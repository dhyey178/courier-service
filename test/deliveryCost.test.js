const Package = require('../src/Package');
const { validateOffer } = require('../src/index'); 

describe('Package Class Core Logic', () => {
  test('should calculate the correct base cost for a package', () => {
    const pkg = new Package('PKG1', 10, 50, 'OFR001', 100);
    expect(pkg.calculateBaseCost()).toBe(450);
  });
  test('should apply 10% discount for OFR001 when criteria are met', () => {
    const baseCost = 100;
    const weight = 75;
    const distance = 10;
    const offerCode = 'OFR001';
    const pkg = new Package('PKG1', weight, distance, offerCode, baseCost);
    pkg.applyCostAndDiscount(validateOffer);

    const calculatedBaseCost = baseCost + (weight * 10) + (distance * 5);
    const expectedDiscount = calculatedBaseCost * 0.10;
    const expectedTotalCost = calculatedBaseCost - expectedDiscount;

    expect(pkg.discount).toBe(expectedDiscount);
    expect(pkg.totalCost).toBe(expectedTotalCost);

  })
})

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

describe('Package Logic Error Handling', () => {
  test('should throw an error for non-numeric weight', () => {
    const pkg = new Package('PKG1', 'invalid-weight', 50, 'OFR001', 100);
    expect(() => pkg.applyCostAndDiscount(validateOffer)).toThrow(
      'Invalid input: Weight and distance must be positive numbers.'
    );
  });

  test('should throw an error for non-positive weight', () => {
      const pkg = new Package('PKG1', -5, 50, 'OFR001', 100);
      expect(() => pkg.applyCostAndDiscount(validateOffer)).toThrow(
          'Invalid input: Weight and distance must be positive numbers.'
      );
  });

  test('should throw an error for non-numeric distance', () => {
    const pkg = new Package('PKG1', 70, 'invalid-distance', 'OFR001', 100);
    expect(() => pkg.applyCostAndDiscount(validateOffer)).toThrow(
      'Invalid input: Weight and distance must be positive numbers.'
    );
  });

  test('should throw an error for non-positive distance', () => {
      const pkg = new Package('PKG1', 40, 0, 'OFR001', 100);
      expect(() => pkg.applyCostAndDiscount(validateOffer)).toThrow(
        'Invalid input: Weight and distance must be positive numbers.'
      );
  });
})

