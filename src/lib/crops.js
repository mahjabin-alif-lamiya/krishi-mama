/**
 * ==============================================================================================
 * CRITICAL SCIENTIFIC & AGRONOMIC NOTICE:
 * ==============================================================================================
 * EVERY NUMERICAL VALUE, THRESHOLD, AND CROP TRAIT IN THIS CONFIGURATION FILE IS A PRELIMINARY
 * HEURISTIC ASSUMPTION.
 *
 * Sowing calendar dates (baseSowingMonthDay), germination duration (establishmentWindowDays),
 * precipitation excess thresholds (wetRainThresholdMm), root-zone soil wetness limits
 * (dryWetnessThreshold from NASA POWER GWETROOT), and crop traits (waterNeed, durationDays,
 * isLegume, soilHealthEffect) MUST BE RIGOROUSLY CALIBRATED AND VERIFIED WITH OFFICIAL
 * BANGLADESH AGRICULTURAL AUTHORITIES:
 *   1. Bangladesh Rice Research Institute (BRRI)
 *   2. Department of Agricultural Extension (DAE)
 *   3. Bangladesh Agricultural Research Council (BARC)
 *   4. Bangladesh Agricultural Research Institute (BARI)
 *   5. Bangladesh Wheat and Maize Research Institute (BWMRI)
 *
 * DO NOT USE THESE ASSUMPTIONS FOR DIRECT UNVERIFIED FIELD DISPATCH WITHOUT EXTENSION VALIDATION.
 * ==============================================================================================
 */

export const ROTATIONS = {
  "aman-mustard": {
    id: "aman-mustard",
    name: {
      en: "T. Aman Rice → Mustard",
      bn: "রোপা আমন ধান → সরিষা",
    },
    cropName: {
      en: "Mustard (Tori-7 / BARI Sarisha-14)",
      bn: "সরিষা (টোরি-৭ / বারি সরিষা-১৪)",
    },
    // Standard target sowing date post-monsoon: November 10
    baseSowingMonthDay: {
      month: 11,
      day: 10,
    },
    // Seedling emergence & root anchoring window in days
    establishmentWindowDays: 14,
    // Cumulative rainfall over establishment window (mm) exceeding field capacity
    wetRainThresholdMm: 40.0,
    // Mean root-zone soil wetness (GWETROOT, 0.0 - 1.0 fraction) below which germination suffers
    dryWetnessThreshold: 0.45,

    // --- CROP CHARACTERISTICS (ASSUMPTIONS TO VERIFY WITH BRRI, DAE, BARC) ---
    waterNeed: "low", // low, medium, high
    durationDays: 85, // 80-85 days crop cycle
    isLegume: false,
    soilHealthEffect: "neutral", // builds nitrogen, neutral, depletes
    sourceNote: "Assumption based on standard Rabi oilseed extension guides (BARI Sarisha-14 / Tori-7); requires field verification with BRRI, DAE, BARC.",

    description: {
      en: "Short-duration Rabi oilseed vulnerable to waterlogging during emergence and terminal heat during pod fill.",
      bn: "স্বল্পমেয়াদী রবি তৈলবীজ যা গজানোর সময় জলাবদ্ধতা এবং দানা গঠনের সময় তীব্র তাপের ঝুঁকিতে থাকে।",
    },
  },

  "aman-lentil": {
    id: "aman-lentil",
    name: {
      en: "T. Aman Rice → Lentil",
      bn: "রোপা আমন ধান → মসুর ডাল",
    },
    cropName: {
      en: "Lentil (BARI Masur-8)",
      bn: "মসুর ডাল (বারি মসুর-৮)",
    },
    // Standard target sowing date post-monsoon: November 15
    baseSowingMonthDay: {
      month: 11,
      day: 15,
    },
    // Seedling emergence & root anchoring window in days
    establishmentWindowDays: 14,
    // Lentils are exceptionally sensitive to waterlogging (asphyxiation)
    wetRainThresholdMm: 35.0,
    // Mean root-zone soil wetness threshold
    dryWetnessThreshold: 0.45,

    // --- CROP CHARACTERISTICS (ASSUMPTIONS TO VERIFY WITH BRRI, DAE, BARC) ---
    waterNeed: "low", // low, medium, high
    durationDays: 110, // 110-115 days crop cycle
    isLegume: true,
    soilHealthEffect: "builds nitrogen", // builds nitrogen, neutral, depletes
    sourceNote: "Assumption based on legume biological nitrogen fixation (BARI Masur); requires field verification with BRRI, DAE, BARC.",

    description: {
      en: "High-value legume requiring moist, friable soil; extreme sensitivity to saturated seedbeds.",
      bn: "উচ্চমূল্যের ডাল ফসল যার জন্য নরম আর্দ্র মাটি প্রয়োজন; জলাবদ্ধতায় বীজ পচে যাওয়ার তীব্র ঝুঁকি থাকে।",
    },
  },

  "aman-wheat": {
    id: "aman-wheat",
    name: {
      en: "T. Aman Rice → Wheat",
      bn: "রোপা আমন ধান → গম",
    },
    cropName: {
      en: "Wheat (BARI Gom-26 / BWMRI)",
      bn: "গম (বারি গম-২৬ / বাউরি)",
    },
    // Standard target sowing date post-monsoon: November 22
    baseSowingMonthDay: {
      month: 11,
      day: 22,
    },
    // Seedling emergence & crown root initiation window in days
    establishmentWindowDays: 14,
    // Cumulative rainfall threshold (mm)
    wetRainThresholdMm: 45.0,
    // Mean root-zone soil wetness threshold
    dryWetnessThreshold: 0.45,

    // --- CROP CHARACTERISTICS (ASSUMPTIONS TO VERIFY WITH BRRI, DAE, BARC) ---
    waterNeed: "medium", // low, medium, high
    durationDays: 110, // 105-110 days crop cycle
    isLegume: false,
    soilHealthEffect: "depletes", // builds nitrogen, neutral, depletes
    sourceNote: "Assumption based on cereal nutrient and residual moisture extraction (BARI Gom-26 / BWMRI); requires field verification with BRRI, DAE, BARC.",

    description: {
      en: "Cereal rotation requiring timely winter establishment to escape March terminal heat stress during anthesis.",
      bn: "শীতকালীন দানা ফসল যার সময়মতো রোপণ প্রয়োজন যাতে মার্চের তীব্র তাপমাত্রায় পরাগায়ন ক্ষতিগ্রস্ত না হয়।",
    },
  },
};

import { DISTRICTS, getDistrictById, DIVISIONS } from "./bangladesh-districts.js";

export { DISTRICTS, DIVISIONS };

/**
 * Retrieve rotation configuration with validation
 */
export function getRotationConfig(rotationKey) {
  if (!rotationKey) return null;
  const normalized = rotationKey.toLowerCase().trim();
  return ROTATIONS[normalized] || null;
}

/**
 * Retrieve district configuration with validation (supports all 64 districts)
 */
export function getDistrictConfig(districtKey) {
  return getDistrictById(districtKey);
}
