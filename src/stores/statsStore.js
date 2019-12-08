import { user } from './authStore'
import { writable, get, derived } from 'svelte/store'
import { stats } from '../firebase/stats'

import {orderBy} from 'lodash-es'

const SORT_BY = 'gamesWon'

const statsStore = writable(null)

const handleFirstData = (snapshot) => {
	const data = snapshot.docs.map((doc) => doc.data())
	statsStore.set(data)
}

const handleDocChanges = (snapshot) => {
	const currentData = [...get(statsStore)]
	snapshot.docChanges().forEach(function({ doc, oldIndex, newIndex, type }) {
		if (type === 'added') {
			currentData.splice(newIndex, 0, doc.data())
		} else if (type === 'modified') {
			if (oldIndex === newIndex) {
				currentData[newIndex] = doc.data()
			} else {
				currentData.splice(oldIndex, 1)
				currentData.splice(newIndex, doc.data())
			}
		}
	})
	statsStore.set(currentData)
}

stats.onSnapshot((snapshot) => {
	const entries = get(statsStore)
	if (!entries) {
		handleFirstData(snapshot)
	} else {
		handleDocChanges(snapshot)
	}
})

const sortedStats = derived(statsStore, ($stats) => orderBy($stats, ['gamesWon'], ['desc']))

export { sortedStats as stats }
