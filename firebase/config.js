import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmFs9eRLe2EHoTo1bPjpvKINKlG5TwLxg",
  authDomain: "react-native-hw-2023.firebaseapp.com",
  projectId: "react-native-hw-2023",
  storageBucket: "react-native-hw-2023.appspot.com",
  messagingSenderId: "759364708992",
  appId: "1:759364708992:web:a1c7700295d21982089465",
  measurementId: "G-YZYNE43WST",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
