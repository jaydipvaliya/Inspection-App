import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'profile_data';

let profile = {
  name: 'Your Name',
  roll: 'Roll No.',
  course: 'React Native App',
  photoUri: null,
};

let listeners = [];

const persist = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save profile', e);
  }
};

const loadFromDisk = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) profile = JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load profile', e);
  } finally {
    listeners.forEach((l) => l());
  }
};

loadFromDisk();

export const ProfileStore = {
  get: () => profile,
  update: (data) => {
    profile = { ...profile, ...data };
    persist();
    listeners.forEach((l) => l());
  },
  subscribe: (fn) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};