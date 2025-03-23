const { wasm } = require("circom_tester");
const assert = require("assert");

describe("BiPartiteTwoColourGraph Circuit", function () {
  let circuit;

  before(async function () {
    // Compile the circuit
    circuit = await wasm("bipartitetwocolourgraph.circom");
  });

  // Test cases from our JSON
  const testCases = [
    {
      name: "Simple Valid Case - Line Graph",
      message: "A simple line of 4 nodes (0-1-2-3) which is bipartite",
      adjacencyMatrix: [
        [0, 1, 0, 0],
        [1, 0, 1, 0],
        [0, 1, 0, 1],
        [0, 0, 1, 0],
      ],
      colors: [0, 1, 0, 1],
      isValid: true,
    },
    {
      name: "Simple Valid Case - Star Graph",
      message: "A star graph with node 0 connected to all others",
      adjacencyMatrix: [
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
      ],
      colors: [0, 1, 1, 1],
      isValid: true,
    },
    {
      name: "Complete Bipartite Graph K(2,2)",
      message: "A complete bipartite graph with two nodes on each side",
      adjacencyMatrix: [
        [0, 0, 1, 1],
        [0, 0, 1, 1],
        [1, 1, 0, 0],
        [1, 1, 0, 0],
      ],
      colors: [0, 0, 1, 1],
      isValid: true,
    },
    {
      name: "Disconnected Graph",
      message: "Two separate components, each bipartite",
      adjacencyMatrix: [
        [0, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 1],
        [0, 0, 1, 0],
      ],
      colors: [0, 1, 0, 1],
      isValid: true,
    },
    {
      name: "Empty Graph",
      message: "A graph with no edges",
      adjacencyMatrix: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      colors: [0, 0, 0, 0],
      isValid: true,
    },
    {
      name: "Invalid Case - Triangle",
      message: "A triangle is not bipartite",
      adjacencyMatrix: [
        [0, 1, 1, 0],
        [1, 0, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      colors: [0, 1, 0, 0],
      isValid: false,
    },
    {
      name: "Invalid Case - Square with Diagonal",
      message: "A square with one diagonal, creating an odd cycle",
      adjacencyMatrix: [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
      ],
      colors: [0, 1, 1, 0],
      isValid: false,
    },
    {
      name: "Invalid Coloring of Bipartite Graph",
      message: "The graph is bipartite but the coloring is invalid",
      adjacencyMatrix: [
        [0, 1, 0, 0],
        [1, 0, 1, 0],
        [0, 1, 0, 1],
        [0, 0, 1, 0],
      ],
      colors: [0, 0, 1, 0],
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
            adjacencyMatrix: testCase.adjacencyMatrix,
            colors: testCase.colors,
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
