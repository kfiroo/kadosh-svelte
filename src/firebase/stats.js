import { db } from './firebase'

export const stats = db.collection('stats')

export const createUserStats = (uid, displayName, photoUrl, gamesPlayed = 0, gamesWon = 0) => {
	stats.add({
		uid,
		displayName,
		photoUrl,
		gamesPlayed,
		gamesWon
	})
}

export const logGame = async (uid, didWin = false) => {
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
}