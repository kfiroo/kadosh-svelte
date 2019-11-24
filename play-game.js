const _ = require('lodash')
const fs = require('fs')
const {
    WINNER,
    getAllValidMoves,
    playGame
} = require('./src/game')


const randomNextAction = state => {
    const moves = getAllValidMoves(state)
    return moves[_.random(moves.length - 1)]
}

let i = 0
let result = playGame(randomNextAction)
while (result.finalState.phase !== WINNER) {
    console.log('Game', i++)
    result = playGame(randomNextAction)
    console.log('Cards left: ', result.finalState.deck.length)
}

console.log('result:', JSON.stringify(result.finalState))
fs.writeFileSync('log.json', JSON.stringify(result))