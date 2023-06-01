import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export function AuthProvider({ children }) {
  // Se inicializan los estados del usuario y el estado de carga
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para registrar un nuevo usuario
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Función para iniciar sesión
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Función para cerrar sesión
  const logout = () => signOut(auth);

  // Función para enviar un correo electrónico de restablecimiento de contraseña
  const resetPassword = async (email) => sendPasswordResetEmail(auth, email);

  // Se utiliza useEffect para suscribirse a los cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log({ currentUser });
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Función para obtener el token de acceso a la API de TMDB
  const getTMDBToken = () => {
    const tmdbToken = "4f5f43495afcc67e9553f6c684a82f84";
    return tmdbToken;
  };

  // Se proporcionan los valores del contexto de autenticación
  return (
    <authContext.Provider
      value={{
        signup,
        login,
        user,
        logout,
        loading,
        resetPassword,
        getTMDBToken,
      }}
    >
      {children}
    </authContext.Provider>
  );
}