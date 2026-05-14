<script lang="ts">
  import { findShortestPath } from "./lib/findShortestPath";
  import { loadMap, separateKanji, separatedToKanji } from "./lib/kanjiParts";

  (async () => {
    const start = "倍";
    const end = "健";

    const startRight = (await separateKanji(start))!.right;
    const endLeft = (await separateKanji(end))!.left;

    const nodes = Object.values(await loadMap()).map(
      ({ kanjiParts }) => kanjiParts,
    );

    const path = findShortestPath(nodes, startRight, endLeft);

    if (!path) {
      console.log("No path found");
      return;
    }

    const pairs = path
      .slice(0, -1)
      .map((item, index) => [item, path[index + 1]]);

    const result = await Promise.all(
      pairs.map(async ([left, right]) => await separatedToKanji(left, right)),
    );

    console.log([start, ...result, end]);
  })();
</script>
