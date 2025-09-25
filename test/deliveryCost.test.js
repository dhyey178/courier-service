const { 
  calculateBaseCost,
  validateOffer,
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

describe('Offer Validation', () => {

  test('should return 0.1 for OFR001 when criteria are exactly met', () => {
    const details = { weight: 70, distance: 100, offerCode: 'OFR001' };
    expect(validateOffer(details)).toBe(0.1);
  });

  test('should return 0 for OFR001 when weight is under limit', () => {
    const details = { weight: 69, distance: 100, offerCode: 'OFR001' };
    expect(validateOffer(details)).toBe(0);
  });

  test('should return 0.07 for OFR002 when criteria are met', () => {
    const details = { weight: 100, distance: 100, offerCode: 'OFR002' };
    expect(validateOffer(details)).toBe(0.07);
  });

  test('should return 0 for OFR002 when distance is under limit', () => {
    const details = { weight: 100, distance: 49, offerCode: 'OFR002' };
    expect(validateOffer(details)).toBe(0);
  });

  test('should return 0 for a non-existent offer code', () => {
    const details = { weight: 100, distance: 100, offerCode: 'OFR999' };
    expect(validateOffer(details)).toBe(0);
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

  test('should throw an error for non-numeric weight', () => {
    const packageDetails = {
      baseCost: 100,
      weight: 'invalid-weight',
      distance: 50,
      offerCode: 'OFR001'
    };

    expect(() => calculateDeliveryDetails(packageDetails)).toThrow(
      'Invalid input: Weight and distance must be positive numbers.'
    );
  });

  test('should throw an error for non-numeric distance', () => {
    const packageDetails = {
      baseCost: 100,
      weight: 70,
      distance: 'invalid-distance',
      offerCode: 'OFR001'
    };

    expect(() => calculateDeliveryDetails(packageDetails)).toThrow(
      'Invalid input: Weight and distance must be positive numbers.'
    );
  });

  test('should throw an error for non-positive weight', () => {
      const packageDetails = {
          baseCost: 100,
          weight: -5,
          distance: 50,
          offerCode: 'OFR001'
      };

      expect(() => calculateDeliveryDetails(packageDetails)).toThrow(
          'Invalid input: Weight and distance must be positive numbers.'
      );
  });
  test('should throw an error for non-positive distance', () => {
      const packageDetails = {
          baseCost: 100,
          weight: 40,
          distance: 0,
          offerCode: 'OFR001'
      };

      expect(() => calculateDeliveryDetails(packageDetails)).toThrow(
          'Invalid input: Weight and distance must be positive numbers.'
      );
  });

});
