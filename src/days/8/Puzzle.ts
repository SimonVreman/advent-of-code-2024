type Position = [number, number];

const empty = '.';

const parseInput = (input: string): string[][] =>
  input.split('\n').map((line) => line.split(''));

const findAntennas = (matrix: string[][]) => {
  const antennas: Record<string, Position[]> = {};
  matrix.forEach((row, rowIndex) =>
    row.forEach(
      (cell, columnIndex) =>
        cell !== empty &&
        (antennas[cell] = [...(antennas[cell] ?? []), [rowIndex, columnIndex]])
    )
  );

  return antennas;
};

const positionInMatrix = (position: Position, matrix: string[][]) =>
  position[0] >= 0 &&
  position[0] < matrix.length &&
  position[1] >= 0 &&
  position[1] < matrix[0].length;

const antinodesForPair = (a: Position, b: Position, matrix: string[][]) => {
  const dRow = a[0] - b[0];
  const dColumn = a[1] - b[1];

  return [
    [a[0] + dRow, a[1] + dColumn] as Position,
    [b[0] - dRow, b[1] - dColumn] as Position,
  ].filter((p) => positionInMatrix(p, matrix));
};

const antinodesRepeatingForPair = (
  a: Position,
  b: Position,
  matrix: string[][]
) => {
  const dRow = a[0] - b[0];
  const dColumn = a[1] - b[1];

  const rowRepeats = Math.ceil(matrix.length / Math.abs(dRow)) * 1;
  const columnRepeats = Math.ceil(matrix[0].length / Math.abs(dColumn)) * 1;

  return [
    ...[...Array(rowRepeats)].map(
      (_, i) => [a[0] + i * dRow, a[1] + i * dColumn] as Position
    ),
    ...[...Array(columnRepeats)].map(
      (_, i) => [b[0] - i * dRow, b[1] - i * dColumn] as Position
    ),
  ].filter((p) => positionInMatrix(p, matrix));
};

const calculatePositionHash = (position: [number, number]) =>
  `${position[0]},${position[1]}`;

const first = (input: string) => {
  const matrix = parseInput(input);
  const antennas = findAntennas(matrix);
  const positions = new Set<string>();

  for (const antennaType in antennas) {
    for (let a = 0; a < antennas[antennaType].length - 1; a++) {
      for (let b = a + 1; b < antennas[antennaType].length; b++) {
        antinodesForPair(
          antennas[antennaType][a],
          antennas[antennaType][b],
          matrix
        ).forEach((p) => positions.add(calculatePositionHash(p)));
      }
    }
  }

  return positions.size;
};

const expectedFirstSolution = 14;

const second = (input: string) => {
  const matrix = parseInput(input);
  const antennas = findAntennas(matrix);
  const positions = new Set<string>();

  for (const antennaType in antennas) {
    for (let a = 0; a < antennas[antennaType].length - 1; a++) {
      for (let b = a + 1; b < antennas[antennaType].length; b++) {
        antinodesRepeatingForPair(
          antennas[antennaType][a],
          antennas[antennaType][b],
          matrix
        ).forEach((p) => positions.add(calculatePositionHash(p)));
      }
    }
  }

  return positions.size;
};

const expectedSecondSolution = 34;

export { first, expectedFirstSolution, second, expectedSecondSolution };
