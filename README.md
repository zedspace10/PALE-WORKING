# PALE

PALE is an iOS app from Stellara: a calm place to look up. It shows where you are in the universe
and what is in your sky tonight, with real distances and positions worked out on the phone.

Built with Expo (SDK 54), React Native and expo-router, in TypeScript.

## What is in it

- **Home**: the pale blue dot, tonight's Observatory entry, and a line about what is up after dark.
- **Shift**: about a minute zooming out from Earth to everything we can see, with original music.
- **Explore**: places from the Moon to the edge of what we can see, and this week's Hubble or Webb
  picture from stellaraspace.com.
- **Notes**: a line sent towards a planet, star, nebula, black hole or galaxy, followed at the
  speed of light. The same journeys open on stellaraspace.com.
- **Time Machine** and **Tonight's Sky**.

PALE has no accounts and collects no data. Everything is stored on the phone; notifications are
set on the phone itself.

## Working on it

```powershell
npm ci
npm start
```

Before a release, run `npm run verify`: formatting, lint, types, tests, content checks, and exports
for every platform.

## Releasing

Builds are made with EAS and go to TestFlight:

```powershell
npx eas-cli@latest build --platform ios --profile production --auto-submit
```

## Kept in step with the website

The note destinations (`constants/notes.ts`) and planet positions (`constants/ephemeris.ts`) match
the Stellara website (`cosmoscope/src/lib/notes.ts` and `cosmoscope/src/lib/ephemeris.ts`). Change
them together. The Shift music is made by `scripts/audio/shift_piano.py` and is timed to
`constants/shiftTiming.ts`.

## Content

Scientific copy cites a source and says where it is uncertain. Reflection is kept apart from fact.
No content about the death of stars, and no copyrighted quotes.
