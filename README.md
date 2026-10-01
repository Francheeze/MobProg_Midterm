# Campus Safety and Incident Reporter

Campus Safety and Incident Reporter is an application that allows users to quickly report safety incidents on campus, helping school security respond faster and keep everyone safe.

## What it does
- Provides a dashboard with recent reports and quick access to the incident report form
- Lets users submit incident reports with a category, description, photo, and location
- Captures photo evidence with the device camera and shows a photo preview before submitting
- Attaches the incident location to every report
- Handles camera and location permissions, with a clear message when access is denied
- Saves reports in local storage and lists them in a report history
- Uses reusable components (IncidentCard, ReportButton, CategorySelector, LocationDisplay)

It's a secure, school-only system that digitizes and streamlines campus incident reporting and safety response. 

---

##  Team Members

| Name | 
|------|
| Apal, Francis Cesar|
| Baclia-an, Honey Grace|
| Collera, Rienard|
| Quitoriano, Maegun Aixel|
| Sawitan, Marianne Joeriddine |

---

## Teach Stack
- **React Native** - Mobile app framework
- **Expo - Development** platform and tooling
- **Expo Router** - File-based routing
- **TypeScript** - Language
- **Expo Camera** - Capturing incident evidence
- **Expo Location** - location information
- **AsyncStorage**- Local storage for saved reports

## Repository Link
https://github.com/Francheeze/MobProg_Midterm.git

## Architecture
 
The app follows a layered architecture:
 
```
Presentation  →  Incident Form
      ↓
Business      →  Validate Report
      ↓
Data          →  Local Storage
```

| Layer | Responsibility |
|-------|----------------|
| Presentation | Screens and components the user interacts with (dashboard, incident form, report history) |
| Business | Validates reports (category, description, photo, location) before saving |
| Data | Saves and retrieves reports from local storage |

## Setup Instructions
 
1. Install dependencies
```bash
   npm install
```
 
2. Start the app
```bash
   npx expo start
```
 
In the output, you'll find options to open the app in a
 
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).
 
---
 
## Permissions
 
The app asks for the following permissions when needed:
 
- **Camera** - to capture photo evidence of an incident

---
 
## System Screenshots
 
### 1. Dashboard
`<add screenshot here>`
 
### 2. Incident Report Form
`<add screenshot here>`
 
### 3. Report History
`<add screenshot here>`