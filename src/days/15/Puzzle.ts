enum GridValue {
  Empty = '.',
  Wall = '#',
  Box = 'O',
  Robot = '@',
  BoxLeft = '[',
  BoxRight = ']',
}

enum Move {
  Up = '^',
  Right = '>',
  Down = 'v',
  Left = '<',
}

type Grid = GridValue[][];
type Vector = [number, number];

const deltas: Record<Move, Vector> = {
  [Move.Up]: [-1, 0],
  [Move.Right]: [0, 1],
  [Move.Down]: [1, 0],
  [Move.Left]: [0, -1],
};

const parseInput = (input: string) => {
  const [mapString, moveString] = input.split('\n\n');

  return {
    grid: mapString.split('\n').map((row) => row.split('') as GridValue[]),
    moves: moveString.split('').filter((v) => v.trim().length > 0) as Move[],
  };
};

const widenGrid = (grid: Grid): Grid =>
  grid.map((row) => {
    const newRow = [];
    for (const cell of row) {
      if ([GridValue.Empty, GridValue.Wall].includes(cell)) {
        newRow.push(cell, cell);
      } else if (cell == GridValue.Robot) {
        newRow.push(cell, GridValue.Empty);
      } else {
        newRow.push(GridValue.BoxLeft, GridValue.BoxRight);
      }
    }
    return newRow;
  });

const vectorAddition = (a: Vector, b: Vector): Vector => [
  a[0] + b[0],
  a[1] + b[1],
];

const findRobot = (grid: Grid): Vector => {
  let column = -1;
  const row = grid.findIndex((row) =>
    row.some((cell, cellIndex) => {
      if (cell !== GridValue.Robot) return false;

      column = cellIndex;
      return true;
    })
  );

  return [row, column];
};

const gridValue = (grid: Grid, vector: Vector) => grid[vector[0]][vector[1]];

// const printGrid = (grid: Grid) =>
//   grid.forEach((row) => console.log(row.join('')));

const executeMoves = (grid: Grid, moves: Move[]) => {
  let robot = findRobot(grid);

  for (const move of moves) {
    const delta = deltas[move];
    const facing = vectorAddition(robot, delta);
    const facingValue = gridValue(grid, facing);

    if (facingValue === GridValue.Empty) {
      grid[robot[0]][robot[1]] = GridValue.Empty;
      robot = vectorAddition(robot, delta);
      grid[robot[0]][robot[1]] = GridValue.Robot;
      continue;
    } else if (facingValue === GridValue.Wall) {
      continue;
    }

    let behind = vectorAddition(facing, delta);
    let behindValue = gridValue(grid, behind);

    while (behindValue === GridValue.Box) {
      behind = vectorAddition(behind, delta);
      behindValue = gridValue(grid, behind);
    }

    if (behindValue !== GridValue.Empty) continue;

    grid[robot[0]][robot[1]] = GridValue.Empty;
    robot = vectorAddition(robot, delta);
    grid[robot[0]][robot[1]] = GridValue.Robot;
    grid[behind[0]][behind[1]] = GridValue.Box;
  }

  return grid;
};

const boxesToMove = (
  grid: Grid,
  side: Vector,
  delta: Vector
): Vector[] | null => {
  const sideValue = gridValue(grid, side);
  if (sideValue === GridValue.BoxRight)
    return boxesToMove(grid, [side[0], side[1] - 1], delta);
  if (sideValue !== GridValue.BoxLeft) return null;

  const pushingLeftVector = vectorAddition(side, delta);
  const pushingRightVector = vectorAddition(side, [delta[0], 1]);
  const pushingLeft = gridValue(grid, pushingLeftVector);
  const pushingRight = gridValue(grid, pushingRightVector);

  if (pushingLeft === GridValue.Wall || pushingRight === GridValue.Wall)
    return null;

  if (pushingLeft === GridValue.BoxLeft) {
    const pushing = boxesToMove(grid, pushingLeftVector, delta);
    return pushing === null ? null : [side, ...pushing];
  }

  const resultLeft =
    pushingLeft === GridValue.BoxRight
      ? boxesToMove(grid, pushingLeftVector, delta)
      : [];

  if (resultLeft === null) return null;

  const resultRight =
    pushingRight === GridValue.BoxLeft
      ? boxesToMove(grid, pushingRightVector, delta)
      : [];

  if (resultRight === null) return null;

  return [side, ...resultLeft, ...resultRight];
};

const executeMovesWide = (grid: Grid, moves: Move[]) => {
  let robot = findRobot(grid);

  // printGrid(grid);
  // let i = 0;
  for (const move of moves) {
    const delta = deltas[move];
    const facing = vectorAddition(robot, delta);
    const facingValue = gridValue(grid, facing);

    // i++;
    // if (i > 2570) {
    //   console.log(move, i);
    //   process.stdout.moveCursor(0, -(grid.length + 1));
    //   printGrid(grid);
    //   await new Promise((r) => setTimeout(r, 500));
    // }

    // Push is blocked
    if (facingValue === GridValue.Wall) continue;

    if (facingValue !== GridValue.Empty && delta[0] === 0) {
      // Horizontal push
      let behind = vectorAddition(facing, delta);
      let behindValue = gridValue(grid, behind);

      while ([GridValue.BoxLeft, GridValue.BoxRight].includes(behindValue)) {
        behind = vectorAddition(behind, delta);
        behindValue = gridValue(grid, behind);
      }

      // Push is blocked
      if (behindValue !== GridValue.Empty) continue;

      while (behind[1] !== robot[1]) {
        const newBehind: Vector = [behind[0], behind[1] - delta[1]];
        grid[behind[0]][behind[1]] = grid[newBehind[0]][newBehind[1]];
        behind = newBehind;
      }
    } else if (facingValue !== GridValue.Empty) {
      // Vertical push
      const boxes = boxesToMove(grid, facing, delta)?.filter(
        (box1, index1, boxes) =>
          !boxes.some(
            (box2, index2) =>
              box1[0] === box2[0] && box1[1] === box2[1] && index2 > index1
          )
      );

      // Push is blocked
      if (boxes == null) continue;

      let left = null;
      while ((left = boxes.pop()) != null) {
        const right = vectorAddition(left, [0, 1]);
        const facingLeft = vectorAddition(left, delta);
        const facingRight = vectorAddition(right, delta);

        grid[facingLeft[0]][facingLeft[1]] = GridValue.BoxLeft;
        grid[facingRight[0]][facingRight[1]] = GridValue.BoxRight;
        grid[left[0]][left[1]] = GridValue.Empty;
        grid[right[0]][right[1]] = GridValue.Empty;
      }
    }

    // Move robot
    grid[robot[0]][robot[1]] = GridValue.Empty;
    robot = vectorAddition(robot, delta);
    grid[robot[0]][robot[1]] = GridValue.Robot;
  }

  return grid;
};

const sumGpsCoordinates = (grid: Grid) =>
  grid.reduce(
    (acc, row, rowIndex) =>
      acc +
      row.reduce(
        (accRow, cell, columnIndex) =>
          cell === GridValue.Box || cell === GridValue.BoxLeft
            ? accRow + 100 * rowIndex + columnIndex
            : accRow,
        0
      ),

    0
  );

const first = (input: string) => {
  const { grid, moves } = parseInput(input);

  const executed = executeMoves(grid, moves);

  return sumGpsCoordinates(executed);
};

const expectedFirstSolution = 10092;

const second = (input: string) => {
  const { grid: smallGrid, moves } = parseInput(input);

  const grid = widenGrid(smallGrid);

  const executed = executeMovesWide(grid, moves);

  return sumGpsCoordinates(executed);
};

const expectedSecondSolution = 9021;

export { first, expectedFirstSolution, second, expectedSecondSolution };
