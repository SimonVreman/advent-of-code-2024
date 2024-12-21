enum GridValue {
  Empty = '.',
  Wall = '#',
  Start = 'S',
  End = 'E',
}

type Grid = GridValue[][];
type Costs = (number | null)[][];
type Vector = [number, number];

const parseInput = (input: string) =>
  input.split('\n').map((row) => row.split('') as GridValue[]);

const findGridValue = (grid: Grid, value: GridValue): Vector | null => {
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      if (grid[row][column] === value) return [row, column];
    }
  }
  return null;
};

const adjecent = (vector: Vector): Vector[] =>
  [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ].map(([a, b]) => [a + vector[0], b + vector[1]]);

const propegateCosts = (grid: Grid): Costs => {
  const costs: (number | null)[][] = [...Array(grid.length)].map(() =>
    [...Array(grid[0].length)].map(() => null)
  );
  const end = findGridValue(grid, GridValue.End);

  costs[end[0]][end[1]] = 0;
  adjecent(end).map((a) => propegateCostsAdjecent(grid, costs, a));

  return costs;
};

const propegateCostsAdjecent = (grid: Grid, costs: Costs, position: Vector) => {
  const value = grid[position[0]]?.[position[1]];
  if (value == null || value === GridValue.Wall) return;

  const neighbours = adjecent(position);
  const currentCost = costs[position[0]]?.[position[1]];

  const newCost = neighbours.reduce(
    (acc, [a, b]) => {
      const neighbourCost = costs[a]?.[b];
      if (neighbourCost == null) return acc;
      return acc == null || neighbourCost + 1 < acc ? neighbourCost + 1 : acc;
    },
    null as number | null
  );

  if (newCost == null || newCost >= (currentCost ?? Infinity)) return;
  costs[position[0]][position[1]] = newCost;

  neighbours.map((a) => propegateCostsAdjecent(grid, costs, a));
};

const findCheatCount = (
  grid: Grid,
  costs: Costs,
  gain: number,
  range: number
) => {
  let count = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      const value = grid[row][column];
      if (value == null || value === GridValue.Wall) continue;

      const cost = costs[row][column];
      count += countImprovementsInRange(
        [row, column],
        costs,
        cost,
        gain,
        range
      );
    }
  }

  return count;
};

const countImprovementsInRange = (
  [row, column]: Vector,
  costs: Costs,
  cost: number,
  gain: number,
  range: number
) => {
  let count = 0;

  for (let dRow = -range; dRow <= range; dRow++) {
    const dRowAbsolute = Math.abs(dRow);
    const leftoverRange = range - dRowAbsolute;

    for (let dColumn = -leftoverRange; dColumn <= leftoverRange; dColumn++) {
      const targetCost = costs[row + dRow]?.[column + dColumn];
      const dColumnAbsolute = Math.abs(dColumn);
      const distance = dRowAbsolute + dColumnAbsolute;

      if (targetCost == null) continue;

      const costWithCheat = targetCost + distance;

      if (cost - costWithCheat >= gain) count++;
    }
  }

  return count;
};

// Different for test and actual
const minSavings = 20;
// const minSavings = 100;

const first = (input: string) => {
  const grid = parseInput(input);

  const costs = propegateCosts(grid);

  return findCheatCount(grid, costs, minSavings, 2);
};

const expectedFirstSolution = 5;

// Different for test and actual
const minSavings2 = 50;
// const minSavings2 = 100;

const second = (input: string) => {
  const grid = parseInput(input);

  const costs = propegateCosts(grid);

  return findCheatCount(grid, costs, minSavings2, 20);
};

const expectedSecondSolution = 285;

export { first, expectedFirstSolution, second, expectedSecondSolution };
