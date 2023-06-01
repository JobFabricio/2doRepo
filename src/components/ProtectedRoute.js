import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading</h1>; // Si se está cargando la información del usuario, se muestra un mensaje de carga

  if (!user) return <Navigate to="/login" />; // Si no hay un usuario autenticado, se redirige al usuario a la página de inicio de sesión ("/login")

  return <>{children}</>; // Si hay un usuario autenticado, se renderiza el contenido protegido pasado como children
}