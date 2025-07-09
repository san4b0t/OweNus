

export const initializeApp = jest.fn(() => ({}));

export const getFirestore = jest.fn(() => ({}));

export const getStorage = jest.fn(() => ({}));

// Mock for react-native auth
export const getReactNativePersistence = jest.fn();

export const initializeAuth = jest.fn(() => ({
  currentUser: null,
  onAuthStateChanged: jest.fn(),
}));

// For 'firebase/auth' functions you use:
export const createUserWithEmailAndPassword = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const updateProfile = jest.fn();
