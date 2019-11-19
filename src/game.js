const _ = require('lodash')

const SUITES = ['spades', 'diamonds', 'clubs', 'hearts']
const CARDS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const PLACE_CARD = 'PLACE_CARD'
const REMOVE_CARDS = 'REMOVE_CARDS'
const GAME_OVER = 'GAME_OVER'
const WINNER = 'WINNER'

function createDeck() {
    return _.flatMap(SUITES, suit =>
        CARDS.map(value => ({
            suit,
            value
        }))
    )
}

function shuffleDeck(deck, n = 1000) {
    for (let i = 0; i < n; i++) {
        const location1 = Math.floor((Math.random() * deck.length))
        const location2 = Math.floor((Math.random() * deck.length))
        const tmp = deck[location1]
        deck[location1] = deck[location2]
        deck[location2] = tmp
    }
    return deck
}

const hasValidMoves = state => getAllValidMoves(state).length > 0
const isBoardFull = state => _.every(state.board)
const isFaceCard = card => card && ['J', 'Q', 'K'].includes(card.value)
const getCardValue = card => card === null ? 0 : card.value === 'A' ? 1 : parseInt(card.value, 10)
const gameInProgress = state => [PLACE_CARD, REMOVE_CARDS].includes(state.phase)
const isWinner = state => _.every(BOARD_MAP, (a, c) =>
    _.every(a, i =>
        state.board[i] && state.board[i].value === c
    )
)

const BOARD_MAP = {
    J: [4, 7, 8, 11],
    Q: [1, 2, 13, 14],
    K: [0, 3, 12, 15]
}

// 0  1  2  3
// 4  5  6  7
// 8  9  10 11
// 12 13 14 15

// K Q Q K
// J * * J
// J * * J
// K Q Q K

function getNextPhase(state) {
    if (state.phase === GAME_OVER) {
        return GAME_OVER
    }
    if (state.phase === WINNER) {
        return WINNER
    }
    if (state.phase === PLACE_CARD) {
        if (isWinner(state)) {
            return WINNER
        }
        if (isBoardFull(state)) {
            return REMOVE_CARDS
        }
        if (hasValidMoves(state)) {
            return PLACE_CARD
        }
        return GAME_OVER
    }
    if (state.phase === REMOVE_CARDS) {
        if (hasValidMoves(state)) {
            return REMOVE_CARDS
        }
        if (isBoardFull(state)) {
            return GAME_OVER
        }
        return PLACE_CARD
    }
}

function calcNextPhase(state) {
    const prevPhase = state.phase
    state.phase = getNextPhase(state)
    if (state.phase !== prevPhase) {
        state.phase = getNextPhase(state)
    }
}

function removeCards(state, action) {
    const card1 = state.board[action.index1]
    const card2 = state.board[action.index2] || null
    if (!card1) {
        throw new Error('Remove at least 1 card')
    }
    if (isFaceCard(card1) || isFaceCard(card2)) {
        throw new Error('Cannot remove face cards [J / Q / K]')
    }
    if (getCardValue(card1) + getCardValue(card2) !== 10) {
        throw new Error('Sum of cards should be 10')
    }
    if (card1) {
        state.removedCards.push(card1)
        state.board[action.index1] = null
    }
    if (card2) {
        state.removedCards.push(card2)
        state.board[action.index2] = null
    }
}

function placeCard(state, action) {
    if (state.board[action.index] !== null) {
        throw new Error('Place on board already taken')
    }
    state.board[action.index] = state.deck.pop()
    return state
}

// API

function createInitialState({shuffleTimes} = {}) {
    return {
        board: Array(16).fill(null),
        deck: shuffleDeck(createDeck(), shuffleTimes),
        removedCards: [],
        phase: PLACE_CARD
    }
}

function playTurn(state, action) {
    if (state.phase !== action.type) {
        throw new Error('Invalid action')
    }
    const nextState = _.cloneDeep(state)
    switch (action.type) {
        case PLACE_CARD:
            placeCard(nextState, action)
            break
        case REMOVE_CARDS:
            removeCards(nextState, action)
            break
        default:
            throw new Error('Unknown action type')
    }
    calcNextPhase(nextState)
    return nextState
}

function getAllValidMoves(state) {
    if (state.phase === PLACE_CARD) {
        const card = _.last(state.deck)
        if (isFaceCard(card)) {
            return _(BOARD_MAP[card.value])
                .filter(i => state.board[i] === null)
                .map(index => ({
                    type: PLACE_CARD,
                    index
                }))
                .value()
        }
        return _(state.board)
            .map((card, i) => card === null ? i : null)
            .filter(x => x !== null)
            .map(index => ({
                type: PLACE_CARD,
                index
            }))
            .value()
    }
    if (state.phase === REMOVE_CARDS) {
        const moves = []
        for (let i = 0; i < state.board.length; i++) {
            const card1 = state.board[i]
            if (card1 === null || isFaceCard(card1)) {
                continue
            }
            const card1Value = getCardValue(card1)
            if (card1Value === 10) {
                moves.push({
                    type: REMOVE_CARDS,
                    index1: i
                })
                continue
            }
            for (let j = i + 1; j < state.board.length; j++) {
                const card2 = state.board[j];
                if (card2 === null || isFaceCard(card2)) {
                    continue
                }
                const card2Value = getCardValue(card2)
                if (card1Value + card2Value === 10) {
                    moves.push({
                        type: REMOVE_CARDS,
                        index1: i,
                        index2: j
                    })
                }
            }
        }
        return moves
    }
}

function playGame(getNextAction, initialState = createInitialState()) {
    // console.log('*** Initial State ***')
    // console.log(initialState)

    // console.log('')
    // console.log('*** Actions ***')

    const actions = []

    let state = initialState
    while (gameInProgress(state)) {
        const action = getNextAction(state)
        // console.log(action)
        try {
            state = playTurn(state, action)
            actions.push({
                action,
                state: _.cloneDeep(state)
            })
        } catch (e) {
            console.error(e)
        }
    }

    // console.log('')
    // console.log('*** Result ***')
    // console.log(state)

    return {
        initialState,
        actions,
        finalState: state
    }
}

module.exports = {
    PLACE_CARD,
    REMOVE_CARDS,
    GAME_OVER,
    WINNER,

    createInitialState,
    playTurn,
    getAllValidMoves,
    isFaceCard,
    playGame
}