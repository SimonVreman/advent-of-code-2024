type Schematic = [number, number, number, number, number];

const parseInput = (input: string) => {
  const schematics = input.split('\n\n');
  const locks: Schematic[] = [];
  const keys: Schematic[] = [];

  for (const schematic of schematics) {
    const lines = schematic.split('\n');
    const values: [number, number][] = [];

    for (let column = 0; column < lines[0].length; column++) {
      let [min, max] = [lines.length, -1];
      for (let i = 0; i < lines.length; i++) {
        const isMarked = lines[i][column] === '#';

        if (isMarked && i < min) min = i;
        if (isMarked && i > max) max = i;
      }
      values.push([min, max]);
    }

    if (values[0][0] > 0) {
      keys.push(values.map(([min, max]) => max - min) as Schematic);
    } else {
      locks.push(values.map(([, max]) => max) as Schematic);
    }
  }

  return { locks, keys };
};

const keyOverlapsLock = (lock: Schematic, key: Schematic) =>
  lock.some((v, i) => v + key[i] > 5);

const first = (input: string) => {
  const { locks, keys } = parseInput(input);

  let count = 0;
  for (const lock of locks) {
    for (const key of keys) {
      if (!keyOverlapsLock(lock, key)) count++;
    }
  }

  return count;
};

const expectedFirstSolution = 3;

const second = (input: string) => {
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };
