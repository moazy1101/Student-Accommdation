// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {getFirestore} from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";


// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCpfYHvXBN7ao9W04k_S-KsrwiDvxl5oMU",
//   authDomain: "farabi-8552f.firebaseapp.com",
//   projectId: "farabi-8552f",
//   storageBucket: "farabi-8552f.appspot.com",
//   messagingSenderId: "764582837173",
//   appId: "1:764582837173:web:cf7d13d8139eb68cb8b7fc",
//   measurementId: "G-8LQPNPSZ15",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const db = getFirestore();
// export const auth=getAuth();
// export const storage=getStorage()

//Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZHe7wrZCKA2Fdk4fiC52bgPgGUGmtYqw",
  authDomain: "form-app-6102d.firebaseapp.com",
  databaseURL: "https://form-app-6102d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "form-app-6102d",
  storageBucket: "form-app-6102d.appspot.com",
  messagingSenderId: "1034219708172",
  appId: "1:1034219708172:web:73ffe98adab65e3d023329"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();
export const auth=getAuth();
export const storage=getStorage()
