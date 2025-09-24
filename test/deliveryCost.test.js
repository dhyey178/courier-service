describe('Delivery Cost Calculation', () => {
  test('should calculate the correct base cost for a package', () => {
    const baseCost = 100;
    const weight = 10;
    const distance = 50;
    const expectedCost = baseCost + (weight * 10) + (distance * 5);

    const actualCost = calculateCost(baseCost, weight, distance);

    expect(actualCost).toBe(expectedCost);
  });
});