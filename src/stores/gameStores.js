import {analytics} from '../firebase'
import {writable, derived, get} from 'svelte/store'
import {
    createInitialState,
    playTurn as playTurnInternal,
    getAllValidMoves,
    getCardValue,
    isGameOver,

    PLACE_CARD,
    REMOVE_CARDS,
    GAME_OVER,
    WINNER
} from '../game'
import {find, some} from 'lodash-es'
import {user} from './authStore'
import {logGame as logGameInner} from '../firebase/stats'

export const state = writable(createInitialState())
export const validMoves = derived(state, ($state) => getAllValidMoves($state))
export const deck = derived(state, ({deck}) => deck)
export const nextCard = derived(deck, ($deck) => $deck[$deck.length - 1])
export const phase = derived(state, ({phase}) => phase)

export const selectedPosition = writable(-1)

const logGame = (didWin = false, lastState) => {
    const uid = get(user)
    if (uid) {
        logGameInner(uid, didWin, lastState)
    }
}

phase.subscribe(($phase) => {
    if ($phase !== REMOVE_CARDS && get(selectedPosition) !== -1) {
        selectedPosition.set(-1)
    }
    let gameEndedAt = null;

    if ($phase === GAME_OVER) {
        gameEndedAt = Date.now()
        analytics.logEvent('game_lost')
        logGame(false, get(state))
    } else if ($phase === WINNER) {
        gameEndedAt = Date.now()
        analytics.logEvent('game_won')
        logGame(true, get(state))
    }
    state.set({
        ...get(state),
        gameEndedAt
    })
})

export const lastPlaced = writable(0)

export const playTurn = (action) => {
    if (action.type === PLACE_CARD) {
        lastPlaced.set(action.index)
    }
    state.update(($state) => playTurnInternal($state, action))
}

const placeCard = (position) => {
    const action = find(get(validMoves), ({index}) => {
        return index === position
    })

    if (action) {
        playTurn(action)
    }
}

const tryToRemove = (position) => {
    const {board} = get(state)
    const $selectedPosition = get(selectedPosition)
    selectedPosition.set(-1)

    if ($selectedPosition === position) {
        return
    }

    const card = board[position]
    if (!card) {
        return
    }

    if (getCardValue(card) === 10) {
        playTurn({
            type: REMOVE_CARDS,
            index1: position
        })

        return
    }

    const $validMoves = get(validMoves)
    if ($selectedPosition > -1) {
        const action = find(
            $validMoves,
            ({index1, index2}) =>
                (index1 === position && index2 === $selectedPosition) ||
                (index1 === $selectedPosition && index2 === position)
        )

        if (action) {
            playTurn(action)
            return
        }
    }

    if (some($validMoves, ({index1, index2}) => index1 === position || index2 === position)) {
        selectedPosition.set(position)
    }
}

export const playPosition = (position) => {
    const $phase = get(phase)

    switch ($phase) {
        case PLACE_CARD:
            return placeCard(position)
        case REMOVE_CARDS:
            return tryToRemove(position)
    }
}

export const restartGame = () => {
    if (!isGameOver(get(state))) {
        if (!window.confirm('Are you Harkash?!')) {
            return;
        }
    }

    analytics.logEvent('restart_game')

    // aborting mid-game. if the game had finished, we already logged it
    const currentPhase = get(phase)
    if (currentPhase !== GAME_OVER && currentPhase !== WINNER) {
        logGame(false)
    }

    state.set(createInitialState())
}
