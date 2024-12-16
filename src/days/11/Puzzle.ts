const parseInput = (input: string) => input.split(' ').map(Number);

const blinkAtStone = (stone: number, iterations: number): number => {
  while (iterations > 0) {
    iterations--;

    if (stone === 0) {
      stone = 1;
      continue;
    }

    const digits = (Math.log10(stone) + 1) | 0;
    if (digits % 2 !== 0) {
      stone = stone * 2024;
      continue;
    }

    const divider = 10 ** (digits / 2);
    const left = (stone / divider) | 0;
    const right = stone % divider | 0;

    return blinkAtStone(left, iterations) + blinkAtStone(right, iterations);
  }

  return 1;
};

const blinkAtSingleStone = (stone: number) => {
  if (stone === 0) return [1];

  const digits = (Math.log10(stone) + 1) | 0;
  if (digits % 2 !== 0) return [stone * 2024];

  const divider = 10 ** (digits / 2);

  return [(stone / divider) | 0, stone % divider | 0];
};

const blinkAtGroupedStones = (stones: number[], iterations: number): number => {
  let stoneMap = new Map<number, number>();
  stones.forEach((s) => stoneMap.set(s, 1));

  for (let i = 0; i < iterations; i++) {
    const newStoneMap = new Map<number, number>();
    for (const [stone, count] of stoneMap.entries()) {
      const [a, b] = blinkAtSingleStone(stone);

      newStoneMap.set(a, (newStoneMap.get(a) ?? 0) + count);
      if (b != null) newStoneMap.set(b, (newStoneMap.get(b) ?? 0) + count);
    }
    stoneMap = newStoneMap;
  }

  let total = 0;
  for (const count of stoneMap.values()) total += count;
  return total;
};

const first = (input: string) =>
  parseInput(input).reduce((acc, stone) => acc + blinkAtStone(stone, 25), 0);

const expectedFirstSolution = 55312;

const second = (input: string) => blinkAtGroupedStones(parseInput(input), 75);

const expectedSecondSolution = 65601038650482;

export { first, expectedFirstSolution, second, expectedSecondSolution };
