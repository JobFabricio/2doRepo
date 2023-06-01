import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeApp as initializeFirestoreApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCV4pxPtvbFfzey9UmM7LenI-7s8moH4vw",
  authDomain: "mi-primer-proyecto-4e7af.firebaseapp.com",
  databaseURL: "https://mi-primer-proyecto-4e7af-default-rtdb.firebaseio.com",
  projectId: "mi-primer-proyecto-4e7af",
  storageBucket: "mi-primer-proyecto-4e7af.appspot.com",
  messagingSenderId: "486971012772",
  appId: "1:486971012772:web:4dbd2e9b5ab3f46ecb5831",
  measurementId: "G-KXYYTWTB5P"
};

// Inicializar la aplicación de Firebase
const app = initializeApp(firebaseConfig);
// Obtener la instancia de autenticación de Firebase
export const auth = getAuth(app);

// Inicializar la aplicación de Firebase para Firestore
const firestoreApp = initializeFirestoreApp(firebaseConfig);
// Obtener la instancia de Firestore
export const firestore = getFirestore(firestoreApp);

// Función para guardar una búsqueda en la base de datos
export const saveSearch = async (searchData) => {
  try {
    const docRef = await addDoc(collection(firestore, "busquedas"), searchData);
    console.log("Búsqueda guardada con ID:", docRef.id);
  } catch (error) {
    console.log("Error al guardar la búsqueda en la base de datos:", error);
    throw error;
  }
};

// Función para guardar una película en la base de datos
export const saveMovie = async (movieData) => {
  try {
    const docRef = await addDoc(collection(firestore, "peliculas"), movieData);
    console.log("Película guardada con ID:", docRef.id);
  } catch (error) {
    console.log("Error al guardar la película en la base de datos:", error);
    throw error;
  }
};

export default app;