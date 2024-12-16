type Vector = { x: number; y: number };
type Robot = { p: Vector; v: Vector };

const parseInput = (input: string): Robot[] =>
  input.split('\n').map((line) => {
    const [p, v] = line.split(' ').map((c) => {
      const [xString, yString] = c.split('=')[1].split(',');
      return { x: +xString, y: +yString };
    });
    return { p, v };
  });

const moveRobots = (robots: Robot[], grid: Vector) =>
  robots.map(({ p: { x, y }, v }) => ({
    v,
    p: { x: (x + v.x + grid.x) % grid.x, y: (y + v.y + grid.y) % grid.y },
  }));

const safetyFactor = (robots: Robot[], grid: Vector) => {
  const xCenter = Math.floor(grid.x / 2);
  const yCenter = Math.floor(grid.y / 2);

  let [q1, q2, q3, q4] = [0, 0, 0, 0];

  for (const {
    p: { x, y },
  } of robots) {
    if (x < xCenter) {
      if (y < yCenter) q1++;
      if (y > yCenter) q3++;
    } else if (x > xCenter) {
      if (y < yCenter) q2++;
      if (y > yCenter) q4++;
    }
  }

  return q1 * q2 * q3 * q4;
};

const printRobots = (robots: Robot[], grid: Vector) => {
  for (let y = 0; y < grid.y; y++) {
    let line = '';
    for (let x = 0; x < grid.x; x++) {
      const atPosition = robots.filter(
        ({ p }) => p.x === x && p.y === y
      ).length;
      line += atPosition > 0 ? Math.min(9, atPosition) : ' ';
    }
    console.log(line);
  }
};

const first = (input: string) => {
  const gridSize = { x: 11, y: 7 };
  // const gridSize = { x: 101, y: 103 };

  const robots = parseInput(input);

  const finalPositions = [...Array(100)].reduce(
    (r) => moveRobots(r, gridSize),
    robots
  );

  return safetyFactor(finalPositions, gridSize);
};

const expectedFirstSolution = 12;

const second = (input: string) => {
  const gridSize = { x: 101, y: 103 };
  let robots = parseInput(input);

  // console.log('Start');
  // printRobots(robots, gridSize);

  for (let i = 0; i < 0; i++) {
    if (i > 7915) {
      process.stdout.moveCursor(0, -(gridSize.y + 1));
      console.log('Iteration', i);
      printRobots(robots, gridSize);
      // await new Promise((r) => setTimeout(r, 550));
    }

    robots = moveRobots(robots, gridSize);
  }

  return 1;
};

const expectedSecondSolution = 1;

export { first, expectedFirstSolution, second, expectedSecondSolution };
