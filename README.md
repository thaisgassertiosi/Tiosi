# Tiosi

Expo + React Native + TypeScript app for sound healers and Crystal Tones bowl distributors. V1: add a bowl from its tag, read a calm energetic summary, and keep a local library.

## Run locally

```bash
cd "/Users/thaistiosi/Documents/Tiosi App"
npm install
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with **Expo Go** on your phone.

## Stack

- Expo SDK 52
- React Navigation (native stack)
- AsyncStorage for saved bowls

## Project layout

- `src/data` — notes, tunings, alchemies
- `src/utils` — interpretation + insight generation
- `src/storage` — load/save bowls
- `src/screens` — Home, Add Bowl, Library, Bowl Detail
- `src/components` — shared UI
- `src/types` — `Bowl` model
