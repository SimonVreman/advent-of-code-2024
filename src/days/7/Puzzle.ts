type Calibration = { result: number; components: number[] };
type Operator = '*' | '+' | '||';

const parseInput = (input: string): Calibration[] =>
  input.split('\n').map((line) => {
    const [result, components] = line.split(': ');
    return { result: +result, components: components.split(' ').map(Number) };
  });

const reverseOperatorMap = {
  '+': (x: number, y: number): number | null => x - y,
  '*': (x: number, y: number): number | null => (x % y === 0 ? x / y : null),
  '||': (x: number, y: number): number | null =>
    String(x).endsWith(String(y))
      ? +String(x).substring(0, String(x).length - String(y).length)
      : null,
} as const;

const validOperators = (
  { result, components }: Calibration,
  operators: Operator[] = ['*', '+', '||']
): Operator[] | null => {
  const lastComponent = components[components.length - 1];
  const otherComponents = components.slice(0, -1);

  if (components.length === 1) return result === lastComponent ? [] : null;

  for (const operatorIndex in operators) {
    const newResult = reverseOperatorMap[operators[operatorIndex]](
      result,
      lastComponent
    );

    if (newResult === null) continue;

    const solution = validOperators(
      { result: newResult, components: otherComponents },
      operators
    );

    if (solution !== null) return [...solution, operators[operatorIndex]];
  }

  return null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _verify = (
  { result, components }: Calibration,
  operators: Operator[] = ['*', '+', '||']
) =>
  operators.reduce(
    (result, operator, i) =>
      ({
        '+': (x: number, y: number) => x + y,
        '*': (x: number, y: number) => x * y,
        '||': (x: number, y: number) => +(String(x) + String(y)),
      })[operator](result, components[i + 1]),
    components[0]
  ) === result;

const first = (input: string) => {
  const calibrations = parseInput(input);

  return calibrations
    .filter((c) => validOperators(c, ['+', '*']) !== null)
    .reduce((acc, c) => acc + c.result, 0);
};

const expectedFirstSolution = 3749;

const second = (input: string) => {
  const calibrations = parseInput(input);

  return calibrations
    .filter((c) => validOperators(c, ['+', '*', '||']) !== null)
    .reduce((acc, c) => acc + c.result, 0);
};

const expectedSecondSolution = 11387;

export { first, expectedFirstSolution, second, expectedSecondSolution };
