<script lang="ts">
  import { fade } from "svelte/transition";

  import { findShortestPath } from "./lib/findShortestPath";
  import {
    loadMap,
    separateKanji,
    separatedToKanji,
    hasLeft,
    hasRight,
  } from "./lib/kanjiParts";

  const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
  const countChar = (string: string) => {
    return [...segmenter.segment(string)].length;
  };
  const chiseNoticeUrl = `${import.meta.env.BASE_URL}data/CHISE-IDS-NOTICE.txt`;

  let isInputMode = $state(true);
  let startKanji = $state("始");
  let endKanji = $state("終");
  let result = $state<string[] | null>([]);

  let isValidInput = $derived.by(async () => {
    const start = startKanji;
    const end = endKanji;

    if (countChar(start) !== 1 || countChar(end) !== 1) {
      return false;
    }

    const [startResult, endResult] = await Promise.all([
      separateKanji(start),
      separateKanji(end),
    ]);

    const [startResultRight, endResultLeft] = await Promise.all([
      startResult ? hasLeft(startResult.right) : null,
      endResult ? hasRight(endResult.left) : null,
    ]);

    const [startLeft, endRight] = await Promise.all([
      hasLeft(start),
      hasRight(end),
    ]);

    return (startResultRight || startLeft) && (endResultLeft || endRight);
  });

  async function onclick() {
    const start = startKanji;
    const end = endKanji;

    isInputMode = false;

    const [startParts, endParts] = await Promise.all([
      separateKanji(start),
      separateKanji(end),
    ]);
    const startRight = startParts?.right || start;
    const endLeft = endParts?.left || end;

    const nodes = Object.values(await loadMap()).map(
      ({ kanjiParts }) => kanjiParts,
    );

    const path = findShortestPath(nodes, startRight, endLeft);

    if (!path) {
      result = null;
      return;
    }

    const pairs = path
      .slice(0, -1)
      .map((item, index) => [item, path[index + 1]]);

    const kanjiPath = await Promise.all(
      pairs.map(
        async ([left, right]) => (await separatedToKanji(left, right))!,
      ),
    );

    result = [start, ...kanjiPath, end];
  }

  function goBack() {
    isInputMode = true;

    result = [];
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      goBack();
    }
  }
</script>

<svelte:head>
  <!-- Font Loading -->
  <script>
    (function (d) {
      var config = {
          kitId: "cen2jii",
          scriptTimeout: 3000,
          async: true,
        },
        h = d.documentElement,
        t = setTimeout(function () {
          h.className =
            h.className.replace(/\bwf-loading\b/g, "") + " wf-inactive";
        }, config.scriptTimeout),
        tk = d.createElement("script"),
        f = false,
        s = d.getElementsByTagName("script")[0],
        a;
      h.className += " wf-loading";
      tk.src = "https://use.typekit.net/" + config.kitId + ".js";
      tk.async = true;
      tk.onload = tk.onreadystatechange = function () {
        a = this.readyState;
        if (f || (a && a != "complete" && a != "loaded")) return;
        f = true;
        clearTimeout(t);
        try {
          Typekit.load(config);
        } catch (e) {}
      };
      s.parentNode.insertBefore(tk, s);
    })(document);
  </script>
</svelte:head>

<div class="screen" class:result-active={!isInputMode}>
  {#if isInputMode}
    <main class="input-mode" transition:fade={{ duration: 140 }}>
      <input type="text" bind:value={startKanji} placeholder="漢字一字" />
      <button disabled={!(await isValidInput)} {onclick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
          ><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
            d="M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z"
          /></svg
        >
      </button>
      <input type="text" bind:value={endKanji} placeholder="漢字一字" />
    </main>
  {:else}
    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
    <main
      class="result-mode"
      transition:fade={{ duration: 140 }}
      onclick={goBack}
      {onkeydown}
      role="button"
      tabindex="0"
      aria-label="戻る"
    >
      <div class="kanjis">
        {#if result !== null}
          {#each result as kanji, index (index)}
            <span class="kanji-step">
              {#if index !== 0}
                <svg
                  class="arrow"
                  in:fade|global={{
                    duration: 150,
                    delay: (index * 2 - 1) * 50,
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                >
                  <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                  <path
                    d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"
                  />
                </svg>
              {/if}
              <span
                class="kanji"
                in:fade={{ duration: 150, delay: index * 2 * 50 }}>{kanji}</span
              >
            </span>
            <wbr />
          {/each}
        {:else}
          <span class="kanji" in:fade={{ duration: 150, delay: 0 }}
            >{startKanji}</span
          >
          <div class="fail-icon" in:fade={{ duration: 150, delay: 50 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
              ><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
                d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"
              /></svg
            >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
              ><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
                d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"
              /></svg
            >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
              ><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
                d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"
              /></svg
            >
          </div>
          <span class="kanji" in:fade={{ duration: 150, delay: 100 }}
            >{endKanji}</span
          >
        {/if}
      </div>
    </main>
  {/if}
  <footer class="credits" aria-label="データ出典">
    漢字構造データ:
    <a
      href="https://gitlab.chise.org/CHISE/ids"
      target="_blank"
      rel="noreferrer">CHISE-IDS</a
    >
    <span aria-hidden="true">/</span>
    <a href={chiseNoticeUrl}>GPL-2.0-or-later</a>
  </footer>
</div>

<style>
  .screen {
    position: relative;
    height: 100vh;
    width: 100vw;
    overflow: hidden;

    main {
      height: 100vh;
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;

      position: absolute;
      top: 0;
      left: 0;

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

          background-color: transparent;

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

      &.result-mode {
        box-sizing: border-box;
        padding: 1rem;

        background-color: var(--color-blue-600);

        cursor: pointer;

        .kanjis {
          display: block;
          text-align: center;

          --kanji-gap: 1.5rem;

          width: 100%;
          max-width: 100%;
          min-width: 0;
          font-size: 0;
          line-height: 0;

          .kanji-step {
            display: inline-block;
            margin: 0.5rem 0.75rem;
            vertical-align: middle;
            white-space: nowrap;
          }

          .kanji-step > svg {
            display: inline-block;
            margin-right: var(--kanji-gap);
            vertical-align: middle;

            fill: white;

            width: 2rem;
            height: 2rem;
          }

          .fail-icon {
            display: inline-flex;
            margin: 0.5rem 0.75rem;
            vertical-align: middle;

            height: 2rem;

            svg {
              display: block;

              fill: white;

              width: 2rem;
              height: 2rem;
            }

            * + * {
              margin-left: -0.5rem;
            }
          }

          > .kanji {
            margin: 0.5rem 0.75rem;
          }

          .kanji {
            display: inline-block;
            vertical-align: middle;

            height: 6rem;
            line-height: 6rem;
            font-size: 6rem;

            transform: translateY(-0.05em);

            font-family: "noto-sans-cjk-jp", sans-serif;
            font-weight: 900;
            font-style: normal;

            color: white;
          }
        }
      }
    }

    .credits {
      position: fixed;
      right: 1rem;
      bottom: 0.75rem;
      z-index: 2;

      color: color-mix(in oklch, var(--color-blue-950) 72%, transparent);

      font-size: 0.72rem;
      line-height: 1.5;

      a {
        color: inherit;
        text-underline-offset: 0.18em;
      }
    }

    &.result-active {
      .credits {
        color: color-mix(in oklch, white 82%, transparent);
      }
    }
  }
</style>
