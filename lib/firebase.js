import { initializeApp } from 'firebase/app';
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5puXj6ey73x50z1mbTViyxzRziEkKakQ",
  authDomain: "fighter-d719c.firebaseapp.com",
  projectId: "fighter-d719c",
  storageBucket: "fighter-d719c.appspot.com",
  messagingSenderId: "134509093848",
  appId: "1:134509093848:web:32be4b842085b5f6cc48ad",
  measurementId: "G-JTGR7PV0RM"
};

const app=initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export {app,firestore,auth};