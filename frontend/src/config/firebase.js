import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDPCcgpWmkPOfumJ9H3EzbUJiOVff7fCWU",
  authDomain: "goldguardian-c8002.firebaseapp.com",
  projectId: "goldguardian-c8002",
  storageBucket: "goldguardian-c8002.firebasestorage.app",
  messagingSenderId: "428410467799",
  appId: "1:428410467799:web:49f685e5a62acf24208792",
  measurementId: "G-Q22WBQTD4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


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
