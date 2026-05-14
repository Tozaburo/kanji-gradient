import { mkdir, readFile, writeFile } from "node:fs/promises";

type IdsRecord = {
  unicode: string;
  char: string;
  ids: string;
};

type KanjiParts = {
  left: string;
  right: string;
};

type KanjiPartsRecord = {
  unicode: string;
  char: string;
  kanjiParts: KanjiParts;
};

const inputPaths = [
  "vendor/chise-ids/IDS-UCS-Basic.txt",
  "vendor/chise-ids/IDS-UCS-Ext-A.txt",
  "vendor/chise-ids/IDS-UCS-Compat.txt",
];
const outputPath = "public/data/kanji-parts-map.json";

function parseLine(line: string): IdsRecord | null {
  if (!line.trim() || line.startsWith(";")) {
    return null;
  }

  const columns = line.split("\t");

  if (columns.length < 3) {
    return null;
  }

  const unicode = columns[0];
  const char = columns[1];
  const ids = columns[2];

  if (!unicode.startsWith("U+")) {
    return null;
  }

  return {
    unicode,
    char,
    ids,
  };
}

function parseIds(idsRecord: IdsRecord): KanjiPartsRecord | null {
  const { unicode, char, ids } = idsRecord;

  if (!ids.startsWith("⿰")) {
    return null;
  }

  const parts = Array.from(ids.slice(1));

  if (parts.length !== 2) {
    return null;
  }

  const [left, right] = parts;

  return {
    unicode,
    char,
    kanjiParts: {
      left,
      right,
    },
  };
}

const texts = await Promise.all(
  inputPaths.map((path) => readFile(path, "utf-8")),
);

const records = texts
  .join("\n")
  .split(/\r?\n/)
  .map(parseLine)
  .filter((record): record is IdsRecord => record !== null)
  .map(parseIds)
  .filter((record): record is KanjiPartsRecord => record !== null);

const map = Object.fromEntries(
  records.map((record) => [
    record.char,
    {
      unicode: record.unicode,
      kanjiParts: record.kanjiParts,
    },
  ]),
);

await mkdir("public/data", { recursive: true });
await writeFile(outputPath, JSON.stringify(map, null, 2), "utf-8");

console.log(`Wrote ${records.length} records to ${outputPath}`);
