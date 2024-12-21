enum GridValue {
  Empty = '.',
  Wall = '#',
  Start = 'S',
  End = 'E',
}

type Grid = GridValue[][];
// Maps cheat picos to cost
type Cost = Record<number, number> | null;
type Costs = Cost[][]
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

const adjecent = (vector: Vector, d?: number): Vector[] =>
  [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ].map(([a, b]) => [a * (d ?? 1) + vector[0], b * (d ?? 1) + vector[1]]);

const propegateCosts = (grid: Grid, cheat: number): Costs => {
  const costs: Costs = [...Array(grid.length)].map(() =>
    [...Array(grid[0].length)].map(() => null)
  );
  const end = findGridValue(grid, GridValue.End);

  costs[end[0]][end[1]] = { cost: 0, cheat: 0 };
  adjecent(end).map(a => propegateCostsFromAdjecent(grid, costs, a, cheat));

  return costs;
};

const propegateCostsFromAdjecent = (grid: Grid, costs: Costs, position: Vector, cheat: number) => {
  const value = grid[position[0]]?.[position[1]];
  if (value == null) return;

  const neighbours = adjecent(position);
  const currentCost = costs[position[0]]?.[position[1]];

  // If a wall, take into account cheat picos
  if (value === GridValue.Wall) {
    let foundImprovement = false;
    let improved = {...currentCost};
    for (const neighbour of neighbours) {
      const neighbourCost = costs[neighbour[0]]?.[neighbour[1]];
      if (neighbourCost == null) continue;

      for (const cheat in neighbourCost) {
        const costWithCheat = neighbourCost[+cheat];
        if ()
        const currentCostWith cheat

        foundImprovement = true;
      }
    }

    if (!foundImprovement) return;
    
  adjecent(position).map(a => propegateCostsFromAdjecent(grid, costs, a, cheat));
  }

  // Must be a regular square now
  const newCost = adjecent(position).reduce((acc, a) => {
    const cost = costs[a[0]]?.[a[1]]?.[0];
    if (cost == null) return acc;
    return acc == null || (cost + 1) < acc ? cost + 1 : acc;
  }, null as number | null);

  // Catch no improvement case
  if (newCost === null || newCost >= (currentCost[0] ?? Infinity)) return;

  costs[position[0]][position[1]] = { 0: newCost };
  adjecent(position).map(a => propegateCostsFromAdjecent(grid, costs, a, cheat));
};

const findCheatCount = (grid: Grid, costs: Costs, gain: number) => {
  let count = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      const value = grid[row][column];
      if (value == null || value === GridValue.Wall) continue;
      const cost = costs[row][column];

      // Check delta, if large enough there must be a wall anyways
      for (const [a, b] of adjecent([row, column], 2)) {
        const adjecentCost = costs[a]?.[b];
        if (adjecentCost == null) continue;
        const delta = costs[a][b] - cost - 2;
        if (delta >= gain) count++;
      }
    }
  }

  return count;
};


// Different for test and actual
const minSavings = 20;
// const minSavings = 100;

const first = (input: string) => {
  const grid = parseInput(input);

  const costs = propegateCosts(grid, 2);

  return findCheatCount(grid, costs, minSavings);
};

const expectedFirstSolution = 5;

const second = (input: string) => {
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };
