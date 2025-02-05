// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVH-CO2yl-vhHmtgIpQ-dmz598kS5dl8c",
  authDomain: "berc-app.firebaseapp.com",
  projectId: "berc-app",
  storageBucket: "berc-app.firebasestorage.app",
  messagingSenderId: "751466822391",
  appId: "1:751466822391:web:ec678339dc66238a8531f2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
