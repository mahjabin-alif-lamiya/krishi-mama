import fs from "node:fs";
import path from "node:path";
import { getDistrictConfig, getRotationConfig, DISTRICTS, ROTATIONS } from "@/lib/crops";
import { calculateHandoffRisk } from "@/lib/risk";

// In-memory 24-hour server cache for NASA responses
const serverCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const districtParam = searchParams.get("district");
  const rotationParam = searchParams.get("rotation");

  // 1. Parameter Validation
  if (!districtParam) {
    return Response.json(
      {
        error: "Missing required query parameter: 'district'.",
        supportedDistricts: Object.keys(DISTRICTS),
        example: "/api/handoff?district=chattogram&rotation=aman-mustard",
      },
      { status: 400 }
    );
  }

  if (!rotationParam) {
    return Response.json(
      {
        error: "Missing required query parameter: 'rotation'.",
        supportedRotations: Object.keys(ROTATIONS),
        example: "/api/handoff?district=chattogram&rotation=aman-mustard",
      },
      { status: 400 }
    );
  }

  const districtConfig = getDistrictConfig(districtParam);
  if (!districtConfig) {
    return Response.json(
      {
        error: `Unknown district '${districtParam}'.`,
        supportedDistricts: Object.keys(DISTRICTS),
      },
      { status: 400 }
    );
  }

  const rotationConfig = getRotationConfig(rotationParam);
  if (!rotationConfig) {
    return Response.json(
      {
        error: `Unknown crop rotation '${rotationParam}'.`,
        supportedRotations: Object.keys(ROTATIONS),
      },
      { status: 400 }
    );
  }

  // 2. Check 24-hour Server In-Memory Cache First
  const cacheKey = districtConfig.id;
  const cachedEntry = serverCache.get(cacheKey);

  let nasaData = null;
  let source = "live";

  if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
    nasaData = cachedEntry.data;
    source = "live";
  } else {
    // 3. Attempt Live Fetch from NASA POWER API with 8-second Timeout
    const nasaUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR,GWETROOT&community=AG&longitude=${districtConfig.lon}&latitude=${districtConfig.lat}&start=20010101&end=20251231&format=JSON`;

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 15000); // 15s timeout for reliable live fetch

    try {
      const response = await fetch(nasaUrl, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "KrishiMama-NASA-SpaceApps/2026",
        },
        next: { revalidate: 86400 }, // 24-hour Next.js fetch cache
      });

      clearTimeout(timeoutTimer);

      if (!response.ok) {
        throw new Error(`NASA API returned HTTP ${response.status}`);
      }

      const json = await response.json();
      if (!json?.properties?.parameter?.PRECTOTCORR) {
        throw new Error("Invalid NASA POWER payload structure");
      }

      nasaData = json;
      source = "live";

      // Store in memory cache
      serverCache.set(cacheKey, {
        data: json,
        timestamp: Date.now(),
      });

      // Persist snapshot to disk for subsequent offline resilience
      try {
        const snapshotDir = path.join(process.cwd(), "src", "data", "snapshots");
        if (fs.existsSync(snapshotDir)) {
          fs.writeFileSync(
            path.join(snapshotDir, `${districtConfig.id}.json`),
            JSON.stringify(json),
            "utf-8"
          );
        }
      } catch {
        // Non-critical write error ignored
      }
    } catch (fetchError) {
      clearTimeout(timeoutTimer);
      console.warn(
        `[NASA API] Live request failed or timed out for ${districtConfig.id} (${fetchError.message}). Falling back to snapshot.`
      );

      // 4. Fallback to Snapshot file on disk
      try {
        const snapshotPath = path.join(
          process.cwd(),
          "src",
          "data",
          "snapshots",
          `${districtConfig.id}.json`
        );

        if (fs.existsSync(snapshotPath)) {
          const fileContent = fs.readFileSync(snapshotPath, "utf-8");
          nasaData = JSON.parse(fileContent);
          source = "snapshot";
        } else {
          return Response.json(
            {
              error: `NASA POWER live request timed out or network was unreachable for ${districtConfig.name?.en || districtConfig.id} (${districtConfig.lat}°N, ${districtConfig.lon}°E), and no offline snapshot is available. Please retry with an active internet connection.`,
              district: districtConfig.id,
              rotation: rotationConfig.id,
            },
            { status: 503 }
          );
        }
      } catch (snapshotError) {
        return Response.json(
          {
            error: `Failed to load fallback snapshot: ${snapshotError.message}`,
            district: districtConfig.id,
            rotation: rotationConfig.id,
          },
          { status: 500 }
        );
      }
    }
  }

  // 5. Calculate Historical Risk Matrix
  try {
    const riskAnalysis = calculateHandoffRisk(nasaData, rotationConfig);

    return Response.json({
      source,
      district: districtConfig.id,
      districtName: districtConfig.name,
      division: districtConfig.division,
      coordinates: { lat: districtConfig.lat, lon: districtConfig.lon },
      rotation: rotationConfig.id,
      yearsUsed: riskAnalysis.yearsUsed,
      results: riskAnalysis.results,
      safestDelay: riskAnalysis.safestDelay,
    });
  } catch (calcError) {
    return Response.json(
      {
        error: `Risk calculation failed: ${calcError.message}`,
      },
      { status: 500 }
    );
  }
}
