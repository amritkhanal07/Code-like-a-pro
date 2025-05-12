"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { signInWithGoogle, signOut, setupAuthListener, getCurrentUser } from "@/lib/firebase"
import { exportPosts, importPosts } from "@/lib/posts"
import { Cloud, Download, Upload, LogOut, AlertTriangle, RefreshCw, Settings } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { isFirebaseConfigured } from "@/lib/firebase"

export default function FirebaseSync() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [firebaseAvailable, setFirebaseAvailable] = useState(false)
  const [initializingApi, setInitializingApi] = useState(false)
  const [progress, setProgress] = useState(0)
  const [credentialsConfigured, setCredentialsConfigured] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Check for Firebase configuration
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCredentialsConfigured(isFirebaseConfigured())
    }
  }, [])

  // Initialize Firebase and check authentication status
  useEffect(() => {
    const initFirebase = async () => {
      try {
        setLoading(true)

        // Check if credentials are configured
        const hasCredentials = isFirebaseConfigured()
        setCredentialsConfigured(hasCredentials)

        if (!hasCredentials) {
          setFirebaseAvailable(false)
          setLoading(false)
          return
        }

        setInitializingApi(true)

        // Simulate progress for better UX
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval)
              return prev
            }
            return prev + 10
          })
        }, 300)

        // Set up auth state listener
        const unsubscribe = setupAuthListener((user) => {
          setAuthenticated(!!user)
          setUserEmail(user?.email || null)
        })

        setFirebaseAvailable(true)

        clearInterval(interval)
        setProgress(100)

        // Reset progress after animation completes
        setTimeout(() => {
          setProgress(0)
        }, 500)

        return () => {
          unsubscribe()
        }
      } catch (error) {
        console.error("Failed to initialize Firebase:", error)
        setFirebaseAvailable(false)
      } finally {
        setLoading(false)
        setInitializingApi(false)
      }
    }

    initFirebase()
  }, [])

  // Handle Google Sign In
  const handleSignIn = async () => {
    try {
      setLoading(true)
      const success = await signInWithGoogle()

      if (success) {
        const user = getCurrentUser()
        setUserEmail(user?.email || null)
        setAuthenticated(true)
        toast({
          title: "Signed in to Firebase",
          description: "Your posts will now be synced with Firebase.",
        })
      } else {
        toast({
          title: "Sign in failed",
          description: "Could not sign in to Firebase. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Sign in failed",
        description: "Could not sign in to Firebase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      setLoading(true)
      const success = await signOut()

      if (success) {
        setAuthenticated(false)
        setUserEmail(null)
        toast({
          title: "Signed out from Firebase",
          description: "Your posts will no longer be synced with Firebase.",
        })
      }
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle manual export
  const handleExport = () => {
    try {
      exportPosts()
      toast({
        title: "Posts exported",
        description: "Your posts have been exported to a JSON file.",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "Could not export posts. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle file selection for import
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSyncing(true)
    importPosts(file)
      .then(() => {
        toast({
          title: "Posts imported",
          description: "Your posts have been imported successfully.",
        })
      })
      .catch((error) => {
        console.error("Import error:", error)
        toast({
          title: "Import failed",
          description: "Could not import posts. Please check the file format.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setSyncing(false)
        // Reset file input
        if (e.target) {
          e.target.value = ""
        }
      })
  }

  // Retry initializing Firebase
  const handleRetryInitialization = () => {
    setInitializingApi(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 300)

    // Try to initialize Firebase again
    setTimeout(() => {
      try {
        const isConfigured = isFirebaseConfigured()
        setCredentialsConfigured(isConfigured)

        if (isConfigured) {
          setFirebaseAvailable(true)
          toast({
            title: "Firebase connected",
            description: "Successfully connected to Firebase.",
          })
        } else {
          toast({
            title: "Connection failed",
            description: "Could not connect to Firebase. Please check your setup.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Firebase initialization error:", error)
        toast({
          title: "Connection failed",
          description: "Could not connect to Firebase. Please check your setup.",
          variant: "destructive",
        })
      } finally {
        clearInterval(interval)
        setProgress(100)
        setTimeout(() => {
          setProgress(0)
          setInitializingApi(false)
        }, 500)
      }
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firebase Storage</CardTitle>
        <CardDescription>
          Save your posts to Firebase to access them from any device and prevent data loss.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {initializingApi && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Connecting to Firebase...</p>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {!credentialsConfigured ? (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Firebase Configuration Required</AlertTitle>
            <AlertDescription>
              <p className="mb-2">You need to configure your Firebase credentials to use Firebase integration.</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings?tab=credentials">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Firebase
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        ) : loading && !initializingApi ? (
          <div className="text-center py-4">Loading...</div>
        ) : !firebaseAvailable ? (
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Firebase integration unavailable</AlertTitle>
            <AlertDescription>
              <p className="mb-2">Firebase integration is not available. This could be because:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>There was an error with your Firebase configuration</li>
                <li>There was an error connecting to Firebase servers</li>
              </ul>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetryInitialization}
                  disabled={initializingApi}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry Connection
                </Button>
              </div>
              <p className="mt-3">
                For now, you can use the export/import features below to back up your posts locally.
              </p>
            </AlertDescription>
          </Alert>
        ) : authenticated ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Cloud className="h-4 w-4" />
              <span>Connected to Firebase as {userEmail}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your posts are now automatically synced with Firebase. You can access them from any device by signing in
              with the same account.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect to Firebase to save your posts in the cloud. This will allow you to access them from any device
              and prevent data loss if your browser data is cleared.
            </p>
            <Button onClick={handleSignIn} className="w-full" disabled={loading || !firebaseAvailable}>
              <Cloud className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button variant="outline" onClick={handleExport} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Export Posts
          </Button>
          <div className="relative w-full">
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="w-full" disabled={syncing}>
              <Upload className="mr-2 h-4 w-4" />
              Import Posts
            </Button>
          </div>
        </div>
        {authenticated && firebaseAvailable && (
          <Button variant="ghost" onClick={handleSignOut} className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
