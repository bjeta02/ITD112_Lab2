import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDh6moOG-c5zPrQFIPFwWeVC6uQ5HRf6ZU",
  authDomain: "itd112.firebaseapp.com",
  projectId: "itd112",
  storageBucket: "itd112.appspot.com",
  messagingSenderId: "1085267225166",
  appId: "1:1085267225166:web:0a69289629a1843d63311f",
  measurementId: "G-Z4G8Z07KC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db };