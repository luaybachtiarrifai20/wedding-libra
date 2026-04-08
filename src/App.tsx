import { useState } from "react";
import "./App.css";
import bgImage from "./assets/2.png";
import centerImage1 from "./assets/1.png";
import btnImage from "./assets/asset_interaktif_10_btn_id.png";

// Components
import MenuPage from "./MenuPage";

function App() {
  const [page, setPage] = useState(0);
  const [lang, setLang] = useState<'ID' | 'EN'>('ID');

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
    <div className="fixed inset-0 w-full h-full overflow-hidden">
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
      <div className="absolute inset-0 z-0 bg-black/20" />

      {/* Main Content Wrapper */}
      <section className="relative z-10 w-full h-full flex justify-center box-border overflow-hidden">
        {/* Wrapper w-fit ensures its bounds snap tightly to the contained image, making "top-right" place it correctly on the image corner */}
        <div className="relative h-full flex flex-col items-center w-fit">
          <img 
            src={page === 0 ? centerImage1 : bgImage} 
            alt="Centered image" 
            className="h-full w-auto object-contain shadow-2xl rounded-2xl"
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

          {page === 0 && (
            <>
              {/* Text Overlay precisely placed within the bounds of the red board */}
              <div 
                className="absolute flex flex-col justify-center items-center text-center px-2"
                style={{
                  top: '25%',       // Starts exactly below the bride/groom cartoon
                  bottom: '37%',    // Ends at the bottom border of the red board
                  left: '5%', 
                  right: '5%',
                }}
              >
                <p className="text-[#3b3b3b] font-bold text-[20px]" style={{ marginBottom: '0.5vh', fontFamily: "'Talk Comic', sans-serif" }}>
                  {t.weddingOf}
                </p>
                <h1 
                  className="font-black text-[#e43232] tracking-wider whitespace-nowrap"
                  style={{
                    fontSize: '4.8vh',
                    WebkitTextStroke: '0.15vh #4a1515',
                    textShadow: '0.2vh 0.2vh 0px #4a1515',
                    marginBottom: '1vh',
                    fontFamily: "'Talk Comic', sans-serif"
                  }}
                >
                  Ramizah & Luay
                </h1>
                <p className="text-[#3b3b3b]" style={{ fontSize: '2vh' }}>
                  {t.to}
                </p>
                <p className="text-[#3b3b3b] font-bold" style={{ fontSize: '2vh' }}>
                  {t.guest}
                </p>
                <p className="text-[#4a4a4a] italic leading-tight" style={{ fontSize: '1.5vh', marginBottom: '2vh' }}>
                  {t.apology}
                </p>
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
                  <img src={btnImage} alt="Buka Undangan" className="h-[9.5vh] w-auto drop-shadow-lg" />
                </button>
              </div>
            </>
          )}

          {page === 1 && <MenuPage onBack={() => setPage(0)} lang={lang} />}

        </div>
      </section>
    </div>
  );
}

export default App;
