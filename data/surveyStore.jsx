let surveys = [];
let listeners = [];

export const SurveyStore = {
  getAll: () => surveys,
  add: (survey) => {
    surveys = [{ ...survey, id: Date.now().toString() }, ...surveys];
    listeners.forEach((l) => l());
  },
  update: (id, data) => {
    surveys = surveys.map((s) => (s.id === id ? { ...s, ...data } : s));
    listeners.forEach((l) => l());
  },
  remove: (id) => {
    surveys = surveys.filter((s) => s.id !== id);
    listeners.forEach((l) => l());
  },
  subscribe: (fn) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};
