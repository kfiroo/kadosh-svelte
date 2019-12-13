import {firebase} from '@firebase/app';
import '@firebase/analytics'
import '@firebase/firestore'
import '@firebase/auth'
import "firebase/performance";

import firebaseConfig from './firebaseConfig.json'

firebase.initializeApp(firebaseConfig)
firebase.performance();

export {firebase}
export const auth = firebase.auth()
export const analytics = firebase.analytics()
export const db = firebase.firestore()
