import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Auth with persistence
export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Cloud Functions
export const functions = getFunctions(app)

// Cloud Function Callables
export const verifyHUID = httpsCallable(functions, 'verifyHUID')
export const calculateGoldPrice = httpsCallable(functions, 'calculateGoldPrice')
export const fraudCheck = httpsCallable(functions, 'fraudCheck')
export const generateComplaint = httpsCallable(functions, 'generateComplaint')
export const submitComplaint = httpsCallable(functions, 'submitComplaint')
export const deleteComplaint = httpsCallable(functions, 'deleteComplaint')
export const getGoldRate = httpsCallable(functions, 'getGoldRate')
export const getUserProfile = httpsCallable(functions, 'getUserProfile')
export const updateUserProfile = httpsCallable(functions, 'updateUserProfile')

export default app
