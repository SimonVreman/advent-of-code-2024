enum GridValue {
  Empty = '.',
  Wall = '#',
  Start = 'S',
  End = 'E',
}

type Grid = GridValue[][];
type Vector = [number, number];
type Cost = {
  north?: number;
  east?: number;
  south?: number;
  west?: number;
};

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

const vectorToCostKey = (vector: Vector): keyof Cost =>
  vector[0] > 0
    ? 'south'
    : vector[0] < 0
      ? 'north'
      : vector[1] > 0
        ? 'east'
        : 'west';

const adjecent = (vector: Vector): Vector[] =>
  [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ].map(([a, b]) => [a + vector[0], b + vector[1]]);

const adjecentEmpty = (grid: Grid, vector: Vector): Vector[] =>
  adjecent(vector).filter(([a, b]) =>
    [GridValue.Empty, GridValue.Start, GridValue.End].includes(grid[a][b])
  ) as Vector[];

const markCostsToGrid = (
  grid: Grid,
  costs: Cost[][],
  start: Vector,
  end: Vector
) => {
  const deltaRow = end[0] - start[0];
  const deltaColumn = end[1] - start[1];

  const targetCosts = costs[end[0]][end[1]];
  let newCosts: Cost;
  if (deltaColumn === 0) {
    const costFromTarget =
      deltaRow === 1 ? targetCosts.south : targetCosts.north;

    newCosts = {
      east: costFromTarget + 1001,
      west: costFromTarget + 1001,
      south: costFromTarget + (deltaRow === 1 ? 1 : 2001),
      north: costFromTarget + (deltaRow === 1 ? 2001 : 1),
    };
  } else {
    const costFromTarget =
      deltaColumn === 1 ? targetCosts.east : targetCosts.west;

    newCosts = {
      north: costFromTarget + 1001,
      south: costFromTarget + 1001,
      east: costFromTarget + (deltaColumn === 1 ? 1 : 2001),
      west: costFromTarget + (deltaColumn === 1 ? 2001 : 1),
    };
  }

  const oldCosts = costs[start[0]][start[1]];
  let foundImprovement = false;

  for (const key in newCosts) {
    const direction = key as keyof Cost;
    if (
      oldCosts[direction] != null &&
      oldCosts[direction] <= newCosts[direction]
    )
      continue;

    foundImprovement = true;
    oldCosts[direction] = newCosts[direction];
  }

  if (foundImprovement)
    adjecentEmpty(grid, start).forEach((adjecent) =>
      markCostsToGrid(grid, costs, adjecent, start)
    );
};

const mapPropegatedCosts = (grid: Grid): Cost[][] => {
  const costs: Cost[][] = [...Array(grid.length)].map(() =>
    [...Array(grid[0].length)].map(() => ({}))
  );

  const end = findGridValue(grid, GridValue.End);
  costs[end[0]][end[1]] = { north: 0, east: 0, south: 0, west: 0 };

  adjecentEmpty(grid, end).forEach((adjecent) =>
    markCostsToGrid(grid, costs, adjecent, end)
  );

  return costs;
};

const optimalMovesForPosition = (
  costs: Cost[][],
  position: Vector,
  direction: keyof Cost,
  limit: number
): { position: Vector; cost: number; direction: keyof Cost }[] => {
  const options = adjecent(position).map((a) => {
    const key = vectorToCostKey([a[0] - position[0], a[1] - position[1]]);

    const cost = costs[a[0]]?.[a[1]]?.[key] ?? null;
    if (cost === null) return { position: a, cost, direction: key };

    return {
      position: a,
      cost: cost + (direction !== key ? 1000 : 0),
      direction: key,
    };
  });

  return options.filter(
    (a) =>
      a.cost !== null &&
      a.cost < limit &&
      !options.some((b) => (b.cost ?? Infinity) < a.cost)
  );
};

const markOptimalPositions = (
  costs: Cost[][],
  optimal: boolean[][],
  start: Vector,
  direction: keyof Cost,
  limit: number
) => {
  optimal[start[0]][start[1]] = true;

  optimalMovesForPosition(costs, start, direction, limit).forEach(
    ({ position, cost, direction }) =>
      markOptimalPositions(costs, optimal, position, direction, cost)
  );
};

const first = (input: string) => {
  const grid = parseInput(input);

  const costs = mapPropegatedCosts(grid);
  const start = findGridValue(grid, GridValue.Start);

  return costs[start[0]][start[1]].east!;
};

const expectedFirstSolution = 11048;

const second = (input: string) => {
  const grid = parseInput(input);

  const costs = mapPropegatedCosts(grid);
  const start = findGridValue(grid, GridValue.Start);

  const optimal: boolean[][] = [...Array(grid.length)].map(
    () => Array.from({ length: grid[0].length }).fill(false) as boolean[]
  );

  markOptimalPositions(
    costs,
    optimal,
    start,
    'east',
    costs[start[0]][start[1]].east!
  );

  // printOptimal(optimal);

  return optimal
    .flatMap((row) => row)
    .reduce((acc, v) => (v ? acc + 1 : acc), 0);
};

// const printOptimal = (grid: boolean[][]) =>
//   grid.forEach((row) => console.log(row.map((v) => (v ? 'x' : '.')).join('')));

const expectedSecondSolution = 64;

export { first, expectedFirstSolution, second, expectedSecondSolution };
