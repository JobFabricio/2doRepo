import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export function Home() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // Realiza el cierre de sesión
    } catch (error) {
      console.error(error.message); // Muestra el mensaje de error en la consola en caso de fallo
    }
  };

  return (
    <div className="w-full max-w-xs m-auto text-black">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="text-xl mb-4">Welcome {user.displayName || user.email}</p>
        {/* Enlace para ir a la página "TMDB" */}
        <Link
          to="/tmdb"
          className="block bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black text-center"
        >
          Go to TMDB
        </Link>
      </div>
    </div>
  );
}
