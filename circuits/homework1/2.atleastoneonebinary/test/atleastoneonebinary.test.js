const { wasm } = require("circom_tester");
const assert = require("assert");

describe("AtLeastOneOneBinary Circuit", function () {
  let circuit;

  before(async function () {
    // Compile the circuit
    circuit = await wasm("atleastoneonebinary.circom");
  });

  // Test cases from our JSON
  const testCases = [
    {
      name: "should pass when all inputs are 1",
      message: "should pass when all inputs are 1",
      x: [1, 1, 1],
      isValid: true,
    },
    {
      name: "should pass when first input is 1",
      message: "should pass when first input is 1",
      x: [1, 0, 0],
      isValid: true,
    },
    {
      name: "should pass when middle input is 1",
      message: "should pass when middle input is 1",
      x: [0, 1, 0],
      isValid: true,
    },
    {
      name: "should pass when last input is 1",
      message: "should pass when last input is 1",
      x: [0, 0, 1],
      isValid: true,
    },
    {
      name: "should pass when some inputs are 1",
      message: "should pass when some inputs are 1",
      x: [1, 0, 1],
      isValid: true,
    },
    {
      name: "should fail when all inputs are 0",
      message: "Expected circuit to fail for all-zero inputs",
      x: [0, 0, 0],
      isValid: false,
    },
    {
      name: "should reject non-binary inputs",
      message: "Expected circuit to fail for non-binary inputs",
      x: [2, 0, 0],
      isValid: false,
    },
    {
      name: "should reject negative inputs",
      message: "Expected circuit to fail for negative inputs",
      x: [0, -1, 0],
      isValid: false,
    },
    {
      name: "should reject fractional inputs",
      message: "Expected circuit to fail for fractional inputs",
      x: [0, 0.5, 0],
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
            assert.strictEqual(witness[1], BigInt(1));
            assert.ok(testCase.message);
          } else {
            assert.fail(testCase.message);
          }
        });
      });
  });
});
