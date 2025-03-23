const { wasm } = require("circom_tester");
const assert = require("assert");

describe("AtLeastOneZero Circuit", function () {
  let circuit;

  before(async function () {
    // Compile the circuit
    circuit = await wasm("atleastonezero.circom");
  });

  // Test cases from our JSON
  const testCases = [
    {
      name: "should pass when all inputs are zero",
      message: "should pass when all inputs are zero",
      x: [0, 0, 0],
      isValid: true,
    },
    {
      name: "should pass when first input is zero",
      message: "should pass when first input is zero",
      x: [0, 5, 10],
      isValid: true,
    },
    {
      name: "should pass when middle input is zero",
      message: "should pass when middle input is zero",
      x: [5, 0, 10],
      isValid: true,
    },
    {
      name: "should pass when last input is zero",
      message: "should pass when last input is zero",
      x: [5, 10, 0],
      isValid: true,
    },
    {
      name: "should pass when multiple inputs are zero",
      message: "should pass when multiple inputs are zero",
      x: [0, 10, 0],
      isValid: true,
    },
    {
      name: "should fail when all inputs are non-zero",
      message: "Expected circuit to fail for all non-zero inputs",
      x: [1, 2, 3],
      isValid: false,
    },
    {
      name: "Should fail with large non-zero numbers",
      message: "Expected circuit to fail for all non-zero inputs",
      x: [42, 100, 999],
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
          };

          // Calculate witness
          const witness = await circuit.calculateWitness(input, true);
          await circuit.checkConstraints(witness);
          if (testCase.isValid) {
            assert.ok(testCase.message);
          } else {
            assert.fail(testCase.message);
          }
        });
      });
  });
});
