// Google Drive API integration for persistent storage

import type { Post } from "./posts"

// Default configuration
const DRIVE_FILE_NAME = "code-like-a-pro-posts.json"
const DEFAULT_CLIENT_ID = "847857133846-b4h7vsj9i2uk1g6nmj9lqp7c8cul9qgr.apps.googleusercontent.com"
const DEFAULT_API_KEY = "" // We'll let users provide this in settings
const SCOPES = "https://www.googleapis.com/auth/drive.file"

// Track API availability
let isApiAvailable = false
let isApiLoading = false
let apiLoadPromise: Promise<boolean> | null = null

// Get user credentials from localStorage
export const getUserCredentials = () => {
  if (typeof window === "undefined") {
    return {
      clientId: DEFAULT_CLIENT_ID,
      apiKey: DEFAULT_API_KEY,
    }
  }

  try {
    const storedCredentials = localStorage.getItem("google_drive_credentials")
    if (storedCredentials) {
      return JSON.parse(storedCredentials)
    }
  } catch (error) {
    console.error("Error reading credentials from localStorage:", error)
  }

  return {
    clientId: DEFAULT_CLIENT_ID,
    apiKey: DEFAULT_API_KEY,
  }
}

// Save user credentials to localStorage
export const saveUserCredentials = (clientId: string, apiKey: string) => {
  if (typeof window === "undefined") return false

  try {
    localStorage.setItem(
      "google_drive_credentials",
      JSON.stringify({
        clientId: clientId || DEFAULT_CLIENT_ID,
        apiKey,
      }),
    )
    return true
  } catch (error) {
    console.error("Error saving credentials to localStorage:", error)
    return false
  }
}

// Check if we're in a preview environment
const isPreviewEnvironment = (): boolean => {
  // Always return false to enable Google Drive integration in all environments
  return false
}

// Check if credentials are configured
export const areCredentialsConfigured = (): boolean => {
  const { clientId, apiKey } = getUserCredentials()
  return !!clientId && !!apiKey
}

// Load the Google API client library
export const loadGoogleApi = (): Promise<boolean> => {
  // If already loading, return the existing promise
  if (isApiLoading && apiLoadPromise) {
    return apiLoadPromise
  }

  // Create a new loading promise
  isApiLoading = true
  apiLoadPromise = new Promise((resolve) => {
    // Skip API loading in preview environments
    if (typeof window === "undefined" || isPreviewEnvironment()) {
      console.log("Skipping Google API initialization in preview environment")
      isApiAvailable = false
      isApiLoading = false
      resolve(false)
      return
    }

    // Get user credentials
    const { clientId, apiKey } = getUserCredentials()

    // Skip if credentials are not configured
    if (!clientId || !apiKey) {
      console.log("Skipping Google API initialization - credentials not configured")
      isApiAvailable = false
      isApiLoading = false
      resolve(false)
      return
    }

    // Check if the API is already loaded
    if (window.gapi && isApiAvailable) {
      isApiLoading = false
      resolve(true)
      return
    }

    // Load the Google API client library
    try {
      // Use a safer approach to load the script
      const script = document.createElement("script")
      script.src = "https://apis.google.com/js/api.js"
      script.async = true
      script.defer = true

      script.onload = () => {
        // Safely check if gapi is available
        if (typeof window.gapi === "undefined") {
          console.error("Google API failed to load properly")
          isApiAvailable = false
          isApiLoading = false
          resolve(false)
          return
        }

        window.gapi.load("client:auth2", () => {
          window.gapi.client
            .init({
              apiKey: apiKey,
              clientId: clientId,
              scope: SCOPES,
              discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
            })
            .then(() => {
              isApiAvailable = true
              isApiLoading = false
              resolve(true)
            })
            .catch((error: any) => {
              console.error("Error initializing Google API client:", error)
              isApiAvailable = false
              isApiLoading = false
              resolve(false)
            })
        })
      }

      script.onerror = () => {
        console.error("Failed to load Google API client script")
        isApiAvailable = false
        isApiLoading = false
        resolve(false)
      }

      // Add the script to the document
      document.body.appendChild(script)
    } catch (error) {
      console.error("Error setting up Google API:", error)
      isApiAvailable = false
      isApiLoading = false
      resolve(false)
    }
  })

  return apiLoadPromise
}

// Reset API state (used when credentials change)
export const resetApiState = (): void => {
  isApiAvailable = false
  isApiLoading = false
  apiLoadPromise = null
}

// Check if Google Drive integration is available
export const isDriveAvailable = (): boolean => {
  // Always return false in preview environments
  if (isPreviewEnvironment()) return false
  return isApiAvailable
}

// Check if user is signed in
export const isSignedIn = (): boolean => {
  if (!isApiAvailable || isPreviewEnvironment()) return false
  try {
    return window.gapi?.auth2?.getAuthInstance()?.isSignedIn.get() || false
  } catch (error) {
    console.error("Error checking sign-in status:", error)
    return false
  }
}

// Sign in to Google
export const signIn = async (): Promise<boolean> => {
  if (isPreviewEnvironment()) return false

  if (!isApiAvailable) {
    const apiLoaded = await loadGoogleApi()
    if (!apiLoaded) return false
  }

  try {
    await window.gapi.auth2.getAuthInstance().signIn()
    return true
  } catch (error) {
    console.error("Sign in error:", error)
    return false
  }
}

// Sign out from Google
export const signOut = async (): Promise<boolean> => {
  if (!isApiAvailable || isPreviewEnvironment()) return false

  try {
    await window.gapi.auth2.getAuthInstance().signOut()
    return true
  } catch (error) {
    console.error("Sign out error:", error)
    return false
  }
}

// Find the posts file in Google Drive
const findPostsFile = async (): Promise<string | null> => {
  if (!isApiAvailable || isPreviewEnvironment()) return null

  try {
    const response = await window.gapi.client.drive.files.list({
      q: `name='${DRIVE_FILE_NAME}' and trashed=false`,
      fields: "files(id, name)",
    })

    const files = response.result.files
    if (files && files.length > 0) {
      return files[0].id
    }
    return null
  } catch (error) {
    console.error("Error finding posts file:", error)
    return null
  }
}

// Create a new posts file in Google Drive
const createPostsFile = async (posts: Post[]): Promise<string | null> => {
  if (!isApiAvailable || isPreviewEnvironment()) return null

  try {
    const fileMetadata = {
      name: DRIVE_FILE_NAME,
      mimeType: "application/json",
    }

    const content = JSON.stringify(posts)
    const file = new Blob([content], { type: "application/json" })

    const form = new FormData()
    form.append("metadata", new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }))
    form.append("file", file)

    const accessToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token

    const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    })

    const data = await response.json()
    return data.id
  } catch (error) {
    console.error("Error creating posts file:", error)
    return null
  }
}

// Save posts to Google Drive
export const saveToDrive = async (posts: Post[]): Promise<boolean> => {
  if (isPreviewEnvironment()) return false

  if (!isApiAvailable) {
    const apiLoaded = await loadGoogleApi()
    if (!apiLoaded) return false
  }

  try {
    if (!isSignedIn()) {
      const signedIn = await signIn()
      if (!signedIn) return false
    }

    let fileId = await findPostsFile()

    if (!fileId) {
      fileId = await createPostsFile(posts)
      return !!fileId
    }

    const content = JSON.stringify(posts)
    const file = new Blob([content], { type: "application/json" })

    const accessToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token

    await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: file,
    })

    return true
  } catch (error) {
    console.error("Error saving posts to Drive:", error)
    return false
  }
}

// Load posts from Google Drive
export const loadFromDrive = async (): Promise<Post[] | null> => {
  if (isPreviewEnvironment()) return null

  if (!isApiAvailable) {
    const apiLoaded = await loadGoogleApi()
    if (!apiLoaded) return null
  }

  try {
    if (!isSignedIn()) {
      const signedIn = await signIn()
      if (!signedIn) return null
    }

    const fileId = await findPostsFile()
    if (!fileId) {
      return null
    }

    const accessToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data as Post[]
  } catch (error) {
    console.error("Error loading posts from Drive:", error)
    return null
  }
}
