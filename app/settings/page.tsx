"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import DriveSync from "@/components/drive-sync"
import { Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GoogleDriveSetup from "@/components/google-drive-setup"
import ApiCredentials from "@/components/api-credentials"

export default function SettingsPage() {
  const { toast } = useToast()
  const [clearingData, setClearingData] = useState(false)

  const handleClearLocalData = () => {
    if (window.confirm("Are you sure you want to clear all local data? This cannot be undone.")) {
      setClearingData(true)
      try {
        localStorage.removeItem("blog_posts")
        toast({
          title: "Local data cleared",
          description: "All locally stored posts have been removed.",
        })
        // Refresh the page to reset the app state
        window.location.href = "/"
      } catch (error) {
        console.error("Error clearing data:", error)
        toast({
          title: "Error",
          description: "Failed to clear local data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setClearingData(false)
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Settings</h1>
        <p className="text-muted-foreground">Manage your blog settings and data storage options.</p>
      </div>

      <Tabs defaultValue="storage">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="credentials">API Credentials</TabsTrigger>
          <TabsTrigger value="setup">Google Drive Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="storage" className="space-y-6 mt-6">
          <DriveSync />

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your locally stored blog data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert variant="warning" className="mb-4">
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Clearing local data will remove all posts stored in your browser. Make sure you have exported your
                    posts or connected to Google Drive before proceeding.
                  </AlertDescription>
                </Alert>
                <Button variant="destructive" onClick={handleClearLocalData} disabled={clearingData} className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {clearingData ? "Clearing..." : "Clear Local Data"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6 mt-6">
          <ApiCredentials />
        </TabsContent>

        <TabsContent value="setup" className="space-y-6 mt-6">
          <GoogleDriveSetup />
        </TabsContent>
      </Tabs>
    </div>
  )
}
