import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'surveys_data';

let surveys = [];
let listeners = [];
let loaded = false;

const persist = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(surveys));
  } catch (e) {
    console.warn('Failed to save surveys', e);
  }
};

const loadFromDisk = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) surveys = JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load surveys', e);
  } finally {
    loaded = true;
    listeners.forEach((l) => l());
  }
};

// Kick off load immediately when the module is imported
loadFromDisk();

export const SurveyStore = {
  getAll: () => surveys,
  isLoaded: () => loaded,
  add: (survey) => {
    surveys = [{ ...survey, id: Date.now().toString() }, ...surveys];
    persist();
    listeners.forEach((l) => l());
  },
  update: (id, data) => {
    surveys = surveys.map((s) => (s.id === id ? { ...s, ...data } : s));
    persist();
    listeners.forEach((l) => l());
  },
  remove: (id) => {
    surveys = surveys.filter((s) => s.id !== id);
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