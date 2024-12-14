const parseRulesAndUpdates = (
  input: string
): { rules: [number, number][]; updates: number[][] } =>
  input
    .split('\n')
    .reduce(
      (acc, line) =>
        line.includes('|')
          ? { ...acc, rules: [...acc.rules, line.split('|').map(Number)] }
          : line.includes(',')
            ? { ...acc, updates: [...acc.updates, line.split(',').map(Number)] }
            : acc,
      { rules: [], updates: [] }
    );

const updateIsValid = (update: number[], rules: [number, number][]) =>
  update.every((page, index) =>
    rules.every(
      (rule) => rule[0] !== page || !update.slice(0, index).includes(rule[1])
    )
  );

const sumOfMiddles = (acc: number, update: number[]) =>
  acc + update[Math.floor(update.length / 2)];

const first = (input: string) => {
  const { rules, updates } = parseRulesAndUpdates(input);

  return updates.filter((u) => updateIsValid(u, rules)).reduce(sumOfMiddles, 0);
};

const expectedFirstSolution = 143;

const second = (input: string) => {
  const { rules, updates } = parseRulesAndUpdates(input);

  const invalidUpdates = updates.filter((u) => !updateIsValid(u, rules));

  const fixedUpdates = invalidUpdates.map((update) => {
    const modifiedUpdate = [...update];

    while (!updateIsValid(modifiedUpdate, rules)) {
      for (let pageIndex = 0; pageIndex < modifiedUpdate.length; pageIndex++) {
        for (let ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
          const page = modifiedUpdate[pageIndex];
          const rule = rules[ruleIndex];

          if (page !== rule[0]) continue;

          const illegalIndex = modifiedUpdate
            .slice(0, pageIndex)
            .indexOf(rule[1]);

          if (illegalIndex === -1) continue;

          modifiedUpdate[illegalIndex] = rule[0];
          modifiedUpdate[pageIndex] = rule[1];
        }
      }
    }

    return modifiedUpdate;
  });

  return fixedUpdates.reduce(sumOfMiddles, 0);
};

const expectedSecondSolution = 123;

export { first, expectedFirstSolution, second, expectedSecondSolution };
