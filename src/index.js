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

  if (typeof weight !== 'number' || typeof distance !== 'number' || weight <= 0 || distance <= 0) {
    throw new Error('Invalid input: Weight and distance must be positive numbers.');
  }

  const totalBaseCost = calculateBaseCost(baseCost, weight, distance);

  const discountPercentage = validateOffer({ weight, distance, offerCode });

  const discount = totalBaseCost * discountPercentage;

  const totalCost = totalBaseCost - discount;

  return { discount, totalCost };
}

/**
 * Parses input lines, calculates delivery costs for all packages, and formats the output.
 * @param {string[]} lines - An array of input strings from the command line.
 * @returns {string[]} An array of output strings in the format: "pkg_id discount total_cost"
 */
function processInput(lines) {
  if (!lines || lines.length === 0) {
    return [];
  }

  const [baseCostStr, numPackagesStr] = lines[0].trim().split(/\s+/);
  const baseCost = parseFloat(baseCostStr);
  const numPackages = parseInt(numPackagesStr, 10);

  if (isNaN(baseCost) || isNaN(numPackages) || lines.length !== numPackages + 1) {
    console.error("Invalid input format detected.");
    return [];
  }

  const packageOutput = [];

  for (let i = 1; i <= numPackages; i++) {
    const line = lines[i];

    const [pkgId, weightStr, distanceStr, offerCode] = line.trim().split(/\s+/); 

    const weight = parseFloat(weightStr);
    const distance = parseFloat(distanceStr);

    const packageDetails = {
      pkgId,
      baseCost,
      weight,
      distance,
      offerCode
    };

    const { discount, totalCost } = calculateDeliveryDetails(packageDetails);

    const outputLine = `${pkgId} ${Math.round(discount)} ${Math.round(totalCost)}`;

    packageOutput.push(outputLine);
  }

  return packageOutput;
}

module.exports = {
  calculateBaseCost,
  validateOffer,
  calculateDeliveryDetails,
  processInput
};