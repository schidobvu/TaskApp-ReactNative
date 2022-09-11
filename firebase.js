// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB2ofgqtVzvDSF999z9_IlrbdUG8xslTE",
  authDomain: "todo-app-42008.firebaseapp.com",
  projectId: "todo-app-42008",
  storageBucket: "todo-app-42008.appspot.com",
  messagingSenderId: "280786153692",
  appId: "1:280786153692:web:039d2654bec892b45d8419",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
