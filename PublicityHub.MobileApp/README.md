# PublicityHub Mobile App

React Native mobile app for the PublicityHub field campaign management platform.

---

## 🏗️ Project Structure

```
PublicityHub.MobileApp/
├── src/
│   ├── api/              ← All API calls (one file per domain)
│   │   ├── client.ts     ← Axios instance with auto JWT injection
│   │   ├── auth.api.ts
│   │   ├── campaigns.api.ts
│   │   ├── assignments.api.ts
│   │   └── proofs.api.ts
│   │
│   ├── components/       ← Reusable UI building blocks
│   │   ├── AppButton.tsx
│   │   ├── AppInput.tsx
│   │   ├── Card.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── StatCard.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── EmptyState.tsx
│   │   └── ScreenHeader.tsx
│   │
│   ├── constants/        ← Design tokens (change here to rebrand)
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── config.ts     ← API URL, storage keys, timeouts
│   │
│   ├── context/
│   │   └── AuthContext.tsx  ← Global auth state (JWT + user)
│   │
│   ├── navigation/       ← All navigators
│   │   ├── RootNavigator.tsx    ← Routes by role
│   │   ├── AdminNavigator.tsx
│   │   ├── WorkerNavigator.tsx
│   │   └── ProviderNavigator.tsx
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboardScreen.tsx
│   │   │   ├── CampaignDetailScreen.tsx
│   │   │   ├── CreateCampaignScreen.tsx
│   │   │   ├── AssignWorkerScreen.tsx
│   │   │   ├── ProofReviewScreen.tsx
│   │   │   └── UserListScreen.tsx
│   │   ├── worker/
│   │   │   ├── WorkerHomeScreen.tsx
│   │   │   ├── JobDetailScreen.tsx
│   │   │   └── SubmitProofScreen.tsx
│   │   ├── provider/
│   │   │   ├── ProviderHomeScreen.tsx
│   │   │   └── ProviderCampaignDetailScreen.tsx
│   │   └── shared/
│   │       └── ProfileScreen.tsx
│   │
│   ├── types/
│   │   └── index.ts      ← All TypeScript interfaces (mirrors API DTOs)
│   │
│   └── utils/
│       ├── storage.ts    ← AsyncStorage wrapper
│       └── formatters.ts ← Currency, dates, labels
│
├── App.tsx               ← Root component
├── app.json              ← Expo config
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS / Android)

### Install
```bash
cd PublicityHub.MobileApp
npm install
```

### Run
```bash
npm start          # Start Expo dev server
npm run android    # Android emulator
npm run ios        # iOS simulator (Mac only)
```

Scan the QR code with **Expo Go** on your phone to run instantly.

---

## 👥 User Roles & Flows

| Role | Login | What they see |
|------|-------|---------------|
| **Admin** 🛡️ | Phone number | Dashboard, all campaigns, create/publish/assign/review |
| **Provider** 🚀 | Phone number | Their own campaigns + progress tracking |
| **Worker** 👷 | Phone number | Assigned jobs, accept/reject, submit proof |

Login is **phone number only** — no password. Role is determined by the backend.

---

## 🔗 API Configuration

Change the base URL in `src/constants/config.ts`:

```ts
export const Config = {
  API_BASE_URL: 'https://publicityhub-api.onrender.com', // ← change for local dev
};
```

For local dev: `http://localhost:5072`

---

## 🎨 Design System

All design tokens are in `src/constants/`:
- **Colors** — brand, status, neutrals
- **Typography** — font sizes and weights

To rebrand: only edit these two files.

---

## 🧩 Adding New Features

1. Add types to `src/types/index.ts`
2. Add API calls to `src/api/`
3. Create screen in `src/screens/<role>/`
4. Add route to the relevant navigator in `src/navigation/`

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| expo | ~56.0.12 | App framework |
| react-native | 0.85.3 | Core RN |
| @react-navigation/native | 6.1.18 | Navigation |
| @react-navigation/native-stack | 6.11.0 | Stack navigator |
| @react-navigation/bottom-tabs | 6.6.1 | Tab navigator |
| axios | 1.7.9 | HTTP client |
| @react-native-async-storage/async-storage | 2.1.2 | Local storage |
| react-native-safe-area-context | 4.14.1 | Safe areas |
| react-native-screens | 4.5.0 | Native screens |
