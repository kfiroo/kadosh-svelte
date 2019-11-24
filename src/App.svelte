<script>
    import _ from 'lodash'
    import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

    import Card from './Card.svelte'

	import {
	    PLACE_CARD,
        REMOVE_CARDS,
        GAME_OVER,
        WINNER,

        createInitialState,
        playTurn,
        getAllValidMoves,
        isFaceCard,
        playGame
	} from './game'

    let state = createInitialState()

    function startNewGame() {
        state = createInitialState()
    }

    function playTurn2() {
	    if (state.phase === GAME_OVER || state.phase === WINNER) {
	        state = createInitialState()
	        return
	    }
	    const moves = getAllValidMoves(state)
        const action = moves[_.random(moves.length - 1)]
        state = playTurn(state, action)
    }

	$: nextCard = state.deck[state.deck.length - 1]
</script>

<style>
    h1 {
        text-align: center;
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
	}
	.next-card {
        margin: 50px auto;
        cursor:pointer;
	}
	.card {
        width: 69px;
        height: 94px;
    }
    .game-over {
        cursor:pointer;
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        object-fit: none;
    }
</style>

<h1>Play Kadosh! {state.phase}</h1>

<div class="grid">
    {#each state.board as card}
    <Card {card} showCard={true}></Card>
    {/each}
</div>

<div class="card next-card" on:click={playTurn2}>
    <Card card={nextCard} showCard={state.phase !== REMOVE_CARDS}></Card>
</div>

{#if state.phase === GAME_OVER}
<img class="game-over"
    src="https://i.pinimg.com/originals/8e/81/58/8e81587e8580109067e093533b0495ec.jpg"
    in:scale
    out:fly="{{duration: 1000, x: 0, y: -1000, easing: quintOut}}"
    on:click={startNewGame}
/>
{/if}

{#if state.phase === WINNER}
<img class="winner"
    src="https://media-cdn.tripadvisor.com/media/photo-s/0f/e0/d3/62/tucan-del-minizoologico.jpg"
    in:scale
    out:fly="{{duration: 1000, x: 0, y: -1000, easing: quintOut}}"
    on:click={startNewGame}
/>
{/if}