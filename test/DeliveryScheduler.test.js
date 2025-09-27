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