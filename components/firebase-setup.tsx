"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Steps, Step } from "@/components/ui/steps"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InfoIcon } from "lucide-react"

export default function FirebaseSetup() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Firebase Setup Guide</CardTitle>
        <CardDescription>Follow these steps to set up Firebase integration for your blog.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            You'll need a Google account to create a Firebase project and complete this setup.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="setup">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Setup Steps</TabsTrigger>
            <TabsTrigger value="rules">Firestore Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6 mt-4">
            <Steps>
              <Step number={1} title="Create a Firebase Project">
                <div className="space-y-2">
                  <p>
                    Go to the{" "}
                    <a
                      href="https://console.firebase.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Firebase Console
                    </a>
                    .
                  </p>
                  <p>Click on "Add project" or "Create a project".</p>
                  <p>Enter a name for your project (e.g., "My Blog") and click "Continue".</p>
                  <p>Choose whether to enable Google Analytics (optional) and click "Create project".</p>
                </div>
              </Step>

              <Step number={2} title="Set up Authentication">
                <div className="space-y-2">
                  <p>In your Firebase project, click on "Authentication" in the left sidebar.</p>
                  <p>Click on "Get started" or "Set up sign-in method".</p>
                  <p>Enable the "Google" sign-in provider by clicking on it and toggling the "Enable" switch.</p>
                  <p>Add your email as a project support email and click "Save".</p>
                </div>
              </Step>

              <Step number={3} title="Create a Firestore Database">
                <div className="space-y-2">
                  <p>In your Firebase project, click on "Firestore Database" in the left sidebar.</p>
                  <p>Click on "Create database".</p>
                  <p>Choose "Start in production mode" or "Start in test mode" (for development).</p>
                  <p>Select a location for your database and click "Enable".</p>
                </div>
              </Step>

              <Step number={4} title="Register a Web App">
                <div className="space-y-2">
                  <p>
                    In your Firebase project, click on the gear icon next to "Project Overview" and select "Project
                    settings".
                  </p>
                  <p>Scroll down to "Your apps" and click on the web icon ({"</>"}).</p>
                  <p>Register your app with a nickname (e.g., "My Blog Web App").</p>
                  <p>Optionally set up Firebase Hosting, then click "Register app".</p>
                  <p>You'll be shown your Firebase configuration object. Copy these values for the next step.</p>
                </div>
              </Step>

              <Step number={5} title="Configure Your Blog">
                <div className="space-y-2">
                  <p>Go to the "Firebase Configuration" tab in your blog's settings.</p>
                  <p>Enter the Firebase configuration values you copied in the previous step:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>API Key</li>
                    <li>Project ID</li>
                    <li>Auth Domain</li>
                    <li>Storage Bucket</li>
                    <li>Messaging Sender ID</li>
                    <li>App ID</li>
                  </ul>
                  <p>Click "Save Configuration" to store your Firebase configuration.</p>
                  <p>Return to the "Storage" tab and click "Sign in with Google" to start using Firebase storage.</p>
                </div>
              </Step>
            </Steps>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6 mt-4">
            <div className="space-y-4">
              <p>
                For security, you should set up proper Firestore rules to protect your data. Here are recommended rules
                for your blog:
              </p>

              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <pre className="text-sm">
                  {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write only their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`}
                </pre>
              </div>

              <p>To set these rules:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Go to your Firebase Console</li>
                <li>Click on "Firestore Database" in the left sidebar</li>
                <li>Click on the "Rules" tab</li>
                <li>Replace the existing rules with the ones above</li>
                <li>Click "Publish"</li>
              </ol>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Security Note</AlertTitle>
                <AlertDescription>
                  These rules ensure that users can only access their own data. Each user will have their own separate
                  collection of posts in the database.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
