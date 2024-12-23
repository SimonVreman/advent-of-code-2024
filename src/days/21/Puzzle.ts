type Vector = [number, number];
enum PadType {
  Numerical = 0,
  Directional = 1,
}

// Numerical pad:
// +---+---+---+
// | 7 | 8 | 9 |
// +---+---+---+
// | 4 | 5 | 6 |
// +---+---+---+
// | 1 | 2 | 3 |
// +---+---+---+
//     | 0 | A |
//     +---+---+

// Directional pad:
//     +---+---+
//     | ^ | B |
// +---+---+---+
// | < | v | > |
// +---+---+---+

const characterPositionMap: Record<string, Vector> = {
  0: [3, 1],
  1: [2, 0],
  2: [2, 1],
  3: [2, 2],
  4: [1, 0],
  5: [1, 1],
  6: [1, 2],
  7: [0, 0],
  8: [0, 1],
  9: [0, 2],
  A: [3, 2],
  B: [0, 2],
  '^': [0, 1],
  '<': [1, 0],
  v: [1, 1],
  '>': [1, 2],
};

const parseInput = (input: string) => input.split('\n');

const isEmptySquare = ([a, b]: Vector, type: PadType) =>
  b === 0 && a === (type === PadType.Numerical ? 3 : 0);

const padInstructions = (code: string, type: PadType) => {
  const instructions: string[][] = [];
  let position = type === PadType.Numerical ? [3, 2] : [0, 2];

  for (let i = 0; i < code.length; i++) {
    const character = code[i];
    const characterInstructions: string[] = [];

    const target =
      characterPositionMap[character as keyof typeof characterPositionMap];
    const dRow = target[0] - position[0];
    const dColumn = target[1] - position[1];

    const horizontalMoves = (dColumn > 0 ? '>' : '<').repeat(Math.abs(dColumn));
    const verticalMoves = (dRow > 0 ? 'v' : '^').repeat(Math.abs(dRow));

    if (dRow !== 0 && dColumn !== 0) {
      if (!isEmptySquare([position[0], target[1]], type))
        characterInstructions.push(`${horizontalMoves}${verticalMoves}B`);
      if (!isEmptySquare([target[0], position[1]], type))
        characterInstructions.push(`${verticalMoves}${horizontalMoves}B`);
    } else if (dRow !== 0) {
      characterInstructions.push(`${verticalMoves}B`);
    } else if (dColumn !== 0) {
      characterInstructions.push(`${horizontalMoves}B`);
    } else {
      characterInstructions.push('B');
    }

    instructions.push(characterInstructions);
    position = target;
  }

  return instructions;
};

const resolvedOptions: Record<number, Map<string, number>> = {};

const optimalChain = (codes: string[][], depth: number) => {
  const map = (resolvedOptions[depth] =
    resolvedOptions[depth] ?? new Map<string, number>());
  let chain = 0;

  for (const options of codes) {
    let optimalLength = Infinity;
    let optimalIndex = 0;
    for (let i = 0; i < options.length; i++) {
      const code = options[i];
      let resolved = map.get(code);

      if (resolved == null) {
        resolved =
          depth === 0
            ? code.length
            : optimalChain(
                padInstructions(code, PadType.Directional),
                depth - 1
                // map
              );

        map.set(code, resolved);
      }

      if (resolved < optimalLength) {
        optimalLength = resolved;
        optimalIndex = i;
      }
    }
    chain += map.get(options[optimalIndex]);
  }

  return chain;
};

const first = (input: string) => {
  const codes = parseInput(input);
  let complexity = 0;

  for (const code of codes) {
    const optimal = optimalChain(padInstructions(code, PadType.Numerical), 2);
    complexity += optimal * +code.split('A')[0];
  }

  return complexity;
};

const expectedFirstSolution = 126384;

const second = (input: string) => {
  const codes = parseInput(input);
  let complexity = 0;

  for (const code of codes) {
    const optimal = optimalChain(padInstructions(code, PadType.Numerical), 25);
    complexity += optimal * +code.split('A')[0];
  }

  return complexity;
};

const expectedSecondSolution = 154115708116294;

export { first, expectedFirstSolution, second, expectedSecondSolution };
