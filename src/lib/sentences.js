import { formatNumber } from "./formatNumber.js";

/**
 * Builds ONE plain-language farmer sentence per delay window in Bengali and English.
 * Strictly avoids technical words, guarantees, or mentions of heat/yield.
 *
 * @param {Object} params
 * @param {number} [params.delay=0] - Delay in days (0, 7, 14)
 * @param {number} [params.wetYears=0] - Number of years flagged as too wet
 * @param {number} [params.dryYears=0] - Number of years flagged as too dry
 * @param {number} [params.flaggedYears] - Total unique years with any problem
 * @param {number} [params.yearsUsed=25] - Total valid years analyzed (2001-2025)
 * @param {number} [params.riskPercent] - Calculated risk percentage (0 - 100)
 * @param {"safe" | "caution" | "danger"} [params.level] - Risk classification level
 * @returns {{ bn: string, en: string }}
 */
export function buildFarmerSentence({
  delay = 0,
  wetYears = 0,
  dryYears = 0,
  flaggedYears,
  yearsUsed = 25,
  riskPercent,
  level,
}) {
  const numWet = Math.max(0, Number(wetYears) || 0);
  const numDry = Math.max(0, Number(dryYears) || 0);
  const totalYears = Math.max(1, Number(yearsUsed) || 25);

  // Derive total problem years accurately
  let problemYears = 0;
  if (typeof flaggedYears === "number" && flaggedYears >= 0) {
    problemYears = flaggedYears;
  } else if (numWet + numDry > 0) {
    problemYears = numWet + numDry;
  } else if (typeof riskPercent === "number" && riskPercent > 0) {
    problemYears = Math.max(1, Math.round((riskPercent / 100) * totalYears));
  }

  // Derive risk level if not explicitly provided
  let effectiveLevel = level;
  if (!effectiveLevel) {
    const p =
      typeof riskPercent === "number"
        ? riskPercent
        : Math.round((problemYears / totalYears) * 100);
    if (p < 25) effectiveLevel = "safe";
    else if (p <= 50) effectiveLevel = "caution";
    else effectiveLevel = "danger";
  }

  // Plain-language level wording:
  // safe (under 25%): "Most years were fine."
  // caution (25 to 50): "Be careful, problems happened in many years."
  // danger (over 50): "This time was risky in most years."
  let levelTextEn = "Most years were fine.";
  let levelTextBn = "বেশিরভাগ বছরই ভালো ছিল।";

  if (effectiveLevel === "caution") {
    levelTextEn = "Be careful, problems happened in many years.";
    levelTextBn = "সতর্ক থাকুন, অনেক বছর সমস্যা হয়েছিল।";
  } else if (effectiveLevel === "danger") {
    levelTextEn = "This time was risky in most years.";
    levelTextBn = "বেশিরভাগ বছরই এ সময়ে ঝুঁকি ছিল।";
  }

  const yearsBn = formatNumber(totalYears, "bn");
  const yearsEn = formatNumber(totalYears, "en");

  // Only say "no problem years" when the count is really 0
  if (problemYears === 0) {
    return {
      en: `In the last ${yearsEn} years, there were no problem years at this time. Most years were fine.`,
      bn: `গত ${yearsBn} বছরে এই সময়ে কোনো সমস্যা ছিল না। বেশিরভাগ বছরই ভালো ছিল।`,
    };
  }

  const probBn = formatNumber(problemYears, "bn");
  const probEn = formatNumber(problemYears, "en");
  const wetBn = formatNumber(numWet, "bn");
  const wetEn = formatNumber(numWet, "en");
  const dryBn = formatNumber(numDry, "bn");
  const dryEn = formatNumber(numDry, "en");

  // If both wetYears and dryYears are above zero, split them
  if (numWet > 0 && numDry > 0) {
    return {
      en: `In ${probEn} of the last ${yearsEn} years the soil was too wet or too dry at this time (too wet in ${wetEn} ${numWet === 1 ? "year" : "years"}, too dry in ${dryEn} ${numDry === 1 ? "year" : "years"}). ${levelTextEn}`,
      bn: `গত ${yearsBn} বছরের মধ্যে ${probBn} বছর এই সময়ে মাটি অতিরিক্ত ভেজা বা বেশি শুকনা ছিল (${wetBn} বছর অতিরিক্ত ভেজা, ${dryBn} বছর বেশি শুকনা)। ${levelTextBn}`,
    };
  }

  // If only wetYears > 0
  if (numWet > 0 && numDry === 0) {
    return {
      en: `In ${probEn} of the last ${yearsEn} years the soil was too wet at this time. ${levelTextEn}`,
      bn: `গত ${yearsBn} বছরের মধ্যে ${probBn} বছর এই সময়ে মাটি অতিরিক্ত ভেজা ছিল। ${levelTextBn}`,
    };
  }

  // If only dryYears > 0
  if (numDry > 0 && numWet === 0) {
    return {
      en: `In ${probEn} of the last ${yearsEn} years the soil was too dry at this time. ${levelTextEn}`,
      bn: `গত ${yearsBn} বছরের মধ্যে ${probBn} বছর এই সময়ে মাটি বেশি শুকনা ছিল। ${levelTextBn}`,
    };
  }

  // Fallback when problemYears > 0 but wet/dry breakdown is combined
  return {
    en: `In ${probEn} of the last ${yearsEn} years the soil was too wet or too dry at this time. ${levelTextEn}`,
    bn: `গত ${yearsBn} বছরের মধ্যে ${probBn} বছর এই সময়ে মাটি অতিরিক্ত ভেজা বা বেশি শুকনা ছিল। ${levelTextBn}`,
  };
}

export default buildFarmerSentence;
