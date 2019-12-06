import {analytics} from './firebase'

import { writable, derived, get } from 'svelte/store'
import {
	createInitialState,
	playTurn as playTurnInternal,
	getAllValidMoves,
	getCardValue,

    PLACE_CARD,
	REMOVE_CARDS,
    GAME_OVER,
    WINNER
} from './game'
import _ from 'lodash'

export const state = writable(createInitialState())
export const validMoves = derived(state, ($state) => getAllValidMoves($state))
export const deck = derived(state, ({ deck }) => deck)
export const nextCard = derived(deck, ($deck) => $deck[$deck.length - 1])
export const phase = derived(state, ({ phase }) => phase)

export const selectedPosition = writable(-1)
phase.subscribe(($phase) => {
	if ($phase !== REMOVE_CARDS && get(selectedPosition) !== -1) {
		selectedPosition.set(-1)
    }
    
    if ($phase === GAME_OVER) {
        analytics.logEvent('game_lost')
    } else if ($phase === WINNER) {
        analytics.logEvent('game_won')
    }
})

export const lastPlaced = writable(0)

export const playTurn = (action) => {
    if (action.type === PLACE_CARD) {
		lastPlaced.set(action.index)
	}
	state.update(($state) => playTurnInternal($state, action))
}

const placeCard = (position) => {
	const action = _.find(get(validMoves), ({ index }) => {
		return index === position
	})

	if (action) {
		playTurn(action)
	}
}

const tryToRemove = (position) => {
    const { board } = get(state)
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
		const action = _.find(
			$validMoves,
			({ index1, index2 }) =>
				(index1 === position && index2 === $selectedPosition) ||
				(index1 === $selectedPosition && index2 === position)
		)

		if (action) {
			playTurn(action)
			return
		}
	}

	if (_.some($validMoves, ({ index1, index2 }) => index1 === position || index2 === position)) {
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
    analytics.logEvent('restart_game')
	state.set(createInitialState())
}
