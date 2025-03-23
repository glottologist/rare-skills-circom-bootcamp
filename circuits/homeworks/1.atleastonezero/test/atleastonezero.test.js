const { wasm } = require("circom_tester");
const assert = require("assert");

describe("AtLeastOneZero Circuit", function () {
  let circuit;

  before(async function () {
    // Compile the circuit
    circuit = await wasm("atleastonezero.circom");
  });

  // Passing test cases (at least one zero)
  it("should pass when all inputs are zero", async function () {
    const input = {
      x: [0, 0, 0],
    };
    const witness = await circuit.calculateWitness(input);
    await circuit.checkConstraints(witness);
  });

  it("should pass when first input is zero", async function () {
    const input = {
      x: [0, 5, 10],
    };
    const witness = await circuit.calculateWitness(input);
    await circuit.checkConstraints(witness);
  });

  it("should pass when middle input is zero", async function () {
    const input = {
      x: [5, 0, 10],
    };
    const witness = await circuit.calculateWitness(input);
    await circuit.checkConstraints(witness);
  });

  it("should pass when last input is zero", async function () {
    const input = {
      x: [5, 10, 0],
    };
    const witness = await circuit.calculateWitness(input);
    await circuit.checkConstraints(witness);
  });

  it("should pass when multiple inputs are zero", async function () {
    const input = {
      x: [0, 10, 0],
    };
    const witness = await circuit.calculateWitness(input);
    await circuit.checkConstraints(witness);
  });

  // Failing test cases (no zeros)
  it("should fail when all inputs are non-zero", async function () {
    const input = {
      x: [1, 2, 3],
    };

    try {
      const witness = await circuit.calculateWitness(input);
      await circuit.checkConstraints(witness);
      assert.fail("Expected circuit to fail for all non-zero inputs");
    } catch (error) {
      assert(error !== undefined, "Expected an error but none was thrown");
    }
  });

  it("should fail with large non-zero numbers", async function () {
    const input = {
      x: [42, 100, 999],
    };

    try {
      const witness = await circuit.calculateWitness(input);
      await circuit.checkConstraints(witness);
      assert.fail("Expected circuit to fail for all non-zero inputs");
    } catch (error) {
      assert(error !== undefined, "Expected an error but none was thrown");
    }
  });
});
