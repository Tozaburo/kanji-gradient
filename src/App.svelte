<script lang="ts">
  import { separateKanji } from "./lib/kanjiParts";

  (async () => {
    console.log(await separateKanji("漢"));
  })();
</script>
