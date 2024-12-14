const guard = '^';
const obstacle = '#';
const empty = '.';

enum Spot {
  Guard = guard,
  Obstacle = obstacle,
  Empty = empty,
}

const parseInput = (input: string): Spot[][] =>
  input.split('\n').map((line) => line.split('') as Spot[]);

const guardPosition = (matrix: Spot[][]): [number, number] => {
  let column = -1;
  const row = matrix.findIndex((row) =>
    row.some((cell, cellIndex) => {
      if (cell !== guard) return false;

      column = cellIndex;
      return true;
    })
  );

  return [row, column];
};

const positionInMatrix = (position: [number, number], matrix: Spot[][]) =>
  position[0] >= 0 &&
  position[0] < matrix.length &&
  position[1] >= 0 &&
  position[1] < matrix[0].length;

const applyVelocity = (
  position: [number, number],
  velocity: [number, number]
): [number, number] => [position[0] + velocity[0], position[1] + velocity[1]];

const rotateVelocity = (velocity: [number, number]): [number, number] => [
  velocity[1],
  velocity[0] * -1,
];

const calculatePositionHash = (position: [number, number]) =>
  `${position[0]},${position[1]}`;

const traceGuard = ({
  matrix,
  position: fromPosition,
  velocity: fromVelocity,
}: {
  matrix: Spot[][];
  position: [number, number];
  velocity: [number, number];
}): number => {
  let position: [number, number] = fromPosition;
  let velocity: [number, number] = fromVelocity;

  const fullHistory = new Set<string>();
  const positionHistory = new Set<string>();

  while (positionInMatrix(position, matrix)) {
    let facingPosition: [number, number] = applyVelocity(position, velocity);

    while (
      positionInMatrix(facingPosition, matrix) &&
      matrix[facingPosition[0]][facingPosition[1]] === Spot.Obstacle
    ) {
      velocity = rotateVelocity(velocity);
      facingPosition = applyVelocity(position, velocity);
    }

    position = facingPosition;

    const positionHash = calculatePositionHash(position);
    positionHistory.add(positionHash);

    const hash = `${positionHash}~${velocity[0]},${velocity[1]}`;
    if (fullHistory.has(hash)) return -1; // Loop

    fullHistory.add(hash);
  }

  return positionHistory.size - 1;
};

const first = (input: string) => {
  const matrix = parseInput(input);

  return traceGuard({
    matrix,
    position: guardPosition(matrix),
    velocity: [-1, 0],
  });
};

const expectedFirstSolution = 41;

const second = (input: string) => {
  const matrix = parseInput(input);
  const positionHistory = new Set<string>();

  let options = 0;
  let position: [number, number] = guardPosition(matrix);
  let velocity: [number, number] = [-1, 0];

  while (positionInMatrix(position, matrix)) {
    let nextPosition: [number, number] = applyVelocity(position, velocity);
    let nextVelocity = velocity;

    // Rotate while facing obstacle
    while (
      positionInMatrix(nextPosition, matrix) &&
      matrix[nextPosition[0]][nextPosition[1]] === Spot.Obstacle
    ) {
      nextVelocity = rotateVelocity(velocity);
      nextPosition = applyVelocity(position, nextVelocity);
    }

    // Stop when leaving area
    if (!positionInMatrix(nextPosition, matrix)) break;

    const nextPositionHash = calculatePositionHash(nextPosition);

    // Check if it is possible to create a loop by placing an obstacle in the
    // new position. This should be the case when:
    //  - This position has been reached
    //  - The new position was not visited before
    //  - We can trace to forwards to the previous position
    if (!positionHistory.has(nextPositionHash)) {
      const modifiedMatrix = Object.assign(matrix.slice(), {
        [nextPosition[0]]: Object.assign(matrix[nextPosition[0]].slice(), {
          [nextPosition[1]]: Spot.Obstacle,
        }),
      });

      if (traceGuard({ matrix: modifiedMatrix, position, velocity }) === -1)
        options++;
    }

    // Move
    position = nextPosition;
    velocity = nextVelocity;
    positionHistory.add(nextPositionHash);
  }

  return options;
};

const expectedSecondSolution = 6;

export { first, expectedFirstSolution, second, expectedSecondSolution };
