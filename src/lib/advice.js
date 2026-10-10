import { formatNumber } from "./formatNumber.js";

/**
 * Finds the safest/best delay from an array of delay result objects.
 * TIE RULE: If two delays have the same risk percent, the shorter delay is called the best one.
 *
 * @param {Array<{ delay: number, riskPercent: number }>} delayResults
 * @returns {number} The best delay in days (0, 7, or 14)
 */
export function getBestDelay(delayResults = []) {
  if (!Array.isArray(delayResults) || delayResults.length === 0) return 0;

  let best = delayResults[0];

  for (let i = 1; i < delayResults.length; i++) {
    const cur = delayResults[i];
    if (cur.riskPercent < best.riskPercent) {
      best = cur;
    } else if (cur.riskPercent === best.riskPercent) {
      // Tie rule: shorter delay wins
      if (cur.delay < best.delay) {
        best = cur;
      }
    }
  }

  return best.delay;
}

/**
 * Returns the full result object for the best delay.
 *
 * @param {Array<{ delay: number, riskPercent: number }>} delayResults
 * @returns {Object|null}
 */
export function getBestDelayItem(delayResults = []) {
  if (!Array.isArray(delayResults) || delayResults.length === 0) return null;

  let best = delayResults[0];

  for (let i = 1; i < delayResults.length; i++) {
    const cur = delayResults[i];
    if (cur.riskPercent < best.riskPercent) {
      best = cur;
    } else if (cur.riskPercent === best.riskPercent) {
      if (cur.delay < best.delay) {
        best = cur;
      }
    }
  }

  return best;
}

/**
 * Builds ONE short, plain-language recommendation sentence for the farmer.
 * Example: "Best for you: Aman rice then Mustard. Sow within 7 days."
 *
 * @param {Object} params
 * @param {Object} params.rotation - Rotation object from crops.js
 * @param {number} params.bestDelay - Best delay in days (0, 7, 14)
 * @param {string} [params.language="en"] - "bn" or "en"
 * @returns {string}
 */
export function buildRecommendationSentence({ rotation, bestDelay = 0, language = "en" }) {
  const cropName =
    rotation?.name?.[language] ||
    rotation?.name?.en ||
    (language === "bn" ? "আমন ধান → সরিষা" : "Aman rice then Mustard");

  if (language === "bn") {
    if (bestDelay === 0) {
      return `আপনার জন্য সেরা: ${cropName}। সময়মতো বা এখনই বুনুন।`;
    }
    return `আপনার জন্য সেরা: ${cropName}। ${formatNumber(bestDelay, "bn")} দিনের মধ্যে বুনুন।`;
  }

  if (bestDelay === 0) {
    return `Best for you: ${cropName}. Sow on time without delay.`;
  }
  return `Best for you: ${cropName}. Sow within ${bestDelay} days.`;
}

/**
 * Generates exactly 3 short action lines with icons from the result.
 * Strictly no technical jargon, no yield claims, and no guarantees.
 *
 * @param {Object} params
 * @param {number} params.bestDelay - Safest delay in days
 * @param {Object} params.rotation - Crop rotation object
 * @param {string} [params.soilId="loam"] - Soil type ("clay", "loam", "sandy")
 * @param {string} [params.language="en"] - Locale code
 * @returns {Array<{ id: number, iconType: "check" | "droplet" | "clock", text: { bn: string, en: string } }>}
 */
export function generateNextSteps({ bestDelay = 0, rotation, soilId = "loam", language = "en" }) {
  // Step 1: Land Preparation
  let step1En = "Start preparing the seedbed and field now without waiting.";
  let step1Bn = "দেরি না করে এখনই জমি তৈরির কাজ শুরু করুন।";

  if (bestDelay === 7) {
    step1En = "Prepare the land and finish plowing within the next 7 days.";
    step1Bn = "আগামী ৭ দিনের মধ্যে জমি চাষ ও তৈরির কাজ শেষ করুন।";
  } else if (bestDelay === 14) {
    step1En = "Take time to prepare the field and get ready to sow within 14 days.";
    step1Bn = "মাটি তৈরি করতে সময় নিন এবং ১৪ দিনের মধ্যে বোনার প্রস্তুতি নিন।";
  }

  // Step 2: Soil Moisture Check
  let step2En = "Check that the soil has good moisture and workable condition before sowing.";
  let step2Bn = "বীজ ফেলার আগে মাটির রস ও জো অবস্থা দেখে নিন।";

  if (soilId === "clay") {
    step2En = "Make sure water does not stand in the field before sowing.";
    step2Bn = "বীজ বোনার আগে খেয়াল রাখুন জমিতে যেন পানি জমে না থাকে।";
  } else if (soilId === "sandy") {
    step2En = "Check that the soil still has enough moisture before dropping seeds.";
    step2Bn = "মাটির রস দ্রুত শুকায়, তাই বোনার আগে মাটির পর্যাপ্ত রস দেখে নিন।";
  }

  // Step 3: Timing Discipline (Avoid Delay)
  let step3En = "Avoid waiting more than 7 days, as delay increases the risk.";
  let step3Bn = "৭ দিনের বেশি দেরি করা এড়িয়ে চলুন, এতে ঝুঁকি বাড়ে।";

  if (bestDelay === 7) {
    step3En = "Sow around 7 days delay, and avoid delaying past 14 days.";
    step3Bn = "৭ দিন পর বুনুন, তবে ১৪ দিনের বেশি দেরি করবেন না।";
  } else if (bestDelay === 14) {
    step3En = "Sow within 14 days, and do not delay into the late season.";
    step3Bn = "১৪ দিনের মধ্যে বুনুন, মৌসুমের বেশি দেরিতে যাবেন না।";
  }

  return [
    {
      id: 1,
      iconType: "check",
      text: { bn: step1Bn, en: step1En },
    },
    {
      id: 2,
      iconType: "droplet",
      text: { bn: step2Bn, en: step2En },
    },
    {
      id: 3,
      iconType: "clock",
      text: { bn: step3Bn, en: step3En },
    },
  ];
}
