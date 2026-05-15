<script lang="ts">
  import { findShortestPath } from "./lib/findShortestPath";
  import { loadMap, separateKanji, separatedToKanji } from "./lib/kanjiParts";

  let isInputMode = $state(true);
  let startKanji = $state("始");
  let endKanji = $state("終");

  let isValidInput = $derived(
    startKanji.length === 1 &&
      endKanji.length === 1 &&
      separateKanji(startKanji) !== null &&
      separateKanji(endKanji) !== null,
  );

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

{#if isInputMode}
  <main class="input-mode">
    <input type="text" bind:value={startKanji} placeholder="漢字一字" />
    <button
      disabled={!isValidInput}
      onclick={() => console.log("TODO: find path")}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
        ><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
          d="M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z"
        /></svg
      >
    </button>
    <input type="text" bind:value={endKanji} placeholder="漢字一字" />
  </main>
{:else}
  <main class="result-mode"></main>
{/if}

<style>
  main {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;

    &.input-mode {
      flex-direction: column;

      gap: 2rem;

      input {
        display: block;

        color: var(--color-blue-950);

        font-size: 1.5rem;
        width: 7rem;
        padding: 0.25em 0;
        text-align: center;

        outline: none;

        border: none;
        border-bottom: solid 1px var(--color-blue-950);

        transition: border-color 0.2s ease;

        &:focus {
          border-color: var(--color-blue-600);
        }
      }

      button {
        display: flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        border: none;
        border-radius: 100vmax;

        background-color: var(--color-blue-600);

        width: 2rem;
        aspect-ratio: 1;

        transition:
          background-color 0.2s ease,
          transform 0.2s ease;

        &:not([disabled]) {
          &:hover {
            transform: scale(1.05);
          }

          &:active {
            transform: scale(0.95);
          }
        }

        &[disabled] {
          background-color: var(--color-gray-400);
          cursor: not-allowed;
        }

        svg {
          width: 1rem;
          height: 1rem;

          fill: white;
        }
      }
    }
  }
</style>
