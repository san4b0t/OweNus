// __mocks__/FirebaseConfig.ts
export const FIREBASE_AUTH = {
  // mock functions as needed by your tests
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
};

export const db = {
  // mock Firestore calls if needed
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
};

export const storage = {};
