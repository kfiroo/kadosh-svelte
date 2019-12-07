import { auth } from '../firebase'
import { writable } from 'svelte/store'

export const user = writable(null)

auth.onAuthStateChanged((_user) => {
	if (_user) {
		user.set(_user.uid)
    }
})

user.subscribe($user => {
    console.log('User:', $user)
})

export { login } from '../firebase/auth'
