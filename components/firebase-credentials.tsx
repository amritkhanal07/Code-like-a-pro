"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { getFirebaseConfig, saveFirebaseConfig } from "@/lib/firebase"
import { InfoIcon, Save } from "lucide-react"

export default function FirebaseCredentials() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [authDomain, setAuthDomain] = useState("")
  const [projectId, setProjectId] = useState("")
  const [storageBucket, setStorageBucket] = useState("")
  const [messagingSenderId, setMessagingSenderId] = useState("")
  const [appId, setAppId] = useState("")
  const [saving, setSaving] = useState(false)

  // Load saved credentials
  useEffect(() => {
    const config = getFirebaseConfig()
    setApiKey(config.apiKey || "")
    setAuthDomain(config.authDomain || "")
    setProjectId(config.projectId || "")
    setStorageBucket(config.storageBucket || "")
    setMessagingSenderId(config.messagingSenderId || "")
    setAppId(config.appId || "")
  }, [])

  // Save credentials
  const handleSave = async () => {
    setSaving(true)
    try {
      // Validate inputs
      if (!apiKey || !projectId) {
        toast({
          title: "Required Fields Missing",
          description: "API Key and Project ID are required.",
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      // Save credentials
      const success = saveFirebaseConfig({
        apiKey,
        authDomain: authDomain || `${projectId}.firebaseapp.com`,
        projectId,
        storageBucket: storageBucket || `${projectId}.appspot.com`,
        messagingSenderId,
        appId,
      })

      if (success) {
        toast({
          title: "Firebase Configuration Saved",
          description:
            "Your Firebase configuration has been saved successfully. Please refresh the page to apply changes.",
        })
      } else {
        toast({
          title: "Error Saving Configuration",
          description: "There was a problem saving your Firebase configuration. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving Firebase configuration:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your Firebase configuration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firebase Configuration</CardTitle>
        <CardDescription>Configure your Firebase project to enable cloud storage for your blog posts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Where to get these credentials?</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              You need to create a project in the Firebase Console and enable Authentication and Firestore Database. See
              the "Firebase Setup" tab for detailed instructions.
            </p>
            <p>
              These credentials are stored locally in your browser and are only used to access your own Firebase
              project.
            </p>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">
              API Key <span className="text-red-500">*</span>
            </Label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-id">
              Project ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="project-id"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="my-blog-project"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-domain">Auth Domain</Label>
            <Input
              id="auth-domain"
              value={authDomain}
              onChange={(e) => setAuthDomain(e.target.value)}
              placeholder="my-blog-project.firebaseapp.com"
            />
            <p className="text-xs text-muted-foreground">
              If left blank, this will be automatically set to [projectId].firebaseapp.com
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storage-bucket">Storage Bucket</Label>
            <Input
              id="storage-bucket"
              value={storageBucket}
              onChange={(e) => setStorageBucket(e.target.value)}
              placeholder="my-blog-project.appspot.com"
            />
            <p className="text-xs text-muted-foreground">
              If left blank, this will be automatically set to [projectId].appspot.com
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="messaging-sender-id">Messaging Sender ID</Label>
            <Input
              id="messaging-sender-id"
              value={messagingSenderId}
              onChange={(e) => setMessagingSenderId(e.target.value)}
              placeholder="123456789012"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="app-id">App ID</Label>
            <Input
              id="app-id"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="1:123456789012:web:abc123def456"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Configuration"}
        </Button>
      </CardFooter>
    </Card>
  )
}
