import { firebase, auth } from './firebase'
import { createUserStats } from './stats'

const provider = new firebase.auth.GoogleAuthProvider()

window.logout = () => auth.signOut()

export const login = () => {
	auth.signInWithPopup(provider)
		.then(function({ additionalUserInfo: { isNewUser }, user: _user }) {
			console.log('Login:', _user)
			if (isNewUser) {
				const { uid, displayName, photoURL } = _user
				createUserStats(uid, displayName, photoURL)
			}
		})
		.catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code
			var errorMessage = error.message
			// The email of the user's account used.
			var email = error.email
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential
			// ...
		})
}
