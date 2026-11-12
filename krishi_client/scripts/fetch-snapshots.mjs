import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISTRICTS = [
  {
    id: "dhaka",
    name: "Dhaka",
    lat: 23.8103,
    lon: 90.4125,
  },
  {
    id: "rajshahi",
    name: "Rajshahi",
    lat: 24.3636,
    lon: 88.6241,
  },
  {
    id: "chattogram",
    name: "Chattogram",
    lat: 22.34,
    lon: 91.83,
  },
  {
    id: "cumilla",
    name: "Cumilla",
    lat: 23.46,
    lon: 91.18,
  },
];

const TARGET_DIR = path.resolve(__dirname, "../src/data/snapshots");

async function fetchDistrictData(district) {
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR,GWETROOT&community=AG&longitude=${district.lon}&latitude=${district.lat}&start=20010101&end=20251231&format=JSON`;

  console.log(`\n[SNAPSHOT] Fetching 2001-2025 data for ${district.name} (${district.id})...`);
  console.log(`[SNAPSHOT] URL: ${url}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout for bulk script

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "KrishiMama-NASA-SpaceApps/2026",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NASA POWER API responded with status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);

    if (!data || !data.properties || !data.properties.parameter) {
      throw new Error("Invalid response format: missing properties.parameter");
    }

    const paramKeys = Object.keys(data.properties.parameter);
    const dayCount = Object.keys(data.properties.parameter.PRECTOTCORR || {}).length;

    console.log(`[SNAPSHOT] SUCCESS: Received ${paramKeys.join(", ")} for ${dayCount} days in ${elapsedSec}s.`);

    // Ensure snapshot directory exists
    if (!fs.existsSync(TARGET_DIR)) {
      fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    const filePath = path.join(TARGET_DIR, `${district.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`[SNAPSHOT] Saved: ${filePath} (${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)} MB)`);

    return true;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`[SNAPSHOT] ERROR fetching ${district.name}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log("=== Krishi Mama — NASA POWER Historical Snapshots Downloader ===");
  console.log(`Target directory: ${TARGET_DIR}`);

  for (const district of DISTRICTS) {
    try {
      await fetchDistrictData(district);
    } catch (err) {
      console.error(`Failed to snapshot ${district.id}. Retrying or check internet connection.`);
      process.exitCode = 1;
    }
  }

  console.log("\n=== Snapshot process completed ===");
}

main();
