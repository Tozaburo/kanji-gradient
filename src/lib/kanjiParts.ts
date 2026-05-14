import { normalizeKanjiVariants } from "./normalizeKanjiVariants";

export type KanjiParts = {
  left: string;
  right: string;
};

export type MapEntry = {
  unicode: string;
  kanjiParts: KanjiParts;
};

let cache: Record<string, MapEntry> | null = null;

export async function loadMap(): Promise<Record<string, MapEntry>> {
  if (cache !== null) {
    return cache;
  }

  const response = await fetch("/data/kanji-parts-map.json");

  if (!response.ok) {
    throw new Error("Cannot load Kanji Parts data.");
  }

  cache = (await response.json()) as Record<string, MapEntry>;
  return cache;
}

export async function separateKanji(char: string): Promise<KanjiParts | null> {
  const map = await loadMap();
  return map[char]?.kanjiParts ?? null;
}

export async function separatedToKanji(
  left: string,
  right: string,
): Promise<string | null> {
  const map = await loadMap();

  for (const char in map) {
    const parts = map[char].kanjiParts;

    if (
      normalizeKanjiVariants(parts.left) === normalizeKanjiVariants(left) &&
      normalizeKanjiVariants(parts.right) === normalizeKanjiVariants(right)
    ) {
      return char;
    }
  }

  return null;
}
