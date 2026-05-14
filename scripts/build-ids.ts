import { mkdir, readFile, writeFile } from "node:fs/promises";

type IdsRecord = {
  unicode: string;
  char: string;
  ids: string;
};

const inputPath = "vendor/chise-ids/IDS-UCS-Basic.txt";
const outputPath = "public/data/ids.json";

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

const text = await readFile(inputPath, "utf-8");

const records = text
  .split(/\r?\n/)
  .map(parseLine)
  .filter((record): record is IdsRecord => record !== null);

const map = Object.fromEntries(
  records.map((record) => [
    record.char,
    {
      unicode: record.unicode,
      ids: record.ids,
    },
  ]),
);

await mkdir("public/data", { recursive: true });
await writeFile(outputPath, JSON.stringify(map, null, 2), "utf-8");

console.log(`Wrote ${records.length} records to ${outputPath}`);
