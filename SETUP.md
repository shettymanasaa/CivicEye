# CivicEye — Complete Setup Guide

## STEP 1: Install required software (do this first)

### 1A. Install Node.js
- Go to: https://nodejs.org
- Download "LTS" version (green button)
- Install it (click Next → Next → Finish)
- To verify: open Terminal/Command Prompt and type:
  node --version
  (should show something like v20.x.x)

### 1B. Install VS Code
- Go to: https://code.visualstudio.com
- Download and install
- This is where you will write all code

---

## STEP 2: Create the project

Open Terminal (Mac) or Command Prompt (Windows) and run these ONE BY ONE:

  npm create vite@latest civiceye -- --template react
  cd civiceye
  npm install
  npm install firebase react-router-dom leaflet react-leaflet

Then open VS Code:
  code .

---

## STEP 3: Set up Firebase (free)

1. Go to: https://console.firebase.google.com
2. Click "Add project" → name it "civiceye" → Continue
3. Disable Google Analytics → Create project

Enable Authentication:
- Left sidebar → Build → Authentication → Get started
- Sign-in method → Enable "Phone" → Save
- Sign-in method → Enable "Email/Password" → Save

Enable Firestore:
- Left sidebar → Build → Firestore Database → Create database
- Choose "Start in test mode" → Next → Done

Enable Storage:
- Left sidebar → Build → Storage → Get started → Done

Get your config:
- Gear icon (top left) → Project settings
- Scroll to "Your apps" → click </> web icon
- Register app "civiceye-web" → copy the firebaseConfig object

---

## STEP 4: Google Vision API

1. Go to: https://console.cloud.google.com
2. Search "Vision API" → Enable it
3. APIs & Services → Credentials → Create Credentials → API Key
4. Copy the key — paste into src/utils/detectIssue.js

---

## STEP 5: File structure to create

civiceye/
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── firebase.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── CitizenHome.jsx
│   │   ├── ReportIssue.jsx
│   │   ├── AuthorityHome.jsx
│   │   └── CompletedIssues.jsx
│   ├── components/
│   │   ├── StageTracker.jsx
│   │   ├── VoiceInput.jsx
│   │   ├── ComplaintCard.jsx
│   │   └── Navbar.jsx
│   └── utils/
│       └── detectIssue.js

---

## STEP 6: Run the app

  npm run dev
  Open: http://localhost:5173

## STEP 7: Deploy

  npm install -g vercel
  vercel

## Demo credentials

Authority: officer@civiceye.com / civiceye123
(Create in Firebase → Authentication → Add user)
