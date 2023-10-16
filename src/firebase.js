// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_GOOGLE_APP_ID,
    authDomain: "blog-project-13403.firebaseapp.com",
    projectId: "blog-project-13403",
    storageBucket: "blog-project-13403.appspot.com",
    messagingSenderId: "195729295998",
    appId: "1:195729295998:web:33418fb7e6beeff4e4a62f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
