import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import YouTube from "react-youtube";
import { firestore, saveSearch, saveMovie } from "../firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";

function TMDB() {
  // Constantes para la URL y clave de la API de TMDB
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

  // Estados para almacenar las películas, la clave de búsqueda, el tráiler, la película actual, etc.
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Cargando Películas" });
  const [playing, setPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Obtener la instancia de Firestore
  const firestoreApp = getFirestore();

  // Función para obtener las películas desde la API de TMDB
  const fetchMovies = async (searchKey, page) => {
    setLoading(true);
    setError("");

    const type = searchKey ? "search" : "discover";
    try {
      const {
        data: { results },
      } = await axios.get(`${API_URL}/${type}/movie`, {
        params: {
          api_key: API_KEY,
          query: searchKey,
          page: page,
          language: "es-LA",
        },
      });

      // Si es la primera página, reemplazar las películas, de lo contrario, agregar al estado actual
      if (page === 1) {
        setMovies(results);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...results]);
      }

      if (results.length) {
        await fetchMovie(results[0].id);
      } else {
        setMovie(null);
      }
    } catch (error) {
      setError(
        "Error al cargar las películas. Inténtalo de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener los detalles de una película específica desde la API de TMDB
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
        language: "es-LA",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Tráiler Oficial"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    setMovie(data);
  };

  // Función para seleccionar una película
  const selectMovie = async (movie) => {
    fetchMovie(movie.id);
    setMovie(movie);
    window.scrollTo(0, 0);
  };

  // Función para agregar una película a la lista de favoritos
  const addToFavorites = async () => {
    try {
      const movieData = {
        title: movie.title,
        imagePath: `${URL_IMAGE}${movie.poster_path}`,
      };
      await addDoc(collection(firestoreApp, "favoritos"), movieData);
      console.log("Película agregada a favoritos");
    } catch (error) {
      console.log(
        "Error al agregar la película a favoritos:",
        error
      );
    }
  };

  // Función para buscar películas
  const searchMovies = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMovies(searchKey, 1);

    try {
      await saveSearch({ busqueda: searchKey, fecha: new Date() });
      getSearchHistory();
    } catch (error) {
      console.log(
        "Error al guardar la búsqueda en la base de datos:",
        error
      );
    }
  };

  // Función para cargar más películas
  const loadMoreMovies = () => {
    const nextPage = currentPage + 1;
    fetchMovies(searchKey, nextPage);
    setCurrentPage(nextPage);
  };

  // Función para obtener el historial de búsqueda
  const getSearchHistory = async () => {
    try {
      const snapshot = await firestore
        .collection("busquedas")
        .get();
      const history = snapshot.docs.map((doc) => doc.data());
      const searchHistoryWithMovies = await Promise.all(
        history.map(async (search) => {
          const {
            data: { results },
          } = await axios.get(`${API_URL}/search/movie`, {
            params: {
              api_key: API_KEY,
              query: search.busqueda,
              language: "es-LA",
            },
          });

          if (results.length > 0) {
            const movie = results[0];
            return { ...search, movie };
          }

          return { ...search, movie: null };
        })
      );
      setSearchHistory(searchHistoryWithMovies);
    } catch (error) {
      console.log(
        "Error al obtener el historial de búsqueda:",
        error
      );
    }
  };

  // Función para obtener la lista de películas favoritas
  const getFavorites = async () => {
    try {
      const snapshot = await firestore
        .collection("favoritos")
        .get();
      const favoriteMovies = snapshot.docs.map((doc) =>
        doc.data()
      );
      setFavorites(favoriteMovies);
    } catch (error) {
      console.log("Error al obtener los favoritos:", error);
    }
  };

  // Hook de efecto para cargar las películas, el historial de búsqueda y los favoritos
  useEffect(() => {
    fetchMovies("", 1);
    getSearchHistory();
    getFavorites();
  }, []);

  // Función para redirigir a la página de historial
  const redirectToHistoryPage = () => {
    window.location.href = "/historial";
  };

  // Función para redirigir a la página de favoritos
  const redirectToFavoritesPage = () => {
    window.location.href = "/favoritos";
  };

  return (
    <div className="titulo">
      <h2 className="titulo-peliculas">Películas</h2>
      <nav className="enlaces-container">
        <ul className="enlaces">
          <li>
            <a className="boton-historial" onClick={redirectToHistoryPage}>
              Historial
            </a>
          </li>
          <li>
            <a className="boton-favorito" onClick={redirectToFavoritesPage}>
              Favoritos
            </a>
          </li>
        </ul>
      </nav>

      <form className="container mb-4 formulario" onSubmit={searchMovies}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button className="search-button" type="submit"></button>
        </div>
      </form>

      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Cerrar
                  </button>
                </>
              ) : (
                <div className="container">
                  {trailer ? (
                    <>
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Reproducir Tráiler
                      </button>
                      <br></br>
                      <button
                        className="boton-izquierdo"
                        onClick={() => addToFavorites(movie)}
                      >
                        Favorito
                      </button>
                    </>
                  ) : (
                    "Lo sentimos, no hay tráiler disponible"
                  )}
                  <div className="text-bottom">
                    <h1 className="titulo-peliculas">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      <div className="container mt-3">
        <div className="row">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="col-md-4 mb-3"
              onClick={() => {
                selectMovie(movie);
                saveMovie({
                  titulo: movie.title,
                  imagePath: `${URL_IMAGE + movie.poster_path}`,
                });
              }}
              style={{ position: "relative" }}
            >
              <img
                src={`${URL_IMAGE + movie.poster_path}`}
                alt=""
                height={600}
                width="100%"
              />
              <h4>{movie.title}</h4>
              <br></br>
              <p className="text-white">{movie.overview}</p>
            </div>
          ))}
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p>{error}</p>}
        {!loading && movies.length > 0 && (
          <div className="load-more-container">
            <button
              className="load-more-button"
              onClick={loadMoreMovies}
              type="button"
            >
              Cargar más películas
            </button>
          </div>
        )}
      </div>

      <div className="search-history-container">
        <h3></h3>
        <ul>
          {searchHistory.map((search) => (
            <li key={search.fecha}>
              <strong>{search.busqueda}</strong>
              <br />
              {search.movie ? (
                <div>
                  <img
                    src={`${URL_IMAGE}${search.movie.poster_path}`}
                    alt=""
                    height={200}
                  />
                  <br></br>
                  {search.movie.title}
                </div>
              ) : (
                "No se encontraron resultados"
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="favorites-container">
        <h3>Favoritos</h3>
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite.titulo}>
              <img
                src={`${favorite.imagePath}`}
                alt=""
                height={200}
              />
              <br></br>
              {favorite.titulo}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TMDB;