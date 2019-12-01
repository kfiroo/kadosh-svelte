<script>
  import _ from 'lodash'
  import Card from './Card.svelte'
  import Rules from './Rules.svelte'
  import Stats from './Stats.svelte'
  import Confetti from './Confetti.svelte'

  import { fly } from 'svelte/transition'

  import {
    PLACE_CARD,
    REMOVE_CARDS,
    GAME_OVER,
    WINNER,

    createInitialState,
    playTurn,
    getAllValidMoves,
    isFaceCard,
    getCardValue,
    playGame
  } from './game'

  let selectedPosition = -1

  let state = createInitialState()
  let moves
  $: {
    moves = getAllValidMoves(state)
    selectedPosition = -1
  }
  function restartGame() {
      state = createInitialState()
  }
  function playTurn2() {
    if (state.phase === GAME_OVER || state.phase === WINNER) {
      return
    }

    const action = moves[_.random(moves.length - 1)]
    lastPlayed = action.index || 0
    state = playTurn(state, action)
  }

  $: nextCard = state.deck[state.deck.length - 1]
  let lastPlayed = 0
  $: lastPlacedPosition = {
    x: -120 + (lastPlayed % 4) * 80,
    y: -450 + Math.floor(lastPlayed / 4) * 105
  }

  $: isValid = position => {
    if (state.phase === REMOVE_CARDS && selectedPosition !== -1) {
        return !!_.find(moves, ({ index1, index2 }) =>
            (index1 === position && index2 === selectedPosition) ||
            (index1 === selectedPosition && index2 === position)
        )
    }
    return !!_.find(moves, ({ index, index1, index2 }) =>
        index === position || index1 === position || index2 === position
    )
  }

  const onBoardClick = ({ currentTarget }) => {
    if (state.phase === GAME_OVER || state.phase === WINNER) {
      return
    }

    const position = parseInt(currentTarget.dataset.position, 10)
    const card = state.board[position]
    if (state.phase === REMOVE_CARDS) {
      if (!card) {
        return
      }

      if (getCardValue(card) === 10) {
        state = playTurn(state, {
          type: REMOVE_CARDS,
          index1: position
        })

        return
      }

      if (selectedPosition > -1) {
        const action = _.find(
          moves,
          ({ index1, index2 }) =>
            (index1 === position && index2 === selectedPosition) ||
            (index1 === selectedPosition && index2 === position)
        )

        if (action) {
          state = playTurn(state, action)
          return
        } else {
          selectedPosition = -1
        }
      }

      if (isValid(position)) {
        selectedPosition = position
      }
    } else if (state.phase === PLACE_CARD) {
      const action = _.find(moves, ({ index }) => {
        return index === position
      })

      if (action) {
        lastPlayed = position
        state = playTurn(state, action)
      }
    }
  }

  let showRulesLang = null
  const showRules = lang => showRulesLang = lang
  const hideRules = () => showRulesLang = null

  const tahatSrc = 'https://dok7xy59qfw9h.cloudfront.net/587/070/202/-239996995-1t62joi-8mq5akftktd5se5/original/file.jpg'
  const preTahat = new Image()
  preTahat.src = tahatSrc
</script>

<style>
  * {
    user-select: none;
  }

  :global(html, body) {
    margin: 0;
    padding: 0;
  }

  :global(body) {
      background: radial-gradient(transparent 40%, black 170%), darkgreen;
      padding-top: 10px;

      color: #ddd;
    }
  h1 {
    text-align: center;
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
    border: 4px ridge #008000;
    border-radius: 12px;
  }

  .grid.disabled:after {
    content: '';
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
    text-shadow: 5px 5px 0px rgba(0,0,0,0.2);
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

  .placeholder:hover {
    box-shadow: 0px 0px 2px 4px #20b825;
  }

  .placeholder.invalid:hover {
    box-shadow: 0px 0px 2px 4px #b82020;
  }

  .selected {
    box-shadow: 0px 0px 2px 4px #eee251;
  }

  .buttons {
      display: flex;
      justify-content: center;
  }

  .rtl {
    direction: rtl;
  }

</style>

<div class="grid"
    class:disabled={state.phase === GAME_OVER}
    class:winner={state.phase === WINNER}>
{#each state.board as card, i (i)}
  <div
    class="card placeholder"
    class:selected={selectedPosition === i}
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
    {#each [nextCard] as card (`${card.value}_${card.suit}`)}
      <div class="card next-card" 
          on:click={playTurn2} 
          out:fly={state.deck.length === 52 ? {} : lastPlacedPosition}>
          <Card card={nextCard} showCard={state.phase !== REMOVE_CARDS} />
      </div>
    {/each}
    <span>{state.phase !== GAME_OVER ? state.deck.length : '💀'}</span>
</div>

<Stats deck={state.deck} />

<div class="buttons">
    <button class="rtl" on:click={() => showRules('he')}>איך משחקים? 🤔</button>
</div>

<Rules lang={showRulesLang} on:close={hideRules} />

{#if state.phase === WINNER}
    <Confetti amount={200}/>
{/if}
