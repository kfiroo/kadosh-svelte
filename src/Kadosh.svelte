<script>
  import {random, find} from "lodash-es";
  import Card from "./components/Card.svelte";
  import Confetti from "./components/Confetti.svelte";
  import QAB from "./components/QuickActionBar.svelte";
  import { fly } from "svelte/transition";

  import * as stores from "./stores/gameStores";
  window.gameStores = stores;

  import {
    PLACE_CARD,
    REMOVE_CARDS,
    GAME_OVER,
    WINNER,
    createInitialState,
    getAllValidMoves,
    isFaceCard,
    getCardValue,
    playGame
  } from "./game";

  import {
    validMoves,
    phase,
    state,
    deck,
    nextCard,
    selectedPosition,
    lastPlaced,
    restartGame,
    playTurn,
    playPosition
  } from "./stores/gameStores";

  function playTurn2() {
    if ($phase === GAME_OVER || $phase === WINNER) {
      return;
    }

    const action = $validMoves[random($validMoves.length - 1)];
    playTurn(action);
  }

  $: deckLengthIndicator =
    $phase === GAME_OVER ? "💀" : $phase === WINNER ? "👑" : $deck.length;

  $: lastPlacedPosition = {
    x: -120 + ($lastPlaced % 4) * 80,
    y: -450 + Math.floor($lastPlaced / 4) * 105
  };

  $: isValid = position => {
    if ($phase === REMOVE_CARDS && $selectedPosition !== -1) {
      return !!find(
        $validMoves,
        ({ index1, index2 }) =>
          (index1 === position && index2 === $selectedPosition) ||
          (index1 === $selectedPosition && index2 === position)
      );
    }
    return !!find(
      $validMoves,
      ({ index, index1, index2 }) =>
        index === position || index1 === position || index2 === position
    );
  };

  const onBoardClick = ({ currentTarget }) => {
    if ($phase === GAME_OVER || $phase === WINNER) {
      return;
    }

    const position = parseInt(currentTarget.dataset.position, 10);
    playPosition(position);
  };

  const tahatSrc =
    "https://dok7xy59qfw9h.cloudfront.net/587/070/202/-239996995-1t62joi-8mq5akftktd5se5/original/file.jpg";
  const preTahat = new Image();
  preTahat.src = tahatSrc;
</script>

<style>
  * {
    user-select: none;
  }

  :global(html, body) {
    margin: 0;
    padding: 0;
    font-family: "Raleway", sans-serif;
  }

  :global(body) {
    background: radial-gradient(transparent 40%, black 170%), darkgreen;
    padding: 10px 0;
    box-sizing: border-box;
    color: #ddd;
  }

  @keyframes tahat {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  .grid {
    display: grid;
    grid-template-rows: repeat(4, 94px);
    grid-template-columns: repeat(4, 69px);
    grid-gap: 10px;
    padding: 10px;
    width: 306px;
    height: 406px;
    margin: auto;
    position: relative;
    border: 2px solid #008000;
    box-shadow: 0px 0px 0px 1px black;
    border-radius: 12px;
  }

  .grid.disabled > * {
    filter: grayscale(100%);
  }

  .grid.disabled:after {
    content: "";
    background: url(https://dok7xy59qfw9h.cloudfront.net/587/070/202/-239996995-1t62joi-8mq5akftktd5se5/original/file.jpg);
    position: absolute;
    width: 100%;
    height: 100%;
    background-position: -50px center;
    animation: tahat;
    animation-duration: 1942ms;
    animation-iteration-count: infinite;
  }

  .next-wrapper {
    margin-top: 30px;
    display: grid;
    width: 100%;
    grid-template-columns: 1fr min-content 1fr;
    grid-template-rows: 94px;
    align-items: center;
    grid-gap: 30px;
  }

  .next-card {
    cursor: pointer;
    grid-area: 1/2/2/3;
  }

  .next-card.disabled {
    cursor: default;
    filter: grayscale(100%);
  }

  .next-wrapper > span {
    grid-area: 1/3/2/4;
    justify-self: start;
    font-size: 1.4em;
  }

  .restart {
    cursor: pointer;
    grid-area: 1/1/2/2;
    justify-self: end;
    width: 1em;
    color: red;
    font-size: 42px;
    font-weight: bold;
    text-shadow: 5px 5px 0px rgba(0, 0, 0, 0.2);
    -webkit-transition: -webkit-transform 0.8s ease-in-out;
    transition: transform 0.8s ease-in-out;
  }
  .restart:hover {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }

  .card {
    width: 69px;
    height: 94px;
    background-color: green;
    border-radius: 8px;
  }

  .placeholder {
    cursor: pointer;
    border-radius: 2px;
  }

  .valid {
    box-shadow: 0px 0px 2px 4px #99d0ee;
  }

  @media (hover: hover) {
    .placeholder:hover {
      box-shadow: 0px 0px 2px 4px #20b825;
    }

    .placeholder.invalid:hover {
      box-shadow: 0px 0px 2px 4px #b82020;
    }
  }

  .selected {
    box-shadow: 0px 0px 2px 4px #eee251 !important;
  }
</style>

<QAB />

<div
  class="grid"
  class:disabled={$phase === GAME_OVER}
  class:winner={$phase === WINNER}>
  {#each $state.board as card, i (i)}
    <div
      class="card placeholder"
      class:selected={$selectedPosition === i}
      class:invalid={!isValid(i)}
      class:valid={isValid(i)}
      data-position={i}
      on:click={onBoardClick}>
      {#if card}
        <div out:fly>
          <Card {card} showCard={true} />
        </div>
      {/if}
    </div>
  {/each}
</div>

<div class="next-wrapper">
  <div class="rtl restart" on:click={restartGame}>⟳</div>
  {#each [$nextCard] as card (card ? `${card.value}_${card.suit}` : '')}
    <div
      class="card next-card"
      class:disabled={$phase === GAME_OVER}
      on:click={playTurn2}
      out:fly={$deck.length === 52 ? {} : lastPlacedPosition}>
      <Card
        card={$nextCard}
        showCard={$phase !== REMOVE_CARDS && $phase !== WINNER} />
    </div>
  {/each}
  <span>{deckLengthIndicator}</span>
</div>

{#if $phase === WINNER}
  <Confetti amount={200} />
{/if}
