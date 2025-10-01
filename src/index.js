const Package = require('./Package');
const OfferStrategies = require('./offers');
const DeliveryScheduler = require('./DeliveryScheduler')

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
  if (!lines || lines.length < 2) {
    return { success: false, message: 'No input lines provided or insufficient data.' };
  }

  const [baseCostStr, numPackagesStr] = lines[0].trim().split(/\s+/);
  const baseCost = parseFloat(baseCostStr);
  const numPackages = parseFloat(numPackagesStr);

  if (isNaN(baseCost) || baseCost <= 0) {
    return { success: false, message: 'Invalid base delivery cost. Must be a positive number.' };
  }

  if (!Number.isInteger(numPackages) || lines.length !== numPackages + 2) {
    return { success: false, message: 'Invalid number of packages or missing package lines.' };
  }

  const vehicleLineIndex = numPackages + 1;
  const vehicleTokens = lines[vehicleLineIndex].trim().split(/\s+/);
  const numVehicles = parseInt(vehicleTokens[0]);
  const maxSpeed = parseFloat(vehicleTokens[1]);
  const maxLoad = parseFloat(vehicleTokens[2]);

  if (isNaN(numVehicles) || numVehicles <= 0 || isNaN(maxSpeed) || maxSpeed <= 0 || isNaN(maxLoad) || maxLoad <= 0) {
    return { success: false, message: 'Invalid vehicle details (N, S, L). Must be positive numbers.' };
  }

  const packages = [];
  let errorMessages = [];

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
      packages.push(packageObj);

    } catch (error) {
      errorMessages.push(`Skipping package ${tokens[0] || i}: ${error.message}`);
    }
  }
  const scheduler = new DeliveryScheduler(numVehicles, maxLoad, maxSpeed);
  scheduler.scheduleDeliveries(packages, validateOffer); 
  const correctPackages = packages.filter(pkg => pkg.deliveryTime !== null);
  const packageOutput = correctPackages.map(pkg => {
    return `${pkg.id} ${pkg.discount} ${pkg.totalCost} ${pkg.deliveryTime}`;
  });

  if (scheduler.errorMessages.length > 0){
    errorMessages = [...errorMessages, ...scheduler.errorMessages]
  }

  if (scheduler.overSizePackages.length > 0){
    scheduler.overSizePackages.map(pkg => {
      errorMessages.push(`Skipping package delivery time calculation ${pkg.id}: package weight greater than max load`);
    })
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
