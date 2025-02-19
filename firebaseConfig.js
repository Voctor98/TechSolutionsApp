// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCUJ-k5znIwnBAAF23jDzKKx93DErRLoQM",
  authDomain: "techsolutionsapp-9f231.firebaseapp.com",
  projectId: "techsolutionsapp-9f231",
  storageBucket: "techsolutionsapp-9f231.firebasestorage.app",
  messagingSenderId: "334085193390",
  appId: "1:334085193390:android:37ff591f79031ed299373f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };