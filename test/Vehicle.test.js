const Vehicle = require('../src/Vehicle');

describe('Vehicle Class Logic', () => {
  test('should calculate correct return time for a trip starting at time 0', () => {
    const vehicle = new Vehicle(1, 200, 70);
    const distance = 100;
    const expectedReturnTime = (100 / 70) * 2;
    expect(vehicle.calculateReturnTime(distance)).toBeCloseTo(expectedReturnTime, 4);
  });

  test('should calculate return time based on current availableTime', () => {
    const vehicle = new Vehicle(2, 200, 70);
    vehicle.availableTime = 5;
    const distance = 50;
    const tripTime = (50 / 70) * 2;
    expect(vehicle.calculateReturnTime(distance)).toBeCloseTo(5 + tripTime, 4);
  });
});