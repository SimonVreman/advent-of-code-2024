type Vector = { x: number; y: number };
type PrizePuzzle = { a: Vector; b: Vector; prize: Vector };

const parseInput = (input: string): PrizePuzzle[] =>
  input.split('\n\n').map((section) => {
    const [lineA, lineB, linePrize] = section
      .split('\n')
      .map((line) => line.split(': ')[1].split(', '));

    const [a, b] = [lineA, lineB].map((v) => {
      const [x, y] = v.map((d) => +d.split('+')[1]);
      return { x, y };
    });

    const [prizeX, prizeY] = linePrize.map((d) => +d.split('=')[1]);

    return { a, b, prize: { x: prizeX, y: prizeY } };
  });

const bestPossibleCostIterative = (
  { a, b, prize }: PrizePuzzle,
  maxButtonPresses: number
): number | null => {
  let lowestCost: number | null = null;

  for (let aPresses = 0; aPresses < maxButtonPresses; aPresses++) {
    const residualX = prize.x - aPresses * a.x;
    if (residualX % b.x !== 0) continue;

    const residualY = prize.y - aPresses * a.y;
    if (residualY % b.y !== 0) continue;

    const bPresses = residualX / b.x;
    if (residualY / bPresses !== b.y) continue;

    const cost = aPresses * 3 + bPresses;
    if (cost < (lowestCost ?? Infinity)) lowestCost = cost;
  }

  return lowestCost;
};

const bestPossibleCostGeometric = ({
  a,
  b,
  prize: prizeRaw,
}: PrizePuzzle): number | null => {
  const prize = { x: 1, y: prizeRaw.y / prizeRaw.x };

  const magnitudeA = Math.sqrt(a.x ** 2 + a.y ** 2);
  const magnitudeB = Math.sqrt(b.x ** 2 + b.y ** 2);
  const magnitudePrize = Math.sqrt(prize.x ** 2 + prize.y ** 2);

  const dotAlpha = a.x * b.x + a.y * b.y;
  const dotBeta = a.x * prize.x + a.y * prize.y;
  const dotGamma = b.x * prize.x + b.y * prize.y;

  const angleAlpha = Math.acos(dotAlpha / (magnitudeA * magnitudeB));
  const angleBeta = Math.acos(dotBeta / (magnitudeA * magnitudePrize));
  const angleGamma = Math.acos(dotGamma / (magnitudeB * magnitudePrize));

  const lengthVectorA = Math.sqrt(a.x ** 2 + a.y ** 2);
  const lengthVectorB = Math.sqrt(b.x ** 2 + b.y ** 2);
  const lengthVectorPrize = Math.sqrt(prizeRaw.x ** 2 + prizeRaw.y ** 2);

  const lawOfSines = lengthVectorPrize / Math.sin(angleAlpha);
  const lengthSideA = lawOfSines * Math.sin(angleGamma);
  const lengthSideB = lawOfSines * Math.sin(angleBeta);

  const pressesA = Math.round(lengthSideA / lengthVectorA);
  const pressesB = Math.round(lengthSideB / lengthVectorB);

  if (
    pressesA * a.x + pressesB * b.x !== prizeRaw.x ||
    pressesA * a.y + pressesB * b.y !== prizeRaw.y
  )
    return null;

  return pressesA * 3 + pressesB;
};

const first = (input: string) => {
  const equations = parseInput(input);

  const solutions = equations.map((s) => bestPossibleCostIterative(s, 100));

  return solutions.reduce((acc, cost) => acc + (cost ?? 0), 0);
};

const expectedFirstSolution = 480;

const second = (input: string) => {
  // const addition = 10000000000000;
  const addition = 0;

  const equations = parseInput(input).map(({ prize: { x, y }, ...v }) => ({
    ...v,
    prize: { x: x + addition, y: y + addition },
  }));

  const solutions = equations.map(bestPossibleCostGeometric);

  return solutions.reduce((acc, cost) => acc + (cost ?? 0), 0);
};

const expectedSecondSolution = 480;

export { first, expectedFirstSolution, second, expectedSecondSolution };
