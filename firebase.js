import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // ← importar Firestore

const firebaseConfig = {
  apiKey: 'AIzaSyA6rogyj9-YYHGfrJwFn1gAS0H1WLsBiig',
  authDomain: 'techsolutionsbd-64e95.firebaseapp.com',
  projectId: 'techsolutionsbd-64e95',
  storageBucket: 'techsolutionsbd-64e95.appspot.com',
  messagingSenderId: '247885000740',
  appId: '1:247885000740:web:325578dfbba21826dc28b1',
  measurementId: 'G-FG7YB7CYJ3',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ← instancia de Firestore

export { auth, db }; // ← exportá también la base de datos
