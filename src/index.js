/**
 * Calculates the delivery cost for a single package.
 * @param {number} baseCost The base cost of delivery.
 * @param {number} weight The package weight in kg.
 * @param {number} distance The distance to the destination in km.
 * @returns {number} The total delivery cost.
 */
function calculateBaseCost(baseCost, weight, distance) {
  return baseCost + (weight * 10) + (distance * 5);
}

/**
 * Checks if an offer code is valid based on package details.
 * @param {object} packageDetails - The package details including weight, distance, and offer code.
 * @returns {number} The discount percentage as a decimal (e.g., 0.1 for 10%), or 0 if no offer is valid.
 */
function validateOffer(packageDetails) {
  const { weight, distance, offerCode } = packageDetails;

  const offers = {
    OFR001: {
      discount: 0.1,
      criteria: (weight, distance) => weight >= 70 && weight <= 200 && distance >= 0 && distance <= 200,
    },
    OFR002: {
      discount: 0.07,
      criteria: (weight, distance) => weight >= 10 && weight < 150 && distance >= 50 && distance <= 250,
    },
    OFR003: {
      discount: 0.05,
      criteria: (weight, distance) => weight >= 10 && weight <= 250 && distance >= 50 && distance <= 250,
    },
  };

  const offer = offers[offerCode];

  if (offer && offer.criteria(weight, distance)) {
    return offer.discount;
  }

  return 0;
}

/**
 * Orchestrates the calculation of delivery details, including discounts.
 * @param {object} packageDetails - The package details including baseCost, weight, distance, and offerCode.
 * @returns {object} An object containing the final total cost and the applied discount amount.
 */
function calculateDeliveryDetails(packageDetails) {
  const { baseCost, weight, distance, offerCode } = packageDetails;

  const totalBaseCost = calculateBaseCost(baseCost, weight, distance);

  const discountPercentage = validateOffer({ weight, distance, offerCode });

  const discount = totalBaseCost * discountPercentage;

  const totalCost = totalBaseCost - discount;

  return { discount, totalCost };
}

module.exports = {
  calculateBaseCost,
  calculateDeliveryDetails
};