const parseInput = (input: string): (number | null)[] =>
  input
    .split('')
    .flatMap((block, i) => Array(+block).fill(i % 2 === 0 ? i / 2 : null));

const calculateChecksum = (disk: (number | null)[]) =>
  disk.reduce((acc, id, index) => acc + (id ?? 0) * index, 0);

const first = (input: string) => {
  const disk = parseInput(input);

  for (let index = disk.length - 1; index > 0; index--) {
    if (disk[index] === null) continue;

    const freeIndex = disk.findIndex((v) => v === null);

    if (freeIndex > index) break;

    disk[freeIndex] = disk[index];
    disk[index] = null;
  }

  return calculateChecksum(disk);
};

const expectedFirstSolution = 1928;

const findValueStretch = ({
  disk,
  value,
  size = null,
}: {
  disk: (number | null)[];
  value: number | null;
  size: number | null;
}) => {
  let start = 0;
  let end = 0;

  for (start = 0; start < disk.length; start++) {
    if (disk[start] !== value) continue;
    if (disk[start - 1] === value) continue;

    end = start;

    while (
      end < disk.length &&
      disk[end] === value &&
      (size === null || end - start < size)
    )
      end++;

    if (size === null || end - start === size) break;

    start = end;
  }

  if (start === disk.length) end = disk.length;

  return { start, end, size: end - start };
};

const second = (input: string) => {
  const disk = parseInput(input);

  for (let index = disk.length - 1; index > 0; index--) {
    const id = disk[index];
    if (id === null) continue;
    if (disk[index - 1] === id) continue;

    const valueStretch = findValueStretch({ disk, value: id, size: null });
    const emptyStretch = findValueStretch({
      disk,
      value: null,
      size: valueStretch.size,
    });

    if (
      emptyStretch.size < valueStretch.size ||
      emptyStretch.start > valueStretch.start
    )
      continue;

    for (let copyIndex = 0; copyIndex < valueStretch.size; copyIndex++) {
      disk[emptyStretch.start + copyIndex] =
        disk[valueStretch.start + copyIndex];
      disk[valueStretch.start + copyIndex] = null;
    }
  }

  return calculateChecksum(disk);
};

const expectedSecondSolution = 2858;

export { first, expectedFirstSolution, second, expectedSecondSolution };
