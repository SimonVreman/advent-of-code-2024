const invalidAt = (report: number[]) => {
  const direction = report[1] - report[0] > 0 ? 1 : -1;

  for (let i = 1; i < report.length; i++) {
    const difference = (report[i] - report[i - 1]) * direction;
    if (difference < 1 || difference > 3) return i;
  }
};

const first = (input: string) => {
  const reports = input.split('\n').map((line) => line.split(' ').map(Number));

  return reports.reduce(
    (acc, report) => (invalidAt(report) === undefined ? acc + 1 : acc),
    0
  );
};

const expectedFirstSolution = 1;

const second = (input: string) => {
  const reports = input.split('\n').map((line) => line.split(' ').map(Number));

  return reports.reduce((acc, report) => {
    const invalidIndex = invalidAt(report);
    if (invalidIndex === undefined) return acc + 1;

    // Need to check if:
    // - one of the direction setting elements impacts the result
    return invalidAt(report.slice(1)) === undefined ||
      invalidAt([report[0], ...report.slice(2)]) === undefined ||
      // - the element that is removed, and the one before it, impact the result
      invalidAt([
        ...report.slice(0, invalidIndex - 1),
        ...report.slice(invalidIndex),
      ]) === undefined ||
      invalidAt([
        ...report.slice(0, invalidIndex),
        ...report.slice(invalidIndex + 1),
      ]) === undefined
      ? acc + 1
      : acc;
  }, 0);
};

const expectedSecondSolution = 1;

export { first, expectedFirstSolution, second, expectedSecondSolution };
