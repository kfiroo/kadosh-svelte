<script>
    import _ from 'lodash'

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

	import { quintOut } from 'svelte/easing'
    import { crossfade } from 'svelte/transition'

    const [send, receive] = crossfade({
        duration: d => Math.sqrt(d * 200),

        fallback(node, params) {
            const style = getComputedStyle(node)
            const transform = style.transform === 'none' ? '' : style.transform

            return {
                duration: 600,
                easing: quintOut,
                css: t => `
                    transform: ${transform} scale(${t})
                    opacity: ${t}
                `
            }
        }
    })

	const cardWidth = 69
    const cardHeight = 94

    let state = createInitialState()

    function playTurn2() {
	    if (state.phase === GAME_OVER || state.phase === WINNER) {
	        state = createInitialState()
	        return
	    }
	    const moves = getAllValidMoves(state)
        const action = moves[_.random(moves.length - 1)]
        state = playTurn(state, action)
    }

    function cardValue(card) {
        if (card.value === 'A') {
            return 1
        }
        if (card.value === 'J') {
            return 11
        }
        if (card.value === 'Q') {
            return 12
        }
        if (card.value === 'K') {
            return 13
        }
        return parseInt(card.value, 10)
    }

    function calcBgPosition(c) {
        if (!c) {
            return ''
        }
        const offsets = { "c": 0, "d": 1, "h": 2, "s": 3 }
        const suit = c.suit.charAt(0).toLowerCase()
        const rank = cardValue(c)

        return `${-rank * cardWidth}px ${-offsets[suit] * cardHeight}px`
    }

    const key = (card, i) => card ? [card.suit, card.value].join('_') : i

	$: nextCard = state.phase !== REMOVE_CARDS ? state.deck[state.deck.length - 1] : null
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
	.empty {
	    background-color: green;
	}
	.card-block {
	    width: 69px;
	    height: 94px;
	}
	.next-card {
        margin: 50px auto;
	}
	.card {
        background-image: url("http://einaregilsson.github.io/cards.js/img/cards.png");
        position: absolute;
        cursor:pointer;
        width: 69px;
        height: 94px;
        transform:
            translateX(calc(var(--card-x)))
            translateY(calc(var(--card-y)));
    }
</style>

<h1>Play Kadosh! {state.phase}</h1>

<div class="grid">
    {#each state.board as card, i (key(card, i))}
    <div class="card-block">
        <div class="empty card-block"></div>
    </div>
    {/each}
</div>

<div class="card-block next-card" style="--card-x: 0; --card-y: 0;" on:click={playTurn2}>
    {#each state.deck as card, i}
    <div
        class="{card ? 'card' : ''}"
        style="
            background-position: {state.phase !== REMOVE_CARDS ? calcBgPosition(card) : ''};
            --card-x: {card.x}px;
            --card-y: {card.y}px;">
    </div>
    {/each}
</div>