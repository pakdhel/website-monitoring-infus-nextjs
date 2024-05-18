// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHhSeUw4OytlaBiPemZ7FTC5jJ_oO5sPw",
  authDomain: "esp866-monitoring-infus.firebaseapp.com",
  databaseURL: "https://esp866-monitoring-infus-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp866-monitoring-infus",
  storageBucket: "esp866-monitoring-infus.appspot.com",
  messagingSenderId: "915858083062",
  appId: "1:915858083062:web:dc465457b4ca5441eef0d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)

export { database }