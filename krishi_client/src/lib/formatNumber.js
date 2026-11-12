/**
 * Converts Western digits to Bengali digits when the current language is Bengali ('bn').
 * If the language is English or any other locale, digits remain in standard ASCII (0-9).
 *
 * @param {number | string} val - The number or string to format
 * @param {string} [language="en"] - The target language code ("bn" or "en")
 * @returns {string} - The localized formatted number string
 */
const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function formatNumber(val, language = "en") {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (language !== "bn") return str;

  return str.replace(/\d/g, (d) => BANGLA_DIGITS[Number(d)] ?? d);
}

export default formatNumber;
