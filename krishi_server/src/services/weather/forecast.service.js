/**
 * Krishi Mama — Weather Forecast Service.
 * Interfaces Open-Meteo Forecast API with Asia/Dhaka timezone, in-memory TTL caching,
 * structured metadata tracking, and clear separation between short-range (1-7d) and extended (8-16d).
 */

import mongoose from "mongoose";
import { WEATHER_CONFIG, WMO_WEATHER_CODES, resolveLocationCoordinates } from "../../config/weather.config.js";
import WeatherForecastCache, { FORECAST_CACHE_RETENTION_MS } from "../../models/weatherforecastcache.model.js";

// In-memory cache map: key -> { data, expiresAt }
const forecastCache = new Map();

// Provider backoff: after a failed Open-Meteo call we stop re-hammering the
// endpoint. HTTP 429 is IP-wide, so a rate limit opens a global window too.
const PROVIDER_BACKOFF_MS = 5 * 60 * 1000;
const RATE_LIMIT_BACKOFF_MS = 15 * 60 * 1000;
const providerBackoffs = new Map(); // cacheKey -> { until, rateLimited }
let globalProviderBackoff = null; // { until, rateLimited }

const STALE_CONNECTION_NOTICE =
  "Live Open-Meteo connection failed. Showing last verified cached forecast.";
const STALE_RATE_LIMIT_NOTICE =
  "Open-Meteo rate limit is temporarily exhausted. Showing last verified cached forecast.";

function providerDataError(message, statusCode = 502) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Generates cache key based on coordinates rounded to 3 decimal places (~100m)
 */
function getCacheKey(lat, lon) {
  return `${Number(lat).toFixed(3)}_${Number(lon).toFixed(3)}`;
}

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

/**
 * Best-effort persistence of the last-known-good forecast. Never throws and
 * never blocks the response path — a cache write failure must not break the API.
 */
function persistForecast(cacheKey, data) {
  if (!isDatabaseReady()) return;
  const fetchedAt = new Date();
  WeatherForecastCache.updateOne(
    { cacheKey },
    {
      $set: {
        cacheKey,
        locationName: data.location?.nameEn || null,
        payload: data,
        fetchedAt,
        purgeAfter: new Date(fetchedAt.getTime() + FORECAST_CACHE_RETENTION_MS),
      },
    },
    { upsert: true }
  ).catch(() => {
    // Optional enhancement only; the forecast stays served from memory.
  });
}

async function loadPersistedForecast(cacheKey) {
  if (!isDatabaseReady()) return null;
  try {
    const doc = await WeatherForecastCache.findOne({ cacheKey }).lean();
    return doc?.payload || null;
  } catch {
    return null;
  }
}

function staleForecastResponse(data, notice) {
  return {
    ...data,
    meta: {
      ...data.meta,
      isCached: true,
      isStale: true,
      staleNotice: notice,
    },
  };
}

function scheduleProviderBackoff(cacheKey, error) {
  const rateLimited = error?.rateLimited === true;
  const entry = {
    until: Date.now() + (rateLimited ? RATE_LIMIT_BACKOFF_MS : PROVIDER_BACKOFF_MS),
    rateLimited,
  };
  providerBackoffs.set(cacheKey, entry);
  if (rateLimited && (!globalProviderBackoff || globalProviderBackoff.until < entry.until)) {
    globalProviderBackoff = entry;
  }
}

function activeBackoff(cacheKey, now) {
  const keyBackoff = providerBackoffs.get(cacheKey);
  const keyActive = keyBackoff && keyBackoff.until > now ? keyBackoff : null;
  const globalActive = globalProviderBackoff && globalProviderBackoff.until > now ? globalProviderBackoff : null;
  if (!keyActive && !globalActive) return null;
  if (keyActive && globalActive) return keyActive.until >= globalActive.until ? keyActive : globalActive;
  return keyActive || globalActive;
}

/**
 * Serves the freshest available copy (memory → database), or rethrows the
 * original provider error when nothing is recoverable.
 */
async function recoverFromCache(cacheKey, memoryCached, notice, originalError = null) {
  if (memoryCached) return staleForecastResponse(memoryCached.data, notice);

  const persisted = await loadPersistedForecast(cacheKey);
  if (persisted) {
    // Re-seed the memory buffer as an already-expired entry: it acts as the
    // fallback copy while the provider itself is retried after the backoff.
    forecastCache.set(cacheKey, { data: persisted, expiresAt: Date.now() });
    return staleForecastResponse(persisted, notice);
  }

  if (originalError) {
    if (!originalError.statusCode) originalError.statusCode = 503;
    throw originalError;
  }
  throw providerDataError(notice, 503);
}

/**
 * Fetches short-range and extended forecast from Open-Meteo API
 */
export async function getLiveForecast({ latitude, longitude, locationIdentifier = null }) {
  const loc = resolveLocationCoordinates(
    Number.isFinite(latitude) && Number.isFinite(longitude)
      ? { latitude, longitude }
      : locationIdentifier
  );
  if (!loc) {
    throw providerDataError("A supported location or valid coordinate pair is required", 400);
  }

  const cacheKey = getCacheKey(loc.latitude, loc.longitude);
  const now = Date.now();
  const cached = forecastCache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    return {
      ...cached.data,
      meta: {
        ...cached.data.meta,
        isCached: true,
        dataStatus: "AVAILABLE",
        cachedUntil: new Date(cached.expiresAt).toISOString(),
      },
    };
  }

  // Respect provider backoff: while it is active, serve verified data from
  // memory/database instead of calling Open-Meteo again.
  const backoff = activeBackoff(cacheKey, now);
  if (backoff) {
    const notice = backoff.rateLimited ? STALE_RATE_LIMIT_NOTICE : STALE_CONNECTION_NOTICE;
    return recoverFromCache(cacheKey, cached, notice);
  }

  const params = new URLSearchParams({
    latitude: loc.latitude.toString(),
    longitude: loc.longitude.toString(),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "wind_gusts_10m_max",
      "weather_code",
    ].join(","),
    timezone: WEATHER_CONFIG.openMeteo.timezone,
    forecast_days: "16",
  });

  const url = `${WEATHER_CONFIG.openMeteo.forecastUrl}?${params.toString()}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEATHER_CONFIG.openMeteo.timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      const providerError = providerDataError(`Open-Meteo API responded with HTTP ${res.status}: ${res.statusText}`);
      if (res.status === 429) providerError.rateLimited = true;
      throw providerError;
    }

    const json = await res.json();
    if (!json.daily || !Array.isArray(json.daily.time) || json.daily.time.length === 0) {
      throw providerDataError("Open-Meteo response missing daily forecast array");
    }

    const times = json.daily.time;
    if (times.length < 16) {
      throw providerDataError("Open-Meteo response does not cover the requested 16-day forecast");
    }
    const requiredFields = [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "wind_gusts_10m_max",
      "weather_code",
    ];
    for (const field of requiredFields) {
      const values = json.daily[field];
      if (!Array.isArray(values) || values.length < times.length ||
          times.some((_, index) => typeof values[index] !== "number" || !Number.isFinite(values[index]))) {
        throw providerDataError(`Open-Meteo response contains incomplete ${field} values`);
      }
    }

    const dailyRecords = times.map((t, i) => {
      const code = json.daily.weather_code[i];
      const wmo = WMO_WEATHER_CODES[code] || { en: "Unknown", bn: "অজানা", icon: "Cloud", isHazard: false };

      return {
        date: t,
        dayIndex: i + 1,
        isExtended: i >= 7, // Days 8-16 are extended
        precipitationSumMm: json.daily.precipitation_sum[i],
        precipitationProbabilityMax: json.daily.precipitation_probability_max[i],
        temperatureMaxC: json.daily.temperature_2m_max[i],
        temperatureMinC: json.daily.temperature_2m_min[i],
        windSpeedMaxKmH: json.daily.wind_speed_10m_max[i],
        windGustsMaxKmH: json.daily.wind_gusts_10m_max[i],
        weatherCode: code,
        conditionEn: wmo.en,
        conditionBn: wmo.bn,
        icon: wmo.icon,
        isWeatherHazard: wmo.isHazard,
        forecastHorizon: i < 3 ? "short_range" : i < 7 ? "medium_range" : "extended_outlook",
        leadTimeDays: i < 3 ? "Days 1–3" : i < 7 ? "Days 4–7" : "Days 8–16",
        horizonDescriptionEn:
          i < 3
            ? "Short-Range Forecast (Days 1–3, standard deterministic NWP lead-time)"
            : i < 7
            ? "Medium-Range Forecast (Days 4–7, increasing synoptic uncertainty)"
            : "Extended Numerical Outlook (Days 8–16, elevated uncertainty)",
        horizonDescriptionBn:
          i < 3
            ? "স্বল্পমেয়াদী পূর্বাভাস (১–৩ দিন, প্রমিত সংখ্যাতাত্ত্বিক পূর্বাভাস)"
            : i < 7
            ? "মধ্যমেয়াদী পূর্বাভাস (৪–৭ দিন, ক্রমবর্ধমান আবহাওয়াগত অনিশ্চয়তা)"
            : "বর্ধিত দৃষ্টিভঙ্গি (৮–১৬ দিন, উচ্চ অনিশ্চয়তা)",
        // Retain uncertaintyTier for backwards compatibility with any component references
        uncertaintyTier: i < 3 ? "short_range" : i < 7 ? "medium_range" : "extended_outlook",
      };
    });

    const shortRange = dailyRecords.slice(0, 7);
    const extended = dailyRecords.slice(7, 16);

    const result = {
      location: {
        nameEn: loc.locationName,
        nameBn: loc.locationNameBn,
        latitude: loc.latitude,
        longitude: loc.longitude,
        type: loc.type,
        isRepresentative: loc.isRepresentative,
        limitation: loc.limitation || null,
      },
      currentConditions: {
        date: shortRange[0]?.date || null,
        conditionEn: shortRange[0]?.conditionEn || null,
        conditionBn: shortRange[0]?.conditionBn || null,
        temperatureMaxC: typeof shortRange[0]?.temperatureMaxC === "number" ? shortRange[0].temperatureMaxC : null,
        temperatureMinC: typeof shortRange[0]?.temperatureMinC === "number" ? shortRange[0].temperatureMinC : null,
        todayRainExpectedMm: typeof shortRange[0]?.precipitationSumMm === "number" ? shortRange[0].precipitationSumMm : null,
        todayRainProbabilityPercent: typeof shortRange[0]?.precipitationProbabilityMax === "number" ? shortRange[0].precipitationProbabilityMax : null,
        maxWindSpeedKmH: typeof shortRange[0]?.windSpeedMaxKmH === "number" ? shortRange[0].windSpeedMaxKmH : null,
      },
      shortRangeForecast: shortRange,
      extendedForecast: extended,
      meta: {
        provider: "Open-Meteo Weather Forecast API",
        numericalModel: "Open-Meteo Best Match (Deterministic NWP Combination)",
        forecastType: "Deterministic Daily Forecast with Lead-Time Horizons",
        fetchTimestamp: new Date().toISOString(),
        timezone: json.timezone || "Asia/Dhaka",
        timezoneAbbreviation: json.timezone_abbreviation || "GMT+6",
        elevationMeters: json.elevation,
        isCached: false,
        dataStatus: "AVAILABLE",
        cachedUntil: new Date(now + WEATHER_CONFIG.openMeteo.forecastCacheTtlMs).toISOString(),
      },
    };

    // Store in cache
    forecastCache.set(cacheKey, {
      data: result,
      expiresAt: now + WEATHER_CONFIG.openMeteo.forecastCacheTtlMs,
    });

    // A successful fetch clears any backoff and persists the copy so cold
    // starts and provider outages can keep serving verified data.
    providerBackoffs.delete(cacheKey);
    persistForecast(cacheKey, result);

    return result;
  } catch (err) {
    clearTimeout(timeout);

    scheduleProviderBackoff(cacheKey, err);
    const notice = err.rateLimited ? STALE_RATE_LIMIT_NOTICE : STALE_CONNECTION_NOTICE;
    return recoverFromCache(cacheKey, cached, notice, err);
  }
}
