type State = {
  a: bigint;
  b: bigint;
  c: bigint;
  pos: number;
};

enum Instruction {
  ADV = 0,
  BXL = 1,
  BST = 2,
  JNZ = 3,
  BXC = 4,
  OUT = 5,
  BDV = 6,
  CDV = 7,
}

const parseInput = (
  input: string
): { state: State; instructions: Instruction[] } => {
  const [state, instructions] = input.split('\n\n');
  const [a, b, c] = state
    .split('\n')
    .map((line) => BigInt(line.split(': ')[1]));

  return {
    state: { a, b, c, pos: 0 },
    instructions: instructions.split(': ')[1].split(',').map(Number),
  };
};

const comboValue = (state: State, operand: number) => {
  if (operand <= 3) return BigInt(operand);
  if (operand === 4) return state.a;
  if (operand === 5) return state.b;
  return state.c;
};

const instructionMap: Record<
  Instruction,
  (args: { state: State; output: number[]; operand: number }) => number | null
> = {
  // Division
  [Instruction.ADV]: ({ state, operand }) => {
    state.a = state.a >> comboValue(state, operand);
    return null;
  },
  [Instruction.BDV]: ({ state, operand }) => {
    state.b = state.a >> comboValue(state, operand);
    return null;
  },
  [Instruction.CDV]: ({ state, operand }) => {
    state.c = state.a >> comboValue(state, operand);
    return null;
  },
  // Bitwise XOR
  [Instruction.BXL]: ({ state, operand }) => {
    state.b ^= BigInt(operand);
    return null;
  },
  [Instruction.BXC]: ({ state }) => {
    state.b ^= BigInt(state.c);
    return null;
  },
  // Other
  [Instruction.BST]: ({ state, operand }) => {
    state.b = comboValue(state, operand) % 8n;
    return null;
  },
  [Instruction.JNZ]: ({ state, operand }) => {
    if (state.a === 0n) return;
    return operand;
  },
  [Instruction.OUT]: ({ state, operand, output }) => {
    output.push(Number(comboValue(state, operand) % 8n));
    return null;
  },
};

const runInstructions = (startingState: State, instructions: Instruction[]) => {
  const state = { ...startingState };
  const output: number[] = [];

  let i = state.pos;
  while (i < instructions.length - 1) {
    const fn = instructionMap[instructions[i]];
    const operand = instructions[i + 1];
    i = fn({ state, output, operand }) ?? i + 2;
  }

  return { state, output };
};

const runInstructionsWithExpected = (
  startingState: State,
  instructions: Instruction[]
) => {
  const state = { ...startingState };
  const output: number[] = [];

  let i = state.pos;
  while (i < instructions.length - 1) {
    const instruction = instructions[i];
    const operand = instructions[i + 1];

    const fn = instructionMap[instructions[i]];
    i = fn({ state, output, operand }) ?? i + 2;

    if (
      instruction === Instruction.OUT &&
      instructions[output.length - 1] !== output[output.length - 1]
    ) {
      console.log(output.join(','));
      return false;
    }
  }

  return output.length === instructions.length;
};

const concatenateBits = (values: number[]) =>
  values.reduce((acc, v, i) => acc + (BigInt(v % 8) << BigInt(i * 3)), 0n);

type Operation = (x: bigint) => bigint;

type OperationState = {
  a: Operation[];
  b: Operation[];
  c: Operation[];
};

const reduceOperations = (operations: Operation[], x: bigint) =>
  operations.reduce((acc, v) => v(acc), x);

const findAForInstructions = (instructions: Instruction[]): bigint => {
  const register = instructions[instructions.length - 3] === 4 ? 'a' : 'b';

  if (register === 'a') {
    // Simple case: only possibility is a simple 3-bit shift per cycle
    return concatenateBits(instructions) << 3n;
  }

  // Then the puzzle works similarly, but with chained operations
  const operations: OperationState = { a: [], b: [], c: [] };

  const comboValue = (state: OperationState, operand: number): Operation[] => {
    if (operand <= 3) return [() => BigInt(operand)];
    if (operand === 4) return state.a;
    if (operand === 5) return state.b;
    return state.c;
  };

  for (let i = 0; i < instructions.length; i += 2) {
    const instruction = instructions[i];
    const operand = instructions[i + 1];

    if (instruction === Instruction.BXL) {
      operations.b.push((x) => x ^ BigInt(operand));
    } else if (instruction === Instruction.BST) {
      const clonedCombo = [...comboValue(operations, operand)];

      const newOperation = (x: bigint) => reduceOperations(clonedCombo, x) % 8n;

      operations.b = [newOperation];
    } else if (instruction === Instruction.CDV) {
      const clonedCombo = [...comboValue(operations, operand)];

      const newOperation = (x: bigint) => x >> reduceOperations(clonedCombo, x);

      operations.c = [newOperation];
    } else if (instruction === Instruction.BXC) {
      const clonedB = [...operations.b];
      const clonedC = [...operations.c];

      const newOperation = (x: bigint) => {
        return reduceOperations(clonedB, x) ^ reduceOperations(clonedC, x);
      };

      operations.b = [newOperation];
    }
  }

  const solution = findAForOperations(instructions, operations.b);

  return concatenateBits(solution);
};

const findAForOperations = (
  instructions: Instruction[],
  operations: Operation[],
  ending?: number
): number[] | null => {
  if (instructions.length === 0) return [];

  // Find all possibilities that result in outputting the last instruction
  const [...remaining] = instructions;
  const instruction = remaining.pop();

  const maximum = ending != null ? 2 ** 10 : 2 ** 3;

  for (let i = 0; i < maximum; i++) {
    // Check if ending bits constraint is met
    if (ending != null) {
      const shiftUsed = i % 8 ^ 1;
      const modulus = 2 ** (shiftUsed + 1);

      if (ending % modulus !== (i >>> 3) % modulus) continue;
    }

    // Check if result matches instruction
    const result = reduceOperations(operations, BigInt(i)) % 8n;
    if (Number(result) !== instruction) continue;

    // See if we can continue with this new constraint
    const rest = findAForOperations(remaining, operations, i);
    if (rest === null) continue;

    // Works!
    return [...rest, i];
  }

  return null;
};

const first = (input: string) => {
  const { state, instructions } = parseInput(input);

  const { output } = runInstructions(state, instructions);

  return output.join(',');
};

const expectedFirstSolution = '4,6,3,5,6,3,5,2,1,0';

const second = (input: string) => {
  const { instructions } = parseInput(input);

  return findAForInstructions(instructions);
};

const expectedSecondSolution = 117440n;

export { first, expectedFirstSolution, second, expectedSecondSolution };
