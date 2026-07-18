// Holds the "in-progress" survey while the user moves between
// Create Survey -> Camera -> Location -> Contacts -> Clipboard -> Preview screens.
let draft = {
  siteName: '',
  clientName: '',
  description: '',
  priority: '',
  date: new Date().toISOString(),
  photoUri: null,
  photoTime: null,
  location: null, // { latitude, longitude, accuracy }
  contact: null,  // { name, number }
  notes: '',
};

let listeners = [];

export const DraftStore = {
  get: () => draft,
  update: (data) => {
    draft = { ...draft, ...data };
    listeners.forEach((l) => l());
  },
  reset: () => {
    draft = {
      siteName: '',
      clientName: '',
      description: '',
      priority: '',
      date: new Date().toISOString(),
      photoUri: null,
      photoTime: null,
      location: null,
      contact: null,
      notes: '',
    };
    listeners.forEach((l) => l());
  },
  subscribe: (fn) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};