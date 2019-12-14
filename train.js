const _ = require('lodash')
const fs = require('fs')
const tf = require('@tensorflow/tfjs-node')

const {
    PLACE_CARD,
    REMOVE_CARDS,
    GAME_OVER,
    WINNER,

    BOARD_MAP,

    createInitialState,
    playTurn,
    getAllValidMoves,
    isFaceCard,
    getCardValue,
    playGame
} = require('./src/game')

const gameLogs = JSON.parse(fs.readFileSync('./random-player-game-logs.json', 'utf-8'))

const games = gameLogs.win

// tf.util.shuffle(games)

const valueToCard = v => {
    let value = `${v}`
    if (v === 1) {
        value = 'A'
    }
    if (v === 11) {
        value = 'J'
    }
    if (v === 12) {
        value = 'Q'
    }
    if (v === 13) {
        value = 'K'
    }
    return {value}
}

// [...board, card, ...remaining]
const getInputVector = (state, action) => {
    const remaining = _.countBy(state.deck, 'value')
    return [
        ..._.map(state.board, getCardValue),
        getCardValue(_.last(state.deck)),
        remaining[5],
        remaining[6],
        remaining[7],
        remaining[8],
        remaining[9],
        remaining[10]
    ]
}
// [blank, J, Q, K]
const getOutputVector = action => [
    [5, 6, 9, 10].includes(action.index) ? 1 : 0,
    BOARD_MAP.J.includes(action.index) ? 1 : 0,
    BOARD_MAP.Q.includes(action.index) ? 1 : 0,
    BOARD_MAP.K.includes(action.index) ? 1 : 0,
]

const gameToData = game => {
    const inputs = []
    const outputs = []
    let state = createInitialState({
        deck: _.map(game.deck, valueToCard)
    })
    game.actions.forEach(action => {
        if (action.type === PLACE_CARD) {
            inputs.push(getInputVector(state, action))
            outputs.push(getOutputVector(action))
        }
        state = playTurn(state, action)
    })
    return {
        inputs,
        outputs
    }
}
const gamesData = _.map(games, gameToData)
const inputs = _.flatMap(gamesData, 'inputs')
const outputs = _.flatMap(gamesData, 'outputs')

const trainingData = tf.tensor2d(inputs)
const outputData = tf.tensor2d(outputs)
const testingData = tf.tensor2d(_.take(inputs, 5))

debugger

// build neural network
const model = tf.sequential()

model.add(tf.layers.dense({
    inputShape: [inputs[0].length],
    activation: "sigmoid",
    units: 180,
}))
model.add(tf.layers.dense({
    inputShape: [180],
    activation: "sigmoid",
    units: 60,
}))
model.add(tf.layers.dense({
    inputShape: [60],
    activation: "sigmoid",
    units: 16,
}))
model.add(tf.layers.dense({
    activation: "sigmoid",
    units: outputs[0].length,
}))
model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.adam(.06),
})
// train/fit our network
const startTime = Date.now()
model.fit(trainingData, outputData, {epochs: 100})
    .then((history) => {
        debugger
        // console.log(history, Date.now() - startTime)
        model.predict(testingData).print()
    })
// test network