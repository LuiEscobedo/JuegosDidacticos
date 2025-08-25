import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaRedo } from "react-icons/fa";
// 👉 Arreglo de artistas
const artists = [
    {
        name: "Julio Jaramillo",
        image: "../../public/Images/Julio-Jaramillo.jpg",
        audio:
            "../../public/Canciones/01 - Julio Jaramillo - Nuestro juramento.mp3",
        songName: "Nuestro juramento",
    },
    {
        name: "Los Panchos",
        image: "../../public/Images/Los Panchos.jpeg",
        audio:
            "../../public/Canciones/02 - Los Panchos - Quizas, quizas, quizas..mp3",
        songName: "Quizas, quizas, quizas.",
    },
    {
        name: "Pedro Infante",
        image: "../../public/Images/Pedro Infante.jpg",
        audio: "../../public/Canciones/03 - Pedro Infante - Fallaste Corazón.mp3",
        songName: "Fallaste Corazón",
    },
    {
        name: "Carlos Gardel",
        image: "../../public/Images/Carlos Garde.jpg",
        audio:
            "../../public/Canciones/04 - Carlos Gardel  - El día que me quieras.mp3",
        songName: "El día que me quieras",
    },
    {
        name: "Agustin Lara",
        image: "../../public/Images/Agustin Lara.jpg",
        audio: "../../public/Canciones/05 - Agustin Lara - Amor de mis amores.mp3",
        songName: "Amor de mis amores",
    },
    {
        name: "Eydie Gorme",
        image: "../../public/Images/Eydie.jpg",
        audio:
            "../../public/Canciones/06 - Eydie Gorme con Los Panchos - Historia de un amor.mp3",
        songName: "Historia de un amor",
    },
    {
        name: "Los tres diamantes",
        image: "../../public/Images/Los tres diamantes.jpg",
        audio:
            "../../public/Canciones/07 - Los tres diamantes - La Gloria Eres Tu.mp3",
        songName: "La Gloria Eres Tu",
    },
    {
        name: "Sonora Santanera",
        image: "../../public/Images/santanera.jpg",
        audio:
            "../../public/Canciones/08 - Sonora santanera - Perfume de Gardenia.mp3",
        songName: "Perfume de Gardenias",
    },
    {
        name: "José José",
        image: "../../public/Images/jose jose.png",
        audio: "../../public/Canciones/09 - José José - El Triste.mp3",
        songName: "El Triste",
    },
    {
        name: "Camilo Sesto",
        image: "../../public/Images/camilo sesto.jpg",
        audio: "../../public/Canciones/10 - Camilo Sesto - Jamás.mp3",
        songName: "Jamás",
    },
    {
        name: "Angelica Maria",
        image: "../../public/Images/angelica.jpg",
        audio: "../../public/Canciones/11 - Angelica Maria - Eddy Eddy.mp3",
        songName: "Eddy Eddy",
    },
    {
        name: "Enrique Guzman",
        image: "../../public/Images/enrique.jpg",
        audio: "../../public/Canciones/12 - Enrique Guzman - La plaga.mp3",
        songName: "La plaga",
    },
    {
        name: "Rocío Dúrcal",
        image: "../../public/Images/rocio.jpg",
        audio: "../../public/Canciones/13 - Rocío Dúrcal - Amor eterno.mp3",
        songName: "Amor eterno",
    },
    {
        name: "Vicente Fernández",
        image: "../../public/Images/vicente.jpg",
        audio:
            "../../public/Canciones/14 - Vicente Fernández - Mujeres Divinas.mp3",
        songName: "Mujeres Divinas",
    },
    {
        name: "Cesar Costa",
        image: "../../public/Images/cesar.jpg",
        audio: "../../public/Canciones/15 - Cesar Costa - Historia De Mi Amor.mp3",
        songName: "Historia De Mi Amor",
    },
    {
        name: "Los Teen Tops",
        image: "../../public/Images/teen.jpg",
        audio:
            "../../public/Canciones/16 - Los Teen Tops - El Rock de la Cárcel.mp3",
        songName: "El Rock de la Cárcel",
    },
    {
        name: "Juan Gabriel",
        image: "../../public/Images/juan.jpeg",
        audio: "../../public/Canciones/17 - Juan Gabriel - Abrázame Muy Fuerte.mp3",
        songName: "Abrázame Muy Fuerte",
    },
    {
        name: "Enrique Guzmann2",
        image: "../../public/Images/enrique.jpg",
        audio: "../../public/Canciones/18 - Enrique Guzman - Popotitos.mp3",
        songName: "Popotitos",
    },
    // ⚡ Hasta 20 artistas
];

// Función para barajar un arreglo
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-2xl shadow-md border overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl font-semibold transition shadow-md ${className}`}
  >
    {children}
  </button>
);

const Memorama = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [matches, setMatches] = useState({});
  const [disabledArtists, setDisabledArtists] = useState({});
  const [wrongSelection, setWrongSelection] = useState(null); // tarjeta roja
  const [shuffledArtists, setShuffledArtists] = useState([]);
  const audioRef = useRef(null);

  const pickRandomSong = () => {
    const remaining = artists.filter((artist) => !disabledArtists[artist.name]);
    if (remaining.length === 0) return;
    const randomArtist = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentSong(randomArtist.name);
  };

  const handleSelectArtist = (artist) => {
    if (!currentSong || disabledArtists[artist.name]) return;

    if (artist.name === currentSong) {
      // Correcto: marcar verde y limpiar rojo
      setMatches((prev) => ({ ...prev, [artist.name]: true }));
      setDisabledArtists((prev) => ({ ...prev, [artist.name]: true }));
      setWrongSelection(null);
      setCurrentSong(null);

      if (audioRef.current) audioRef.current.pause();

      // Nueva canción
      setTimeout(() => pickRandomSong(), 500);
    } else {
      // Incorrecto: marcar solo esta tarjeta en rojo
      setWrongSelection(artist.name);
    }
  };

  const handleReset = () => {
    setMatches({});
    setDisabledArtists({});
    setWrongSelection(null);
    setCurrentSong(null);
    setShuffledArtists(shuffleArray(artists));
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    pickRandomSong();
  };

  useEffect(() => {
    setShuffledArtists(shuffleArray(artists));
    pickRandomSong();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto text-black h-full overflow-hidden ">
      <h1 className="text-3xl font-bold text-center mb-6">
        🎶 Memorama de Artistas y Canciones
      </h1>

      {/* Reproductor */}
      <div className="flex justify-between w-full items-center not-sm:flex-col gap-2">
        {currentSong && (
          <audio
            ref={audioRef}
            className="w-full"
            controls
            src={artists.find((a) => a.name === currentSong)?.audio}
          />
        )}
        <Button
          onClick={handleReset}
          className="bg-green-500 text-white hover:bg-green-600 w-full md:w-[25%] rounded-full"
        >
          <FaRedo className="inline mr-2" /> Reiniciar
        </Button>
      </div>

      {/* Grid de artistas aleatorio */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-auto h-[75svh] pt-5">
        {shuffledArtists.map((artist) => (
          <motion.div
            key={artist.name}
            whileHover={{ scale: 1.05 }}
            className={`cursor-pointer relative ${disabledArtists[artist.name] ? "opacity-50 pointer-events-none" : ""}`}
            onClick={() => handleSelectArtist(artist)}
          >
            <Card
              className={`transition border-4 text-black ${
                matches[artist.name] === true
                  ? "border-green-500"
                  : wrongSelection === artist.name
                  ? "border-red-500"
                  : "border-transparent"
              }`}
            >
              <div className="relative">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-40 object-cover"
                />
                {matches[artist.name] === true && (
                  <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-1 font-semibold">
                    {artist.songName}
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <p className="font-semibold">{artist.name}</p>
                {matches[artist.name] === true && (
                  <FaCheckCircle className="mx-auto text-green-500 mt-2 text-xl" />
                )}
                {wrongSelection === artist.name && (
                  <FaTimesCircle className="mx-auto text-red-500 mt-2 text-xl" />
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Memorama;