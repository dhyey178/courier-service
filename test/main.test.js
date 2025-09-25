const { processInput } = require('../src/index');

describe('End-to-End Input Processing', () => {
  test('should process sample input and return correct costs and discounts for all packages', () => {
    const inputLines = [
      '100 3',
      'PKG1 5 5 OFR001',
      'PKG2 15 5 OFR002',
      'PKG3 10 100 OFR003',
    ];

    const expectedOutput = [
      'PKG1 0 175',
      'PKG2 0 275',
      'PKG3 35 665',
    ];

    const actualOutput = processInput(inputLines);

    expect(actualOutput).toEqual(expectedOutput);
  });

  test('should return an empty array if the input array is empty/null/undefined/no input', () => {

    let actualOutput = processInput([]);
    expect(actualOutput).toEqual([]);

    actualOutput = processInput(null);
    expect(actualOutput).toEqual([]);

    actualOutput = processInput(undefined);
    expect(actualOutput).toEqual([]);

    actualOutput = processInput();
    expect(actualOutput).toEqual([]);

  });
});