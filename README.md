
# Firebase Bulk Checker

A clearly labelled dashboard for checking Firebase project information through your own authorized panel API.

## Features

- Paste multiple Firebase API keys and project IDs.
- Upload TXT or CSV files.
- Connect to your own HTTPS panel endpoint.
- Display project status and authorized device counts.

## Input format

One entry per line:

API_KEY | PROJECT_ID

## Vercel setup

Add these Environment Variables in Vercel:

PANEL_API_URL=https://your-own-panel.example/api/firebase-check

PANEL_API_TOKEN=your-secret-token

Deploy the project after saving the variables.

## API response

Your authorized panel should return:

{
  "results": [
    {
      "projectId": "demo-project",
      "keyStatus": "VALID",
      "projectStatus": "ACTIVE",
      "registeredDevices": 12,
      "activeDevices": 4
    }
  ]
}

## Important

- Use only Firebase projects you own or are authorized to check.
- Firebase API keys are not passwords.
- Device counts must come from your authorized telemetry system.
- The panel password is for your own panel endpoint.
- 
