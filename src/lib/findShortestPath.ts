import { type KanjiParts } from "./kanjiParts";
import { normalizeKanjiVariants } from "./normalizeKanjiVariants";

export function findShortestPath(
  nodes: KanjiParts[],
  start: string,
  goal: string,
): string[] | null {
  const graph = new Map<string, string[]>();

  for (const node of nodes) {
    const left = normalizeKanjiVariants(node.left);
    const right = normalizeKanjiVariants(node.right);

    if (!graph.has(left)) {
      graph.set(left, []);
    }

    graph.get(left)!.push(right);
  }

  const normalizedStart = normalizeKanjiVariants(start);
  const normalizedGoal = normalizeKanjiVariants(goal);

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
