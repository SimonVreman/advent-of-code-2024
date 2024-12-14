const trailhead = 0;
const trailend = 9;

type Position = [number, number];

const parseInput = (input: string): number[][] =>
  input.split('\n').map((line) => line.split('').map(Number));

const positionInMatrix = (position: Position, matrix: number[][]) =>
  position[0] >= 0 &&
  position[0] < matrix.length &&
  position[1] >= 0 &&
  position[1] < matrix[0].length;

const positionsOfType = (matrix: number[][], type: number): Position[] =>
  matrix.reduce(
    (acc, row, rowIndex) => [
      ...acc,
      ...row.reduce(
        (rowAcc, cell, columnIndex) =>
          cell === type ? [...rowAcc, [rowIndex, columnIndex]] : rowAcc,
        []
      ),
    ],
    []
  );

const adjecentPositions = (position: Position): Position[] =>
  [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ].map(([a, b]) => [a + position[0], b + position[1]]);

const calculatePositionHash = (position: Position) =>
  `${position[0]},${position[1]}`;

const trailEndsFromPosition = (
  matrix: number[][],
  position: Position,
  reached: string[]
): string[] => {
  if (matrix[position[0]][position[1]] === trailend)
    return [...reached, calculatePositionHash(position)];

  const filtered = adjecentPositions(position).filter(
    (adjecent) =>
      positionInMatrix(adjecent, matrix) &&
      matrix[position[0]][position[1]] + 1 === matrix[adjecent[0]][adjecent[1]]
  );

  return filtered.reduce(
    (acc, p) => trailEndsFromPosition(matrix, p, acc),
    reached
  );
};

const first = (input: string) => {
  const matrix = parseInput(input);
  const trailheads = positionsOfType(matrix, trailhead);

  return trailheads.reduce(
    (acc, trailhead) =>
      acc + new Set(trailEndsFromPosition(matrix, trailhead, [])).size,
    0
  );
};

const expectedFirstSolution = 36;

const second = (input: string) => {
  const matrix = parseInput(input);
  const trailheads = positionsOfType(matrix, trailhead);

  return trailheads.reduce(
    (acc, trailhead) =>
      acc + trailEndsFromPosition(matrix, trailhead, []).length,
    0
  );
};

const expectedSecondSolution = 81;

export { first, expectedFirstSolution, second, expectedSecondSolution };
