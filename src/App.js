import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import TMDB from "./components/TMDB";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Historial from "./components/historial";
import Favoritos from "./components/Favoritos"; // Agregado

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="bg-slate-300 text-black h-screen flex text-white">
      {/* Proveedor de autenticación */}
      <AuthProvider>
        <Routes>
          {/* Ruta para el componente Login */}
          <Route path="/" element={<Login />} />
          {/* Ruta para el componente Home (requiere autenticación) */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          {/* Ruta para el componente Register */}
          <Route path="/register" element={<Register />} />
          {/* Ruta para el componente TMDB (requiere autenticación) */}
          <Route path="/tmdb" element={<ProtectedRoute><TMDB /></ProtectedRoute>} />
          {/* Ruta para el componente Historial (requiere autenticación) */}
          <Route path="/historial" element={<ProtectedRoute><Historial /></ProtectedRoute>} />
          {/* Ruta para el componente Favoritos (requiere autenticación) */}
          <Route path="/favoritos" element={<ProtectedRoute><Favoritos /></ProtectedRoute>} /> {/* Agregado */}
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;