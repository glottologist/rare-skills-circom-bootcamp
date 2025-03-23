const { wasm } = require("circom_tester");
const assert = require("assert");

describe("AtLeastOneOneBinary Circuit", function () {
  let circuit;

  before(async function () {
    // Compile the circuit
    circuit = await wasm("atleastoneonebinary.circom");
  });

  // Passing test cases (at least one input is 1)
  it("should pass when all inputs are 1", async function () {
    const input = {
      x: [1, 1, 1],
    };
    const witness = await circuit.calculateWitness(input);

    // Check output is 1 (true)
    assert.strictEqual(witness[1], BigInt(1));

    // Check constraints
    await circuit.checkConstraints(witness);
  });

  it("should pass when first input is 1", async function () {
    const input = {
      x: [1, 0, 0],
    };
    const witness = await circuit.calculateWitness(input);

    // Check output is 1 (true)
    assert.strictEqual(witness[1], BigInt(1));

    // Check constraints
    await circuit.checkConstraints(witness);
  });

  it("should pass when middle input is 1", async function () {
    const input = {
      x: [0, 1, 0],
    };
    const witness = await circuit.calculateWitness(input);

    // Check output is 1 (true)
    assert.strictEqual(witness[1], BigInt(1));

    // Check constraints
    await circuit.checkConstraints(witness);
  });

  it("should pass when last input is 1", async function () {
    const input = {
      x: [0, 0, 1],
    };
    const witness = await circuit.calculateWitness(input);

    // Check output is 1 (true)
    assert.strictEqual(witness[1], BigInt(1));

    // Check constraints
    await circuit.checkConstraints(witness);
  });

  it("should pass when some inputs are 1", async function () {
    const input = {
      x: [1, 0, 1],
    };
    const witness = await circuit.calculateWitness(input);

    // Check output is 1 (true)
    assert.strictEqual(witness[1], BigInt(1));

    // Check constraints
    await circuit.checkConstraints(witness);
  });

  // Test case for all zeros - this should fail due to the constraint on line 21
  it("should fail when all inputs are 0", async function () {
    const input = {
      x: [0, 0, 0],
    };

    try {
      const witness = await circuit.calculateWitness(input);
      await circuit.checkConstraints(witness);
      assert.fail("Expected circuit to fail for all-zero inputs");
    } catch (error) {
      assert(error !== undefined, "Expected an error but none was thrown");
    }
  });

  // Test invalid binary inputs
  it("should reject non-binary inputs", async function () {
    const input = {
      x: [2, 0, 0],
    };

    try {
      const witness = await circuit.calculateWitness(input);
      await circuit.checkConstraints(witness);
      assert.fail("Expected circuit to fail for non-binary inputs");
    } catch (error) {
      assert(error !== undefined, "Expected an error but none was thrown");
    }
  });

  it("should reject negative inputs", async function () {
    const input = {
      x: [0, -1, 0],
    };

    try {
      const witness = await circuit.calculateWitness(input);
      await circuit.checkConstraints(witness);
      assert.fail("Expected circuit to fail for negative inputs");
    } catch (error) {
      assert(error !== undefined, "Expected an error but none was thrown");
    }
  });

  it("should reject fractional inputs", async function () {
    const input = {
      x: [0, 0.5, 0],
    };

    try {
      const witness = await circuit.calculateWitness(input);
      await circuit.checkConstraints(witness);
      assert.fail("Expected circuit to fail for fractional inputs");
    } catch (error) {
      assert(error !== undefined, "Expected an error but none was thrown");
    }
  });
});
