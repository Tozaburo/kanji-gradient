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
  const ids = await loadMap();
  return ids[char]?.kanjiParts ?? null;
}
