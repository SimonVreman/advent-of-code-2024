type State = Record<string, boolean>;

type Operator = 'OR' | 'AND' | 'XOR';

type Operation = {
  varA: string;
  varB: string;
  output: string;
  operator: Operator;
};

enum OperationType {
  InputAND = 0,
  InputXOR = 1,
  InterAND = 2,
  CarryOR = 3,
  ResultXOR = 4,
}

const operatorMap: Record<Operator, (a: boolean, b: boolean) => boolean> = {
  OR: (a, b) => a || b,
  AND: (a, b) => a && b,
  XOR: (a, b) => a !== b,
};

const parseInput = (input: string) => {
  const [initial, changes] = input.split('\n\n');
  return {
    initial: initial.split('\n').reduce((acc, line) => {
      const [label, value] = line.split(': ');
      acc[label] = Boolean(+value);
      return acc;
    }, {} as State),
    changes: changes.split('\n').map((line) => {
      const [input, output] = line.split(' -> ');
      const [varA, operator, varB] = input.split(' ');
      return { varA, varB, output, operator } as Operation;
    }),
  };
};

const getOperationType = ({ varA, operator }: Operation) => {
  if (varA[0] === 'x' || varA[0] === 'y')
    return operator === 'AND' ? OperationType.InputAND : OperationType.InputXOR;
  if (operator === 'AND') return OperationType.InterAND;
  if (operator === 'OR') return OperationType.CarryOR;
  return OperationType.ResultXOR;
};

const variableUsedIn = (
  operations: Operation[],
  variable: string,
  type: OperationType
) =>
  operations.some(
    (o) =>
      getOperationType(o) === type &&
      (o.varA === variable || o.varB === variable)
  );

const sortOperations = (initial: string[], operations: Operation[]) => {
  const seen = new Set<string>(initial);
  const sorted: Operation[] = [];

  let remaining = operations;
  while (remaining.length > 0) {
    const newRemaining: Operation[] = [];

    for (const operation of remaining) {
      if (!seen.has(operation.varA) || !seen.has(operation.varB)) {
        newRemaining.push(operation);
        continue;
      }

      seen.add(operation.output);
      sorted.push(operation);
    }

    remaining = newRemaining;
  }

  return sorted;
};

const applyChanges = (initial: State, operations: Operation[]) => {
  const state = { ...initial };

  for (const operation of sortOperations(Object.keys(initial), operations)) {
    const { varA, varB, output, operator } = operation;
    state[output] = operatorMap[operator](state[varA], state[varB]);
  }

  return state;
};

const calculateResult = (state: State) => {
  let runningTotal = 0n;
  for (const variable in state) {
    if (variable[0] !== 'z') continue;

    const value = state[variable];
    if (!value) continue;

    const index = BigInt(variable.slice(1));
    runningTotal += 1n << index;
  }
  return runningTotal;
};

const findIncorrect2 = (operations: Operation[]) => {
  const incorrect = operations.filter(
    (o) =>
      getOperationType(o) === OperationType.InputAND &&
      !variableUsedIn(operations, o.output, OperationType.CarryOR)
  );

  operations.forEach((o) => {
    if (
      getOperationType(o) === OperationType.InputXOR &&
      !(
        variableUsedIn(operations, o.output, OperationType.InterAND) &&
        variableUsedIn(operations, o.output, OperationType.ResultXOR)
      )
    )
      incorrect.push(o);
  });

  operations.forEach((o) => {
    if (
      getOperationType(o) === OperationType.InterAND &&
      !variableUsedIn(operations, o.output, OperationType.CarryOR)
    )
      incorrect.push(o);
  });

  operations.forEach((o) => {
    if (
      getOperationType(o) === OperationType.CarryOR &&
      !(
        variableUsedIn(operations, o.output, OperationType.InterAND) &&
        variableUsedIn(operations, o.output, OperationType.ResultXOR)
      )
    )
      incorrect.push(o);
  });

  operations.forEach((o) => {
    if (getOperationType(o) === OperationType.ResultXOR && o.output[0] !== 'z')
      incorrect.push(o);
  });

  // Remove the unique but correct operations
  return incorrect.filter((o) => {
    // First bit has no carry yet
    if (o.varA === 'x00' || o.varB === 'x00') return false;
    // Last bit is also different
    if (o.output === 'z45') return false;
    return true;
  });
};

const first = (input: string) => {
  const { initial, changes } = parseInput(input);

  const final = applyChanges(initial, changes);

  return calculateResult(final);
};

const expectedFirstSolution = 2024n;

const second = (input: string) => {
  const { changes } = parseInput(input);

  const incorrect = findIncorrect2(changes);

  console.log(incorrect);

  return incorrect
    .map(({ output }) => output)
    .sort()
    .join(',');
};

const expectedSecondSolution = 'dvb,fhg,fsq,tnc,vcf,z10,z17,z39';

export { first, expectedFirstSolution, second, expectedSecondSolution };
