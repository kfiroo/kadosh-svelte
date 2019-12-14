const _ = require('lodash')
const fs = require('fs')
const {
    WINNER,
    GAME_OVER,
    getAllValidMoves,
    playGame,
    getCardValue
} = require('./src/game')

const randomNextAction = state => {
    const moves = getAllValidMoves(state)
    return moves[_.random(moves.length - 1)]
}

const makeGameLog = result => ({
    deck: _.map(result.initialState.deck, getCardValue),
    actions: result.actions,
    finalPhase: result.finalState.phase
})
const MAX = 10
const games = {
    win: [],
    lose: []
}
let i = 0
while (games.win.length < MAX || games.lose.length < MAX) {
    i++
    const result = playGame(randomNextAction)
    if (result.finalState.phase === WINNER && games.win.length < MAX) {
        games.win.push(makeGameLog(result))
    }
    if (result.finalState.phase === GAME_OVER && games.lose.length < MAX) {
        games.lose.push(makeGameLog(result))
    }
}

console.log(`played ${i} games`)
fs.writeFileSync('random-player-game-logs.json', JSON.stringify(games, null, 4))