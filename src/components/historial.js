import React, { useEffect, useState } from "react";
import { getFirestore, collectionGroup, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";
import "./Home.css";

function Historial() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // Obtiene todos los documentos de la colección "peliculas" en la base de datos
      const querySnapshot = await getDocs(
        collectionGroup(firestore, "peliculas")
      );

      const movieData = [];
      querySnapshot.forEach((doc) => {
        const movie = doc.data();
        movieData.push(movie);
      });

      // Actualiza el estado con los datos de las películas obtenidas
      setMovies(movieData);
    } catch (error) {
      console.log("Error al obtener las películas:", error);
    }
  };

  return (
    <div className="Contenido">
      <div className="historial-container">
        <h1 className="titulo-peliculas">Historial</h1>
        <nav className="enlaces-container">
          <li>
            <Link to="/tmdb" className="boton-favorito">
              Regresar
            </Link>
          </li>
        </nav>
        <br></br>
        <ul className="movie-list">
          {/* Mapea la lista de películas y muestra cada una */}
          {movies.map((movie, index) => (
            <li key={index} className="movie-item">
              <p className="movie-title">Nombre: {movie.title}</p>
              <img
                className="movie-image"
                src={`https://image.tmdb.org/t/p/w500/${movie.imagePath}`}
                alt={movie.title}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Historial;