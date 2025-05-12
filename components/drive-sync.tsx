"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { isSignedIn, signIn, signOut, loadGoogleApi, areCredentialsConfigured } from "@/lib/drive-storage"
import { exportPosts, importPosts } from "@/lib/posts"
import { Cloud, Download, Upload, LogOut, AlertTriangle, RefreshCw, Info, Settings } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function DriveSync() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [driveAvailable, setDriveAvailable] = useState(false)
  const [initializingApi, setInitializingApi] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isPreview, setIsPreview] = useState(false)
  const [credentialsConfigured, setCredentialsConfigured] = useState(false)

  // Check for credentials configuration
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Always set isPreview to false to enable Google Drive integration
      setIsPreview(false)
      setCredentialsConfigured(areCredentialsConfigured())
    }
  }, [])

  // Initialize Google API and check authentication status
  useEffect(() => {
    const initGoogleApi = async () => {
      try {
        setLoading(true)

        // Skip API initialization in preview environments
        if (isPreview) {
          setDriveAvailable(false)
          setLoading(false)
          return
        }

        // Check if credentials are configured
        const hasCredentials = areCredentialsConfigured()
        setCredentialsConfigured(hasCredentials)

        if (!hasCredentials) {
          setDriveAvailable(false)
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

        const apiAvailable = await loadGoogleApi()
        setDriveAvailable(apiAvailable)

        if (apiAvailable) {
          setAuthenticated(isSignedIn())
        }

        clearInterval(interval)
        setProgress(100)

        // Reset progress after animation completes
        setTimeout(() => {
          setProgress(0)
        }, 500)
      } catch (error) {
        console.error("Failed to initialize Google API:", error)
        setDriveAvailable(false)
      } finally {
        setLoading(false)
        setInitializingApi(false)
      }
    }

    initGoogleApi()
  }, [isPreview])

  // Handle Google Sign In
  const handleSignIn = async () => {
    try {
      setLoading(true)
      const success = await signIn()

      if (success) {
        setAuthenticated(true)
        toast({
          title: "Signed in to Google Drive",
          description: "Your posts will now be synced with Google Drive.",
        })
      } else {
        toast({
          title: "Sign in failed",
          description: "Could not sign in to Google Drive. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Sign in failed",
        description: "Could not sign in to Google Drive. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle Google Sign Out
  const handleSignOut = async () => {
    if (isPreview) return

    try {
      setLoading(true)
      const success = await signOut()

      if (success) {
        setAuthenticated(false)
        toast({
          title: "Signed out from Google Drive",
          description: "Your posts will no longer be synced with Google Drive.",
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

  // Retry initializing the API
  const handleRetryInitialization = () => {
    if (isPreview) {
      toast({
        title: "Not available in preview",
        description: "Google Drive integration is not available in preview environments.",
        variant: "destructive",
      })
      return
    }

    setInitializingApi(true)
    setProgress(0)
    loadGoogleApi()
      .then((available) => {
        setDriveAvailable(available)
        if (available) {
          setAuthenticated(isSignedIn())
          toast({
            title: "Google Drive connected",
            description: "Successfully connected to Google Drive API.",
          })
        } else {
          toast({
            title: "Connection failed",
            description: "Could not connect to Google Drive API. Please check your setup.",
            variant: "destructive",
          })
        }
      })
      .catch((error) => {
        console.error("API initialization error:", error)
        toast({
          title: "Connection failed",
          description: "Could not connect to Google Drive API. Please check your setup.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setInitializingApi(false)
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloud Storage</CardTitle>
        <CardDescription>
          Save your posts to Google Drive to access them from any device and prevent data loss.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {initializingApi && !isPreview && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Connecting to Google Drive API...</p>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {isPreview ? (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Preview Environment Detected</AlertTitle>
            <AlertDescription>
              <p>
                Google Drive integration is disabled in preview environments. In a production deployment, you'll be able
                to:
              </p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Connect to Google Drive</li>
                <li>Sync your posts across devices</li>
                <li>Automatically back up your content</li>
              </ul>
              <p className="mt-2">
                For now, you can use the export/import features below to back up your posts locally.
              </p>
            </AlertDescription>
          </Alert>
        ) : !credentialsConfigured ? (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>API Credentials Required</AlertTitle>
            <AlertDescription>
              <p className="mb-2">You need to configure your Google API credentials to use Google Drive integration.</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings?tab=credentials">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Credentials
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        ) : loading && !initializingApi ? (
          <div className="text-center py-4">Loading...</div>
        ) : !driveAvailable ? (
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Google Drive integration unavailable</AlertTitle>
            <AlertDescription>
              <p className="mb-2">Google Drive integration is not available. This could be because:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>There was an error with your API credentials</li>
                <li>There was an error connecting to Google's servers</li>
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
              <span>Connected to Google Drive</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your posts are now automatically synced with Google Drive. You can access them from any device by signing
              in with the same Google account.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect to Google Drive to save your posts in the cloud. This will allow you to access them from any
              device and prevent data loss if your browser data is cleared.
            </p>
            <Button onClick={handleSignIn} className="w-full" disabled={loading || !driveAvailable}>
              <Cloud className="mr-2 h-4 w-4" />
              Connect to Google Drive
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
        {authenticated && driveAvailable && !isPreview && (
          <Button variant="ghost" onClick={handleSignOut} className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect from Google Drive
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
