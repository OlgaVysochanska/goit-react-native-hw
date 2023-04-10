// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmFs9eRLe2EHoTo1bPjpvKINKlG5TwLxg",
  authDomain: "react-native-hw-2023.firebaseapp.com",
  projectId: "react-native-hw-2023",
  storageBucket: "react-native-hw-2023.appspot.com",
  messagingSenderId: "759364708992",
  appId: "1:759364708992:web:a1c7700295d21982089465",
  measurementId: "G-YZYNE43WST",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
