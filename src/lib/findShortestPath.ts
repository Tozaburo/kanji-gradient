import { type KanjiParts } from "./kanjiParts";

function normalizeNodeName(name: string): string {
  if (name === "⻏") {
    return "⻖";
  }

  return name;
}

export function findShortestPath(
  nodes: KanjiParts[],
  start: string,
  goal: string,
): string[] | null {
  const graph = new Map<string, string[]>();

  for (const node of nodes) {
    const left = normalizeNodeName(node.left);
    const right = normalizeNodeName(node.right);

    if (!graph.has(left)) {
      graph.set(left, []);
    }

    graph.get(left)!.push(right);
  }

  const normalizedStart = normalizeNodeName(start);
  const normalizedGoal = normalizeNodeName(goal);

  const queue: string[][] = [[normalizedStart]];
  const visited = new Set<string>([normalizedStart]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];

    if (current === normalizedGoal) {
      return path;
    }

    const nextNodes = graph.get(current) ?? [];

    for (const next of nextNodes) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }

  return null;
}
