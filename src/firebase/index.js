import {firebase} from '@firebase/app';
import '@firebase/analytics'
import '@firebase/firestore'
import firebaseConfig from './firebaseConfig.json'

firebase.initializeApp(firebaseConfig)

export const analytics = firebase.analytics()
