type Graph = Record<string, string[]>;

const parseInput = (input: string) => {
  const lines = input.split('\n');
  const graph: Graph = {};

  for (const line of lines) {
    const [a, b] = line.split('-');
    graph[a] = [...(graph[a] ?? []).filter((x) => x !== b), b];
    graph[b] = [...(graph[b] ?? []).filter((x) => x !== a), a];
  }

  return graph;
};

const nodePairs = (nodes: string[]) => {
  const pairs: [string, string][] = [];
  for (const a of nodes) for (const b of nodes) if (a < b) pairs.push([a, b]);
  return pairs;
};

const findConnectedSubGraphs = (graph: Graph) => {
  const subGraphs = new Set<string>();

  for (const node in graph) {
    const neighbours = graph[node];
    const pairs = nodePairs(neighbours);
    for (const [a, b] of pairs) {
      if (!graph[a].includes(b) || !graph[b].includes(a)) continue;
      subGraphs.add([a, b, node].sort().join(','));
    }
  }

  return subGraphs;
};

const findLargestStronglyConnected = (graph: Graph) => {
  const subGraphs = Object.keys(graph).map((k) => [k]);

  for (const node in graph) {
    const neighbours = graph[node];
    for (const subGraph of subGraphs) {
      if (
        subGraph.every(
          (n) => n !== node && neighbours.includes(n) && graph[n].includes(node)
        )
      )
        subGraph.push(node);
    }
  }

  return subGraphs.sort((a, b) => b.length - a.length)[0];
};

const first = (input: string) => {
  const graph = parseInput(input);

  let count = 0;
  for (const subGraph of findConnectedSubGraphs(graph))
    if (subGraph.split(',').some(([x]) => x === 't')) count++;

  return count;
};

const expectedFirstSolution = 7;

const second = (input: string) => {
  const graph = parseInput(input);

  const largestStronglyConnected = findLargestStronglyConnected(graph);

  return largestStronglyConnected.sort().join(',');
};

const expectedSecondSolution = 'co,de,ka,ta';

export { first, expectedFirstSolution, second, expectedSecondSolution };
