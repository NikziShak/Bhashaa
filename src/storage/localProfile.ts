import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'bhashaa.local-profile.v1';

export type LocalProfile = {
  version: 1;
  targetLanguage: string;
  selectedTopic: number;
  completedCalls: number;
  speakingSeconds: number;
  phrasesLearned: number;
};

export const defaultLocalProfile: LocalProfile = {
  version: 1,
  targetLanguage: 'Hindi',
  selectedTopic: 0,
  completedCalls: 0,
  speakingSeconds: 0,
  phrasesLearned: 0,
};

export async function readLocalProfile(): Promise<LocalProfile> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultLocalProfile;
    const value = JSON.parse(raw) as Partial<LocalProfile>;
    if (value.version !== 1) return defaultLocalProfile;
    return {
      ...defaultLocalProfile,
      ...value,
      selectedTopic: Number.isInteger(value.selectedTopic) ? Math.max(0, value.selectedTopic as number) : 0,
      completedCalls: Math.max(0, Number(value.completedCalls) || 0),
      speakingSeconds: Math.max(0, Number(value.speakingSeconds) || 0),
      phrasesLearned: Math.max(0, Number(value.phrasesLearned) || 0),
    };
  } catch {
    return defaultLocalProfile;
  }
}

export async function writeLocalProfile(profile: LocalProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export async function clearLocalProfile(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
