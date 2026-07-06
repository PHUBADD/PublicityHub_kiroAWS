# PublicityHub Mobile App — Setup & Run Guide

## What Is This?

The mobile app is built with **React Native + Expo**. It uses the same REST API as the web admin panel. Three roles are supported:

| Role | Access |
|------|--------|
| **Worker** | View assigned jobs, accept, submit proof with photo + GPS |
| **Provider** | View own campaigns, track status |
| **Admin** | View all campaigns, users, proofs, approve/reject |

---

## Prerequisites

Install these **once** on your laptop:

| Tool | Download |
|------|----------|
| Node.js (v18+) | https://nodejs.org |
| Yarn | `npm install -g yarn` |
| Expo CLI | `npm install -g expo-cli` |
| Expo Go (on phone) | Play Store / App Store → search **"Expo Go"** |

---

## Step 1 — Install Dependencies

Open a terminal and run:

```bash
cd PublicityHub.MobileApp
yarn install
```

This installs all packages listed in `package.json`.

---

## Step 2 — Configure the API URL

Open `src/constants/config.ts`.

You need to tell the app **where the API is**. There are 4 options:

### Option A — Use Production API (Easiest — no local setup needed)

```typescript
const ENV = 'production';
```

The app will connect to `https://publicityhub-api.onrender.com`.

> **Note:** Render free tier spins down after 15 minutes of inactivity. First request may take 30–60 seconds. If you get no response, wait and retry.

---

### Option B — Use Local API on Physical Phone (WiFi)

1. Make sure your phone and laptop are on the **same WiFi network**
2. Find your laptop's IP address:
   - Windows: open CMD → `ipconfig` → look for **IPv4 Address** (e.g. `192.168.1.42`)
3. Start the API on your laptop:
   ```bash
   cd PublicityHub.API
   dotnet run --launch-profile http
   ```
   The API will run on `http://localhost:5072`
4. In `config.ts`, set:
   ```typescript
   const ENV = 'local_wifi';
   const LOCAL_IP = '192.168.1.42'; // your actual IP
   ```

> **Important:** Use `http` not `https` for local. Android blocks `https` with self-signed certs.

---

### Option C — Android Emulator (Android Studio)

```typescript
const ENV = 'emulator_android';
```

The emulator maps `10.0.2.2` to your laptop's `localhost`.

---

### Option D — iOS Simulator (Mac only)

```typescript
const ENV = 'simulator_ios';
```

---

## Step 3 — Start the App

```bash
cd PublicityHub.MobileApp
yarn start
```

This opens the **Expo Dev Tools** in your browser and shows a QR code in the terminal.

---

## Viewing the App on Your Phone

1. Open **Expo Go** on your phone
2. Tap **"Scan QR Code"**
3. Scan the QR code shown in the terminal / browser
4. The app loads on your phone

> Your phone and laptop must be on the same WiFi network for this to work.

---

## Viewing the App on Laptop (Browser)

After running `yarn start`, press:
- `w` — opens in browser (web mode)

Or run directly:
```bash
yarn web
```

Then open `http://localhost:8081` in your browser.

---

## Viewing on Android Emulator

1. Install **Android Studio** → open AVD Manager → start a virtual device
2. Run:
```bash
yarn android
```

---

## Viewing on iOS Simulator (Mac only)

1. Install Xcode
2. Run:
```bash
yarn ios
```

---

## Step 4 — Login

Use any existing user phone number from the database.

| Role | Example Phone |
|------|--------------|
| Admin | Check Supabase `users` table |
| Worker | Check Supabase `users` table |
| Provider | Check Supabase `users` table |

The app routes automatically to the correct dashboard based on role.

---

## Troubleshooting

### "Network Error" / "Cannot connect to API"

**Most likely cause:** Wrong `API_BASE_URL` or API is not running.

Checklist:
- [ ] Is the API running? (check `dotnet run` terminal)
- [ ] Are phone and laptop on the same WiFi? (for local_wifi mode)
- [ ] Did you use `http://` not `https://` for local? (Android blocks self-signed HTTPS)
- [ ] Is the correct IP in `LOCAL_IP`? Run `ipconfig` to verify
- [ ] For production: is Render awake? (first request can take 60s)

### "Expo Go" shows blank screen or crash

- Stop the server (Ctrl+C), run `yarn start --clear` to clear the Metro cache
- Check the terminal for red error messages

### App shows "Loading..." forever

- Usually means the API call timed out. Check the API URL in config.
- Try switching `ENV` to `'production'` to test with the live API

### JWT token / login issues

- If you see 401 errors after logging in, the token may have expired (2h lifetime)
- Log out and log in again

---

## Project Structure

```
PublicityHub.MobileApp/
├── src/
│   ├── api/           # All API calls (axios)
│   │   ├── client.ts  # Axios instance — auto-attaches JWT token
│   │   ├── auth.api.ts
│   │   ├── assignments.api.ts
│   │   ├── campaigns.api.ts
│   │   └── proofs.api.ts
│   ├── constants/
│   │   ├── config.ts  # ← CHANGE API URL HERE
│   │   └── colors.ts
│   ├── context/
│   │   └── AuthContext.tsx  # Global login state
│   ├── navigation/
│   │   ├── RootNavigator.tsx  # Routes by role
│   │   ├── WorkerNavigator.tsx
│   │   ├── AdminNavigator.tsx
│   │   └── ProviderNavigator.tsx
│   ├── screens/
│   │   ├── auth/LoginScreen.tsx
│   │   ├── worker/
│   │   │   ├── WorkerHomeScreen.tsx
│   │   │   ├── JobDetailScreen.tsx
│   │   │   └── SubmitProofScreen.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboardScreen.tsx
│   │   │   ├── CampaignDetailScreen.tsx
│   │   │   ├── ProofReviewScreen.tsx
│   │   │   └── AssignWorkerScreen.tsx
│   │   └── provider/
│   │       └── ProviderHomeScreen.tsx
│   └── components/    # Reusable UI components
├── app.json           # Expo app config
├── package.json       # Dependencies
└── MOBILE_APP_GUIDE.md  ← This file
```

---

## API Endpoints Used by the Mobile App

| Screen | Endpoint |
|--------|----------|
| Login | `POST /api/Users/login` |
| Worker jobs | `GET /api/JobAssignments/worker/{id}` |
| Accept job | `POST /api/JobAssignments/{id}/accept` |
| Submit proof | `POST /api/Proofs/submit` |
| Admin campaigns | `GET /api/Campaigns/all` |
| Admin proofs | `GET /api/Proofs` |
| Approve proof | `POST /api/Proofs/{id}/approve` |
| Reject proof | `POST /api/Proofs/{id}/reject` |
| Provider campaigns | `GET /api/Campaigns/by-user?userId={id}` |

All endpoints (except login) require a JWT Bearer token — handled automatically by the axios client.

---

## Build for Production (APK / IPA)

To build a standalone APK for Android:

```bash
npx expo build:android
```

Or using EAS Build (recommended):

```bash
npm install -g eas-cli
eas build --platform android
```

Follow the prompts. You'll need an Expo account (free at https://expo.dev).

---

## Quick Start Summary

```bash
# 1. Install
cd PublicityHub.MobileApp
yarn install

# 2. Set ENV in src/constants/config.ts (production or local_wifi)

# 3. Start
yarn start

# 4. Scan QR with Expo Go on your phone
#    OR press 'w' for browser
#    OR press 'a' for Android emulator
```
