// firebase.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCVH-CO2yl-vhHmtgIpQ-dmz598kS5dl8c",
  authDomain: "berc-app.firebaseapp.com",
  projectId: "berc-app",
  storageBucket: "berc-app.firebasestorage.app",
  messagingSenderId: "751466822391",
  appId: "1:751466822391:web:ec678339dc66238a8531f2"
};

const app = initializeApp(firebaseConfig);

// Use initializeAuth instead of getAuth for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { auth, db };