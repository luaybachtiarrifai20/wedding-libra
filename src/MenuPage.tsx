import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

import gDateVenue from "./assets/asset_interaktif_10_date_venue.png";
import gDresscode from "./assets/asset_interaktif_10_dresscode_hijab.png";
import gAboutUs from "./assets/asset_interaktif_10_about_us_hijab.png";
import gLoveStory from "./assets/asset_interaktif_10_love_story_hijab.png";
import gRsvp from "./assets/asset_interaktif_10_rsvp.png";
import gGift from "./assets/asset_interaktif_10_gift.png";
import gQrCode from "./assets/qr_code.png";
import gAboutUs2 from "./assets/bersama.jpeg";
import gPutri from "./assets/ramizah.jpeg";
import gPutra from "./assets/luay.jpeg";

type MenuPageProps = {
  onBack: () => void;
  lang: 'ID' | 'EN';
  isDarkMode: boolean;
  guestId: string | null;
  guestName: string | null;
};

export default function MenuPage({ onBack, lang, isDarkMode, guestId, guestName }: MenuPageProps) {
  const [showQrCode, setShowQrCode] = useState(false);
  const [showDresscode, setShowDresscode] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  const [showDateVenue, setShowDateVenue] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showLoveStory, setShowLoveStory] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showGiftDetails, setShowGiftDetails] = useState(false);

  // RSVP form state
  const [rsvpName, setRsvpName] = useState(guestName ?? '');
  const [rsvpWish, setRsvpWish] = useState('');
  const [rsvpAttendance, setRsvpAttendance] = useState<'present' | 'absent' | null>(null);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = async () => {
    if (!guestId || rsvpSubmitting || rsvpSubmitted) return;
    if (!rsvpName.trim()) return;
    setRsvpSubmitting(true);
    try {
      await addDoc(collection(db, 'responses'), {
        guestId,
        name: rsvpName.trim(),
        wish: rsvpWish.trim(),
        attendance: rsvpAttendance ?? 'none',
        timestamp: serverTimestamp(),
      });
      setRsvpSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setRsvpSubmitting(false);
    }
  };

  interface Response {
    id: string;
    guestId: string;
    name: string;
    wish: string;
    attendance: 'present' | 'absent' | 'none';
    timestamp: { toDate: () => Date } | null;
  }

  const [responses, setResponses] = useState<Response[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'responses'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const respData = snapshot.docs.map(doc => ({
        id: doc.id,
        guestId: doc.data().guestId || '',
        name: doc.data().name || '',
        wish: doc.data().wish || '',
        attendance: doc.data().attendance || 'none',
        timestamp: doc.data().timestamp
      }));
      setResponses(respData);
    });
    return () => unsubscribe();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(lang === 'ID' ? 'Berhasil disalin: ' + text : 'Successfully copied: ' + text);
  };

  // Countdown logic target date "Sabtu, 27 Juni 2026 08:00 WIB"
  const targetDate = new Date("2026-06-27T08:00:00+07:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // initial check to avoid 1 sec delay
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

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
      rsvpSpecialDesc: "Fitur ini hanya dapat diakses oleh tamu yang terdaftar.",
      dateVenueTitle: "Data Acara",
      saveTheDate: "Save The Date",
      days: "Hari",
      hours: "Jam",
      minutes: "Menit",
      seconds: "Detik",
      saveDateBtn: "Simpan Tanggal",
      akadNikah: "Akad Nikah",
      dateAkad: "Sabtu, 27 Juni 2026",
      timeAkad: "",
      resepsi: "Resepsi",
      dateResepsi: "Sabtu, 27 Juni 2026",
      timeResepsi: "09:30 WIB",
      eventLocation: "Lokasi Acara",
      venueName: "Arif Rahman Hakim Convention Hall",
      venueAddress: "Jl. Arief Rahman Hakim No.131, Keputih, Kec. Sukolilo, Surabaya",
      googleMapsBtn: "Google Maps",
      liveStreaming: "Live Streaming",
      liveStreamingDesc: "Temui kami secara virtual untuk menyaksikan acara pernikahan kami yang insyaaAllah akan disiarkan langsung melalui link dibawah ini.",
      liveStreamBtn: "Lihat Live Streaming",
      aboutUsTitle: "Tentang Kami",
      quranQuote: "\"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.\"",
      quranSource: "Q.S Ar-Rum : 21",
      greeting: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
      prayer: "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami.",
      brideChildOf: "Putri Pertama dari",
      groomChildOf: "Putra Ketiga dari",
      loveStoryTitle: "Love Story",
      lsHeading1: "Rajutan",
      lsHeading2: "Keabadian",
      lsSubHeading: "Di mana Takdir Akhirnya Berpulang...",
      lsP1: "Di sebuah musim dengan harapan yang saling bertaut, kami menemukan sesuatu yang jauh lebih dalam dari sekadar pencapaian yang kami kejar. Kami adalah penenun mimpi yang sama, berdampingan, hingga kehidupan membisikkan arah yang berbeda dan menarik kami ke dalam ketidaktahuan yang luas.",
      lsP2: "Jarak di antara kami merentang jauh, dan gaung tentang 'kita' memudar, namun fondasinya tetap ada. Kini, Tuhan telah menyatukan kembali jalan kami untuk pulang.",
      lsP3: "Kami tak lagi berjalan menuju cakrawala yang fana; kami memulai sebuah perjalanan besar yang melampaui waktu—bersama untuk selamanya.",
      giftTitle: "Wedding Gift",
      giftMessage1: "Doa Restu Anda merupakan karunia yang sangat berarti bagi kami.",
      giftMessage2: "Dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi melalui dibawah ini.",
      clickHereBtn: "Klik di Sini",
      accountNo: "No Rekening",
      accountName: "Atas Nama",
      copyBtn: "Salin",
      giftBox: "Kado",
      recipientName: "Nama Penerima",
      recipientAddress: "Alamat Penerima",
      addressText: "Ciptonegaran 004/006 Sanggrahan Grogol Sukoharjo"
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
      rsvpSpecialDesc: "This feature is only accessible to registered guests.",
      dateVenueTitle: "Event Details",
      saveTheDate: "Save The Date",
      days: "Days",
      hours: "Hours",
      minutes: "Mins",
      seconds: "Secs",
      saveDateBtn: "Save the Date",
      akadNikah: "Wedding Ceremony",
      dateAkad: "Saturday, June 27, 2026",
      timeAkad: "",
      resepsi: "Wedding Reception",
      dateResepsi: "Saturday, June 27, 2026",
      timeResepsi: "09:30 AM",
      eventLocation: "Venue",
      venueName: "Arif Rahman Hakim Convention Hall",
      venueAddress: "Jl. Arief Rahman Hakim No.131, Keputih, Kec. Sukolilo, Surabaya",
      googleMapsBtn: "Google Maps",
      liveStreaming: "Live Streaming",
      liveStreamingDesc: "Meet us virtually to witness our wedding event which will be broadcasted live through the link below.",
      liveStreamBtn: "Watch Live Stream",
      aboutUsTitle: "About Us",
      quranQuote: "\"And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.\"",
      quranSource: "Q.S Ar-Rum : 21",
      greeting: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
      prayer: "Glory be to Allah who created His creatures in pairs. O Allah, may Your blessings be poured upon our marriage.",
      brideChildOf: "First daughter of",
      groomChildOf: "Third son of",
      loveStoryTitle: "Love Story",
      lsHeading1: "The Infinite",
      lsHeading2: "Tapestry",
      lsSubHeading: "Where Destiny Finally Returns...",
      lsP1: "In a season of intertwined hopes, we found something far deeper than the milestones we were chasing. We were weavers of a common dream, side by side, until life whispered a different direction and pulled us into the vast unknown.",
      lsP2: "The space between us was long, and the echoes of 'us' grew faint, but the foundation remained. Now, God has aligned our paths to bring us home.",
      lsP3: "We are no longer walking toward fleeting horizons; we are beginning the one odyssey that transcends time—our forever together.",
      giftTitle: "Wedding Gift",
      giftMessage1: "Your blessings are a tremendous gift that means a lot to us.",
      giftMessage2: "And if giving is a token of your affection, you can give via the options below.",
      clickHereBtn: "Click Here",
      accountNo: "Account No",
      accountName: "Account Name",
      copyBtn: "Copy",
      giftBox: "Gift Package",
      recipientName: "Recipient Name",
      recipientAddress: "Shipping Address",
      addressText: "Ciptonegaran 004/006 Sanggrahan Grogol Sukoharjo"
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
      <div className="absolute top-[10%] left-[15%] w-[18%] min-w-[36px]">
        <button onClick={() => setShowQrCode(true)} className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center">
          <img src={gQrCode} alt="Qr Code" className={`w-full transition-all duration-700 animate-zoom-in-out ${isDarkMode ? 'drop-shadow-[0_0_25px_rgba(255,223,0,0.95)]' : 'drop-shadow-[0_0_12px_rgba(180,240,255,0.9)]'}`} style={{ animationDelay: '0ms' }} />
        </button>
      </div>

      {/* Date & Venue: Upper Right */}
      <div className="absolute top-[16%] right-[20%] w-[18%] min-w-[36px]">
        <button
          onClick={() => setShowDateVenue(true)}
          className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center relative"
        >
          <img src={gDateVenue} alt="Date & Venue" className={`w-[90%] transition-all duration-700 animate-[zoomInOut_3s_ease-in-out_infinite_alternate] ${isDarkMode ? 'drop-shadow-[0_0_25px_rgba(255,223,0,0.95)] scale-100' : 'drop-shadow-[0_0_12px_rgba(180,240,255,0.9)]'}`} style={{ animationDelay: '200ms' }} />
        </button>
      </div>

      {/* Dress Code: Mid Left */}
      <div className="absolute top-[23%] left-[22%] w-[18%] min-w-[36px]">
        <button
          onClick={() => setShowDresscode(true)}
          className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center relative"
        >
          <img src={gDresscode} alt="Dress Code" className={`w-[85%] transition-all duration-700 animate-[zoomInOut_3s_ease-in-out_infinite_alternate] ${isDarkMode ? 'drop-shadow-[0_0_25px_rgba(255,223,0,0.95)]' : 'drop-shadow-[0_0_12px_rgba(180,240,255,0.9)]'}`} style={{ animationDelay: '300ms' }} />
        </button>
      </div>

      {/* Love Story: Mid Left Edge */}
      <div className="absolute top-[40%] left-[6%] w-[20%] min-w-[40px]">
        <button
          onClick={() => setShowLoveStory(true)}
          className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center"
        >
          <img src={gLoveStory} alt="Love Story" className={`w-full transition-all duration-700 animate-zoom-in-out ${isDarkMode ? 'drop-shadow-[0_0_25px_rgba(255,223,0,0.95)]' : 'drop-shadow-[0_0_12px_rgba(180,240,255,0.9)]'}`} style={{ animationDelay: '100ms' }} />
        </button>
      </div>

      {/* About Us: Center */}
      <div className="absolute top-[36%] left-[32%] w-[33%] min-w-[60px]">
        <button
          onClick={() => setShowAboutUs(true)}
          className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center"
        >
          <img src={gAboutUs} alt="About Us" className={`w-full transition-all duration-700 animate-zoom-in-out ${isDarkMode ? 'drop-shadow-[0_0_25px_rgba(255,223,0,0.95)]' : 'drop-shadow-[0_0_12px_rgba(180,240,255,0.9)]'}`} style={{ animationDelay: '400ms' }} />
        </button>
      </div>

      {/* RSVP: Mid Right */}
      <div className="absolute top-[48%] right-[8%] w-[30%] min-w-[56px]">
        <button
          onClick={() => setShowRsvp(true)}
          className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center"
        >
          <img src={gRsvp} alt="RSVP" className={`w-[85%] transition-all duration-700 animate-zoom-in-out ${isDarkMode ? 'drop-shadow-[0_0_25px_rgba(255,223,0,0.95)]' : 'drop-shadow-[0_0_12px_rgba(180,240,255,0.9)]'}`} style={{ animationDelay: '150ms' }} />
        </button>
      </div>

      {/* Gift: Bottom Right */}
      <div className="absolute bottom-[20%] right-[12%] w-[26%] min-w-[48px]">
        <button
          onClick={() => { setShowGift(true); setShowGiftDetails(false); }}
          className="cursor-pointer hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center"
        >
          <img src={gGift} alt="Wedding Gift" className={`w-full transition-all duration-700 animate-zoom-in-out ${isDarkMode ? 'drop-shadow-[0_0_25px_rgba(255,223,0,0.95)]' : 'drop-shadow-[0_0_12px_rgba(180,240,255,0.9)]'}`} style={{ animationDelay: '250ms' }} />
        </button>
      </div>

      {/* QR Code Popup */}
      {showQrCode && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px] transition-opacity rounded-2xl">
          <div
            className="relative w-[90vw] max-w-[360px] bg-white rounded-2xl flex flex-col shadow-2xl border-[3px] border-white ring-4 ring-[#b91c1c] max-h-[88%]"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 4px #b91c1c inset'
            }}
          >
            {/* Header */}
            <div className="bg-[#b91c1c] py-2.5 px-4 flex items-center justify-center relative rounded-t-xl mx-1 mt-1 shrink-0">
              <h2 className="text-white text-lg sm:text-xl tracking-wider pt-1" style={{ fontFamily: "'Talk Comic', sans-serif" }}>
                QR Code
              </h2>
              <button
                onClick={() => setShowQrCode(false)}
                className="absolute right-3 bg-white text-[#b91c1c] rounded-full p-0.5 hover:scale-110 transition-transform shadow-md cursor-pointer flex items-center justify-center"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-3 py-5 sm:px-5 sm:py-6 flex flex-col items-center text-center bg-white rounded-b-xl mx-1 mb-1 overflow-y-auto">
              {guestId ? (
                <>
                  <p className="text-sm text-gray-800 mb-5 font-bold">
                    Tunjukkan QR Code ini kepada penerima tamu.
                  </p>
                  <div className="w-full border-2 border-red-200 rounded-xl p-4 shadow-[4px_4px_0_0_#b91c1c] bg-white mb-3 flex items-center justify-center">
                    <div className="bg-white p-2">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(guestId)}`}
                        alt={`QR Code ${guestName}`}
                        width={150}
                        height={150}
                      />
                    </div>
                  </div>
                  {guestName && <h3 className="font-extrabold text-[#b91c1c] text-lg mt-2 text-center break-words max-w-full px-2 leading-tight">{guestName}</h3>}
                </>
              ) : (
                <div className="w-full p-4 rounded-xl text-center" style={{ backgroundColor: '#fffdfd', border: '1px solid #fce8e8' }}>
                  <h4 className="text-[#964747] font-bold text-sm mb-1">{t.rsvpSpecialTitle}</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {t.rsvpSpecialDesc}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dresscode Popup */}
      {showDresscode && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px] transition-opacity rounded-2xl">
          {/* Box Container */}
          <div
            className="relative w-[90vw] max-w-[360px] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl border-[3px] border-white ring-4 ring-[#b91c1c]"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 4px #b91c1c inset'
            }}
          >
            {/* Header */}
            <div className="bg-[#b91c1c] py-2.5 px-4 flex items-center justify-center relative rounded-t-xl mx-1 mt-1">
              <h2 className="text-white text-lg sm:text-xl tracking-wider pt-1" style={{ fontFamily: "'Talk Comic', sans-serif" }}>
                Dresscode
              </h2>
              <button
                onClick={() => setShowDresscode(false)}
                className="absolute right-3 bg-white text-[#b91c1c] rounded-full p-0.5 hover:scale-110 transition-transform shadow-md cursor-pointer flex items-center justify-center"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-4 pb-6 sm:px-6 sm:py-6 sm:pb-8 flex flex-col items-center text-center bg-white rounded-b-xl mx-1 mb-1">
              <img src={gDresscode} alt="Dress Code Illustration" className="w-[50%] mb-4 drop-shadow-md" />
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                {t.dresscodeDesc1}<strong className="font-extrabold text-black">{t.dresscodeBold}</strong>{t.dresscodeDesc2}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Popup */}
      {showRsvp && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px] transition-opacity rounded-2xl">
          {/* Box Container */}
          <div
            className="relative w-[90vw] max-w-[360px] bg-white rounded-2xl flex flex-col shadow-2xl border-[3px] border-white ring-4 ring-[#b91c1c] max-h-[88%]"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 4px #b91c1c inset'
            }}
          >
            {/* Header */}
            <div className="bg-[#b91c1c] py-2.5 px-4 flex items-center justify-center relative rounded-t-xl mx-1 mt-1 shrink-0">
              <h2 className="text-white text-lg sm:text-xl tracking-wider pt-1" style={{ fontFamily: "'Talk Comic', sans-serif" }}>
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
            <div className="px-3 py-3 pb-5 sm:px-5 sm:py-5 sm:pb-6 flex flex-col items-center text-center bg-white rounded-b-xl mx-1 mb-1 overflow-y-auto">
              <img src={gRsvp} alt="RSVP Illustration" className="w-[50%] mb-3 drop-shadow-md" />
              <p className="text-xs sm:text-sm text-gray-800 mb-5 font-medium">
                {t.rsvpDesc}
              </p>

              {/* Form Card */}
              {guestId ? (
                !rsvpSubmitted ? (
                  <div className="w-full border-2 border-red-200 rounded-xl p-3 sm:p-4 shadow-[4px_4px_0_0_#b91c1c] bg-white mb-5">
                    <input
                      type="text"
                      placeholder={t.rsvpNamePlaceholder}
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full border-2 border-red-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#b91c1c] mb-3 text-gray-700"
                    />
                    <textarea
                      placeholder={t.rsvpMessagePlaceholder}
                      rows={3}
                      value={rsvpWish}
                      onChange={(e) => setRsvpWish(e.target.value)}
                      className="w-full border-2 border-red-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#b91c1c] mb-4 resize-none text-gray-700"
                    />

                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px bg-red-200 flex-1"></div>
                      <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">{t.rsvpConfirm}</span>
                      <div className="h-px bg-red-200 flex-1"></div>
                    </div>

                    <div className="flex gap-2 sm:gap-1 mb-4">
                      <button
                        onClick={() => setRsvpAttendance('present')}
                        className={`flex-1 border-2 rounded-full py-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${rsvpAttendance === 'present' ? 'border-[#b91c1c] bg-red-50 text-[#b91c1c]' : 'border-red-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        {t.rsvpAttend}
                      </button>
                      <button
                        onClick={() => setRsvpAttendance('absent')}
                        className={`flex-1 border-2 rounded-full py-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${rsvpAttendance === 'absent' ? 'border-[#b91c1c] bg-red-50 text-[#b91c1c]' : 'border-red-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        {t.rsvpDecline}
                      </button>
                    </div>

                    <button
                      onClick={handleRsvpSubmit}
                      disabled={rsvpSubmitting || !rsvpName.trim() || !rsvpAttendance}
                      className="w-full bg-[#b91c1c] text-white rounded-xl py-2 px-6 text-xs sm:text-sm font-bold shadow-[0_3px_0_0_#7f1d1d] hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#7f1d1d] active:translate-y-[3px] active:shadow-none hover:bg-red-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {rsvpSubmitting ? 'Mengirim...' : 'Kirim'}
                    </button>
                  </div>
                ) : (
                  <div className="w-full p-4 rounded-xl text-center mb-5" style={{ backgroundColor: '#fffdfd', border: '1px solid #fce8e8' }}>
                    <p className="text-sm text-gray-700 font-medium">Terima kasih atas ucapan dan konfirmasi kehadiran Anda.</p>
                  </div>
                )
              ) : (
                /* Special Note Card */
                <div className="w-full p-4 rounded-xl text-center mb-5" style={{ backgroundColor: '#fffdfd', border: '1px solid #fce8e8' }}>
                  <h4 className="text-[#964747] font-bold text-sm mb-1">{t.rsvpSpecialTitle}</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {t.rsvpSpecialDesc}
                  </p>
                </div>
              )}

              {/* List of wishes */}
              {responses.length > 0 && guestId && (
                <div className="w-full flex flex-col gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-red-200 flex-1"></div>
                    <span className="text-[10px] sm:text-xs text-[#b91c1c] font-bold uppercase tracking-wider">Ucapan ({responses.length})</span>
                    <div className="h-px bg-red-200 flex-1"></div>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto custom-scrollbar flex flex-col gap-3 px-1">
                    {responses.map((resp) => (
                      <div key={resp.id} className="bg-gray-50/80 border border-gray-100 rounded-lg p-3 shadow-sm relative">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h5 className="font-bold text-xs text-gray-800 break-words">{resp.name}</h5>
                          {resp.attendance === 'present' && (
                            <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full whitespace-nowrap font-bold shrink-0 items-center justify-center flex"><svg className="w-2.5 h-2.5 mr-0.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> {t.rsvpAttend}</span>
                          )}
                          {resp.attendance === 'absent' && (
                            <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full whitespace-nowrap font-bold shrink-0 items-center justify-center flex"><svg className="w-2.5 h-2.5 mr-0.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg> {t.rsvpDecline}</span>
                          )}
                        </div>
                        {resp.wish && (
                          <p className="text-xs text-gray-600 leading-relaxed break-words">{resp.wish}</p>
                        )}
                        {resp.timestamp && (
                          <p className="text-[9px] text-gray-400 mt-2 text-right">
                            {new Date(resp.timestamp?.toDate ? resp.timestamp.toDate() : Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Date & Venue Popup */}
      {showDateVenue && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px] transition-opacity rounded-2xl">
          <div
            className="relative w-[90vw] max-w-[360px] bg-white rounded-2xl flex flex-col shadow-2xl border-[3px] border-white ring-4 ring-[#b91c1c] max-h-[88%]"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 4px #b91c1c inset'
            }}
          >
            {/* Header */}
            <div className="bg-[#b91c1c] py-2.5 px-4 flex items-center justify-center relative rounded-t-xl mx-1 mt-1 shrink-0">
              <h2 className="text-white text-lg sm:text-xl tracking-wider pt-1" style={{ fontFamily: "'Talk Comic', sans-serif" }}>
                {t.dateVenueTitle}
              </h2>
              <button
                onClick={() => setShowDateVenue(false)}
                className="absolute right-3 bg-white text-[#b91c1c] rounded-full p-0.5 hover:scale-110 transition-transform shadow-md cursor-pointer flex items-center justify-center"
                aria-label="Close"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-3 py-3 pb-5 sm:px-5 sm:py-5 sm:pb-6 flex flex-col items-center text-center bg-white rounded-b-xl mx-1 mb-1 overflow-y-auto custom-scrollbar">

              {/* Save The Date Card */}
              <div className="w-full border-2 border-red-200 rounded-xl p-3 sm:p-5 shadow-[4px_4px_0_0_#b91c1c] bg-white mb-5">
                <h3 className="text-[#b91c1c] font-black text-base sm:text-lg mb-3" style={{ fontFamily: "'Talk Comic', sans-serif" }}>{t.saveTheDate}</h3>

                <div className="flex justify-center gap-1 sm:gap-2 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-[#b91c1c] text-white text-sm sm:text-lg font-bold rounded-lg w-9 h-10 sm:w-11 sm:h-12 flex items-center justify-center shadow-inner">{String(timeLeft.days).padStart(2, '0')}</div>
                    <span className="text-[9px] sm:text-xs text-gray-600 mt-1 font-bold">{t.days}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-[#b91c1c] text-white text-sm sm:text-lg font-bold rounded-lg w-9 h-10 sm:w-11 sm:h-12 flex items-center justify-center shadow-inner">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <span className="text-[9px] sm:text-xs text-gray-600 mt-1 font-bold">{t.hours}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-[#b91c1c] text-white text-sm sm:text-lg font-bold rounded-lg w-9 h-10 sm:w-11 sm:h-12 flex items-center justify-center shadow-inner">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <span className="text-[9px] sm:text-xs text-gray-600 mt-1 font-bold">{t.minutes}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-[#b91c1c] text-white text-sm sm:text-lg font-bold rounded-lg w-9 h-10 sm:w-11 sm:h-12 flex items-center justify-center shadow-inner">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <span className="text-[9px] sm:text-xs text-gray-600 mt-1 font-bold">{t.seconds}</span>
                  </div>
                </div>

                <button className="bg-[#b91c1c] text-white rounded-xl py-2 px-6 text-xs font-bold hover:bg-red-800 transition-colors shadow-[0_3px_0_0_#7f1d1d] hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#7f1d1d] active:shadow-none active:translate-y-[3px] flex items-center justify-center gap-2 mx-auto">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {t.saveDateBtn}
                </button>
              </div>

              {/* Akad Nikah & Resepsi Card */}
              <div className="w-full border-2 border-red-200 rounded-xl p-3 sm:p-5 shadow-[4px_4px_0_0_#b91c1c] bg-white mb-5">
                <h3 className="text-[#b91c1c] font-black text-lg mb-2" style={{ fontFamily: "'Talk Comic', sans-serif" }}>{t.akadNikah}</h3>
                <p className="text-sm font-medium text-gray-800">{t.dateAkad}</p>
                {t.timeAkad && (
                  <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-800 mb-2 mt-1">
                    <svg className="w-3.5 h-3.5 text-[#b91c1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {t.timeAkad}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-3">{t.eventLocation}</p>
                <p className="text-sm font-bold text-gray-800 mt-1 mb-1">{t.venueName}</p>
                <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed max-w-[80%] mx-auto">{t.venueAddress}</p>

                <div className="flex items-center justify-center gap-2 my-5 opacity-70">
                  <div className="h-px w-20 bg-red-300"></div>
                  <svg className="w-3.5 h-3.5 text-[#b91c1c]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                  <div className="h-px w-20 bg-red-300"></div>
                </div>

                <h3 className="text-[#b91c1c] font-black text-lg mb-2" style={{ fontFamily: "'Talk Comic', sans-serif" }}>{t.resepsi}</h3>
                <p className="text-sm font-medium text-gray-800">{t.dateResepsi}</p>
                {t.timeResepsi && (
                  <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-800 mb-2 mt-1">
                    <svg className="w-3.5 h-3.5 text-[#b91c1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {t.timeResepsi}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-3">{t.eventLocation}</p>
                <p className="text-sm font-bold text-gray-800 mt-1 mb-1">{t.venueName}</p>
                <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed max-w-[80%] mx-auto mb-5">{t.venueAddress}</p>

                <a
                  href="https://share.google/9aUc3iXU0w5R66gQy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#b91c1c] text-white rounded-xl py-2 px-5 text-xs font-bold hover:bg-red-800 transition-colors shadow-[0_3px_0_0_#7f1d1d] hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#7f1d1d] active:shadow-none active:translate-y-[3px] flex items-center justify-center gap-2 mx-auto w-fit cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg>
                  {t.googleMapsBtn}
                </a>
              </div>

              {/* Live Streaming Card */}
              <div className="w-full border-2 border-red-200 rounded-xl p-3 sm:p-5 shadow-[4px_4px_0_0_#b91c1c] bg-white mb-2">
                <h3 className="text-[#b91c1c] font-black text-lg mb-3" style={{ fontFamily: "'Talk Comic', sans-serif" }}>{t.liveStreaming}</h3>
                <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed mb-5">
                  {t.liveStreamingDesc}
                </p>
                <a
                  href="https://www.instagram.com/zaramizah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#b91c1c] text-white rounded-xl py-2 px-5 text-xs font-bold hover:bg-red-800 transition-colors shadow-[0_3px_0_0_#7f1d1d] hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#7f1d1d] active:shadow-none active:translate-y-[3px] flex items-center justify-center gap-2 mx-auto w-fit cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" /></svg>
                  {t.liveStreamBtn}
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* About Us Popup */}
      {showAboutUs && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px] transition-opacity rounded-2xl">
          <div
            className="relative w-[90vw] max-w-[360px] bg-white rounded-2xl flex flex-col shadow-2xl border-[3px] border-white ring-4 ring-[#b91c1c] max-h-[88%]"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 4px #b91c1c inset'
            }}
          >
            {/* Header */}
            <div className="bg-[#b91c1c] py-2.5 px-4 flex items-center justify-center relative rounded-t-xl mx-1 mt-1 shrink-0">
              <h2 className="text-white text-lg sm:text-xl tracking-wider pt-1" style={{ fontFamily: "'Talk Comic', sans-serif" }}>
                {t.aboutUsTitle}
              </h2>
              <button
                onClick={() => setShowAboutUs(false)}
                className="absolute right-3 bg-white text-[#b91c1c] rounded-full p-0.5 hover:scale-110 transition-transform shadow-md cursor-pointer flex items-center justify-center gap-2 mx-auto"
                aria-label="Close"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-3 py-3 pb-5 sm:px-5 sm:py-5 sm:pb-6 flex flex-col items-center text-center bg-white rounded-b-xl mx-1 mb-1 overflow-y-auto custom-scrollbar">

              {/* Card 1: Quran Quote */}
              <div className="w-full border-2 border-red-200 rounded-xl p-2 shadow-[4px_4px_0_0_#b91c1c] bg-white mb-5 flex flex-col items-center">
                <img src={gAboutUs2} alt="About Us" className="w-[100%] mb-4 opacity-90 drop-shadow-md rounded-xl" />
                <p className="text-[11px] sm:text-[12px] text-gray-700 leading-relaxed max-w-[95%] mb-4 italic">
                  {t.quranQuote}
                </p>
                <p className="text-sm font-black text-gray-800 tracking-wider">
                  {t.quranSource}
                </p>
              </div>

              {/* Card 2: Prayer */}
              <div className="w-full border-2 border-red-200 rounded-xl p-3 sm:p-5 sm:px-6 shadow-[4px_4px_0_0_#b91c1c] bg-white mb-5 flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 mb-4 w-full">
                  <div className="h-px bg-red-200 flex-1"></div>
                  <svg className="w-4 h-4 text-[#b91c1c]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                  <div className="h-px bg-red-200 flex-1"></div>
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-gray-800 mb-4 leading-relaxed max-w-[80%]">
                  {t.greeting}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-medium">
                  {t.prayer}
                </p>
              </div>

              {/* Card 3: Bride */}
              <div className="w-full border-2 border-red-200 rounded-xl p-3 pb-6 shadow-[4px_4px_0_0_#b91c1c] bg-white mb-5">
                <div className="relative w-full aspect-[4/5] bg-white border-2 border-gray-100 rounded-lg mb-6 shadow-inner">
                  <img src={gPutri} alt="Ramizah" className="w-full h-full object-cover rounded-md" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#b91c1c] text-white font-black text-sm px-6 py-1 rounded-full shadow-[0_3px_0_0_#7f1d1d] tracking-widest outline outline-4 outline-white" style={{ fontFamily: "'Talk Comic', sans-serif" }}>
                    Ramizah
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-sm mb-1 mt-3">Ramizah Ariq Sakinah Irvansyah</h3>
                <p className="text-[10px] text-gray-500 mb-1 font-medium">{t.brideChildOf}</p>
                <p className="text-[10px] sm:text-[11px] text-gray-800 font-bold max-w-[85%] mx-auto leading-relaxed mb-4">
                  Bapak Ars. Irvasyah, ST., MT dan Ibu Santi Williandari A.Md., S.S
                </p>
                <a
                  href="https://www.instagram.com/zaramizah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#b91c1c] text-white rounded-full py-1.5 px-4 text-[10px] font-bold hover:bg-red-800 transition-colors shadow-[0_2px_0_0_#7f1d1d] active:translate-y-[2px] active:shadow-none inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  @zaramizah
                </a>
              </div>

              {/* Card 4: Groom */}
              <div className="w-full border-2 border-red-200 rounded-xl p-3 pb-6 shadow-[4px_4px_0_0_#b91c1c] bg-white mb-2">
                <div className="relative w-full aspect-[4/5] bg-white border-2 border-gray-100 rounded-lg mb-6 shadow-inner">
                  <img src={gPutra} alt="Luay" className="w-full h-full object-cover rounded-md" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#b91c1c] text-white font-black text-sm px-7 py-1 rounded-full shadow-[0_3px_0_0_#7f1d1d] tracking-widest outline outline-4 outline-white" style={{ fontFamily: "'Talk Comic', sans-serif" }}>
                    Luay
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-sm mb-1 mt-3">Luay Bachtiar Rifai</h3>
                <p className="text-[10px] text-gray-500 mb-1 font-medium">{t.groomChildOf}</p>
                <p className="text-[10px] sm:text-[11px] text-gray-800 font-bold max-w-[85%] mx-auto leading-relaxed mb-4">
                  Alm Bapak Mustafa Abdullah dan Ibu Emmy Noor Laily
                </p>
                <a
                  href="https://www.instagram.com/luaybachtiar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#b91c1c] text-white rounded-full py-1.5 px-4 text-[10px] font-bold hover:bg-red-800 transition-colors shadow-[0_2px_0_0_#7f1d1d] active:translate-y-[2px] active:shadow-none inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  @luaybachtiar
                </a>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Love Story Popup */}
      {showLoveStory && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px] transition-opacity rounded-2xl">
          <div
            className="relative w-[90vw] max-w-[360px] bg-white rounded-2xl flex flex-col shadow-2xl border-[3px] border-white ring-4 ring-[#b91c1c] max-h-[88%]"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 4px #b91c1c inset'
            }}
          >
            {/* Header */}
            <div className="bg-[#b91c1c] py-2.5 px-4 flex items-center justify-center relative rounded-t-xl mx-1 mt-1 shrink-0">
              <h2 className="text-white text-lg sm:text-xl tracking-wider pt-1" style={{ fontFamily: "'Talk Comic', sans-serif" }}>
                {t.loveStoryTitle}
              </h2>
              <button
                onClick={() => setShowLoveStory(false)}
                className="absolute right-3 bg-white text-[#b91c1c] rounded-full p-0.5 hover:scale-110 transition-transform shadow-md cursor-pointer flex items-center justify-center gap-2 mx-auto"
                aria-label="Close"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-6 pb-8 sm:px-6 sm:py-10 sm:pb-12 flex flex-col items-center text-center bg-white rounded-b-xl mx-1 mb-1 overflow-y-auto custom-scrollbar relative">
              <h3 className="text-[22px] sm:text-2xl text-[#b91c1c] mb-3 leading-tight font-medium" style={{ fontFamily: "Georgia, serif" }}>
                {t.lsHeading1}<br />{t.lsHeading2}
              </h3>
              <p className="text-xs text-gray-500 italic mb-8">
                {t.lsSubHeading}
              </p>

              <div className="text-xs sm:text-[13px] text-gray-700 leading-[1.8] space-y-6 px-1">
                <p>{t.lsP1}</p>
                <p>{t.lsP2}</p>
                <p>{t.lsP3}</p>
              </div>

              <div className="mt-12 font-bold text-[#b91c1c] text-xl sm:text-2xl" style={{ fontFamily: "Georgia, serif" }}>
                R &amp; L
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wedding Gift Popup */}
      {showGift && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px] transition-opacity rounded-2xl">
          <div
            className="relative w-[90vw] max-w-[360px] bg-white rounded-2xl flex flex-col shadow-2xl border-[3px] border-white ring-4 ring-[#b91c1c] max-h-[88%]"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 4px #b91c1c inset'
            }}
          >
            {/* Header */}
            <div className="bg-[#b91c1c] py-2.5 px-4 flex items-center justify-center relative rounded-t-xl mx-1 mt-1 shrink-0">
              <h2 className="text-white text-lg sm:text-xl tracking-wider pt-1" style={{ fontFamily: "'Talk Comic', sans-serif" }}>
                {t.giftTitle}
              </h2>
              <button
                onClick={() => setShowGift(false)}
                className="absolute right-3 bg-white text-[#b91c1c] rounded-full p-0.5 hover:scale-110 transition-transform shadow-md cursor-pointer flex items-center justify-center gap-2 mx-auto"
                aria-label="Close"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-3 py-4 pb-6 sm:px-5 sm:py-6 sm:pb-8 flex flex-col items-center text-center bg-white/95 rounded-b-xl mx-1 mb-1 overflow-y-auto custom-scrollbar relative">

              <img src={gGift} alt="Gift Box" className="w-[50%] mb-4 drop-shadow-md" />
              <p className="text-xs sm:text-sm text-gray-800 mb-2 font-medium leading-relaxed px-2">
                {t.giftMessage1}
              </p>
              <p className="text-xs sm:text-sm text-gray-800 mb-6 font-medium leading-relaxed px-2">
                {t.giftMessage2}
              </p>

              <button
                onClick={() => setShowGiftDetails(true)}
                className="bg-[#b91c1c] text-white rounded-xl py-2 px-6 text-xs sm:text-sm font-bold shadow-[0_3px_0_0_#7f1d1d] hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#7f1d1d] active:translate-y-[3px] active:shadow-none hover:bg-red-800 transition-all mb-4 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4h12v12H4V4zm2 2v8h8V6H6zm2 2h4v4H8V8z" /></svg>
                {t.clickHereBtn}
              </button>

              {/* Render Gift Delivery Card only after clicking */}
              {showGiftDetails && (
                <div className="w-full flex flex-col gap-4 mt-4 animate-zoom-in-out" style={{ animationIterationCount: 1, animationDuration: "0.5s" }}>

                  {/* Kado Delivery Card */}
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-[4px_4px_0_0_#b91c1c] border-[3px] border-red-200 p-5 text-left bg-gradient-to-br from-[#ffffff] to-[#fecaca]">
                    <div className="absolute inset-0 opacity-10 bg-black mix-blend-overlay"></div>
                    <div className="relative z-10">
                      <h3 className="font-extrabold text-[#b91c1c] text-xl tracking-wide mb-5 drop-shadow-sm">{t.giftBox}</h3>

                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-0.5">{t.recipientName}</p>
                      <p className="text-sm font-bold text-gray-800 mb-4 drop-shadow-sm">Ramizah / Luay</p>

                      <div className="flex flex-col gap-3">
                        

                        

                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-1">WhatsApp Contact</p>
                          <div className="flex gap-2 flex-wrap">
                            <a
                              href="https://wa.me/6289619344767?text=Halo%20Luay,%20saya%20ingin%20memberikan%20kado%20untuk%20wedding%20Anda."
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-500 text-white rounded-xl py-1.5 px-3 text-[10px] font-bold shadow-[0_2px_0_0_#166534] active:translate-y-[2px] active:shadow-none flex items-center gap-1.5 hover:bg-green-600 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.024 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" /></svg>
                              Luay
                            </a>
                            <a
                              href="https://wa.me/6281225700592?text=Halo%20Ramizah,%20saya%20ingin%20memberikan%20kado%20untuk%20wedding%20Anda."
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-500 text-white rounded-xl py-1.5 px-3 text-[10px] font-bold shadow-[0_2px_0_0_#166534] active:translate-y-[2px] active:shadow-none flex items-center gap-1.5 hover:bg-green-600 transition-colors"
                            
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.024 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" /></svg>
                              Ramizah
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
