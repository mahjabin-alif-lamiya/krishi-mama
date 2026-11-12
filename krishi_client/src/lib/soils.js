/**
 * ==============================================================================================
 * SOIL INFORMATION & DRAINAGE MODIFIERS (LOCAL INFORMATION)
 * ==============================================================================================
 * This module defines typical topsoil textures encountered in Bangladesh agricultural lands.
 *
 * CRITICAL SCIENTIFIC ASSUMPTION NOTICE:
 * All drainage modifiers and threshold shifts in this file are preliminary HEURISTIC ASSUMPTIONS.
 * They represent physical tendencies (clay retains water, sand drains quickly) and MUST BE
 * CALIBRATED with official soil surveys from:
 *   1. Soil Resource Development Institute (SRDI)
 *   2. Bangladesh Agricultural Research Council (BARC)
 *
 * DO NOT PRESENT THESE MODIFIERS AS PRECISE FIELD MEASUREMENTS WITHOUT IN-SITU CALIBRATION.
 * ==============================================================================================
 */

export const SOIL_TYPES = {
  loam: {
    id: "loam",
    name: {
      en: "Loam Soil (Medium Texture)",
      bn: "দোআঁশ মাটি (মাঝারি বুনট)",
    },
    shortName: {
      en: "Loam",
      bn: "দোআঁশ",
    },
    description: {
      en: "Balanced water retention and natural drainage. Standard baseline for most post-Aman Rabi crops.",
      bn: "ভারসাম্যপূর্ণ পানি নিষ্কাশন ও আর্দ্রতা ধারণ ক্ষমতা। রবি ফসলের জন্য সবচেয়ে উপযোগী ও আদর্শ মাটি।",
    },
    // Baseline reference: no shift to baseline threshold
    drainageModifier: {
      wetRainDeltaMm: 0, // Cumulative rain threshold adjustment
      dryWetnessDelta: 0, // Root-zone soil wetness threshold adjustment
      drainageSpeed: "balanced",
      label: {
        en: "Balanced Drainage (1.0x baseline)",
        bn: "ভারসাম্যপূর্ণ নিষ্কাশন (১.০ গুণ বেসলাইন)",
      },
    },
    sourceNote: "Baseline agronomic reference assumption; to be calibrated with SRDI / BARC agro-ecological zones.",
  },

  clay: {
    id: "clay",
    name: {
      en: "Clay / Clay Loam (Heavy Texture)",
      bn: "এঁটেল / এঁটেল দোআঁশ (ভারী বুনট)",
    },
    shortName: {
      en: "Clay",
      bn: "এঁটেল",
    },
    description: {
      en: "Dense soil that holds water longer. Higher risk of waterlogging after rain, but retains residual moisture better.",
      bn: "ঘন মাটি যা বেশি সময় পানি ধরে রাখে। বৃষ্টির পর জলাবদ্ধতার ঝুঁকি বাড়ে, তবে মাটির রস দীর্ঘস্থায়ী হয়।",
    },
    // Clay holds moisture: waterlogging occurs with slightly less cumulative rain (-5mm)
    // and soil moisture stays above deficit level longer (dryness threshold shifted by -0.05)
    drainageModifier: {
      wetRainDeltaMm: -5.0, // Waterlogging threshold lowered because drainage is slow
      dryWetnessDelta: -0.05, // Retains moisture longer
      drainageSpeed: "slow",
      label: {
        en: "Slow Drainage / High Retention (-5 mm rain tolerance)",
        bn: "ধীর নিষ্কাশন / আর্দ্রতা ধরে রাখে (৫ মিমি কম বৃষ্টিতেই জলাবদ্ধতা)",
      },
    },
    sourceNote: "Preliminary heuristic assumption reflecting slow percolation rates in heavy soils; requires SRDI calibration.",
  },

  sandy: {
    id: "sandy",
    name: {
      en: "Sandy / Sandy Loam (Light Texture)",
      bn: "বেলে / বেলে দোআঁশ (হালকা বুনট)",
    },
    shortName: {
      en: "Sandy",
      bn: "বেলে",
    },
    description: {
      en: "Coarse soil with rapid water percolation. Rarely waterlogs, but topsoil moisture depletes quickly after monsoon rains.",
      bn: "দ্রুত পানি নিষ্কাশনকারী মাটি। জলাবদ্ধতা খুব কম হয়, তবে বর্ষার পর মাটির রস দ্রুত শুকিয়ে যায়।",
    },
    // Sandy soil drains fast: higher rainfall tolerated before waterlogging (+5mm)
    // but moisture depletes rapidly (dryness threshold shifted by +0.05 to signal moisture stress sooner)
    drainageModifier: {
      wetRainDeltaMm: 5.0, // Higher rain tolerance before ponding
      dryWetnessDelta: 0.05, // Slower to hold water; drought stress arrives earlier
      drainageSpeed: "rapid",
      label: {
        en: "Rapid Drainage / Fast Dryout (+5 mm rain tolerance)",
        bn: "দ্রুত নিষ্কাশন / দ্রুত শুকায় (৫ মিমি বেশি বৃষ্টি সহ্য করতে পারে)",
      },
    },
    sourceNote: "Preliminary heuristic assumption reflecting rapid percolation in light soils; requires SRDI calibration.",
  },
};

/**
 * Retrieve soil type configuration by ID
 * @param {string} id
 * @returns {Object|null}
 */
export function getSoilType(id) {
  if (!id) return SOIL_TYPES.loam;
  const key = String(id).toLowerCase().trim();
  return SOIL_TYPES[key] || SOIL_TYPES.loam;
}

/**
 * Return all supported soil types as an array
 * @returns {Array}
 */
export function getAllSoilTypes() {
  return Object.values(SOIL_TYPES);
}

/**
 * Calculate soil-adjusted climate thresholds for a rotation
 * (Does not alter underlying historical records, adjusts empirical sensitivity)
 * @param {Object} cropConfig
 * @param {string} soilId
 * @returns {{ wetRainThresholdMm: number, dryWetnessThreshold: number }}
 */
export function getAdjustedThresholds(cropConfig, soilId) {
  const soil = getSoilType(soilId);
  const baseRain = cropConfig.wetRainThresholdMm || 40.0;
  const baseGwet = cropConfig.dryWetnessThreshold || 0.45;

  const wetRainThresholdMm = Math.max(
    15.0,
    baseRain + soil.drainageModifier.wetRainDeltaMm
  );
  const dryWetnessThreshold = Math.min(
    0.8,
    Math.max(0.1, baseGwet + soil.drainageModifier.dryWetnessDelta)
  );

  return {
    wetRainThresholdMm,
    dryWetnessThreshold,
  };
}
