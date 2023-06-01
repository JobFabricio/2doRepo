import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "./Alert";

export function Register() {
  // Importar el hook useAuth desde el contexto AuthContext
const { signup } = useAuth();

// Estado para almacenar los valores del usuario (correo electrónico y contraseña)
const [user, setUser] = useState({
  email: "",
  password: "",
});

// Estado para almacenar el mensaje de error en caso de que ocurra durante el registro
const [error, setError] = useState("");

// Obtiene la función navigate del hook useNavigate para poder redirigir después del registro
const navigate = useNavigate();

// Maneja el envío del formulario de registro
const handleSubmit = async (e) => {
  e.preventDefault();
  setError(""); // Reinicia el mensaje de error

  try {
    // Llama a la función signup para registrar al usuario con los valores proporcionados
    await signup(user.email, user.password);
    navigate("/"); // Navega a la página principal después del registro exitoso
  } catch (error) {
    setError(error.message); // Captura el error y lo almacena en el estado de error
  }
};

  return (
    <div className="w-full max-w-xs m-auto text-black">
      {error && <Alert message={error} />} {/* Renderiza el componente de Alert si hay un error */}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-6 mb-4"
      >
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="youremail@company.tld"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Contraseña
          </label>
          <input
            type="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="*************"
          />
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Registrate
        </button>
      </form>
      <p className="my-4 text-sm flex justify-between px-3">
        ¿Ya tienes una cuenta?
        <Link to="/" className="text-blue-700 hover:text-blue-900">
          Sesión
        </Link>
      </p>
    </div>
  );
}
