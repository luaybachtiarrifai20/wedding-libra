import { useState, useRef, useEffect } from "react";
import "./App.css";
import bgImage from "./assets/2.png";
import centerImage1 from "./assets/1.png";
import btnImage from "./assets/asset_interaktif_10_btn_id.png";
import starMusic from "./assets/star_nadin.webm";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// Components
import MenuPage from "./MenuPage";

function App() {
  const [page, setPage] = useState(0);
  const [lang, setLang] = useState<'ID' | 'EN'>('ID');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Guest state from URL param
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string | null>(null);

  // Autoplay music on mount
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch((error) => {
        console.log("Autoplay prevented by browser policy:", error);
        setIsPlaying(false);
      });
    }
  }, []);

  // Read ?guest= URL param and fetch from Firestore
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('guest');
    if (!id) return;
    setGuestId(id);
    getDoc(doc(db, 'guests', id)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setGuestName(data.name ?? null);
      } else {
        // Guest ID in URL but not found in Firestore → treat as no guest
        setGuestId(null);
      }
    }).catch(console.error);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log(e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const t = {
    ID: {
      weddingOf: "The Wedding Of",
      to: "Kepada Yth.",
      guest: "Bapak/Ibu/Saudara/i",
      apology: "*Mohon maaf jika ada kesalahan dalam penulisan nama / gelar."
    },
    EN: {
      weddingOf: "The Wedding Of",
      to: "To:",
      guest: "Dear Guests",
      apology: "*We apologize for any errors in spelling names or titles."
    }
  }[lang];

  return (
    <div className="fixed inset-0 w-full overflow-hidden" style={{ height: '100dvh' }}>
      {/* Blurred Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          filter: "blur(8px)",
          transform: "scale(1.1)" // Prevents white edges when blurred
        }}
      />
      
      {/* Optional dark overlay for better text readability */}
      <div className={`absolute inset-0 z-0 transition-colors duration-700 ${isDarkMode ? 'bg-black/60' : 'bg-black/20'}`} />

      {/* Main Content Wrapper */}
      <section className="relative z-10 w-full flex justify-center box-border overflow-hidden" style={{ height: '100dvh' }}>
        {/* Wrapper w-fit ensures its bounds snap tightly to the contained image, making "top-right" place it correctly on the image corner */}
        <div
          className="relative flex flex-col items-center transition-all duration-700 w-fit rounded-2xl overflow-hidden shadow-2xl"
          style={{ height: '100dvh' }}
        >
          <img 
            src={page === 0 ? centerImage1 : bgImage} 
            alt="Centered image" 
            className={`transition-all duration-700 h-full w-auto object-contain ${isDarkMode ? 'brightness-[0.4] contrast-125' : 'brightness-100'}`}
          />

          {/* Language Switcher - Pinned to the top right of the centered image */}
          <div className="absolute top-[2vh] right-[2vh] z-50 flex gap-2 bg-white/70 backdrop-blur-sm p-1 rounded-full shadow-lg border border-white/50">
             <button 
               onClick={() => setLang('ID')}
               className={`px-3 py-1 text-[1.5vh] font-bold rounded-full transition-colors ${lang === 'ID' ? 'bg-[#e43232] text-white shadow-sm' : 'text-gray-700 hover:bg-white/60'}`}
             >
               ID
             </button>
             <button 
               onClick={() => setLang('EN')}
               className={`px-3 py-1 text-[1.5vh] font-bold rounded-full transition-colors ${lang === 'EN' ? 'bg-[#e43232] text-white shadow-sm' : 'text-gray-700 hover:bg-white/60'}`}
             >
               EN
             </button>
          </div>

          {/* Music Toggle - Pinned to the bottom right of the centered image */}
          <div className="absolute bottom-[2vh] right-[2vh] z-50 flex bg-white/70 backdrop-blur-sm p-1 rounded-full shadow-lg border border-white/50">
             <button 
               onClick={toggleMusic}
               className={`w-[4vh] h-[4vh] flex items-center justify-center rounded-full transition-colors drop-shadow-sm ${isPlaying ? 'bg-[#e43232] text-white' : 'bg-gray-300 text-gray-700 hover:bg-white/60'}`}
               aria-label={isPlaying ? "Mute Music" : "Play Music"}
             >
               {isPlaying ? (
                 <svg className="w-[2.2vh] h-[2.2vh]" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                 </svg>
               ) : (
                 <svg className="w-[2.2vh] h-[2.2vh]" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                 </svg>
               )}
             </button>
          </div>

          {/* Light/Dark Toggle - Pinned to the bottom left of the centered image */}
          <div className="absolute bottom-[2vh] left-[2vh] z-50 flex bg-white/70 backdrop-blur-sm p-1 rounded-full shadow-lg border border-white/50">
             <button 
               onClick={() => setIsDarkMode(!isDarkMode)}
               className={`w-[4vh] h-[4vh] flex items-center justify-center rounded-full transition-colors drop-shadow-sm ${isDarkMode ? 'bg-[#333] text-yellow-400' : 'bg-yellow-400 text-white hover:bg-yellow-500'}`}
               aria-label={isDarkMode ? "Light Mode" : "Dark Mode"}
             >
               {isDarkMode ? (
                 <svg className="w-[2.2vh] h-[2.2vh]" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                 </svg>
               ) : (
                 <svg className="w-[2.2vh] h-[2.2vh]" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.364a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM18 10a1 1 0 011 1v-1a1 1 0 01-1-1h-1a1 1 0 110 2h1zm-3.78 4.636a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 18a1 1 0 011 1v-1a1 1 0 11-2 0v1a1 1 0 011-1zm-4.22-2.364a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM2 10a1 1 0 011 1H2a1 1 0 110-2h1a1 1 0 01-1 1zm2.364-4.22a1 1 0 010-1.414l-.707-.707A1 1 0 015.07 2.93l.707.707A1 1 0 014.364 5.78z" clipRule="evenodd" /><path d="M10 14a4 4 0 100-8 4 4 0 000 8z" />
                 </svg>
               )}
             </button>
          </div>

          <audio ref={audioRef} src={starMusic} loop autoPlay playsInline />

          {page === 0 && (
            <>
              {/* Text Overlay precisely placed within the bounds of the red board */}
              <div 
                className="absolute flex flex-col justify-center items-center text-center"
                style={{
                  top: '30%',
                  bottom: '38%',
                  left: '6%',
                  right: '6%',
                  padding: '0 2vw',
                }}
              >
                <p className="text-[#3b3b3b] font-bold" style={{ marginBottom: '0.2vh', fontFamily: "'Talk Comic', sans-serif", fontSize: 'clamp(0.6rem, 2.2vh, 0.9rem)' }}>
                  {t.weddingOf}
                </p>
                <h1 
                  className="font-black text-[#e43232] tracking-wider whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(1rem, 4vh, 2rem)',
                    WebkitTextStroke: '0.12vh #4a1515',
                    textShadow: '0.15vh 0.15vh 0px #4a1515',
                    marginBottom: '0.8vh',
                    fontFamily: "'Talk Comic', sans-serif"
                  }}
                >
                  Ramizah & Luay
                </h1>
                <p className="text-[#3b3b3b]" style={{ fontSize: 'clamp(0.55rem, 1.6vh, 0.8rem)' }}>
                  {t.to}
                </p>
                <p className="text-[#3b3b3b] font-bold" style={{ fontSize: 'clamp(0.55rem, 1.8vh, 0.85rem)', marginBottom: '0.2vh' }}>
                  {t.guest}
                </p>
                <p className="text-[#4a4a4a] italic leading-tight" style={{ fontSize: 'clamp(0.45rem, 1.3vh, 0.65rem)', marginBottom: guestName ? '0.2vh' : '1.5vh' }}>
                  {t.apology}
                </p>
                {/* Guest name from URL */}
                {guestName && (
                  <p
                    className="text-[#e43232] font-black text-center leading-snug tracking-wide"
                    style={{ fontSize: 'clamp(0.7rem, 2.2vh, 1.1rem)', marginBottom: '0.5vh', fontFamily: "'Talk Comic', sans-serif", textShadow: '0.5px 0.5px 0px #4a1515' }}
                  >
                    {guestName}
                  </p>
                )}
              </div>

              {/* Button Overlay placed over the beige wooden board */}
              <div 
                className="absolute flex justify-center items-center"
                style={{
                  top: '75%',
                  bottom: '8%',
                  left: '10%',
                  right: '10%',
                }}
              >
                <button 
                  onClick={() => setPage(1)}
                  className="cursor-pointer animate-zoom-in-out hover:brightness-110 active:scale-95 transition-all"
                >
                  <img src={btnImage} alt="Buka Undangan" className={`h-[9.5vh] w-auto transition-all duration-700 ${isDarkMode ? 'drop-shadow-[0_0_20px_rgba(255,223,0,1)]' : 'drop-shadow-lg'}`} />
                </button>
              </div>
            </>
          )}

          {page === 1 && <MenuPage onBack={() => setPage(0)} lang={lang} isDarkMode={isDarkMode} guestId={guestId} guestName={guestName} />}

        </div>
      </section>
    </div>
  );
}

export default App;
