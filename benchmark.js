const _ = require('lodash')
const {
    WINNER,
    GAME_OVER,
    getAllValidMoves,
    playGame
} = require('./src/game')

const randomNextAction = state => {
    const moves = getAllValidMoves(state)
    return moves[_.random(moves.length - 1)]
}

const count = {
    [WINNER]: 0,
    [GAME_OVER]: 0
}

const n = 1000
_.times(n, i => {
    count[playGame(randomNextAction).finalState.phase]++
    console.log('Game', i, count[WINNER] / i * 100)
})

console.log()
console.log(`Played ${n} kadosh games`)
console.log(`Won ${count[WINNER]}`)
console.log(`Lost ${count[GAME_OVER]}`)
console.log(`Win rate: ${count[WINNER] / n * 100}%`)