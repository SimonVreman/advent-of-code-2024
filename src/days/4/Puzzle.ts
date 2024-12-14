enum Direction {
  North,
  NorthEast,
  East,
  SouthEast,
  South,
  SouthWest,
  West,
  NorthWest,
}

const directionNorth = [
  Direction.NorthWest,
  Direction.North,
  Direction.NorthEast,
];
const directionEast = [
  Direction.NorthEast,
  Direction.East,
  Direction.SouthEast,
];
const directionSouth = [
  Direction.SouthEast,
  Direction.South,
  Direction.SouthWest,
];
const directionWest = [
  Direction.NorthWest,
  Direction.West,
  Direction.SouthWest,
];

const order = ['X', 'M', 'A', 'S'];

const hasSequence = ({
  start,
  direction,
  sequence: [sequenceStart, ...sequenceRest],
  matrix,
}: {
  start: { x: number; y: number };
  direction: Direction;
  sequence: string[];
  matrix: string[][];
}): boolean => {
  if (matrix[start.x][start.y] !== sequenceStart) return false;
  if (sequenceRest.length === 0) return true;

  const nextPosition = { ...start };

  if (directionNorth.includes(direction)) nextPosition.y--;
  if (directionEast.includes(direction)) nextPosition.x++;
  if (directionSouth.includes(direction)) nextPosition.y++;
  if (directionWest.includes(direction)) nextPosition.x--;

  if (
    nextPosition.x < 0 ||
    nextPosition.x >= matrix.length ||
    nextPosition.y < 0 ||
    nextPosition.y >= matrix[0].length
  )
    return false;

  return hasSequence({
    start: nextPosition,
    direction,
    sequence: sequenceRest,
    matrix,
  });
};

const getSequenceCount = ({
  start,
  matrix,
}: {
  start: { x: number; y: number };
  matrix: string[][];
}): number =>
  Object.values(Direction)
    .map((direction) =>
      hasSequence({
        start,
        direction: direction as Direction,
        sequence: order,
        matrix,
      })
    )
    .filter((v) => v).length;

const first = (input: string) => {
  const matrix = input.split('\n').map((r) => r.split(''));
  let count = 0;

  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      if (matrix[x][y] !== order[0]) continue;

      count += getSequenceCount({
        start: { x, y },
        matrix,
      });
    }
  }

  return count;
};

const expectedFirstSolution = 18;

const center = 'A';
const firstChar = 'M';
const secondChar = 'S';

const second = (input: string) => {
  const matrix = input.split('\n').map((r) => r.split(''));
  let count = 0;

  for (let x = 1; x < matrix.length - 1; x++) {
    for (let y = 1; y < matrix[x].length - 1; y++) {
      if (matrix[x][y] !== center) continue;

      if (
        ((matrix[x - 1][y - 1] === firstChar &&
          matrix[x + 1][y + 1] === secondChar) ||
          (matrix[x - 1][y - 1] === secondChar &&
            matrix[x + 1][y + 1] === firstChar)) &&
        ((matrix[x - 1][y + 1] === firstChar &&
          matrix[x + 1][y - 1] === secondChar) ||
          (matrix[x - 1][y + 1] === secondChar &&
            matrix[x + 1][y - 1] === firstChar))
      )
        count++;
    }
  }

  return count;
};

const expectedSecondSolution = 9;

export { first, expectedFirstSolution, second, expectedSecondSolution };
