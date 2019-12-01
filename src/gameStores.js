import {writable, derived, get} from 'svelte/store'
import {
    PLACE_CARD,
    REMOVE_CARDS,
    GAME_OVER,
    WINNER,

    createInitialState,
    playTurn as playTurnInternal,
    getAllValidMoves,
    isFaceCard,
    getCardValue,
    playGame
  } from './game'

export const state = writable(createInitialState())
export const validMoves = derived(state, $state => getAllValidMoves($state))
export const deck = derived(state, ({deck}) => deck)
export const nextCard = derived(deck, $deck => $deck[$deck.length - 1])
export const phase = derived(state, ({phase}) => phase)

export const selectedPosition = writable(-1)
phase.subscribe($phase => {
    if ($phase !== REMOVE_CARDS && get(selectedPosition) !== -1) {
        selectedPosition.set(-1)
    }
})

export const playTurn = action => {
    state.update($state => playTurnInternal(get(state), action))
}

export const restartGame = () => {
    state.set(createInitialState())
}
