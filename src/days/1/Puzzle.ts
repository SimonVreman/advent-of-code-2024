const lists = (input: string): { left: number[]; right: number[] } =>
  input.split('\n').reduce(
    (acc, line) => ({
      left: [...acc.left, +line.substring(0, 5)],
      right: [...acc.right, +line.substring(8, 13)],
    }),
    { left: [] as number[], right: [] as number[] }
  );

const first = (input: string) => {
  const { left, right } = lists(input);

  left.sort();
  right.sort();

  let total = 0;
  for (let i = 0; i < left.length; i++) {
    total += Math.abs(left[i] - right[i]);
  }
  return total;
};

const expectedFirstSolution = 0;

const second = (input: string) => {
  const { left, right } = lists(input);

  const counts = right.reduce(
    (acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    },
    {} as { [key: number]: number }
  );

  return left.reduce((acc, value) => (acc += value * (counts[value] ?? 0)), 0);
};

const expectedSecondSolution = 0;

export { first, expectedFirstSolution, second, expectedSecondSolution };
