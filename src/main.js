const readline = require('readline');
const { processInput } = require('./index');

function runCliReadline() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log("Please Provide input to calculate delivery cost (Go to new line and Press Ctrl + D to end input):")
  const inputLines = [];

  rl.on('line', (line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length > 0) {
      inputLines.push(trimmedLine);
    }
  });

  rl.on('close', () => {
    try {
      const result = processInput(inputLines);
      if (result.success) {
        if (result.message) {
          console.log(result.message);
        } else {
          console.log("Processing Complete.")
        }
        result.data.forEach(line => {
          console.log(line);
        });
        if (result.errorMessages?.length > 0) {
          console.log("Errors:")
          result.errorMessages.forEach(error => {
            console.error(error);
          });
        }
      } else {
        console.error(`\nError: ${result.message}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`\nFatal Application Error: ${error.message}`);
      process.exit(1);
    }
  });
}

runCliReadline();