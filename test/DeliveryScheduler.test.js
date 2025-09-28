const DeliveryScheduler = require('../src/DeliveryScheduler');
const Package = require('../src/Package')

describe('DeliveryScheduler Priority 1: Max Package Count', () => {
  test('should return the maximum count of 5 packages for a weight sorted package array', () => {
    const scheduler = new DeliveryScheduler(1, 200, 70); 

    scheduler.pendingPackages = [
      new Package('P_A', 60, 50, '', 100),
      new Package('P_B', 150, 50, '', 100),
      new Package('P_C', 10, 50, '', 100),
      new Package('P_D', 50, 50, '', 100),
      new Package('P_E', 20, 50, '', 100),
      new Package('P_F', 40, 50, '', 100),
      new Package('P_G', 30, 50, '', 100),
    ];

    scheduler.pendingPackages = scheduler.pendingPackages.sort((a, b) => a.weight - b.weight);
    const maxCount = scheduler.getMaxCountPossible(scheduler.pendingPackages);

    expect(maxCount).toBe(5); 
  });
});

describe('DeliveryScheduler Priority 2: Maximize Total Weight', () => {
  test('should find the group of size count that has the maximum possible weight', () => {
    const scheduler = new DeliveryScheduler(1, 200, 70); 

    scheduler.pendingPackages = [
      new Package('P1', 100, 50, '', 100),
      new Package('P2', 95, 50, '', 100),
      new Package('P3', 90, 50, '', 100),
      new Package('P4', 50, 50, '', 100),
    ];
    scheduler.pendingPackages = scheduler.pendingPackages.sort((a, b) => a.weight - b.weight);

    const maxCount = scheduler.getMaxCountPossible(scheduler.pendingPackages);

    const tripCandidates = scheduler.findMaxWeightGroups(scheduler.pendingPackages, maxCount);

    expect(tripCandidates.length).toBe(1); 

    const packageIds = tripCandidates[0].map(p => p.id).sort();
    expect(packageIds).toEqual(['P1', 'P2']);

    const totalWeight = tripCandidates[0].reduce((sum, p) => sum + p.weight, 0);
    expect(totalWeight).toBe(195);
  });

  test('should find the multiple group of size count that has the maximum possible weight', () => {
    const scheduler = new DeliveryScheduler(1, 200, 70); 

    scheduler.pendingPackages = [
      new Package('P1', 125, 50, '', 100),
      new Package('P2', 75, 50, '', 100),
      new Package('P3', 110, 50, '', 100),
      new Package('P4', 90, 50, '', 100),
      new Package('P5', 50, 50, '', 100),
    ];

    scheduler.pendingPackages = scheduler.pendingPackages.sort((a, b) => a.weight - b.weight);

    const maxCount = scheduler.getMaxCountPossible(scheduler.pendingPackages);
    const tripCandidates = scheduler.findMaxWeightGroups(scheduler.pendingPackages, maxCount);
    expect(tripCandidates.length).toBe(2);

    expect(tripCandidates[0].reduce((sum, p) => sum + p.weight, 0)).toBe(200);
    expect(tripCandidates[1].reduce((sum, p) => sum + p.weight, 0)).toBe(200);
  });
});

describe('DeliveryScheduler Priority 3: Minimize Delivery Time (Min Distance)', () => {
  test('should select the single trip from candidates that has the minimum maximum distance', () => {
    const scheduler = new DeliveryScheduler(1, 200, 70); 
    const candidates = [
      [new Package('P_A1', 125, 100, '', 100), new Package('P_A2', 75, 50, '', 100)],
      [new Package('P_B1', 100, 75, '', 100), new Package('P_B2', 100, 10, '', 100)], 
      [new Package('P_C1', 110, 120, '', 100), new Package('P_C2', 90, 10, '', 100)], 
    ];

    const finalTrip = scheduler.selectBestTripByTime(candidates);

    const finalTripIds = finalTrip.map(p => p.id).sort();
    expect(finalTripIds).toEqual(['P_B1', 'P_B2']);

    const maxDistance = finalTrip.reduce((max, p) => Math.max(max, p.distance), 0);
    expect(maxDistance).toBe(75); 
  })
});

describe('DeliveryScheduler State Management: Dispatch Trip', () => {
  test('should correctly dispatch a trip, update vehicle time, and set package delivery times', () => {
    const scheduler = new DeliveryScheduler(2, 200, 70); 

    const v1 = scheduler.vehicles[0];
    const v2 = scheduler.vehicles[1];
    v1.availableTime = 10.0;

    const tripPackages = [
      new Package('P_A', 100, 50, '', 100),
      new Package('P_B', 100, 100, '', 100),
    ];

    scheduler.pendingPackages = [...tripPackages, new Package('P_C', 50, 10, '', 100)]; 

    scheduler.dispatchTripAndUpdateState(tripPackages);

    const expectedDeliveryTime_PA = 50 / 70;
    const expectedDeliveryTime_PB = 100 / 70;

    expect(tripPackages[0].deliveryTime).toBeCloseTo(expectedDeliveryTime_PA, 4);
    expect(tripPackages[1].deliveryTime).toBeCloseTo(expectedDeliveryTime_PB, 4);

    expect(v1.availableTime).toBe(10.0);
    expect(v2.availableTime).toBeCloseTo(expectedDeliveryTime_PB*2, 4);

    expect(scheduler.pendingPackages.length).toBe(1);
    expect(scheduler.pendingPackages[0].id).toBe('P_C');
  });
});