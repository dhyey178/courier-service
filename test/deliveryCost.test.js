const { 
  calculateBaseCost, 
  calculateDeliveryDetails 
} = require('../src/index');

describe('Delivery Cost Calculation', () => {
  test('should calculate the correct base cost for a package', () => {
    const baseCost = 100;
    const weight = 10;
    const distance = 50;
    const expectedCost = baseCost + (weight * 10) + (distance * 5);

    const actualCost = calculateBaseCost(baseCost, weight, distance);

    expect(actualCost).toBe(expectedCost);
  });
});

describe('Delivery Details Calculation', () => {
  test('should apply 10% discount for OFR001 when criteria are met', () => {
    const baseCost = 100;
    const weight = 75;
    const distance = 10;
    const offerCode = 'OFR001';

    const packageDetails = {
      baseCost,
      weight,
      distance,
      offerCode
    };

    const result = calculateDeliveryDetails(packageDetails);

    const calculatedBaseCost = baseCost + (weight * 10) + (distance * 5);
    const expectedDiscount = calculatedBaseCost * 0.10;
    const expectedTotalCost = calculatedBaseCost - expectedDiscount;

    expect(result.discount).toBe(expectedDiscount);
    expect(result.totalCost).toBe(expectedTotalCost);
  });
});
