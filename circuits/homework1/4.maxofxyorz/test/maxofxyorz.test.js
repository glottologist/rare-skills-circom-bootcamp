
const { wasm } = require("circom_tester");
const assert = require("assert");

describe("Max of X, Y or Z Circuit", function () {
  let circuit;

  before(async function () {
    // Compile the circuit
    circuit = await wasm("maxofxyorz.circom");
  });

  // Test cases from our JSON
  const testCases = [
    {
      name: "Should output the maximum value when x is the largest",
      x: 7,
      y: 5,
      z: 3,
      assertion:7n,
      isValid: true,
    },
    {
      name: "Should output the maximum value when y is the largest",
      x: 5,
      y: 8,
      z: 3,
      assertion:8n,
      isValid: true,
    },
    {
      name: "Should output the maximum value when z is the largest",
      x: 2,
      y: 5,
      z: 9,
      assertion:9n,
      isValid: true,
    },
    {
      name: "Should fail when there is no max",
      x: 1,
      y: 1,
      z: 1,
      assertion:0n,
      isValid: false,
    },
    {
      name: "Should fail when there is no clear max",
      x: 2,
      y: 2,
      z: 1,
      assertion:0n,
      isValid: false,
    },
  ];

  describe("All TestCases", function () {
    testCases
      .filter((tc) => tc.isValid)
      .forEach(function (testCase) {
        it(testCase.name, async function () {
          // Create circuit input
          const input = {
            x: testCase.x,
            y: testCase.y,
            z: testCase.z,
          };

          // Calculate witness
          const witness = await circuit.calculateWitness(input, true);
          await circuit.checkConstraints(witness);
          if (testCase.isValid) {
             assert.strictEqual(witness[1], testCase.assertion);
          } else {
            assert.fail(testCase.message);
          }
        });
      });
  });
});
