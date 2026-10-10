import { buildFarmerSentence } from "./sentences.js";

/**
 * Calculates historical climate risk for each delay window (0, 7, 14 days)
 * over the 2001–2025 NASA POWER observational record.
 *
 * @param {Object} nasaData - NASA POWER JSON payload containing parameters (PRECTOTCORR, GWETROOT)
 * @param {Object} cropConfig - Rotation config with baseSowingMonthDay, thresholds, etc.
 * @param {number[]} [delays=[0, 7, 14]] - Delays to compare in days
 * @param {number} [startYear=2001] - Starting year of the analysis window
 * @param {number} [endYear=2025] - Ending year of the analysis window
 * @returns {Object} { yearsUsed, results: Array, safestDelay }
 */
export function calculateHandoffRisk(
  nasaData,
  cropConfig,
  delays = [0, 7, 14],
  startYear = 2001,
  endYear = 2025
) {
  if (!nasaData || !nasaData.properties || !nasaData.properties.parameter) {
    throw new Error("Invalid NASA POWER data format: missing properties.parameter");
  }

  const { PRECTOTCORR = {}, GWETROOT = {} } = nasaData.properties.parameter;
  const {
    baseSowingMonthDay,
    establishmentWindowDays = 14,
    wetRainThresholdMm = 40.0,
    dryWetnessThreshold = 0.45,
  } = cropConfig;

  if (!baseSowingMonthDay || !baseSowingMonthDay.month || !baseSowingMonthDay.day) {
    throw new Error("Invalid cropConfig: baseSowingMonthDay is required");
  }

  // Pre-calculate per-delay metrics
  const preliminaryResults = [];

  for (const delay of delays) {
    let yearsUsed = 0;
    let wetYears = 0;
    let dryYears = 0;
    let flaggedYears = 0;

    for (let year = startYear; year <= endYear; year++) {
      let isMissing = false;
      let totalRain = 0;
      let totalGwet = 0;

      for (let dayOffset = 0; dayOffset < establishmentWindowDays; dayOffset++) {
        // Use UTC date arithmetic to ensure consistent calendar traversal
        const targetDate = new Date(
          Date.UTC(
            year,
            baseSowingMonthDay.month - 1,
            baseSowingMonthDay.day + delay + dayOffset
          )
        );

        const yStr = targetDate.getUTCFullYear();
        const mStr = String(targetDate.getUTCMonth() + 1).padStart(2, "0");
        const dStr = String(targetDate.getUTCDate()).padStart(2, "0");
        const dateKey = `${yStr}${mStr}${dStr}`;

        const rainVal = PRECTOTCORR[dateKey];
        const gwetVal = GWETROOT[dateKey];

        // Skip years where NASA POWER reports missing value (-999 or < -900)
        if (
          rainVal === undefined ||
          rainVal === null ||
          rainVal < -900 ||
          gwetVal === undefined ||
          gwetVal === null ||
          gwetVal < -900
        ) {
          isMissing = true;
          break;
        }

        totalRain += Number(rainVal);
        totalGwet += Number(gwetVal);
      }

      if (isMissing) {
        // Missing data encountered for this year's window; skip it
        continue;
      }

      yearsUsed++;
      const meanGwet = totalGwet / establishmentWindowDays;

      const isWet = totalRain > wetRainThresholdMm;
      const isDry = meanGwet < dryWetnessThreshold;

      if (isWet) wetYears++;
      if (isDry) dryYears++;
      if (isWet || isDry) flaggedYears++;
    }

    const riskPercent =
      yearsUsed > 0 ? Math.round((flaggedYears / yearsUsed) * 100) : 0;
    const wetPercent =
      yearsUsed > 0 ? Math.round((wetYears / yearsUsed) * 100) : 0;
    const dryPercent =
      yearsUsed > 0 ? Math.round((dryYears / yearsUsed) * 100) : 0;

    // Classification level: green under 25, yellow 25 to 50, red over 50
    let level = "safe";
    if (riskPercent < 25) {
      level = "safe";
    } else if (riskPercent <= 50) {
      level = "caution";
    } else {
      level = "danger";
    }

    preliminaryResults.push({
      delay,
      wetPercent,
      dryPercent,
      riskPercent,
      wetYears,
      dryYears,
      flaggedYears,
      yearsUsed,
      level,
    });
  }

  // Determine safest delay (lowest riskPercent; break ties by earlier delay)
  let safestDelay = delays[0];
  let lowestRisk = Infinity;

  for (const item of preliminaryResults) {
    if (item.riskPercent < lowestRisk) {
      lowestRisk = item.riskPercent;
      safestDelay = item.delay;
    }
  }

  // Attach farmer sentences to each delay outcome
  const finalResults = preliminaryResults.map((item) => {
    const sentence = buildFarmerSentence({
      delay: item.delay,
      wetYears: item.wetYears,
      dryYears: item.dryYears,
      flaggedYears: item.flaggedYears,
      yearsUsed: item.yearsUsed,
      level: item.level,
      safestDelay,
    });

    return {
      delay: item.delay,
      wetPercent: item.wetPercent,
      dryPercent: item.dryPercent,
      riskPercent: item.riskPercent,
      wetYears: item.wetYears,
      dryYears: item.dryYears,
      level: item.level,
      sentence,
    };
  });

  const yearsUsed =
    preliminaryResults.length > 0 ? preliminaryResults[0].yearsUsed : 0;

  return {
    yearsUsed,
    results: finalResults,
    safestDelay,
  };
}
