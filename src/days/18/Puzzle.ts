enum GridValue {
  Empty = 0,
  Corrupted = 1,
}

type Grid = GridValue[][];
type Costs = (number | null)[][];
type Vector = [number, number];

const parseInput = (input: string) =>
  input.split('\n').map((l) => l.split(',').map(Number).reverse() as Vector);

const newGrid = <T>([rows, columns]: Vector, value: T): T[][] =>
  [...Array(rows)].map(() => Array(columns).fill(value));

const simulateBytes = (bytes: Vector[], grid: Grid) =>
  bytes.forEach(([row, column]) => (grid[row][column] = GridValue.Corrupted));

const adjecent = (vector: Vector): Vector[] =>
  [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ].map(([a, b]) => [a + vector[0], b + vector[1]]);

const costsForGrid = (grid: Grid) => {
  const end: Vector = [grid.length - 1, grid[0].length - 1];
  const costs = newGrid<number | null>([grid.length, grid[0].length], null);

  costs[end[0]][end[1]] = 0;
  adjecent(end).forEach((a) => markCostForPosition(grid, costs, a));

  return costs;
};

const markCostForPosition = (grid: Grid, costs: Costs, position: Vector) => {
  if (grid[position[0]]?.[position[1]] !== GridValue.Empty) return;

  const currentCost = costs[position[0]][position[1]];
  const adjecentPositions = adjecent(position);

  const cheapestAdjecent = adjecentPositions.reduce(
    (acc, [row, column]) => {
      const cost = costs[row]?.[column];
      if (cost == null) return acc;

      return acc == null || cost < acc ? costs[row]?.[column] : acc;
    },
    null as number | null
  );

  if (
    cheapestAdjecent === null ||
    cheapestAdjecent + 1 >= (currentCost ?? Infinity)
  )
    return;

  // Improvement found
  costs[position[0]][position[1]] = cheapestAdjecent + 1;
  adjecentPositions.forEach((a) => markCostForPosition(grid, costs, a));
};

// const printGrid = (grid: (number | null)[][]) =>
//   console.log(grid.map((l) => l.map((v) => (v ? 'X' : '.')).join()).join('\n'));

// Different for test and actual data
const gridSize: Vector = [7, 7];
// const gridSize: Vector = [71, 71];

const first = (input: string) => {
  const bytes = parseInput(input).slice(0, 1024);
  const grid = newGrid(gridSize, GridValue.Empty);

  simulateBytes(bytes, grid);

  const costs = costsForGrid(grid);

  return costs[0][0];
};

const expectedFirstSolution = 22;

const second = (input: string) => {
  const bytes = parseInput(input);

  let min = 0;
  let max = bytes.length;

  while (max - min !== 1) {
    const middle = min + Math.round((max - min) / 2);
    const grid = newGrid(gridSize, GridValue.Empty);

    simulateBytes(bytes.slice(0, middle), grid);
    const reachable = costsForGrid(grid)[0][0] !== null;

    reachable ? (min = middle) : (max = middle);
  }

  return bytes[min].reverse().join(',');
};

const expectedSecondSolution = '6,1';

export { first, expectedFirstSolution, second, expectedSecondSolution };
