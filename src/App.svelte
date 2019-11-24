<script>
    import _ from 'lodash'
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

    let mode = 'human'

    $: {
        if (mode) { // reset when mode changes
            state = createInitialState()
        }
    }

    let pendingMoves = null
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
        if (mode === 'human') {
            return
        }

        const action = moves[_.random(moves.length - 1)]
        state = playTurn(state, action)
    }

    $: nextCard = state.deck[state.deck.length - 1]

    const isValid = position => !!_.find(moves, ({index, index1, index2}) =>
        index === position || index1 === position || index2 === position
    )

    const onBoardClick = ({currentTarget}) => {
        if (state.phase === GAME_OVER || state.phase === WINNER) {
	        return
        }
        
        const { target } = event
        const position = parseInt(currentTarget.dataset.position, 10)
        const card = state.board[position]
        if (state.phase === REMOVE_CARDS) {
            if (!card) {
                return
            }

            if (parseInt(card.value, 10) === 10) {
                state = playTurn(state, {
                    type: REMOVE_CARDS,
                    index1: position
                })

                return
            }

            if (selectedPosition > -1) {
                const action = _.find(moves, ({index1, index2}) =>
                    index1 === position && index2 === selectedPosition ||
                    index1 === selectedPosition && index2 === position
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
            const action = _.find(moves, ({index}) => {
                return index === position
            })

            if (action) {
                state = playTurn(state, action)
            }
        }
    }

    const img = new Image()
    img.src = 'https://dok7xy59qfw9h.cloudfront.net/587/070/202/-239996995-1t62joi-8mq5akftktd5se5/original/file.jpg'
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
        position: relative;
	}

    .grid.disabled:after {
        content: '';
        background: url(https://dok7xy59qfw9h.cloudfront.net/587/070/202/-239996995-1t62joi-8mq5akftktd5se5/original/file.jpg);
        position: absolute;
        width: 100%;
        height: 100%;
        background-position: -50px center;
    }

    .playmode-wrapper {
        user-select: none;
        margin: 50px auto;
        text-align: center;
    }

    .playmode-wrapper > label {
        display: inline-block;
    }

	.next-card {
        margin: 50px auto;
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
</style>

<h1>Play Kadosh! {state.phase}</h1>

<div class="grid" class:disabled={state.phase === GAME_OVER}>
    {#each state.board as card, i (i)}
        <div class="card placeholder" 
            class:selected={selectedPosition === i}
            class:invalid={!isValid(i)}
            data-position={i} 
            on:click={onBoardClick}>
            <Card {card} showCard={true} />
        </div>
    {/each}
</div>

<div class="playmode-wrapper">
    Play Mode:
    <label>
        <input type=radio bind:group={mode} value={'human'}>
        Human
    </label>
    <label>
        <input type=radio bind:group={mode} value={'random'}>
        Random Monkey
    </label>
</div>

<div class="card next-card" on:click={playTurn2}>
    <Card card={nextCard} showCard={state.phase === PLACE_CARD}></Card>
</div>