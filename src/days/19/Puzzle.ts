enum Stripe {
  White = 0,
  Blue = 1,
  Black = 2,
  Red = 3,
  Green = 4,
}

type StripeCharacter = 'w' | 'u' | 'b' | 'r' | 'r';

const stripeMap = {
  w: Stripe.White,
  u: Stripe.Blue,
  b: Stripe.Black,
  r: Stripe.Red,
  g: Stripe.Green,
};

const parseInput = (input: string) => {
  const [towels, designs] = input.split('\n\n');

  const patternToArray = (p: string) =>
    p.split('').map((v) => stripeMap[v as StripeCharacter]);

  return {
    numeric: {
      towels: towels.split(', ').map(patternToArray),
      designs: designs.split('\n').map(patternToArray),
    },
    string: {
      towels: towels.split(', '),
      designs: designs.split('\n'),
    },
  };
};

const designSliceEqualsTowel = (
  design: Stripe[],
  towel: Stripe[],
  offset: number
) =>
  offset + towel.length <= design.length &&
  towel.every((stripe, index) => design[index + offset] === stripe);

const arrangementCountForDesign = (
  design: Stripe[],
  towels: Stripe[][]
): number => {
  // Concept stolen from day 11, maps offset to count
  let arrangements = new Map<number, number>([[0, 1]]);
  let arrangementCount = 0;

  while (arrangements.size > 0) {
    const newArrangements = new Map<number, number>();

    for (const [offset, count] of arrangements.entries()) {
      for (const towel of towels) {
        if (!designSliceEqualsTowel(design, towel, offset)) continue;

        const newOffset = offset + towel.length;

        if (newOffset === design.length) {
          arrangementCount += count;
        } else {
          newArrangements.set(
            newOffset,
            (newArrangements.get(newOffset) ?? 0) + count
          );
        }
      }
    }

    arrangements = newArrangements;
  }

  return arrangementCount;
};

const first = (input: string) => {
  const {
    // string: { towels, designs },
    numeric: { towels, designs },
  } = parseInput(input);

  // This regex approach is pretty slow, took like 40s but I want to keep it.
  // const regex = RegExp(`^(?:${towels.join('|')})+$`);
  // return designs.reduce((acc, d) => regex.test(d) ? acc + 1 : acc, 0);

  // Here follows the code for the second star, way faster
  let count = 0;
  for (let i = 0; i < designs.length; i++)
    if (arrangementCountForDesign(designs[i], towels) > 0) count++;

  return count;
};

const expectedFirstSolution = 6;

const second = (input: string) => {
  const {
    numeric: { towels, designs },
  } = parseInput(input);

  let count = 0;
  for (let i = 0; i < designs.length; i++)
    count += arrangementCountForDesign(designs[i], towels);

  return count;
};

const expectedSecondSolution = 16;

export { first, expectedFirstSolution, second, expectedSecondSolution };
