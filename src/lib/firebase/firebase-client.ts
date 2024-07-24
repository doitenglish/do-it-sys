import { initializeApp, getApps } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDMSEoDRSEnR_OH_8jWdMAZ4qgKsf-Lt1g",
  authDomain: "do-it-english.firebaseapp.com",
  projectId: "do-it-english",
  storageBucket: "do-it-english.appspot.com",
  messagingSenderId: "1080073191669",
  appId: "1:1080073191669:web:e896318ab169da388a45bc",
};

const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
export const storage: FirebaseStorage = getStorage(firebaseApp);
