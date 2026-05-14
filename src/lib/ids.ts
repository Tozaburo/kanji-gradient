export type IdsEntry = {
  unicode: string;
  ids: string;
};

let cache: Record<string, IdsEntry> | null = null;

export async function loadIds(): Promise<Record<string, IdsEntry>> {
  if (cache !== null) {
    return cache;
  }

  const response = await fetch("/data/ids.json");

  if (!response.ok) {
    throw new Error("Cannot load IDS data.");
  }

  cache = (await response.json()) as Record<string, IdsEntry>;
  return cache;
}

export async function getIds(char: string): Promise<IdsEntry | null> {
  const ids = await loadIds();
  return ids[char] ?? null;
}
