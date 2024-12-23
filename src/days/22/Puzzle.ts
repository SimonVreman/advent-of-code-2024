const prune = BigInt(16777216 - 1);

const parseInput = (input: string) => input.split('\n').map(BigInt);

const calculateSecrets = (numbers: bigint[], iterations: number) => {
  let secrets = numbers;

  for (let i = 0; i < iterations; i++) {
    const newSecrets = [];
    for (const secret of secrets) {
      let newSecret = ((secret << 6n) ^ secret) & prune;
      newSecret = ((newSecret >> 5n) ^ newSecret) & prune;
      newSecrets.push(((newSecret << 11n) ^ newSecret) & prune);
    }
    secrets = newSecrets;
  }

  return secrets;
};

const calculateSales = (numbers: bigint[], iterations: number) => {
  const sales = new Map<string, bigint>();
  const occurred = numbers.map(() => new Set<string>());
  const changes = numbers.map(() => []);
  const secrets = [...numbers];

  for (let i = 0; i < iterations; i++) {
    for (let j = 0; j < secrets.length; j++) {
      const secret = secrets[j];

      let newSecret = ((secret << 6n) ^ secret) & prune;
      newSecret = ((newSecret >> 5n) ^ newSecret) & prune;
      newSecret = ((newSecret << 11n) ^ newSecret) & prune;

      const lastDigit = newSecret % 10n;
      const previousLastDigit = secret % 10n;

      changes[j].push(lastDigit - previousLastDigit);
      secrets[j] = newSecret;

      if (i > 2) {
        const changeHash = changes[j].slice(-4).join('');
        if (occurred[j].has(changeHash)) continue;
        occurred[j].add(changeHash);
        sales.set(changeHash, (sales.get(changeHash) ?? 0n) + lastDigit);
      }
    }
  }

  let maxSale = 0n;
  for (const sale of sales.values()) if (sale > maxSale) maxSale = sale;

  return maxSale;
};

const first = (input: string) => {
  const initial = parseInput(input);

  return calculateSecrets(initial, 2000).reduce(
    (acc, number) => acc + number,
    0n
  );
};

const expectedFirstSolution = 37327623n;

const second = (input: string) => {
  const initial = parseInput(input);

  return calculateSales(initial, 2000);
};

const expectedSecondSolution = 23n;

export { first, expectedFirstSolution, second, expectedSecondSolution };
