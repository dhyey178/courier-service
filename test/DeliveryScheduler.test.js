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