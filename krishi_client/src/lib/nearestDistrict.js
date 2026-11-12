import { getAllDistricts } from "./bangladesh-districts.js";

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 *
 * @param {number} lat1 - Latitude of point 1 in degrees
 * @param {number} lon1 - Longitude of point 1 in degrees
 * @param {number} lat2 - Latitude of point 2 in degrees
 * @param {number} lon2 - Longitude of point 2 in degrees
 * @returns {number} Distance in kilometers
 */
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's mean radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest Bangladeshi district to a given latitude and longitude.
 *
 * @param {number} userLat - User's current latitude
 * @param {number} userLon - User's current longitude
 * @param {Array<Object>} [districtsList] - Optional custom district array; defaults to all 64 districts
 * @returns {Object|null} The nearest district object, or null if list is empty
 */
export function findNearestDistrict(userLat, userLon, districtsList = null) {
  const list = districtsList || getAllDistricts();
  if (!list || list.length === 0) return null;

  let nearest = null;
  let minDistance = Infinity;

  for (const district of list) {
    if (typeof district.lat === "number" && typeof district.lon === "number") {
      const dist = haversineDistanceKm(userLat, userLon, district.lat, district.lon);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = district;
      }
    }
  }

  return nearest ? { ...nearest, distanceKm: Math.round(minDistance) } : null;
}

export default findNearestDistrict;
