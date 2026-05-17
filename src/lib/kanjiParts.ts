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

  const response = await fetch(
    `${import.meta.env.BASE_URL}data/kanji-parts-map.json`,
  );

  if (!response.ok) {
    throw new Error("Cannot load Kanji Parts data.");
  }

  cache = (await response.json()) as Record<string, MapEntry>;
  return cache;
}

export async function separateKanji(char: string): Promise<KanjiParts | null> {
  const map = await loadMap();
  const normalizedChar = normalizeKanjiVariants(char);

  return map[char]?.kanjiParts ?? map[normalizedChar]?.kanjiParts ?? null;
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

export async function hasLeft(left: string): Promise<boolean> {
  const map = await loadMap();
  const normalizedLeft = normalizeKanjiVariants(left);

  return Object.values(map).some(
    (entry) => normalizeKanjiVariants(entry.kanjiParts.left) === normalizedLeft,
  );
}

export async function hasRight(right: string): Promise<boolean> {
  const map = await loadMap();
  const normalizedRight = normalizeKanjiVariants(right);

  return Object.values(map).some(
    (entry) =>
      normalizeKanjiVariants(entry.kanjiParts.right) === normalizedRight,
  );
}
