import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaRedo, FaPlay, FaPause } from "react-icons/fa";
import { artists } from "../helpers/artistas";

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
  const [wrongSelection, setWrongSelection] = useState(null);
  const [shuffledArtists, setShuffledArtists] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  const pickRandomSong = (disabled) => {
    const remaining = artists.filter((artist) => !disabled[artist.name]);
    if (remaining.length === 0) {
      setCurrentSong(null);
      return;
    }
    const randomArtist = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentSong(randomArtist.name);
  };

  const handleSelectArtist = (artist) => {
    if (!currentSong || disabledArtists[artist.name]) return;

    if (artist.name === currentSong) {
      setMatches((prev) => ({ ...prev, [artist.name]: true }));
      setDisabledArtists((prev) => {
        const updated = { ...prev, [artist.name]: true };

        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }

        setTimeout(() => pickRandomSong(updated), 500);

        return updated;
      });
      setWrongSelection(null);
      setCurrentSong(null);
    } else {
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
      setIsPlaying(false);
    }
    pickRandomSong({});
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Shuffle inicial y canción aleatoria
  useEffect(() => {
    setShuffledArtists(shuffleArray(artists));
    pickRandomSong({});
  }, []);

  // Listeners de audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Actualizar src del audio cuando cambia currentSong
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const song = artists.find((a) => a.name === currentSong);
    audio.src = song?.audio || "";
    audio.currentTime = 0;
    setProgress(0);
    setDuration(audio.duration || 0);
    setIsPlaying(false);
  }, [currentSong]);

  return (
    <div className="w-full md:w-[50%] h-full overflow-hidden flex justify-between flex-col items-center">
      <div className="flex items-center flex-col">
        <h1 className="text-3xl font-bold text-center h-20 flex items-center">
          🎶 Memorama de Artistas y Canciones
        </h1>
      </div>
      <div className="h-[90%] flex flex-col justify-between">
        {/* Grid de artistas aleatorio */}
        <div className="grid grid-cols-2 md:grid-cols-4 overflow-auto gap-4 p-2">
          {shuffledArtists.map((artist) => (
            <motion.div
              key={artist.name}
              whileHover={{ scale: 1.05 }}
              className={`cursor-pointer relative ${
                disabledArtists[artist.name] ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => handleSelectArtist(artist)}
            >
              <Card
                className={`transition aspe border-4 text-black ${
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

        {/* Reproductor estilo Spotify */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-900 text-white rounded-t-2xl p-4 bottom-0 w-full left-0 shadow-md">
          {/* Audio oculto */}
          <audio ref={audioRef} />

          {currentSong && (
            <div className="flex items-center gap-4 w-full">
              {/* Botón Play/Pause */}
              <button
                onClick={togglePlay}
                className="bg-blue-500 p-3 rounded-full hover:bg-blue-600 transition shadow-md"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              {/* Info canción */}
              <div className="flex flex-col w-full">
                <span className="font-semibold text-sm">
                  {artists.find((a) => a.name === currentSong)?.songName ||
                    "Reproduce la canción"}
                </span>
                

                {/* Barra de progreso */}
                <div className="flex items-center gap-2">
                  <span className="text-xs">{formatTime(progress)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={progress}
                    onChange={(e) => {
                      const newTime = e.target.value;
                      audioRef.current.currentTime = newTime;
                      setProgress(newTime);
                    }}
                    className="w-full accent-blue-500"
                  />
                  <span className="text-xs">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Botón Reiniciar */}
          <Button
            onClick={handleReset}
            className="bg-blue-500 text-white hover:bg-blue-600 w-full md:w-[20%] rounded-full"
          >
            <FaRedo className="inline mr-2" /> Reiniciar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Memorama;
