"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";

export interface WishData {
  name: string;
  presence: string;
  message: string;
  timestamp: string;
}

export interface InvitationData {
  slug?: string;
  theme_id?: string;
  category?: string;
  bride_data: {
    groom: string;
    bride: string;
    parents_groom: string;
    parents_bride: string;
    groom_ig?: string;
    bride_ig?: string;
  };
  event_data: {
    date: string;
    akad_time: string;
    akad_location: string;
    akad_map?: string;
    resepsi_time: string;
    resepsi_location: string;
    resepsi_map?: string;
    live_stream?: string;
  };
  hero_image?: string;
  bg_middle?: string;
  bg_bottom?: string;
  bride_photo?: string;
  groom_photo?: string;
  love_story?: { year: string; title: string; desc: string }[];
  gallery?: string[];
  video?: string;
  gifts?: { bank: string; acc: string; name: string }[];
  music_url?: string;
  quote?: string;
  is_paid?: boolean;
  wishes?: WishData[];
}

interface AdultBdThemeProps {
  data: InvitationData;
  previewMode?: boolean;
  guestName?: string;
}

export default function AdultBdTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: AdultBdThemeProps) {
  const [isOpen, setIsOpen] = useState(previewMode); // Auto-open in preview mode
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // RSVP State
  const [wishes, setWishes] = useState<WishData[]>(data.wishes || []);
  const [rsvpName, setRsvpName] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [rsvpPresence, setRsvpPresence] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!previewMode) {
      const musicSrc = data.music_url || "https://cdn.pixabay.com/download/audio/2022/11/06/audio_f5eb8dfcb7.mp3?filename=beautiful-wedding-125026.mp3";
      audioRef.current = new Audio(musicSrc);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [previewMode]);

  const openInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(err => console.log(err));
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } 
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();
  const calendarDateStr = eventDate.toISOString().split('T')[0].replace(/-/g, '');
  const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+${encodeURIComponent(data.bride_data.groom)}+%26+${encodeURIComponent(data.bride_data.bride)}&dates=${calendarDateStr}/${calendarDateStr}`;

  // Dummy fallback data if missing
  const gallery = data.gallery?.length ? data.gallery : [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80"
  ];
  
  const loveStory = data.love_story?.length ? data.love_story : [
    { year: "2020", title: "Awal Bertemu", desc: "Kami bertemu secara tidak sengaja di sebuah kafe kopi." },
    { year: "2022", title: "Berkomitmen", desc: "Kami memutuskan untuk menjalin hubungan yang lebih serius." },
    { year: "2024", title: "Lamaran", desc: "Hari yang indah saat dua keluarga saling bertemu." }
  ];

  return (
    <div className={`bg-zinc-900 min-h-screen text-rose-400 font-sans selection:bg-[#1a1a1a] selection:text-white ${previewMode ? 'relative' : ''}`}>
      {/* Cover / Hero Overlay  hidden in preview mode */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: "-100%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1a1a] text-white overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                style={{ backgroundImage: `url('${data.hero_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80'}')` }}
              ></div>
              <div className="relative z-10 text-center px-6">
                <FadeIn delay={0.2}>
                  <p className="tracking-widest uppercase text-xs mb-2 text-gray-300">Birthday Celebration</p>
                </FadeIn>
                <FadeIn delay={0.4}>
                  <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4">
                    {data.bride_data.groom || "Groom"} & {data.bride_data.bride || "Bride"}
                  </h1>
                </FadeIn>
                <FadeIn delay={0.6}>
                  <p className="text-sm font-light text-gray-300 mb-8">Kpd Bpk/Ibu/Saudara/i <br/><span className="font-bold text-lg mt-1 block">{guestName}</span></p>
                </FadeIn>
                <FadeIn delay={0.8}>
                  <button 
                    onClick={openInvitation}
                    className="px-8 py-3 bg-zinc-800 text-rose-400 rounded-full font-medium hover:bg-gray-200 transition-colors shadow-lg flex items-center gap-2 mx-auto"
                  >
                    Buka Undangan
                  </button>
                </FadeIn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Preview Mode Banner */}
      {previewMode && (
        <div className="bg-[#1a1a1a] text-white text-center py-2 text-xs uppercase tracking-widest sticky top-0 z-20">
           Mode Preview  Tema Amara Premium 
        </div>
      )}

      {/* Main Content */}
      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: previewMode ? 0 : 1 }} className="pb-32">
          
          {/* Hero Section */}
          <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src={data.hero_image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"} alt="Hero" className="w-full h-full object-cover opacity-10" />
            </div>
            <div className="relative z-10">
              <FadeIn><p className="tracking-widest uppercase text-sm mb-4 text-zinc-400">Birthday Celebration</p></FadeIn>
              <FadeIn delay={0.2}>
                <h2 className="font-serif text-6xl md:text-8xl font-bold mb-6">{data.bride_data.groom || "Groom"} & {data.bride_data.bride || "Bride"}</h2>
              </FadeIn>
              <FadeIn delay={0.4}>
                <p className="text-lg text-zinc-300 italic font-serif mb-12">
                  {eventDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </FadeIn>
              <FadeIn delay={0.6}>
                <Countdown targetDate={eventDate} />
              </FadeIn>
            </div>
          </section>

          {/* Profil Mempelai */}
          <section className="relative py-24 px-6 bg-zinc-800 text-center overflow-hidden">
            {data.bg_middle && (
              <div className="absolute inset-0 z-0">
                <img src={data.bg_middle} alt="Background Middle" className="w-full h-full object-cover opacity-10" />
              </div>
            )}
            <div className="max-w-4xl mx-auto relative z-10">
              <FadeIn>
                <h3 className="font-serif text-4xl mb-6">Yang Berbahagia</h3>
                <p className="text-zinc-300 mb-16 font-light max-w-2xl mx-auto">Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri resepsi pernikahan kami.</p>
              </FadeIn>
              <div className="grid md:grid-cols-2 gap-16">
                <FadeIn delay={0.2}>
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-6 bg-zinc-700 shadow-md">
                      <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} alt="Groom" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500" />
                    </div>
                    <h4 className="font-serif text-3xl font-bold mb-2">{data.bride_data.groom || "Groom"}</h4>
                    <p className="text-sm text-zinc-400 mb-4">Putra dari {data.bride_data.parents_groom || "Nama Orang Tua"}</p>
                    {data.bride_data.groom_ig && (
                      <a href={`https://instagram.com/${data.bride_data.groom_ig}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full text-sm hover:bg-zinc-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        @{data.bride_data.groom_ig}
                      </a>
                    )}
                  </div>
                </FadeIn>
                <FadeIn delay={0.4}>
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-6 bg-zinc-700 shadow-md">
                      <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} alt="Bride" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500" />
                    </div>
                    <h4 className="font-serif text-3xl font-bold mb-2">{data.bride_data.bride || "Bride"}</h4>
                    <p className="text-sm text-zinc-400 mb-4">Putri dari {data.bride_data.parents_bride || "Nama Orang Tua"}</p>
                    {data.bride_data.bride_ig && (
                      <a href={`https://instagram.com/${data.bride_data.bride_ig}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full text-sm hover:bg-zinc-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        @{data.bride_data.bride_ig}
                      </a>
                    )}
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* Love Story */}
          <section className="py-24 px-6 bg-[#f4f2e9] relative">
            <div className="max-w-2xl mx-auto">
              <FadeIn><h3 className="font-serif text-4xl mb-16 text-center">Perjalanan Hidup</h3></FadeIn>
              <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                {loveStory.map((story, i) => (
                  <FadeIn key={i} delay={i * 0.2}>
                    <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[#1a1a1a] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <Heart size={16} />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-800">
                        <span className="text-sm font-medium text-gray-400 block mb-1">{story.year}</span>
                        <h4 className="font-serif text-xl font-bold mb-2">{story.title}</h4>
                        <p className="text-zinc-300 font-light text-sm">{story.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* Jadwal Acara */}
          <section className="relative py-24 px-6 bg-zinc-800 text-center overflow-hidden">
            {data.bg_middle && (
              <div className="absolute inset-0 z-0">
                <img src={data.bg_middle} alt="Background Middle" className="w-full h-full object-cover opacity-10" />
              </div>
            )}
            <div className="relative z-10">
              <FadeIn><h3 className="font-serif text-4xl mb-12">Detail Acara</h3></FadeIn>
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
              <FadeIn delay={0.2}>
                <div className="p-10 border border-zinc-800 rounded-[2rem] bg-zinc-900 shadow-sm relative overflow-hidden group hover:shadow-md transition">
                  <h4 className="font-serif text-3xl mb-4">Acara Utama</h4>
                  <p className="font-medium text-xl mb-1">{data.event_data.akad_time || "Waktu Akad"}</p>
                  <p className="text-zinc-400 font-light mb-6">{data.event_data.akad_location || "Lokasi Akad"}</p>
                  <a href={data.event_data.akad_map || "https://maps.google.com"} target="_blank" className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#1a1a1a] text-white rounded-full font-medium"><MapPin size={18}/> Google Maps</a>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="p-10 border border-zinc-800 rounded-[2rem] bg-zinc-900 shadow-sm relative overflow-hidden group hover:shadow-md transition">
                  <h4 className="font-serif text-3xl mb-4">Dinner Party</h4>
                  <p className="font-medium text-xl mb-1">{data.event_data.resepsi_time || "Waktu Resepsi"}</p>
                  <p className="text-zinc-400 font-light mb-6">{data.event_data.resepsi_location || "Lokasi Resepsi"}</p>
                  <a href={data.event_data.resepsi_map || "https://maps.google.com"} target="_blank" className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#1a1a1a] text-white rounded-full font-medium"><MapPin size={18}/> Google Maps</a>
                </div>
              </FadeIn>
            </div>
            
            <FadeIn delay={0.6}>
              <div className="flex flex-wrap justify-center gap-4 max-w-lg mx-auto">
                <a href={calendarLink} target="_blank" className="flex items-center gap-2 px-6 py-3 border border-zinc-700 rounded-full hover:bg-zinc-800 transition font-medium"><CalendarIcon size={18}/> Simpan Kalender</a>
                <a href={data.event_data.live_stream || "#"} target="_blank" className="flex items-center gap-2 px-6 py-3 border border-zinc-700 rounded-full hover:bg-zinc-800 transition font-medium"><Video size={18}/> Live Streaming</a>
              </div>
              </FadeIn>
            </div>
          </section>

          {/* Galeri */}
          <section className="py-24 px-6 bg-zinc-900">
            <FadeIn><h3 className="font-serif text-4xl mb-12 text-center">Gallery Foto</h3></FadeIn>
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((img, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-200 group">
                    <img src={img} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* Amplop Digital */}
          <section className="py-24 px-6 bg-zinc-800 text-center">
            <div className="max-w-2xl mx-auto">
              <FadeIn>
                <div className="w-16 h-16 bg-zinc-800 text-gray-800 rounded-full flex items-center justify-center mx-auto mb-6"><Gift size={28}/></div>
                <h3 className="font-serif text-4xl mb-4">Amplop Digital</h3>
                <p className="text-zinc-300 mb-10 font-light">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.</p>
              </FadeIn>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {(data.gifts?.length ? data.gifts : [{bank: "BCA", acc: "123456789", name: "Groom Name"}]).map((gift, i) => (
                  <FadeIn key={i} delay={0.2}>
                    <div className="p-6 border border-zinc-700 rounded-2xl bg-zinc-800">
                      <p className="font-bold text-xl mb-2">{gift.bank}</p>
                      <p className="text-lg tracking-widest mb-1">{gift.acc}</p>
                      <p className="text-sm text-zinc-400 uppercase">{gift.name}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP & Wedding Wish */}
          <section className="relative py-24 px-6 bg-[#1a1a1a] text-white overflow-hidden">
            {data.bg_bottom && (
              <div className="absolute inset-0 z-0">
                <img src={data.bg_bottom} alt="Background Bottom" className="w-full h-full object-cover opacity-20" />
              </div>
            )}
            <div className="max-w-2xl mx-auto relative z-10">
              <FadeIn>
                <h3 className="font-serif text-4xl mb-4 text-center">RSVP & Ucapan</h3>
                <p className="text-gray-400 mb-10 text-center font-light">Tinggalkan pesan hangat untuk kedua mempelai.</p>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <form 
                  className="space-y-4 mb-16" 
                  onSubmit={async (e) => { 
                    e.preventDefault(); 
                    if (previewMode) {
                      alert("Mode preview: Form tidak dikirim.");
                      return;
                    }
                    if (!data.slug) return;
                    setIsSubmitting(true);
                    
                    const newWish: WishData = {
                      name: rsvpName || guestName,
                      presence: rsvpPresence,
                      message: rsvpMessage,
                      timestamp: new Date().toISOString()
                    };

                    try {
                      const success = await submitWish(data.slug, newWish);
                      if (success) {
                        setWishes([...wishes, newWish]);
                        setRsvpMessage("");
                        setRsvpPresence("");
                        alert("Ucapan berhasil dikirim!");
                      } else {
                        alert("Gagal mengirim ucapan, coba lagi.");
                      }
                    } catch (error) {
                      console.error(error);
                      alert("Terjadi kesalahan sistem.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Nama Anda" className="w-full px-4 py-3 bg-zinc-800/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-white placeholder:text-gray-400" required />
                  <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-white" required>
                    <option value="">Konfirmasi Kehadiran</option>
                    <option value="hadir">Ya, Saya akan hadir</option>
                    <option value="tidak">Maaf, tidak bisa hadir</option>
                  </select>
                  <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Tuliskan ucapan & doa Anda..." className="w-full px-4 py-3 bg-zinc-800/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-white placeholder:text-gray-400" required></textarea>
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-zinc-800 text-rose-400 font-medium rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200 transition disabled:opacity-50"><Send size={18}/> {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}</button>
                </form>
              </FadeIn>

              {/* Menampilkan List Ucapan */}
              <FadeIn delay={0.4}>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {wishes.length > 0 ? (
                    [...wishes].reverse().map((wish, idx) => (
                      <div key={idx} className="bg-zinc-800/5 p-4 rounded-xl border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-lg">{wish.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${wish.presence === 'hadir' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {wish.presence === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                          </span>
                        </div>
                        <p className="text-gray-300 font-light text-sm mb-2">{wish.message}</p>
                        <p className="text-zinc-400 text-xs text-right">
                          {new Date(wish.timestamp).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-zinc-400 font-light">Belum ada ucapan. Jadilah yang pertama!</p>
                  )}
                </div>
              </FadeIn>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 text-center bg-[#1a1a1a] text-zinc-400 border-t border-white/10">
            <p className="font-serif text-2xl text-white mb-4">{data.bride_data.groom} & {data.bride_data.bride}</p>
            <p className="text-sm">Made with  by Galatamu</p>
            <p className="text-xs mt-2 opacity-50">Masa Aktif Undangan: 6 Bulan Sejak Acara</p>
          </footer>
        </motion.main>
      )}

      {/* Floating Music Player */}
      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-zinc-800/30 backdrop-blur-md border border-white/40 shadow-lg text-rose-400 hover:bg-zinc-800/50 transition-all">
          <Disc className={`w-6 h-6 ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}
