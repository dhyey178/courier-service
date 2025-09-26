/**
 * Represents a single delivery vehicle, tracking its capacity and availability time.
 */
class Vehicle {
  /**
   * @param {number} id - Unique vehicle identifier (e.g., 1, 2, 3).
   * @param {number} maxLoad - Maximum carrying capacity in kg (L).
   * @param {number} maxSpeed - Maximum speed in km/hr (S).
   */
  constructor(id, maxLoad, maxSpeed) {
    this.id = id;
    this.maxLoad = maxLoad; 
    this.maxSpeed = maxSpeed; 
    this.availableTime = 0;
  }

  /**
   * Calculates the time (in hours) when the vehicle will return after a trip.
   * Trip time = (Distance / Speed) * 2 (Round Trip)
   * @param {number} distance - The distance to the furthest package destination in the current trip.
   * @returns {number} The time the vehicle will be available next.
   */
  calculateReturnTime(distance) {
    const timeToDeliver = distance / this.maxSpeed;    
    const roundTripTime = timeToDeliver * 2;
    return this.availableTime + roundTripTime;
  }

}

module.exports = Vehicle;