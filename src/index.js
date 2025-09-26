const Package = require('./Package');
const OfferStrategies = require('./offers');

/**
 * Checks if an offer code is valid based on package details.
 * @param {object} packageDetails - The package details including weight, distance, and offer code.
 * @returns {number} The discount percentage as a decimal (e.g., 0.1 for 10%), or 0 if no offer is valid.
 */
function validateOffer(packageDetails) {
  const { weight, distance, offerCode } = packageDetails;
  const offer = OfferStrategies[offerCode];

  if (offer && offer.criteria(weight, distance)) {
    return offer.discount;
  }
  return 0;
}

/**
 * Parses input lines, creates Package objects, calculates costs, and formats the output.
 * @param {string[]} lines - An array of input strings from the command line.
 * @returns {object} { success: boolean, data: string[] | null, message: string | null, errorMessages: string[] | null }
 */
function processInput(lines) {
  if (!lines || lines.length === 0) {
    return { success: false, message: 'No input lines provided.' };
  }

  const [baseCostStr, numPackagesStr] = lines[0].trim().split(/\s+/);
  const baseCost = parseFloat(baseCostStr);
  const numPackages = parseFloat(numPackagesStr);

  if (isNaN(baseCost) || baseCost <= 0) {
    return { success: false, message: 'Invalid base delivery cost. Must be a positive number.' };
  }

  if (!Number.isInteger(numPackages) || lines.length !== numPackages + 1) {
    return { success: false, message: 'Invalid number of packages or missing package lines.' };
  }

  const packageOutput = [];
  const errorMessages = [];
  const packageObjects = [];

  for (let i = 1; i <= numPackages; i++) {
    const line = lines[i];
    const tokens = line.trim().split(/\s+/); 
    if (tokens.length < 3) { 
      errorMessages.push(`Skipping package ${i}: Missing data. Line: "${line.trim()}"`);
      continue; 
    }
    try {
      const [pkgId, weightStr, distanceStr, offerCode] = tokens;

      const weight = parseFloat(weightStr);
      const distance = parseFloat(distanceStr);
      
      const packageObj = new Package(pkgId, weight, distance, offerCode, baseCost);
      
      packageObj.applyCostAndDiscount(validateOffer);
      
      packageObjects.push(packageObj);
      const outputLine = `${packageObj.id} ${Math.round(packageObj.discount)} ${Math.round(packageObj.totalCost)}`;
      packageOutput.push(outputLine);

    } catch (error) {
      errorMessages.push(`Skipping package ${tokens[0] || i}: ${error.message}`);
    }

  }
  return { 
    success: true, 
    data: packageOutput,
    message: errorMessages.length > 0 
      ? `Processing complete. ${errorMessages.length} packages were skipped due to errors.`
      : null,
    errorMessages
  };
}

module.exports = {
  validateOffer, 
  processInput
};
