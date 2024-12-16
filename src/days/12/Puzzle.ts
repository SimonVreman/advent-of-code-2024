type Grid = string[][];
type Location = [number, number];

const parseInput = (input: string): Grid =>
  input.split('\n').map((line) => line.split(''));

const locEq = (a: Location, b: Location) => a[0] === b[0] && a[1] === b[1];

const adjecentLocations = (location: Location): Location[] =>
  [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ].map(([a, b]) => [a + location[0], b + location[1]]);

const adjecentOfSameType = (grid: Grid, location: Location) =>
  adjecentLocations(location).filter(
    (l) => grid[l[0]]?.[l[1]] === grid[location[0]][location[1]]
  );

const perimeterOfLocation = (grid: Grid, location: Location) =>
  adjecentLocations(location).filter(
    (l) => grid[l[0]]?.[l[1]] !== grid[location[0]][location[1]]
  ).length;

const perimeterOfLocationDiscounted = (grid: Grid, location: Location) =>
  adjecentLocations(location).filter((adjecent) => {
    const crop = grid[location[0]]?.[location[1]];
    const adjecentCrop = grid[adjecent[0]]?.[adjecent[1]];

    if (adjecentCrop === crop) return false;

    if (adjecent[0] - location[0] === 0) {
      // Vertically adjecent, count top-most
      return (
        grid[location[0] - 1]?.[location[1]] !== crop ||
        grid[adjecent[0] - 1]?.[adjecent[1]] === crop
      );
    } else {
      // Horizontally adjecent, count left-most
      return (
        grid[location[0]]?.[location[1] - 1] !== crop ||
        grid[adjecent[0]]?.[adjecent[1] - 1] === crop
      );
    }
  }).length;

const findGridAreas = (grid: Grid): Location[][] => {
  const areas: Location[][] = [];
  let locationSet: Location[] = Array.from(
    { length: grid.length },
    (_, i) => i
  ).flatMap((_, row) =>
    Array.from({ length: grid[0].length }, (_, i) => [row, i] as Location)
  );

  while (locationSet.length > 0) {
    let area = [locationSet[0]];
    let adjecent = [area[0]];

    while (
      (adjecent = adjecent
        .flatMap((l) => adjecentOfSameType(grid, l))
        .filter(
          (a, i, self) =>
            self.findIndex((b) => locEq(a, b)) === i &&
            !area.some((b) => locEq(a, b))
        )).length > 0
    )
      area = [...area, ...adjecent];

    locationSet = locationSet.filter((a) => !area.some((b) => locEq(a, b)));

    areas.push(area);
  }

  return areas;
};

const first = (input: string) => {
  const grid = parseInput(input);

  return findGridAreas(grid)
    .map(
      (area) =>
        area.length *
        area.reduce((acc, l) => acc + perimeterOfLocation(grid, l), 0)
    )
    .reduce((acc, a) => acc + a, 0);
};

const expectedFirstSolution = 1930;

const second = (input: string) => {
  const grid = parseInput(input);

  return findGridAreas(grid)
    .map(
      (area) =>
        area.length *
        area.reduce((acc, l) => acc + perimeterOfLocationDiscounted(grid, l), 0)
    )
    .reduce((acc, a) => acc + a, 0);
};

const expectedSecondSolution = 1206;

export { first, expectedFirstSolution, second, expectedSecondSolution };
