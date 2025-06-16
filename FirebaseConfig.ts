import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
//@ts-ignore
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} from '@env';

const firebaseConfig = {
  apiKey: "AIzaSyDjl1aYBZ_IfT36fMTuiVJGo5LIPnS0B6o",
  authDomain: "owetest-edfc7.firebaseapp.com",
  projectId: "owetest-edfc7",
  storageBucket: "owetest-edfc7.firebasestorage.app",
  messagingSenderId: "783199309926",
  appId: "1:783199309926:web:d8e325893bbaf4a18a9da7",
  measurementId: "G-08T2YW5MB9",
};

const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(FIREBASE_APP);
export const storage = getStorage(FIREBASE_APP);