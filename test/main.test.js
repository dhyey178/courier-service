const { processInput } = require('../src/index');

describe('End-to-End Input Processing', () => {
  test('should process sample input and return success:true correct data containing costs and discounts for all packages', () => {
    const inputLines = [
      '100 3',
      'PKG1 5 5 OFR001',
      'PKG2 15 5 OFR002',
      'PKG3 10 100 OFR003',
    ];

    const expectedData  = [
      'PKG1 0 175',
      'PKG2 0 275',
      'PKG3 35 665',
    ];

    const actualOutput = processInput(inputLines);

    expect(actualOutput.success).toBe(true);
    expect(actualOutput.data).toEqual(expectedData);
  });

  test('should return an success:false and message if the input array is empty/null/undefined/no input', () => {
    let actualOutput = processInput([]);
    expect(actualOutput.success).toBe(false);
    expect(actualOutput.message).toBe('No input lines provided.');

    actualOutput = processInput(null);
    expect(actualOutput.success).toBe(false);
    expect(actualOutput.message).toBe('No input lines provided.');

    actualOutput = processInput(undefined);
    expect(actualOutput.success).toBe(false);
    expect(actualOutput.message).toBe('No input lines provided.');

    actualOutput = processInput();
    expect(actualOutput.success).toBe(false);
    expect(actualOutput.message).toBe('No input lines provided.');
  });

  test('should return success:false and error message if baseCost is non-positive or non-numeric', () => {
    let actualOutput = processInput(['invalid 3', 'PKG1 5 5 OFR001']);
    expect(actualOutput.success).toBe(false);
    expect(actualOutput.message).toBe('Invalid base delivery cost. Must be a positive number.');

    actualOutput = processInput(['0 3', 'PKG1 5 5 OFR001']);
    expect(actualOutput.success).toBe(false);
    expect(actualOutput.message).toBe('Invalid base delivery cost. Must be a positive number.');
  });

  test('should return success:false and error message if the package count is not a integer or does not match the input lines', () => {
    let inputLines = [
      '100 5',
      'PKG1 5 5 OFR001',
    ];

    let actualOutput = processInput(inputLines);

    expect(actualOutput.success).toBe(false);
    expect(actualOutput.message).toBe('Invalid number of packages or missing package lines.');

    inputLines = [
      '100 invalid',
      'PKG1 5 5 OFR001',
      'PKG2 15 5 OFR002',
      'PKG3 10 100 OFR003',
      'PKG4 10 100 OFR003',
    ];

    actualOutput = processInput(inputLines);

    expect(actualOutput.success).toBe(false);
    expect(actualOutput.message).toBe('Invalid number of packages or missing package lines.');

    inputLines = [
      '100 3.5',
      'PKG1 5 5 OFR001',
      'PKG2 15 5 OFR002',
      'PKG3 10 100 OFR003',
      'PKG4 10 100 OFR003',
    ];

    actualOutput = processInput(inputLines);

    expect(actualOutput.success).toBe(false);
    expect(actualOutput.message).toBe('Invalid number of packages or missing package lines.');
  });
  test('should return success:true with partial data and a message when packages are skipped', () => {
    const inputLines = [
      '100 5',
      'PKG1 5 5 OFR001',
      'PKG2 15',
      'PKG3 invalid 100 OFR003',
      'PKG4 50 -200 OFR001',
      'PKG5 15 5',
    ];

    const expectedData = ['PKG1 0 175', 'PKG5 0 275'];

    const result = processInput(inputLines);

    expect(result.success).toBe(true);
    expect(result.data.length).toBe(2);
    expect(result.data).toEqual(expectedData);
    expect(result.message).toContain('3 packages were skipped due to errors.');
  });
});