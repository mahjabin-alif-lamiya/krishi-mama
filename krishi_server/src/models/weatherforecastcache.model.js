/**
 * Krishi Mama — Persisted Weather Forecast Cache.
 *
 * Stores the last-known-good Open-Meteo forecast per location so that
 * Render free-tier cold starts and provider outages (e.g. HTTP 429 rate
 * limits) can keep serving verified data instead of an error page.
 *
 * Records outlive the 2-hour freshness window on purpose: freshness decides
 * whether we call the provider, while retention only decides how long a
 * stale-but-real forecast stays recoverable.
 */

import mongoose from "mongoose";

/** Documents are purged automatically this long after their last fetch. */
export const FORECAST_CACHE_RETENTION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const weatherForecastCacheSchema = new mongoose.Schema(
  {
    cacheKey: {
      type: String,
      required: [true, "Cache key is required"],
      unique: true,
      index: true,
    },
    locationName: {
      type: String,
      trim: true,
      default: null,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    fetchedAt: {
      type: Date,
      required: true,
    },
    purgeAfter: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false, minimize: false }
);

// Mongo TTL index (runs about once a minute) removes expired documents.
weatherForecastCacheSchema.index({ purgeAfter: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("WeatherForecastCache", weatherForecastCacheSchema);
