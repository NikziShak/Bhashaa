# Bhashaa

Bhashaa is a voice-first language-learning app for practicing real conversations. The current call screen is a UI preview; the local speech and tutor models are not connected yet.

## Android install build

GitHub Actions creates a standalone signed release APK on pushes to `main` and on manual workflow runs. It bundles the JavaScript into the APK, so the installed app does not need a Metro server.

1. Open the repository's **Actions** tab and select the latest **Build Android APK** run.
2. Download the `android-release-apk` artifact and extract `app-release.apk`.
3. Transfer the APK to the Android phone and install it. Android may ask you to allow installs from the file manager or browser used to open it.

## Local development

Run `npm ci`, then `npx expo start --clear` for a development session. Development builds require Metro; the release APK from Actions does not.

For voice-model choices, supported licenses, data handling, and remaining store-release work, see [`docs/LOCAL_VOICE_AI.md`](docs/LOCAL_VOICE_AI.md) and [`docs/RELEASE_READINESS.md`](docs/RELEASE_READINESS.md).
