# Inspection App

A complete React Native (Expo) application for creating, managing, and reviewing field
surveys — built with Expo Router, Drawer + Bottom Tab navigation, and native device
APIs (Camera, Location, Contacts, Clipboard, Image Picker).

## Features

### Module 1 — Dashboard
- Welcome screen with live student/profile details
- Today's survey count & total survey count
- Quick action cards (New Survey, Camera, Location, Contacts)
- Custom app header with drawer menu + profile avatar
- Recent survey summary (tappable, opens survey details)

### Module 2 — Create Survey
- Site Name, Client Name, Description, Priority, Date fields
- Required field validation with inline error messages

### Module 3 — Camera
- Camera permission request
- Capture photo with front/back flip action
- Photo preview with capture timestamp
- Retake / Delete photo (with confirmation alert)
- Loading indicator while opening camera

### Module 4 — Location
- Location permission request
- Displays latitude, longitude, and accuracy
- Refresh location button
- Copy current location to clipboard (with success alert)

### Module 5 — Contacts
- Contacts permission request
- Fetch and search device contacts
- Contact counter
- Pull-to-refresh
- Avatar initials, "No Number" fallback
- Copy contact number to clipboard
- Empty state screen

### Module 6 — Clipboard
- Copy Survey ID, Contact Number, and Location
- Paste clipboard content into notes
- Clear clipboard data
- Live clipboard content preview

### Module 7 — Survey Preview
- Displays full survey summary (site, client, photo, contact, location, notes)
- Edit Survey (returns to the form)
- Submit Survey (confirmation alert, saves to history)

### Module 8 — Survey History
- FlatList of all submitted surveys
- Search by site/client name
- Filter by priority (Low / Medium / High)
- Tap a survey to view full details
- Delete survey with confirmation

### Profile & Settings
- Editable profile (name, roll number, course) with photo upload from gallery
- Settings screen with preference toggles and a "Clear All Data" action
- Profile photo/name synced across Dashboard, Header, and Profile screen

### Data Persistence
- Submitted surveys and profile data are saved to device storage
  (`@react-native-async-storage/async-storage`) and survive app reloads/restarts
- In-progress survey drafts are kept in memory only (reset when the app restarts)

## Navigation

**Bottom Tabs:** Dashboard · New Survey · History · Profile

**Drawer:** Dashboard · Camera · Location · Contacts · Clipboard · Settings

## Tech Stack

- **Framework:** React Native + Expo (Expo Router)
- **Navigation:** `@react-navigation/drawer`, `@react-navigation/bottom-tabs`
- **Expo APIs:** `expo-camera`, `expo-location`, `expo-contacts`, `expo-clipboard`,
  `expo-image-picker`
- **Storage:** `@react-native-async-storage/async-storage`
- **UI Concepts:** View, Text, Image, Pressable, FlatList, ScrollView, TextInput,
  Alert, ActivityIndicator, RefreshControl, Modal, useState, useEffect, StyleSheet

## Project Structure

```
app/
  _layout.js                 # Root Drawer navigator
  (tabs)/
    _layout.js                # Bottom Tab navigator
    index.js                   # Dashboard
    survey.js                   # Create Survey
    history.js                   # Survey History
    profile.js                    # Profile
  camera.js                   # Camera module
  location.js                  # Location module
  contacts.js                   # Contacts module
  clipboard.js                    # Clipboard module
  preview.js                        # Survey Preview (hidden from drawer)
  survey-detail.js                    # Shared survey detail view (hidden from drawer)
  settings.js                          # Settings module

components/
  AppHeader.js                # Custom header (menu + profile avatar)
  CustomDrawerContent.js       # Custom drawer with profile header
  QuickActionCard.js            # Dashboard quick action tile
  StatCard.js                    # Dashboard/Profile stat tile

data/
  surveyStore.js               # Submitted surveys (persisted)
  draftStore.js                 # In-progress survey draft (in-memory)
  profileStore.js                # User profile (persisted)
```

## Setup

```bash
npx create-expo-app smart-field-survey
cd smart-field-survey

# Navigation
npx expo install expo-router @react-navigation/native @react-navigation/drawer @react-navigation/bottom-tabs
npx expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context
npm install @expo/vector-icons

# Expo APIs
npx expo install expo-camera expo-location expo-contacts expo-clipboard expo-image-picker
npx expo install @react-native-community/datetimepicker

# Persistence
npx expo install @react-native-async-storage/async-storage
```

In `package.json`, ensure:

```json
"main": "expo-router/entry"
```

In `app.json`, add the required permission plugins:

```json
{
  "expo": {
    "plugins": [
      ["expo-camera", { "cameraPermission": "Allow the app to access your camera to capture survey photos." }],
      ["expo-location", { "locationAlwaysAndWhenInUsePermission": "Allow the app to access your location to record survey site coordinates." }],
      ["expo-contacts", { "contactsPermission": "Allow the app to access your contacts to link a site contact to this survey." }],
      ["expo-image-picker", { "photosPermission": "Allow the app to access your photos to set a profile picture." }]
    ]
  }
}
```

## Running the App

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` / `i` to launch on an Android/iOS
emulator.

## Survey Flow

```
Dashboard → New Survey → Camera → Location → Contacts → Clipboard → Preview → Submit → History
```

Each step writes into a shared **draft** (`draftStore.js`). On submission, the draft
is saved into the persisted **survey list** (`surveyStore.js`) and the draft resets.

## Notes

- `preview.js` and `survey-detail.js` are valid routes but hidden from the drawer
  menu — they're only reached through the survey creation flow or by tapping a
  survey card (Dashboard/History), since they require a survey (draft or saved)
  to display.
- Replace the placeholder `STUDENT` info in `profileStore.js` or edit it directly
  from the in-app Profile screen.