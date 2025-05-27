// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBEyrcevqqp-WNDCElUUhGXj0rzPSRFLfc",
//   authDomain: "rnauthvideo-90170.firebaseapp.com",
//   projectId: "rnauthvideo-90170",
//   storageBucket: "rnauthvideo-90170.firebasestorage.app",
//   messagingSenderId: "482553252004",
//   appId: "1:482553252004:web:24d5d2a8bb2da5cb2bfe31"
// };

// // Initialize Firebase
// export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage),
//   });
// export const FIREBASE_DB = getFirestore(FIREBASE_APP);

//actual

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
//@ts-ignore
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDjl1aYBZ_IfT36fMTuiVJGo5LIPnS0B6o",
  authDomain: "owetest-edfc7.firebaseapp.com",
  projectId: "owetest-edfc7",
  storageBucket: "owetest-edfc7.firebasestorage.app",
  messagingSenderId: "783199309926",
  appId: "1:783199309926:web:d8e325893bbaf4a18a9da7",
  measurementId: "G-08T2YW5MB9"
  };

const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(FIREBASE_APP);
export const storage = getStorage(FIREBASE_APP);