<script>
  import _ from 'lodash'
  import Card from './Card.svelte'
  import Rules from './Rules.svelte'

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
  function playTurn2() {
    if (state.phase === GAME_OVER || state.phase === WINNER) {
      state = createInitialState()
      return
    }

    const action = moves[_.random(moves.length - 1)]
    state = playTurn(state, action)
  }

  $: nextCard = state.deck[state.deck.length - 1]

  const isValid = position =>
    !!_.find(
      moves,
      ({ index, index1, index2 }) =>
        index === position || index1 === position || index2 === position
    )

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
        state = playTurn(state, action)
      }
    }
  }

  let showRulesLang = null
  const showRules = lang => showRulesLang = lang
  const hideRules = () => showRulesLang = null

  $: remaining = _.reduce(
    state.deck,
    (acc, card) => {
      if (isFaceCard(card)) {
        acc[card.value]++
      }
      return acc
    },
    { J: 0, Q: 0, K: 0 }
  )

  const tahatSrc = 'https://dok7xy59qfw9h.cloudfront.net/587/070/202/-239996995-1t62joi-8mq5akftktd5se5/original/file.jpg'
  const preTahat = new Image()
  preTahat.src = tahatSrc

  let showStatistics = true
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
      background: darkgreen;
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
    background-color: darkgreen;
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
    grid-template-columns: 1fr 69px 1fr;
    grid-template-rows: 94px;
    align-items: center;
    grid-gap: 10px;
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
  .card {
    width: 69px;
    height: 94px;
  }

  .placeholder {
    cursor: pointer;
    border-radius: 2px;
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

  .cards-left {
    display: grid;
    width: 263px;
    margin: 20px auto;
    grid-template-rows: 66px;
    grid-template-columns: 20px repeat(3, 49px 20px);
    grid-gap: 6px;
  }

  .cards-left > :global(.card) {
    transform: scale(0.7);
    transform-origin: 0 0;
  }

  .cards-left > label {
    align-self: center;
    justify-self: start;
  }

  .buttons {
      display: flex;
      justify-content: center;
  }

  .rules-button {
    direction: rtl;
  }

</style>

<div class="wrapper">
  <div class="grid" class:disabled={state.phase === GAME_OVER}>
    {#each state.board as card, i (i)}
      <div
        class="card placeholder"
        class:selected={selectedPosition === i}
        class:invalid={!isValid(i)}
        data-position={i}
        on:click={onBoardClick}>
        <Card {card} showCard={true} />
      </div>
    {/each}
  </div>

  <div class="next-wrapper">
    <div class="card next-card" on:click={playTurn2}>
        <Card card={nextCard} showCard={state.phase !== REMOVE_CARDS} />
    </div>
    <span>{state.phase !== GAME_OVER ? state.deck.length : '💀'}</span>
  </div>

</div>

<div class="cards-left">
    <span />
    <Card showCard={true} card={{ suit: 'clubs', value: 'J' }} />
    <label>{remaining.J}</label>
    <Card showCard={true} card={{ suit: 'hearts', value: 'Q' }} />
    <label>{remaining.Q}</label>
    <Card showCard={true} card={{ suit: 'diamonds', value: 'K' }} />
    <label>{remaining.K}</label>
</div>

<div class="buttons">
    <button class="rules-button" on:click={() => showRules('he')}>איך משחקים? 🤔</button>
</div>

<Rules lang={showRulesLang} on:close={hideRules} />
