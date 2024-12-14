const first = (input: string) =>
  input.match(/(mul\(\d{1,3},\d{1,3}\))/g).reduce(
    (acc, instruction) =>
      acc +
      instruction
        .substring(4, instruction.length - 1)
        .split(',')
        .reduce((product, value) => product * +value, 1),
    0
  );

const expectedFirstSolution = 178538786;

const matchIndexArray = (pattern: RegExp, input: string) => {
  const matches = [];
  let match: RegExpMatchArray | null = null;
  while ((match = pattern.exec(input)) !== null) {
    matches.push(match.index);
  }
  return matches;
};

const second = (input: string) => {
  const mulPattern = /(mul\(\d{1,3},\d{1,3}\))/g;
  const doMatches = matchIndexArray(/(do\(\))/g, input);
  const dontMatches = matchIndexArray(/(don't\(\))/g, input);

  let match: RegExpMatchArray | null = null;
  let sum = 0;

  while ((match = mulPattern.exec(input)) != null) {
    const smallerDos = doMatches.filter((m) => m < match.index);
    const smallerDonts = dontMatches.filter((m) => m < match.index);
    const lastDo = smallerDos[smallerDos.length - 1] ?? -1;
    const lastDont = smallerDonts[smallerDonts.length - 1] ?? -2;

    if (lastDo < lastDont) continue;

    sum += match[0]
      .substring(4, match[0].length - 1)
      .split(',')
      .reduce((product, value) => product * +value, 1);
  }

  return sum;
};

const expectedSecondSolution = 102467299;

export { first, expectedFirstSolution, second, expectedSecondSolution };
