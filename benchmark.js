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

_.times(100000, i => {
    count[playGame(randomNextAction).finalState.phase]++
    console.log('Game', i, count[WINNER] / i * 100)
})

console.log(`Played 100,000 games`)
console.log(`Won ${count[WINNER]} games`)
console.log(`Lost ${count[GAME_OVER]} games`)
console.log(`Win rate: ${count[WINNER] / 100000 * 100}%`)