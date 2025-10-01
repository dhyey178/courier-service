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

    const expectedDeliveryTime_PA = Math.round((50 / 70)*100)/100;
    const expectedDeliveryTime_PB = Math.round((100 / 70)*100)/100;

    expect(tripPackages[0].deliveryTime).toBeCloseTo(expectedDeliveryTime_PA, 2);
    expect(tripPackages[1].deliveryTime).toBeCloseTo(expectedDeliveryTime_PB, 2);

    expect(v1.availableTime).toBe(10.0);
    expect(v2.availableTime).toBeCloseTo(expectedDeliveryTime_PB*2, 2);

    expect(scheduler.pendingPackages.length).toBe(1);
    expect(scheduler.pendingPackages[0].id).toBe('P_C');
  });
});

describe('DeliveryScheduler End-to-End: scheduleDeliveries Orchestration', () => {
  test('should correctly schedule all packages according to multi-criteria rules and update delivery times', () => {
    const scheduler = new DeliveryScheduler(2, 200, 70); 
    const packages = [
      new Package('PKG1', 50, 30, 'OFR001', 100),
      new Package('PKG2', 75, 125, 'OFR0008', 100),
      new Package('PKG3', 175, 100, 'OFFR003', 100),
      new Package('PKG4', 110, 60, 'OFR002', 100),
      new Package('PKG5', 155, 95, 'NA', 100),
    ];
    scheduler.scheduleDeliveries(packages);

    const expectedPackageValues = {
      'PKG1': {
        discount: 0,
        totalCost: 750,
      },
      'PKG2': {
        discount: 0,
        totalCost: 1475,
      },
      'PKG3': {
        discount: 0,
        totalCost: 2350,
      },
      'PKG4': {
        discount: 105,
        totalCost: 1395,
      },
      'PKG5': {
        discount: 0,
        totalCost: 2125,
      }
    };
    let v1_time = 0;
    let v2_time = 0;
    expectedPackageValues['PKG2'].deliveryTime = Math.round((v1_time + packages[1].distance / 70)*100)/100;
    expectedPackageValues['PKG4'].deliveryTime = Math.round((v1_time + packages[3].distance / 70)*100)/100;
    v1_time += (packages[1].distance / 70)*2

    expectedPackageValues['PKG3'].deliveryTime = Math.round((v2_time + packages[2].distance / 70)*100)/100;
    v2_time += (packages[2].distance / 70)*2

    expectedPackageValues['PKG5'].deliveryTime = Math.round((v2_time + packages[4].distance / 70)*100)/100;
    v2_time += (packages[4].distance / 70)*2

    expectedPackageValues['PKG1'].deliveryTime = Math.round((v1_time + packages[0].distance / 70)*100)/100;
    v1_time += (packages[0].distance / 70)*2

    packages.forEach(pkg => {
      expect(pkg.discount).toBe(expectedPackageValues[pkg.id].discount)
      expect(pkg.totalCost).toBe(expectedPackageValues[pkg.id].totalCost)
      expect(pkg.deliveryTime).toBeCloseTo(expectedPackageValues[pkg.id].deliveryTime, 2);
    });

    expect(scheduler.pendingPackages.length).toBe(0); 

    const v1 = scheduler.vehicles.find(v => v.id === 1);
    const v2 = scheduler.vehicles.find(v => v.id === 2);

    expect(v1.availableTime).toBeCloseTo(v1_time, 2);
    expect(v2.availableTime).toBeCloseTo(v2_time, 2);

  });
});