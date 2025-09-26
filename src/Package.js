/**
 * Represents a single delivery package, encapsulating its data and cost calculation logic.
 */
class Package {
  constructor(id, weight, distance, offerCode, baseCost) {

    this.id = id;
    this.weight = weight;
    this.distance = distance;
    this.offerCode = offerCode;
    this.baseCost = baseCost;

    this.discount = 0;
    this.totalCost = 0;
  }

  /**
   * Calculates the base delivery cost using the formula:
   * Base Cost + (Weight * 10) + (Distance * 5)
   * @returns {number} The base delivery cost before discount.
   */
  calculateBaseCost() {
    return this.baseCost + (this.weight * 10) + (this.distance * 5);
  }

  /**
   * Validates input fields and applies the best available offer.
   * @param {function} validateOffer - The function containing offer validation rules.
   * @throws {Error} If weight or distance are invalid (non-positive numbers).
   */
  applyCostAndDiscount(validateOffer) {
    if (typeof this.weight !== 'number' || typeof this.distance !== 'number' || 
        isNaN(this.weight) || isNaN(this.distance) || 
        this.weight <= 0 || this.distance <= 0) {
      throw new Error('Invalid input: Weight and distance must be positive numbers.');
    }

    const totalBaseCost = this.calculateBaseCost();

    const discountPercentage = validateOffer({
      weight: this.weight,
      distance: this.distance,
      offerCode: this.offerCode
    });

    this.discount = totalBaseCost * discountPercentage;
    this.totalCost = totalBaseCost - this.discount;
  }
}

module.exports = Package;