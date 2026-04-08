import { useState } from "react";
import gDateVenue from "./assets/asset_interaktif_10_date_venue.png";
import gDresscode from "./assets/asset_interaktif_10_dresscode_hijab.png";
import gAboutUs from "./assets/asset_interaktif_10_about_us_hijab.png";
import gLoveStory from "./assets/asset_interaktif_10_love_story_hijab.png";
import gRsvp from "./assets/asset_interaktif_10_rsvp.png";
import gGift from "./assets/asset_interaktif_10_gift.png";
import gQrCode from "./assets/qr_code.png";

type MenuPageProps = {
  onBack: () => void;
  lang: 'ID' | 'EN';
};

export default function MenuPage({ onBack, lang }: MenuPageProps) {
  const [showDresscode, setShowDresscode] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);

  const t = {
    ID: {
      back: "Utama",
      dresscodeDesc1: "Tamu diharapkan menggunakan busana dengan warna bebas di hari istimewa kami, ",
      dresscodeBold: "kecuali warna Merah atau Putih",
      dresscodeDesc2: " (jangan menggunakan warna merah atau putih).",
      rsvpTitle: "Ucapan & RSVP",
      rsvpDesc: "Berikan doa dan ucapan terbaik untuk kami.",
      rsvpNamePlaceholder: "nama",
      rsvpMessagePlaceholder: "Ucapan",
      rsvpConfirm: "Konfirmasi Kehadiran",
      rsvpAttend: "Hadir",
      rsvpDecline: "Tidak Hadir",
      rsvpSpecialTitle: "Khusus Undangan",
      rsvpSpecialDesc: "Fitur ini hanya dapat diakses oleh tamu yang terdaftar."
    },
    EN: {
      back: "Back",
      dresscodeDesc1: "Guests are expected to wear free-colored attire on our special day, ",
      dresscodeBold: "except Red or White",
      dresscodeDesc2: " (please do not wear red or white).",
      rsvpTitle: "Wishes & RSVP",
      rsvpDesc: "Send your best wishes and prayers for us.",
      rsvpNamePlaceholder: "name",
      rsvpMessagePlaceholder: "Wishes",
      rsvpConfirm: "Attendance Confirmation",
      rsvpAttend: "Attend",
      rsvpDecline: "Can't Attend",
      rsvpSpecialTitle: "Guest Only",
      rsvpSpecialDesc: "This feature is only accessible to registered guests."
    }
  }[lang];

  return (
    <>
      {/* Navigation Optional Back */}
      <div className="absolute top-[2%] left-[2%] z-50">
         <button 
            onClick={onBack}
            className="bg-white/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow hover:bg-white/80 transition-all cursor-pointer"
         >
            &larr; {t.back}
         </button>
      </div>

      {/* Qr Code: Upper Left */}
      <div className="absolute top-[10%] left-[15%] w-[18%]">
         <button className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center">
            <img src={gQrCode} alt="Qr Code" className="w-full drop-shadow-[0_0_12px_rgba(180,240,255,0.9)] animate-zoom-in-out" style={{ animationDelay: '0ms' }} />
         </button>
      </div>

      {/* Date & Venue: Upper Right */}
      <div className="absolute top-[16%] right-[20%] w-[18%]">
         <button className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center">
            <img src={gDateVenue} alt="Date & Venue" className="w-full drop-shadow-[0_0_12px_rgba(180,240,255,0.9)] animate-zoom-in-out" style={{ animationDelay: '200ms' }} />
         </button>
      </div>

      {/* Dress Code: Mid Left */}
      <div className="absolute top-[23%] left-[22%] w-[18%]">
         <button 
            onClick={() => setShowDresscode(true)}
            className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center"
         >
            <img src={gDresscode} alt="Dress Code" className="w-full drop-shadow-[0_0_12px_rgba(180,240,255,0.9)] animate-zoom-in-out" style={{ animationDelay: '400ms' }} />
         </button>
      </div>

      {/* Love Story: Mid Left Edge */}
      <div className="absolute top-[40%] left-[6%] w-[20%]">
         <button className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center">
            <img src={gLoveStory} alt="Love Story" className="w-full drop-shadow-[0_0_12px_rgba(180,240,255,0.9)] animate-zoom-in-out" style={{ animationDelay: '100ms' }} />
         </button>
      </div>

      {/* About Us: Center */}
      <div className="absolute top-[36%] left-[32%] w-[33%]">
         <button className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center">
            <img src={gAboutUs} alt="About Us" className="w-full drop-shadow-[0_0_12px_rgba(180,240,255,0.9)] animate-zoom-in-out" style={{ animationDelay: '300ms' }} />
         </button>
      </div>

      {/* RSVP: Mid Right */}
      <div className="absolute top-[48%] right-[8%] w-[30%]">
         <button 
            onClick={() => setShowRsvp(true)}
            className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center"
         >
            <img src={gRsvp} alt="RSVP" className="w-full drop-shadow-[0_0_12px_rgba(180,240,255,0.9)] animate-zoom-in-out" style={{ animationDelay: '500ms' }} />
         </button>
      </div>

      {/* Gift: Bottom Right */}
      <div className="absolute bottom-[20%] right-[12%] w-[26%]">
         <button className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center">
            <img src={gGift} alt="Wedding Gift" className="w-full drop-shadow-[0_0_12px_rgba(180,240,255,0.9)] animate-zoom-in-out" style={{ animationDelay: '250ms' }} />
         </button>
      </div>

      {/* Dresscode Popup */}
      {showDresscode && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px] transition-opacity rounded-2xl">
          {/* Box Container */}
          <div 
             className="relative w-full max-w-[360px] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl border-[3px] border-white ring-4 ring-[#b91c1c]"
             style={{ 
               boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 4px #b91c1c inset' 
             }}
          >
            {/* Header */}
            <div className="bg-[#b91c1c] py-3 px-4 flex items-center justify-center relative rounded-t-xl mx-1 mt-1">
              <h2 className="text-white text-xl sm:text-2xl tracking-wider pt-1" style={{ fontFamily: "'Talk Comic', sans-serif" }}>
                Dresscode
              </h2>
              <button 
                onClick={() => setShowDresscode(false)}
                className="absolute right-3 bg-white text-[#b91c1c] rounded-full p-0.5 hover:scale-110 transition-transform shadow-md cursor-pointer flex items-center justify-center"
                aria-label="Close"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Body */}
            <div className="px-6 py-6 pb-8 flex flex-col items-center text-center bg-white rounded-b-xl mx-1 mb-1">
              <img src={gDresscode} alt="Dress Code Illustration" className="w-[55%] mb-5 drop-shadow-md" />
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                {t.dresscodeDesc1}<strong className="font-extrabold text-black">{t.dresscodeBold}</strong>{t.dresscodeDesc2}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Popup */}
      {showRsvp && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px] transition-opacity rounded-2xl">
          {/* Box Container */}
          <div 
             className="relative w-full max-w-[360px] bg-white rounded-2xl flex flex-col shadow-2xl border-[3px] border-white ring-4 ring-[#b91c1c] max-h-[88%]"
             style={{ 
               boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 4px #b91c1c inset' 
             }}
          >
            {/* Header */}
            <div className="bg-[#b91c1c] py-3 px-4 flex items-center justify-center relative rounded-t-xl mx-1 mt-1 shrink-0">
              <h2 className="text-white text-xl sm:text-2xl tracking-wider pt-1" style={{ fontFamily: "'Talk Comic', sans-serif" }}>
                {t.rsvpTitle}
              </h2>
              <button 
                onClick={() => setShowRsvp(false)}
                className="absolute right-3 bg-white text-[#b91c1c] rounded-full p-0.5 hover:scale-110 transition-transform shadow-md cursor-pointer flex items-center justify-center"
                aria-label="Close"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Body */}
            <div className="px-5 py-5 pb-6 flex flex-col items-center text-center bg-white rounded-b-xl mx-1 mb-1 overflow-y-auto">
              <img src={gRsvp} alt="RSVP Illustration" className="w-[50%] mb-3 drop-shadow-md" />
              <p className="text-xs sm:text-sm text-gray-800 mb-5 font-medium">
                {t.rsvpDesc}
              </p>

              {/* Form Card */}
              <div className="w-full border-2 border-red-200 rounded-xl p-4 shadow-[4px_4px_0_0_#b91c1c] bg-white mb-6">
                 <input 
                   type="text" 
                   placeholder={t.rsvpNamePlaceholder} 
                   className="w-full border-2 border-red-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#b91c1c] mb-3 text-gray-700"
                 />
                 <textarea 
                   placeholder={t.rsvpMessagePlaceholder} 
                   rows={3}
                   className="w-full border-2 border-red-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#b91c1c] mb-4 resize-none text-gray-700"
                 />

                 <div className="flex items-center gap-3 mb-4">
                   <div className="h-px bg-red-200 flex-1"></div>
                   <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">{t.rsvpConfirm}</span>
                   <div className="h-px bg-red-200 flex-1"></div>
                 </div>

                 <div className="flex gap-2 sm:gap-1">
                   <button className="flex-1 border-2 border-red-200 text-gray-500 rounded-full py-2 text-xs font-bold flex items-center justify-center gap-1 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     {t.rsvpAttend}
                   </button>
                   <button className="flex-1 border-2 border-red-200 text-gray-500 rounded-full py-2 text-xs font-bold flex items-center justify-center gap-1 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                     {t.rsvpDecline}
                   </button>
                 </div>
              </div>

              {/* Special Note Card */}
              <div className="w-full p-4 rounded-xl text-center" style={{ backgroundColor: '#fffdfd', border: '1px solid #fce8e8' }}>
                <h4 className="text-[#964747] font-bold text-sm mb-1">{t.rsvpSpecialTitle}</h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {t.rsvpSpecialDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
