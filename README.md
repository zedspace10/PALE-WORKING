# PALE

PALE is an Expo/React Native reflection app built around carefully qualified astronomy and cosmic-history content.

## Requirements

- Node.js 22.13 or newer
- npm 10 or newer
- A current OpenSpec CLI when changing or archiving specifications

## Setup

```powershell
npm ci
```

## Development

```powershell
npm start
```

Use `npm run android` or `npm run ios` to target a native development environment.

## Verification

The normal local release gate is:

```powershell
npm run verify
```

It checks formatting, lint, TypeScript, the complete unit-test suite, scientific-content validation, and Expo exports for every configured platform. The individual commands are also available as `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:coverage`, `npm run verify:content`, and `npm run build`.

Before completing an OpenSpec change, validate its artifacts separately:

```powershell
npx --yes @fission-ai/openspec@1.13.0 validate <change-name> --strict
```

Also run the SDK and dependency health checks documented in the active change's task list. Do not use forced dependency upgrades to silence audit output; investigate reachability and compatibility first.

## Content standards

Scientific copy must identify its evidence level, cite a primary source, and state uncertainty or observing conditions where relevant. Poetic reflection is welcome, but it must remain distinguishable from measurement or live observational guidance.
