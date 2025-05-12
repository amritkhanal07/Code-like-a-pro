// Firebase configuration and initialization
import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import type { Post } from "./posts"

// Firebase configuration - users will replace these with their own
const DEFAULT_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
}

// Track initialization state
let isInitialized = false
let currentUser: User | null = null

// Get user's Firebase config from localStorage
export const getFirebaseConfig = () => {
  if (typeof window === "undefined") {
    return DEFAULT_CONFIG
  }

  try {
    const storedConfig = localStorage.getItem("firebase_config")
    if (storedConfig) {
      return JSON.parse(storedConfig)
    }
  } catch (error) {
    console.error("Error reading Firebase config from localStorage:", error)
  }

  return DEFAULT_CONFIG
}

// Save user's Firebase config to localStorage
export const saveFirebaseConfig = (config: typeof DEFAULT_CONFIG) => {
  if (typeof window === "undefined") return false

  try {
    localStorage.setItem("firebase_config", JSON.stringify(config))
    return true
  } catch (error) {
    console.error("Error saving Firebase config to localStorage:", error)
    return false
  }
}

// Check if Firebase config is set up
export const isFirebaseConfigured = (): boolean => {
  const config = getFirebaseConfig()
  return !!config.apiKey && !!config.projectId
}

// Initialize Firebase
export const initializeFirebase = () => {
  if (isInitialized) return { app: app, auth: auth, db: db }

  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured")
  }

  const config = getFirebaseConfig()
  const app = initializeApp(config)
  const auth = getAuth(app)
  const db = getFirestore(app)

  isInitialized = true
  return { app, auth, db }
}

// Get Firebase instances (initializing if needed)
export const getFirebase = () => {
  try {
    return initializeFirebase()
  } catch (error) {
    console.error("Failed to initialize Firebase:", error)
    return { app: null, auth: null, db: null }
  }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (!isInitialized) return false
  return !!currentUser
}

// Get current user
export const getCurrentUser = (): User | null => {
  return currentUser
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<boolean> => {
  try {
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase is not configured")
    }

    const { auth } = getFirebase()
    if (!auth) throw new Error("Auth not initialized")

    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    currentUser = result.user
    return true
  } catch (error) {
    console.error("Sign in error:", error)
    return false
  }
}

// Sign out
export const signOut = async (): Promise<boolean> => {
  try {
    const { auth } = getFirebase()
    if (!auth) throw new Error("Auth not initialized")

    await firebaseSignOut(auth)
    currentUser = null
    return true
  } catch (error) {
    console.error("Sign out error:", error)
    return false
  }
}

// Set up auth state listener
export const setupAuthListener = (callback: (user: User | null) => void) => {
  try {
    const { auth } = getFirebase()
    if (!auth) return () => {}

    return onAuthStateChanged(auth, (user) => {
      currentUser = user
      callback(user)
    })
  } catch (error) {
    console.error("Error setting up auth listener:", error)
    return () => {}
  }
}

// Save posts to Firebase
export const savePostsToFirebase = async (posts: Post[]): Promise<boolean> => {
  try {
    if (!isAuthenticated()) return false

    const { db } = getFirebase()
    if (!db) throw new Error("Database not initialized")

    const userId = currentUser!.uid
    const userPostsRef = doc(db, "users", userId)

    await setDoc(userPostsRef, { posts }, { merge: true })
    return true
  } catch (error) {
    console.error("Error saving posts to Firebase:", error)
    return false
  }
}

// Load posts from Firebase
export const loadPostsFromFirebase = async (): Promise<Post[] | null> => {
  try {
    if (!isAuthenticated()) return null

    const { db } = getFirebase()
    if (!db) throw new Error("Database not initialized")

    const userId = currentUser!.uid
    const userPostsRef = doc(db, "users", userId)
    const docSnap = await getDoc(userPostsRef)

    if (docSnap.exists() && docSnap.data().posts) {
      return docSnap.data().posts as Post[]
    }

    return null
  } catch (error) {
    console.error("Error loading posts from Firebase:", error)
    return null
  }
}
