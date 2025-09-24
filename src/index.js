/**
 * Calculates the delivery cost for a single package.
 * @param {number} baseCost The base cost of delivery.
 * @param {number} weight The package weight in kg.
 * @param {number} distance The distance to the destination in km.
 * @returns {number} The total delivery cost.
 */
function calculateCost(baseCost, weight, distance) {
  return baseCost + (weight * 10) + (distance * 5);
}

module.exports = {
  calculateCost
};