const kanjiVariantGroups = [
  ["人", "亻"],
  ["⻏", "⻖"],
  ["牛", "牜"],
  ["王", "⺩"],
  ["足", "⻊"],
  ["食", "飠", "𩙿", "⻝", "⾷", "饣"],
  ["言", "訁", "讠"],
  ["金", "釒", "钅"],
  ["門", "⾨", "门", "⻔"],
  ["黒", "黑"],
  ["歯", "齒"],
  ["黄", "黃"],
] as const;

const variantToCanonical = new Map<string, string>();

for (const group of kanjiVariantGroups) {
  const canonical = group[0];

  for (const char of group) {
    variantToCanonical.set(char, canonical);
  }
}

export function normalizeKanjiVariants(text: string): string {
  let result = "";

  for (const char of text.normalize("NFKC")) {
    result += variantToCanonical.get(char) ?? char;
  }

  return result;
}
