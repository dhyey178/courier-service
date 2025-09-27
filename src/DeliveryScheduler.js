const Vehicle = require('./Vehicle');
// Assuming Package is imported if needed in helper functions

/**
 * Manages the assignment of packages to vehicles and calculates delivery times,
 * following the multi-criteria loading and scheduling strategy.
 */
class DeliveryScheduler {
  /**
   * @param {number} numVehicles - The total number of available vehicles.
   * @param {number} maxLoad - The maximum carrying capacity for all vehicles.
   * @param {number} maxSpeed - The maximum speed for all vehicles.
   */
  constructor(numVehicles, maxLoad, maxSpeed) {
    this.vehicles = [];
    for (let i = 1; i <= numVehicles; i++) {
      this.vehicles.push(new Vehicle(i, maxLoad, maxSpeed));
    }

    // Stores packages that still need to be delivered (will be constantly updated/sorted)
    this.pendingPackages = [];
    this.maxLoad = maxLoad;
    this.maxSpeed = maxSpeed;
    this.numVehicles = numVehicles;
  }

  /**
   * Orchestrates the entire delivery scheduling process.
   * @param {Package[]} packages - The list of all Package objects.
   * @returns {void} Updates the deliveryTime property on the Package objects directly.
   */
  scheduleDeliveries(packages) {
    // Implementation to be added
  }
  
  /**
   * Finds the maximum number of packages that can fit in a vehicle (Priority 1).
   * Uses the "Smallest First" greedy approach.
   * @param {Package[]} sortedPackages - Packages sorted by weight (ascending).
   * @returns {number} The maximum count of packages possible in one trip.
   */
  getMaxCountPossible(sortedPackages) {
    if (sortedPackages.length === 0) {
      return 0;
    }
    const maxLoad = this.maxLoad;
    let currentLoad = 0;
    let maxCount = 0;

    for (const pkg of sortedPackages) {
      if(currentLoad + pkg.weight > maxLoad){
        break;
      }
      currentLoad += pkg.weight;
      maxCount++;
    }

    return maxCount;
  }
  
  /**
   * Finds all groups of packages with the determined maxCount that maximize total weight (Priority 2).
   * @param {Package[]} sortedPackages - Packages sorted by weight (ascending).
   * @param {number} count - The number of packages to fit.
   * @returns {Package[][]} An array of trip candidates (arrays of Package objects) that have max weight.
   */
  findMaxWeightGroups(sortedPackages, count) {
    // Implementation to be added
    const maxLoad = this.maxLoad; 
    let maxFoundLoad = 0;
    let highestWeightCombinations = [];
    /**
     * Recursive function using backtracking to find the maximum weight combinations.
     * @param {number} startIdx - The starting index in the packages array.
     * @param {number} remainingCount - The number of packages still needed.
     * @param {Package[]} currentCombination - The packages selected so far.
     * @param {number} currentLoad - The sum of weights in currentCombination.
     */
    function backtrack(startIdx, remainingCount, currentCombination, currentLoad) {
      if (remainingCount === 0) {
        if (currentLoad > maxFoundLoad) {
          maxFoundLoad = currentLoad;
          highestWeightCombinations = [
            [...currentCombination]
          ];
        }
        else if (currentLoad === maxFoundLoad) {
          highestWeightCombinations.push([...currentCombination]);
        }
        return;
      }
      if (sortedPackages.length - startIdx < remainingCount) {
        return;
      }
      for (let i = startIdx; i < sortedPackages.length; i++) {
        const packageObj = sortedPackages[i];
        const newLoad = currentLoad + packageObj.weight;
        if (newLoad > maxLoad) {
          break; 
        }
        currentCombination.push(packageObj);
        backtrack(i + 1, remainingCount - 1, currentCombination, newLoad);
        currentCombination.pop(); 
      }
    }
    backtrack(0, count, [], 0);
    return highestWeightCombinations;
  }
  
  /**
   * Selects the single best trip from candidates by minimizing the delivery time (Priority 3).
   * Delivery time is based on the max distance package in the group.
   * @param {Package[][]} tripCandidates - Array of package groups with equal max weight.
   * @returns {Package[]} The single optimal group of packages for the next trip.
   */
  selectBestTripByTime(tripCandidates) {
    // Implementation to be added
    return [];
  }
  
  /**
   * Finds the next available vehicle, assigns the trip, updates vehicle time, and updates package times.
   * @param {Package[]} tripPackages - The single optimal group of packages for this trip.
   * @returns {void} Updates internal state (this.pendingPackages, vehicle.availableTime, package.deliveryTime).
   */
  dispatchTripAndUpdateState(tripPackages) {
    // Implementation to be added
  }
  
  /**
   * Finds the vehicle that will be available the soonest. (Utility function)
   * @returns {Vehicle} The Vehicle object available earliest.
   */
  findNextAvailableVehicle() {
    // Implementation to be added
  }
}

module.exports = DeliveryScheduler;