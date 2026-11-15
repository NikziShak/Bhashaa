# Global release readiness

The project now has a versioned local learner profile, a data deletion action, a typed Expo Router entry point, app identifiers, an Android internal APK build, and a store-oriented EAS build profile. This is a foundation, not yet a release candidate.

## Must be completed before store submission

- **Voice loop:** connect microphone capture, VAD, target-language streaming ASR, the locally loaded tutor LLM, interruption handling, and TTS on both Android and iOS. The visible call is currently a UI preview and must not be represented as a working AI call.
- **Production tutor model:** validate Qwen3-0.6B GGUF Q4 on low-memory Android phones and current iPhones; create and evaluate the language-teaching fine-tune; pin the exact model revision and SHA-256. Keep model files as opt-in downloads so the base app install stays small.
- **Model coverage and rights:** provide real ASR/TTS packages for every enabled language and script, review weight, dataset, and code licenses, and ship required attribution. Disable languages until that pipeline has passed native-speaker evaluation.
- **Learner setup:** replace sample profile content with onboarding for target/support languages, age band, level, goals, consent, and accessibility needs. Add age-appropriate safety and an explicit policy for children before allowing child accounts.
- **Privacy and deletion:** publish accurate privacy and terms pages, disclose microphone and model downloads in the store forms, provide a data export/delete path, and verify deletion in local storage. Do not store raw audio by default. The microphone permission copy must match the final inference/data path exactly.
- **Localization and accessibility:** localize all interface strings, support dynamic text sizes, screen readers, contrast, RTL layouts where needed, and test across small phones/tablets and language scripts.
- **Release infrastructure:** reserve/confirm the permanent Android application ID and Apple bundle ID, set production signing credentials, use store AAB/IPA profiles, configure crash reporting without audio capture, and run device QA, model quality, startup, memory, battery, and offline tests.
- **Distribution assets:** replace starter artwork with approved brand icon/splash/screenshots, add support contact and public policy URLs, and complete Google Play/App Store metadata and age/content declarations.

## Current data behavior

The prototype stores selected target language, selected scenario, call count, total call seconds, and phrase count in AsyncStorage on the device. It does not store microphone audio or sync this profile to a server. The profile page has a delete-local-data action. Do not ship a privacy statement until the final model runtime and its complete data flow have been independently checked.

## Build profiles

- `npx expo run:android` / `npx expo run:ios`: development builds for native voice modules.
- `eas build --profile preview --platform android`: sideloadable internal APK.
- `eas build --profile production --platform android`: Play Store AAB.
- `eas build --profile production --platform ios`: App Store IPA (requires Apple signing credentials).

GitHub Actions currently creates an Android debug APK for smoke installation. It is not the signed store build. Store credentials and submissions remain separate from this workflow.
