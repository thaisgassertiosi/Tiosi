# Tiosi

Expo + React Native + TypeScript app for sound healers and Crystal Tones bowl distributors. V1: add a bowl from its tag, read a calm energetic summary, and keep a local library.

## Run locally

```bash
cd "/Users/thaistiosi/Documents/Tiosi App"
npm install
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with **Expo Go** on your phone.

## Web preview on Vercel

The repo includes **`vercel.json`** so Vercel runs **`npm run build`** (`expo export --platform web`) and publishes the **`dist`** folder.

If you still see **404 NOT_FOUND** after deploy:

1. **Vercel → Project → Settings → General → Build & Output**  
   - **Framework Preset:** Other  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `dist`  
   - **Install Command:** `npm install`  
2. Trigger a **Redeploy** of the latest `main` commit.

Local check:

```bash
npm install
npm run build
```

You should get a **`dist`** folder with `index.html` inside.

## Stack

- Expo SDK 52
- React Navigation (native stack)
- AsyncStorage for saved bowls (metadata JSON on device)
- Optional **bowl photos**: picked from library or camera, copied into app document storage (`expo-file-system`), URI stored on each bowl — **local only**, not uploaded to a remote database
- **Web:** `react-dom` + `react-native-web` for static export

## Project layout

- `src/data` — notes, tunings, alchemies
- `src/utils` — interpretation + insight generation
- `src/storage` — load/save bowls
- `src/screens` — Home, Add Bowl, Library, Bowl Detail
- `src/components` — shared UI
- `src/types` — `Bowl` model
