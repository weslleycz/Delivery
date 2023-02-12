import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCeehfyd99fwQ84uPqtjuA95U-ZfWPKBcs",
    authDomain: "guru-delivery-98cf0.firebaseapp.com",
    projectId: "guru-delivery-98cf0",
    storageBucket: "guru-delivery-98cf0.appspot.com",
    messagingSenderId: "943524734577",
    appId: "1:943524734577:web:2420ae2f6230cff6e75dd0"
  };
  
const firestore = getFirestore(initializeApp(firebaseConfig));
const storage = getStorage(initializeApp(firebaseConfig));

export { firestore ,storage};