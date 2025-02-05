// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration (using your provided values)
const firebaseConfig = {
  apiKey: "AIzaSyCVH-CO2yl-vhHmtgIpQ-dmz598kS5dl8c",
  authDomain: "berc-app.firebaseapp.com",
  projectId: "berc-app",
  storageBucket: "berc-app.firebasestorage.app",
  messagingSenderId: "751466822391",
  appId: "1:751466822391:web:ec678339dc66238a8531f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the authentication instance
const auth = getAuth(app);

export { auth };
