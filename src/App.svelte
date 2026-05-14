<script lang="ts">
  import { findShortestPath } from "./lib/findShortestPath";
  import { loadMap, separateKanji } from "./lib/kanjiParts";

  (async () => {
    const start = "倍";
    const end = "健";

    const startRight = (await separateKanji(start))!.right;
    const endLeft = (await separateKanji(end))!.left;

    const nodes = Object.values(await loadMap()).map(
      ({ kanjiParts }) => kanjiParts,
    );

    console.log({ nodes, startRight, endLeft });

    const result = findShortestPath(nodes, startRight, endLeft);

    console.log(result);
  })();
</script>
