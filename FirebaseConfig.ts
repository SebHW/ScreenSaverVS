// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcR4tWBEK-SIfGHNmcrjTGPXl-spfpz2Q",
  authDomain: "screensavervs.firebaseapp.com",
  projectId: "screensavervs",
  storageBucket: "screensavervs.firebasestorage.app",
  messagingSenderId: "325468703176",
  appId: "1:325468703176:web:143bbb8fbf9ec091b298fd",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
