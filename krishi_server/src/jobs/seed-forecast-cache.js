/**
 * Forecast cache seed job — fetches the current 16-day Open-Meteo forecast
 * for every supported location and persists it as last-known-good data in
 * MongoDB, so Render cold starts and provider rate limits (HTTP 429) keep
 * serving verified forecasts instead of an error.
 *
 * Idempotent; safe to re-run. Uses the normal forecast service, which writes
 * through `persistForecast`.
 *
 * Usage: npm run seed:forecast
 * Output: boolean-style status lines; secrets never read or printed.
 */
import "../config/env.config.js";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { getLiveForecast } from "../services/weather/forecast.service.js";

const LOCATIONS = ["Cumilla", "Chattogram"];

export async function seedForecastCache() {
  const results = [];
  for (const locationIdentifier of LOCATIONS) {
    try {
      const forecast = await getLiveForecast({ locationIdentifier });
      results.push({
        locationIdentifier,
        ok: true,
        fetchedAt: forecast?.meta?.fetchTimestamp || null,
      });
      console.log(`[seed:forecast] ${locationIdentifier}: persisted`);
    } catch (error) {
      results.push({ locationIdentifier, ok: false });
      console.error(
        `[seed:forecast] ${locationIdentifier}: failed (${error.statusCode || "unknown"}) ${error.message}`
      );
    }
  }
  // `persistForecast` is fire-and-forget so the API is never blocked by cache
  // writes; give the in-flight upserts time to flush before closing the connection.
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return results;
}

// Allow running both as `npm run seed:forecast` and as an import in tests.
if (process.argv[1] && process.argv[1].endsWith("seed-forecast-cache.js")) {
  const { connected } = await connectDatabase();
  if (!connected) {
    console.error("[seed:forecast] database unavailable; aborting.");
    process.exit(1);
  }
  const results = await seedForecastCache();
  await disconnectDatabase();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
}
