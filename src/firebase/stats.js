import {db} from './firebase'
import {getCardValue} from '../game'

export const stats = db.collection('stats')
const gameLogs = db.collection('gameLogs')

export const createUserStats = (uid, displayName, photoUrl, gamesPlayed = 0, gamesWon = 0) => {
    stats.add({
        uid,
        displayName,
        photoUrl,
        gamesPlayed,
        gamesWon
    })
}

export const logGame = async (uid, didWin = false, state) => {
    if (!uid) {
        console.error('[stats.logGame] Missing `uid` param')
        return
    }
    const query = await stats.where('uid', '==', uid).get()
    const doc = query.docs[0]
    if (!doc) {
        return
    }

    const currentData = doc.data()
    const docToUpdate = stats.doc(doc.id)
    const updated = {
        ...currentData,
        gamesPlayed: currentData.gamesPlayed + 1,
        ...didWin && {gamesWon: currentData.gamesWon + 1}
    }

    docToUpdate.update(updated)

    const gameLog = {
        deck: state.initialDeck.map(getCardValue),
        actions: state.actions,
        finalPhase: state.phase
    }

    gameLogs.add(gameLog)
}