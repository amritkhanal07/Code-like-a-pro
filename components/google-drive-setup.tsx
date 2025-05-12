"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Steps, Step } from "@/components/ui/steps"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InfoIcon } from "lucide-react"

export default function GoogleDriveSetup() {
  const [isPreview, setIsPreview] = useState(false)

  // Update the useEffect that checks for preview environment
  useEffect(() => {
    // Always set isPreview to false to enable Google Drive integration
    setIsPreview(false)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Drive Setup Guide</CardTitle>
        <CardDescription>Follow these steps to set up Google Drive integration for your blog.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isPreview && (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Preview Environment</AlertTitle>
            <AlertDescription>
              You're currently in a preview environment. These instructions are for setting up Google Drive in your
              production environment.
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            You'll need a Google account and access to Google Cloud Console to complete this setup.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="setup">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Setup Steps</TabsTrigger>
            <TabsTrigger value="code">Code Changes</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6 mt-4">
            <Steps>
              <Step number={1} title="Create a Google Cloud Project">
                <div className="space-y-2">
                  <p>
                    Go to the{" "}
                    <a
                      href="https://console.cloud.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Google Cloud Console
                    </a>
                    .
                  </p>
                  <p>Click on the project dropdown at the top of the page and select "New Project".</p>
                  <p>Enter a name for your project (e.g., "Code Like a Pro Blog") and click "Create".</p>
                </div>
              </Step>

              <Step number={2} title="Enable the Google Drive API">
                <div className="space-y-2">
                  <p>In your new project, go to "APIs & Services" &gt; "Library" from the navigation menu.</p>
                  <p>Search for "Google Drive API" and select it from the results.</p>
                  <p>Click the "Enable" button to enable the API for your project.</p>
                </div>
              </Step>

              <Step number={3} title="Configure OAuth Consent Screen">
                <div className="space-y-2">
                  <p>Go to "APIs & Services" &gt; "OAuth consent screen" from the navigation menu.</p>
                  <p>Select "External" as the user type (unless you have a Google Workspace account).</p>
                  <p>Fill in the required information:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>App name: "Code Like a Pro Blog"</li>
                    <li>User support email: Your email address</li>
                    <li>Developer contact information: Your email address</li>
                  </ul>
                  <p>Click "Save and Continue".</p>
                  <p>Skip the "Scopes" section by clicking "Save and Continue".</p>
                  <p>Add your email address as a test user, then click "Save and Continue".</p>
                  <p>Review your settings and click "Back to Dashboard".</p>
                </div>
              </Step>

              <Step number={4} title="Create OAuth Credentials">
                <div className="space-y-2">
                  <p>Go to "APIs & Services" &gt; "Credentials" from the navigation menu.</p>
                  <p>Click "Create Credentials" and select "OAuth client ID".</p>
                  <p>Select "Web application" as the application type.</p>
                  <p>Enter a name for your OAuth client (e.g., "Code Like a Pro Blog Web Client").</p>
                  <p>
                    Under "Authorized JavaScript origins", add your website's domain (e.g., "https://yourdomain.com").
                  </p>
                  <p>For local development, also add "http://localhost:3000".</p>
                  <p>Click "Create".</p>
                  <p>You'll receive a client ID and client secret. Copy the client ID for the next step.</p>
                </div>
              </Step>

              <Step number={5} title="Create API Key">
                <div className="space-y-2">
                  <p>While still in the "Credentials" page, click "Create Credentials" again and select "API Key".</p>
                  <p>Copy the generated API key.</p>
                  <p>Click "Restrict Key" to limit its usage (recommended).</p>
                  <p>Under "API restrictions", select "Google Drive API".</p>
                  <p>Click "Save".</p>
                </div>
              </Step>

              <Step number={6} title="Configure Your Blog">
                <div className="space-y-2">
                  <p>Go to the "API Credentials" tab in your blog's settings.</p>
                  <p>Enter the Client ID and API Key you obtained from the Google Cloud Console.</p>
                  <p>Click "Save Credentials" to store them.</p>
                  <p>Click "Test Connection" to verify that your credentials are working correctly.</p>
                  <p>Return to the "Storage" tab and click "Connect to Google Drive" to start using cloud storage.</p>
                </div>
              </Step>
            </Steps>
          </TabsContent>

          <TabsContent value="code" className="space-y-6 mt-4">
            <div className="space-y-4">
              <p>
                You don't need to modify any code! Just enter your credentials in the "API Credentials" tab and the
                system will automatically use them.
              </p>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Security Note</AlertTitle>
                <AlertDescription>
                  <p>
                    Your credentials are stored securely in your browser's localStorage and are only used on your own
                    device. They are never sent to our servers.
                  </p>
                  <p className="mt-2">
                    Each user of the blog can configure their own Google API credentials, allowing everyone to use their
                    own Google Drive account.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
