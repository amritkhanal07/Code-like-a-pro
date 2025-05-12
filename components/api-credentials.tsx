"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { getUserCredentials, saveUserCredentials, resetApiState, loadGoogleApi } from "@/lib/drive-storage"
import { InfoIcon, Save, RefreshCw } from "lucide-react"

export default function ApiCredentials() {
  const { toast } = useToast()
  const [clientId, setClientId] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  // Load saved credentials
  useEffect(() => {
    const credentials = getUserCredentials()
    setClientId(credentials.clientId || "")
    setApiKey(credentials.apiKey || "")

    // Always set isPreview to false to enable Google Drive integration
    setIsPreview(false)
  }, [])

  // Save credentials
  const handleSave = async () => {
    setSaving(true)
    try {
      // Validate inputs
      if (!clientId) {
        toast({
          title: "Client ID Required",
          description: "Please enter your Google Client ID.",
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: "Please enter your Google API Key.",
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      // Save credentials
      const success = saveUserCredentials(clientId, apiKey)

      if (success) {
        // Reset API state to force reinitialization with new credentials
        resetApiState()

        toast({
          title: "Credentials Saved",
          description: "Your Google API credentials have been saved successfully.",
        })
      } else {
        toast({
          title: "Error Saving Credentials",
          description: "There was a problem saving your credentials. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving credentials:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Test connection
  const handleTestConnection = async () => {
    setTesting(true)
    try {
      // Reset API state to force reinitialization
      resetApiState()

      // Try to load the API with current credentials
      const success = await loadGoogleApi()

      if (success) {
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Google Drive API with your credentials.",
        })
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to Google Drive API. Please check your credentials.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error testing connection:", error)
      toast({
        title: "Connection Error",
        description: "There was a problem testing the connection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google API Credentials</CardTitle>
        <CardDescription>Configure your Google API credentials to enable Google Drive integration.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isPreview && (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Preview Environment</AlertTitle>
            <AlertDescription>
              You're currently in a preview environment. You can still configure your credentials, but Google Drive
              integration will only be fully functional in a production environment.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-id">Google Client ID</Label>
            <Input
              id="client-id"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g., 123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com"
            />
            <p className="text-xs text-muted-foreground">Your OAuth 2.0 Client ID from the Google Cloud Console.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">Google API Key</Label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="e.g., AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q"
              type="password"
            />
            <p className="text-xs text-muted-foreground">Your API Key from the Google Cloud Console.</p>
          </div>

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Where to get these credentials?</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                You need to create a project in the Google Cloud Console and enable the Google Drive API. See the
                "Google Drive Setup" tab for detailed instructions.
              </p>
              <p>
                These credentials are stored locally in your browser and are only used to access your own Google Drive.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleSave} disabled={saving} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Credentials"}
        </Button>
        <Button onClick={handleTestConnection} disabled={testing || isPreview} variant="outline" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          {testing ? "Testing..." : "Test Connection"}
        </Button>
      </CardFooter>
    </Card>
  )
}
