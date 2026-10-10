/**
 * ==============================================================================================
 * FARMER PRIORITIES & TRANSPARENT ROTATION RANKING ENGINE
 * ==============================================================================================
 * This module balances NASA Earth observations (historical climate risk) with local soil
 * texture and farmer-defined priorities (water savings, soil health).
 *
 * TRANSPARENT RULE-BASED SCORING (NO MACHINE LEARNING):
 * Total Score = (w_risk * RiskScore) + (w_water * WaterScore) + (w_soil * SoilScore)
 *
 * WEIGHTING CONFIGURATION:
 * - Baseline (no priority selected): Risk: 50%, Water: 25%, Soil: 25%
 * - One priority selected: Selected priority: 60%, Other two: 20% each
 * - Two priorities selected: Selected priorities: 42.5% each, Remaining: 15%
 * ==============================================================================================
 */

import { getSoilType } from "./soils.js";

export const PRIORITIES = {
  "lowest-risk": {
    id: "lowest-risk",
    name: {
      en: "Lowest Climate Risk",
      bn: "সবচেয়ে কম আবহাওয়া ঝুঁকি",
    },
    shortName: {
      en: "Low Risk",
      bn: "কম ঝুঁকি",
    },
    description: {
      en: "Prioritizes crop rotations with the lowest historical frequency of waterlogging and drought during establishment.",
      bn: "চারা গজানোর প্রতিষ্ঠা সময়ে জলাবদ্ধতা বা খরার ঐতিহাসিক ঝুঁকি সর্বনিম্ন এমন ফসলকে অগ্রাধিকার দেয়।",
    },
    dimension: "risk",
  },

  "saves-water": {
    id: "saves-water",
    name: {
      en: "Saves Water & Irrigation",
      bn: "পানি ও সেচ সাশ্রয়",
    },
    shortName: {
      en: "Saves Water",
      bn: "পানি সাশ্রয়",
    },
    description: {
      en: "Favors crops with low water requirements and short cycle duration, reducing pumping and diesel costs.",
      bn: "কম পানির চাহিদা ও স্বল্পমেয়াদী ফসলকে অগ্রাধিকার দেয়, যা অতিরিক্ত সেচ ও জ্বালানি খরচ কমায়।",
    },
    dimension: "water",
  },

  "protects-soil": {
    id: "protects-soil",
    name: {
      en: "Protects Soil Health",
      bn: "মাটির উর্বরতা ও স্বাস্থ্য রক্ষা",
    },
    shortName: {
      en: "Protects Soil",
      bn: "মাটি রক্ষা",
    },
    description: {
      en: "Favors legume crops that biologically fix atmospheric nitrogen and improve post-rice soil structure.",
      bn: "ডাল জাতীয় লেগিউম ফসলকে অগ্রাধিকার দেয় যা প্রাকৃতিকভাবে নাইট্রোজেন যুক্ত করে মাটির স্বাস্থ্য উন্নত করে।",
    },
    dimension: "soil",
  },
};

/**
 * Return all available farmer priorities as an array
 * @returns {Array}
 */
export function getAllPriorities() {
  return Object.values(PRIORITIES);
}

/**
 * Calculate transparent dimension subscores for a rotation
 *
 * @param {Object} rotationConfig - Crop rotation metadata from crops.js
 * @param {Object} riskResult - Delay analysis from NASA observations (safestDelay, results)
 * @param {string} soilId - Selected soil type ("clay", "loam", "sandy")
 * @returns {{ riskScore: number, waterScore: number, soilScore: number, safestRisk: number }}
 */
function calculateSubscores(rotationConfig, riskResult, soilId) {
  const soil = getSoilType(soilId);

  // 1. CLIMATE RISK SUBSCORE (0 to 100)
  // Inverse of the lowest historical risk percentage found across the delay scenarios
  let safestRisk = 15; // default fallback if risk data not yet available
  if (riskResult && Array.isArray(riskResult.results)) {
    const safestItem = riskResult.results.find(
      (r) => r.delay === riskResult.safestDelay
    ) || riskResult.results[0];
    if (safestItem && typeof safestItem.riskPercent === "number") {
      safestRisk = safestItem.riskPercent;
    }
  } else if (typeof riskResult?.riskPercent === "number") {
    safestRisk = riskResult.riskPercent;
  }

  // Risk Score: 0% risk -> 100 points; 50% risk -> 50 points; capped at 0 minimum
  let riskScore = Math.max(0, 100 - safestRisk);

  // Slight soil sensitivity adjustment on risk:
  // Clay soil has higher waterlogging risk, sandy has higher drought sensitivity
  if (soil.id === "clay" && rotationConfig.id === "aman-lentil") {
    // Lentils are exceptionally sensitive to clay waterlogging
    riskScore = Math.max(0, riskScore - 5);
  } else if (soil.id === "sandy" && rotationConfig.id === "aman-mustard") {
    // Mustard handles quick drainage well
    riskScore = Math.min(100, riskScore + 3);
  }

  // 2. WATER SAVINGS SUBSCORE (0 to 100)
  let waterScore = 60;
  if (rotationConfig.waterNeed === "low") {
    waterScore = 95;
  } else if (rotationConfig.waterNeed === "medium") {
    waterScore = 60;
  } else if (rotationConfig.waterNeed === "high") {
    waterScore = 25;
  }

  // Bonus for short duration (<90 days escapes late dry spells)
  if (rotationConfig.durationDays <= 85) {
    waterScore = Math.min(100, waterScore + 5);
  }

  // Soil modifier on water efficiency:
  if (soil.id === "sandy") {
    // In sandy soils, low water need is even more crucial
    if (rotationConfig.waterNeed === "low") {
      waterScore = Math.min(100, waterScore + 5);
    } else {
      waterScore = Math.max(0, waterScore - 10);
    }
  }

  // 3. SOIL HEALTH SUBSCORE (0 to 100)
  let soilScore = 50;
  if (rotationConfig.soilHealthEffect === "builds nitrogen") {
    soilScore = 100; // Legume biological nitrogen fixation
  } else if (rotationConfig.soilHealthEffect === "neutral") {
    soilScore = 60; // Minimal soil nutrient depletion
  } else if (rotationConfig.soilHealthEffect === "depletes") {
    soilScore = 25; // High cereal nutrient and moisture demand
  }

  return {
    riskScore: Math.round(riskScore),
    waterScore: Math.round(waterScore),
    soilScore: Math.round(soilScore),
    safestRisk,
  };
}

/**
 * Generate a transparent, concise reason sentence explaining why this rotation
 * received its recommendation rank given the soil and priorities.
 */
function buildRecommendationReason(rotationId, soilId, selectedPriorities, subscores) {
  const isWaterPriority = selectedPriorities.includes("saves-water");
  const isSoilPriority = selectedPriorities.includes("protects-soil");
  const isRiskPriority = selectedPriorities.includes("lowest-risk");

  if (rotationId === "aman-lentil") {
    if (isSoilPriority) {
      return {
        en: "Top choice for soil health: fixes atmospheric nitrogen and enriches soil fertility with low water need.",
        bn: "মাটির স্বাস্থ্যের জন্য সেরা: প্রাকৃতিকভাবে নাইট্রোজেন যোগ করে উর্বরতা বাড়ায় এবং কম সেচ লাগে।",
      };
    }
    if (soilId === "clay") {
      return {
        en: "Excellent legume for soil health, but monitor seedbed drainage as clay holds water longer.",
        bn: "মাটির স্বাস্থ্যের জন্য চমৎকার ডাল ফসল, তবে এঁটেল মাটিতে জলাবদ্ধতা এড়াতে সতর্ক নিষ্কাশন প্রয়োজন।",
      };
    }
    return {
      en: "Balanced legume rotation: enriches soil nitrogen while maintaining low irrigation demand.",
      bn: "ভারসাম্যপূর্ণ ডাল ফসল: মাটিতে নাইট্রোজেন যোগ করে এবং তুলনামূলক কম সেচ প্রয়োজন হয়।",
    };
  }

  if (rotationId === "aman-mustard") {
    if (isWaterPriority || soilId === "sandy") {
      return {
        en: "Top choice for water savings: short 85-day cycle with minimal irrigation, avoiding late-season heat.",
        bn: "পানি সাশ্রয়ের জন্য সেরা: মাত্র ৮৫ দিনে পাকে এবং কম সেচ লাগে, যা শেষ মৌসুমের গরম এড়ায়।",
      };
    }
    if (isRiskPriority) {
      return {
        en: "Historically resilient: fast emergence and low water need create a stable post-Aman transition.",
        bn: "আবহাওয়া সহনশীল: দ্রুত গজানো এবং কম পানির চাহিদা আমন-পরবর্তী পরিবর্তনের ঝুঁকি কমায়।",
      };
    }
    return {
      en: "Short-duration cash crop: matures quickly with low water needs and neutral soil impact.",
      bn: "স্বল্পমেয়াদী অর্থকরী তৈলবীজ: কম সেচে দ্রুত পাকে এবং মাটির স্বাভাবিক অবস্থা বজায় রাখে।",
    };
  }

  if (rotationId === "aman-wheat") {
    if (isRiskPriority && subscores.safestRisk === 0) {
      return {
        en: "High grain yield with favorable historical weather window, though water and fertilizer needs are higher.",
        bn: "অনুকূল আবহাওয়া জানালায় উচ্চ ফলনশীল খাদ্যশস্য, তবে সরিষা বা মসুরের চেয়ে সেচ ও সার বেশি লাগে।",
      };
    }
    if (isWaterPriority) {
      return {
        en: "High food value, but requires more irrigation and longer duration than mustard or lentil.",
        bn: "উচ্চ পুষ্টি ও খাদ্যমান, তবে সরিষা বা মসুর ডালের তুলনায় বেশি সেচ ও সময় প্রয়োজন।",
      };
    }
    return {
      en: "Valuable cereal crop for food security, requiring moderate irrigation and timely winter sowing.",
      bn: "খাদ্য নিরাপত্তার জন্য গুরুত্বপূর্ণ দানা ফসল, যার মাঝারি সেচ ও সময়মতো শীতকালীন বপন দরকার।",
    };
  }

  return {
    en: "Viable rotation option adapted to local climate and soil conditions.",
    bn: "স্থানীয় আবহাওয়া ও মাটির উপযোগী কার্যকর ফসল চক্র।",
  };
}

/**
 * Transparently ranks crop rotations based on NASA climate observations,
 * local soil characteristics, and farmer-selected priorities.
 *
 * @param {Object} resultsMap - Map of rotationId -> risk analysis results object
 * @param {Object|Array} rotations - Rotations dictionary or array from crops.js
 * @param {string} [soilType="loam"] - Soil type ID ("loam", "clay", "sandy")
 * @param {string[]} [priorities=[]] - Selected farmer priorities IDs (0, 1, or 2)
 * @returns {Array} Sorted array of ranked rotation cards with scores and reasons
 */
export function rankRotations(resultsMap = {}, rotations = {}, soilType = "loam", priorities = []) {
  const rotationList = Array.isArray(rotations)
    ? rotations
    : Object.values(rotations);

  // Normalize priorities (max 2 priorities can be active)
  const activePriorities = Array.isArray(priorities) ? priorities.slice(0, 2) : [];

  // Determine dynamic transparent weights (sum = 1.0)
  let wRisk = 0.50;
  let wWater = 0.25;
  let wSoil = 0.25;

  if (activePriorities.length === 1) {
    const p = activePriorities[0];
    if (p === "lowest-risk") {
      wRisk = 0.60;
      wWater = 0.20;
      wSoil = 0.20;
    } else if (p === "saves-water") {
      wRisk = 0.20;
      wWater = 0.60;
      wSoil = 0.20;
    } else if (p === "protects-soil") {
      wRisk = 0.20;
      wWater = 0.20;
      wSoil = 0.60;
    }
  } else if (activePriorities.length === 2) {
    const hasRisk = activePriorities.includes("lowest-risk");
    const hasWater = activePriorities.includes("saves-water");
    const hasSoil = activePriorities.includes("protects-soil");

    if (hasRisk && hasWater) {
      wRisk = 0.425;
      wWater = 0.425;
      wSoil = 0.15;
    } else if (hasRisk && hasSoil) {
      wRisk = 0.425;
      wWater = 0.15;
      wSoil = 0.425;
    } else if (hasWater && hasSoil) {
      wRisk = 0.15;
      wWater = 0.425;
      wSoil = 0.425;
    }
  }

  // Calculate scores for each rotation
  const scoredRotations = rotationList.map((rot) => {
    // Locate rotation's NASA risk result from resultsMap
    const riskResult = resultsMap[rot.id] || resultsMap;

    const subscores = calculateSubscores(rot, riskResult, soilType);

    // Transparent weighted composite score (0 to 100)
    const compositeScore = Math.round(
      wRisk * subscores.riskScore +
      wWater * subscores.waterScore +
      wSoil * subscores.soilScore
    );

    const reason = buildRecommendationReason(
      rot.id,
      soilType,
      activePriorities,
      subscores
    );

    // Extract delay array for visual comparison
    let delayResults = [];
    let safestDelay = 7;
    if (riskResult && Array.isArray(riskResult.results)) {
      delayResults = riskResult.results;
      safestDelay = riskResult.safestDelay ?? 7;
    }

    return {
      rotation: rot,
      rotationId: rot.id,
      compositeScore,
      subscores,
      weights: { wRisk, wWater, wSoil },
      safestDelay,
      delayResults,
      reason,
    };
  });

  // Sort descending by composite score (highest recommendation first)
  scoredRotations.sort((a, b) => b.compositeScore - a.compositeScore);

  // Assign ranking badges
  return scoredRotations.map((item, index) => ({
    ...item,
    rank: index + 1,
    isTopPick: index === 0,
  }));
}
