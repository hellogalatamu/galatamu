"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./AmaraTheme";
import GalleryLightbox from "../GalleryLightbox";

interface JawaThemeProps {
  data: InvitationData;
  previewMode?: boolean;
  guestName?: string;
}

export default function JawaTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: JawaThemeProps) {
  const [isOpen, setIsOpen] = useState(previewMode);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [wishes, setWishes] = useState<WishData[]>(data.wishes || []);
  const [rsvpName, setRsvpName] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [rsvpPresence, setRsvpPresence] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!previewMode) {
      const musicSrc = data.music_url || "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2f7b8893d.mp3?filename=javanese-gamelan-soft-1123.mp3";
      audioRef.current = new Audio(musicSrc);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [previewMode, data.music_url]);

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

  return (
    <div className={`bg-[#2c1810] min-h-screen text-[#d4a373] font-serif selection:bg-[#d4a373] selection:text-[#2c1810] ${previewMode ? 'relative' : ''}`}>
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 opacity-10 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/batik-fabric.png')]"></div>

      {/* Cover Overlay */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2c1810] overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 sepia-[.5]"
                style={{ backgroundImage: `url('${data.hero_image || 'https://images.unsplash.com/photo-1590054701041-39e2365996e3?auto=format&fit=crop&q=80'}')` }}
              ></div>
              
              {/* Wayang Silhouette / Ornate Center */}
              <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                 <FadeIn delay={0.2} className="mb-8">
                    <div className="w-32 h-32 mx-auto border-2 border-[#d4a373] rounded-full flex items-center justify-center p-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[#d4a373] opacity-10 animate-pulse"></div>
                        <Heart className="w-12 h-12 text-[#d4a373] fill-[#d4a373]/20" />
                    </div>
                 </FadeIn>
                 <FadeIn delay={0.4}>
                   <p className="tracking-[0.4em] uppercase text-[10px] mb-6 text-[#d4a373]/80">Pawiwahan Ageng</p>
                   <h1 className="text-5xl md:text-7xl font-bold mb-8 text-[#fefae0] leading-tight italic">
                     {data.bride_data.groom} <br/> <span className="text-3xl font-serif not-italic opacity-50">&</span> <br/> {data.bride_data.bride}
                   </h1>
                 </FadeIn>
                 <FadeIn delay={0.6}>
                   <div className="mb-12 py-8 border-y border-[#d4a373]/30">
                      <p className="text-[10px] uppercase tracking-widest text-[#d4a373]/60 mb-4">Katur dumateng Bpk/Ibu/Sdr/i:</p>
                      <h2 className="text-3xl font-bold italic mb-2 text-white tracking-wide">{guestName}</h2>
                   </div>
                 </FadeIn>
                 <FadeIn delay={0.8}>
                   <button 
                     onClick={openInvitation}
                     className="px-12 py-4 bg-[#d4a373] text-[#2c1810] font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-[#fefae0] transition shadow-[0_10px_30px_rgba(212,163,115,0.3)]"
                   >
                     Buka Serat Undangan
                   </button>
                 </FadeIn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="pb-32 relative z-10">
          
          {/* Hero Section */}
          <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
             <div className="absolute inset-0 z-0">
                <img src={data.hero_image || "https://images.unsplash.com/photo-1590054701041-39e2365996e3?auto=format&fit=crop&q=80"} className="w-full h-full object-cover opacity-30 grayscale sepia-[.3]" alt="Hero" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2c1810] via-transparent to-[#2c1810]"></div>
             </div>
             <div className="relative z-10">
                <FadeIn>
                    <img src="https://www.freeiconspng.com/uploads/border-png-24.png" className="w-48 h-auto mx-auto mb-10 invert opacity-60" alt="Ornate" />
                    <p className="tracking-[0.6em] uppercase text-[10px] mb-8 text-[#d4a373]">Miwiti Kabahagyan</p>
                    <h2 className="text-5xl md:text-8xl font-bold italic mb-10 text-[#fefae0]">{data.bride_data.groom} & {data.bride_data.bride}</h2>
                    <div className="w-16 h-px bg-[#d4a373] mx-auto mb-10"></div>
                    <p className="text-2xl italic mb-12 text-[#fefae0]">{eventDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="max-w-md mx-auto p-10 border border-[#d4a373]/20 bg-[#2c1810]/40 backdrop-blur-sm">
                        <Countdown targetDate={eventDate} />
                    </div>
                </FadeIn>
             </div>
          </section>

          {/* Ayat Suci / Quote */}
          <section className="py-24 px-6 text-center">
             <div className="max-w-3xl mx-auto">
                <FadeIn>
                    <p className="text-lg md:text-xl leading-relaxed italic text-[#fefae0]/80 font-light">
                        {data.quote || `"Mugi-mugi Allah SWT tansah paring berkah dumateng panjenengan sedaya ingkang sami angrawuhi adicara punika. Sura dira jayaningrat lebur dening pangastuti."`}
                    </p>
                </FadeIn>
             </div>
          </section>

          {/* Profil Mempelai */}
          <section className="py-24 px-6 relative overflow-hidden">
             <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-24 items-center">
                   <FadeIn className="text-center">
                      <div className="relative mx-auto max-w-xs mb-10 group">
                         <div className="absolute -inset-4 border border-[#d4a373]/20 rounded-full group-hover:rotate-45 transition-transform duration-1000"></div>
                         <div className="aspect-square rounded-full overflow-hidden border-4 border-[#d4a373]/40 shadow-2xl relative">
                            <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover sepia-[.3]" alt="Groom" />
                         </div>
                      </div>
                      <h3 className="text-4xl font-bold italic mb-2 text-[#fefae0]">{data.bride_data.groom}</h3>
                      <p className="text-xs tracking-[0.3em] uppercase text-[#d4a373]/80 mb-4">Putra saking</p>
                      <p className="text-lg italic text-[#fefae0]/60">{data.bride_data.parents_groom}</p>
                   </FadeIn>
                   <FadeIn className="text-center" delay={0.2}>
                      <div className="relative mx-auto max-w-xs mb-10 group">
                         <div className="absolute -inset-4 border border-[#d4a373]/20 rounded-full group-hover:-rotate-45 transition-transform duration-1000"></div>
                         <div className="aspect-square rounded-full overflow-hidden border-4 border-[#d4a373]/40 shadow-2xl relative">
                            <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover sepia-[.3]" alt="Bride" />
                         </div>
                      </div>
                      <h3 className="text-4xl font-bold italic mb-2 text-[#fefae0]">{data.bride_data.bride}</h3>
                      <p className="text-xs tracking-[0.3em] uppercase text-[#d4a373]/80 mb-4">Putri saking</p>
                      <p className="text-lg italic text-[#fefae0]/60">{data.bride_data.parents_bride}</p>
                   </FadeIn>
                </div>
             </div>
          </section>

          {/* Love Story */}
          {data.love_story && data.love_story.length > 0 && (
            <section className="py-24 px-6 bg-[#1a0f0a]">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-20">
                     <h2 className="text-4xl italic font-bold text-[#fefae0] mb-4">Cariyos Katresnan</h2>
                     <div className="w-16 h-px bg-[#d4a373] mx-auto opacity-40"></div>
                  </FadeIn>
                  <div className="space-y-12">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="relative pl-12 border-l-2 border-[#d4a373]/20 group">
                              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#d4a373] rounded-full border-4 border-[#1a0f0a] group-hover:scale-150 transition-transform"></div>
                              <span className="text-2xl font-bold italic text-[#d4a373] mb-2 block">{story.year}</span>
                              <h4 className="text-xl font-bold text-[#fefae0] mb-2">{story.title}</h4>
                              <p className="text-[#fefae0]/60 leading-relaxed italic">{story.desc}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          {/* Detail Acara */}
          <section className="py-24 px-6 relative">
            <div className="max-w-5xl mx-auto">
               <div className="grid md:grid-cols-2 gap-px bg-[#d4a373]/10">
                  <FadeIn className="bg-[#2c1810]/40 p-12 text-center border border-[#d4a373]/10 backdrop-blur-sm">
                     <p className="tracking-[0.4em] uppercase text-[10px] text-[#d4a373] mb-10 italic">Akad Nikah</p>
                     <p className="text-3xl font-bold italic mb-4 text-[#fefae0]">{data.event_data.akad_time}</p>
                     <p className="text-[#fefae0]/40 mb-12 italic leading-relaxed text-lg px-4">{data.event_data.akad_location}</p>
                     <a href={data.event_data.akad_map} target="_blank" className="inline-block px-10 py-3 border border-[#d4a373] text-[#d4a373] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#d4a373] hover:text-[#2c1810] transition-all">Peta Lokasi</a>
                  </FadeIn>
                  <FadeIn className="bg-[#2c1810]/40 p-12 text-center border border-[#d4a373]/10 backdrop-blur-sm" delay={0.2}>
                     <p className="tracking-[0.4em] uppercase text-[10px] text-[#d4a373] mb-10 italic">Resepsi</p>
                     <p className="text-3xl font-bold italic mb-4 text-[#fefae0]">{data.event_data.resepsi_time}</p>
                     <p className="text-[#fefae0]/40 mb-12 italic leading-relaxed text-lg px-4">{data.event_data.resepsi_location}</p>
                     <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-10 py-3 border border-[#d4a373] text-[#d4a373] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#d4a373] hover:text-[#2c1810] transition-all">Peta Lokasi</a>
                  </FadeIn>
               </div>
            </div>
          </section>

          <GalleryLightbox
            images={data.gallery || []}
            title="Gallery Foto"
            titleClassName="font-serif text-4xl font-bold text-center mb-12"
            sectionClassName="py-24 px-6"
            gridClassName="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto"
            itemClassName="aspect-square rounded-2xl overflow-hidden shadow-md group cursor-pointer relative"
            imgClassName="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          />

          {/* Video */}
          {data.video && (
            <section className="py-24 px-6 text-center">
              <FadeIn><h3 className="text-4xl font-bold italic mb-16 text-[#fefae0] tracking-widest">Sinematografi</h3></FadeIn>
              <div className="max-w-5xl mx-auto aspect-video border-[12px] border-[#d4a373]/10 shadow-2xl overflow-hidden">
                <iframe className="w-full h-full grayscale hover:grayscale-0 transition duration-1000" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {/* Kado Digital */}
          {data.gifts && data.gifts.length > 0 && (
            <section className="py-24 px-6 text-center">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-16">
                     <div className="w-16 h-16 bg-[#d4a373]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Gift className="w-8 h-8 text-[#d4a373]" />
                     </div>
                     <h2 className="text-4xl italic font-bold text-[#fefae0] mb-4 tracking-widest">Kado Digital</h2>
                     <p className="text-[#d4a373]/60 italic font-light max-w-md mx-auto">Pandonga pangestu panjenengan sampun cekap kagem kita, nanging menawi panjenengan kersa paring kado, saged liwat transfer ing ngandhap punika.</p>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-8">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-[#2c1810]/40 border border-[#d4a373]/10 p-10 backdrop-blur-sm relative group overflow-hidden">
                              <p className="tracking-[0.3em] uppercase text-[10px] text-[#d4a373]/60 mb-6 italic">{gift.bank}</p>
                              <p className="text-2xl font-bold mb-2 tracking-widest text-[#fefae0]">{gift.acc}</p>
                              <p className="text-xs italic text-[#d4a373]/80 uppercase tracking-widest">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          {/* RSVP & Ucapan */}
          <section className="py-24 px-6 bg-[#1a0f0a] relative overflow-hidden">
            <div className="max-w-2xl mx-auto text-center relative z-10">
               <FadeIn className="mb-12">
                  <h2 className="text-4xl italic font-bold text-[#fefae0] mb-4 tracking-widest">Atur Pangajab</h2>
                  <p className="text-[#d4a373]/40 tracking-[0.3em] uppercase text-[10px]">Tinggalkan pesan dumateng pinanganten</p>
               </FadeIn>
               
               <FadeIn delay={0.2}>
                  <form className="space-y-4 mb-20 font-serif" onSubmit={async (e) => {
                    e.preventDefault();
                    if (previewMode) return alert("Preview: Form mboten dipun kirim.");
                    if (!data.slug) return;
                    setIsSubmitting(true);
                    const newWish: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                    try {
                        const success = await submitWish(data.slug, newWish);
                        if (success) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); alert("Matur Nuwun!"); }
                    } finally { setIsSubmitting(false); }
                  }}>
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Asma Panjenengan" className="w-full px-8 py-4 bg-white/5 border border-white/10 focus:outline-none focus:border-[#d4a373] text-white placeholder:text-[#d4a373]/30 text-xs uppercase tracking-widest italic" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-8 py-4 bg-white/5 border border-white/10 focus:outline-none focus:border-[#d4a373] text-white text-xs uppercase tracking-widest italic" required>
                        <option value="" className="bg-[#1a0f0a]">Konfirmasi Rawuh</option>
                        <option value="hadir" className="bg-[#1a0f0a]">Insya Allah Rawuh</option>
                        <option value="tidak" className="bg-[#1a0f0a]">Nyuwun Pangapunten Mboten Rawuh</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Pesen & Pangajab" className="w-full px-8 py-4 bg-white/5 border border-white/10 focus:outline-none focus:border-[#d4a373] text-white placeholder:text-[#d4a373]/30 text-xs uppercase tracking-widest italic" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-[#d4a373] text-[#2c1810] font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-[#fefae0] transition disabled:opacity-50">
                        {isSubmitting ? "Ngirim..." : "Kirim Pangajab"}
                    </button>
                  </form>
               </FadeIn>

               <div className="space-y-10 max-h-[500px] overflow-y-auto pr-6 custom-scrollbar text-left">
                  {wishes.length > 0 ? (
                     [...wishes].reverse().map((wish, idx) => (
                        <div key={idx} className="border-b border-[#d4a373]/10 pb-8 group">
                           <div className="flex items-center justify-between mb-4">
                              <span className="text-xl font-bold italic text-[#fefae0]">{wish.name}</span>
                              <span className="text-[9px] uppercase tracking-widest bg-white/5 px-2 py-1 text-[#d4a373]">{wish.presence === 'hadir' ? 'Rawuh' : 'Absen'}</span>
                           </div>
                           <p className="text-[#fefae0]/60 italic font-light leading-relaxed">&quot;{wish.message}&quot;</p>
                        </div>
                     ))
                  ) : (
                     <p className="text-center text-[#d4a373]/40 italic text-xs">Dereng wonten pangajab...</p>
                  )}
               </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-24 text-center">
             <p className="text-4xl italic font-bold text-[#fefae0] mb-4">{data.bride_data.groom} & {data.bride_data.bride}</p>
             <p className="tracking-[0.6em] uppercase text-[10px] text-[#d4a373]/60">— Galatamu Jawi —</p>
          </footer>

        </motion.main>
      )}

      {/* Floating Music Player */}
      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-14 h-14 bg-[#d4a373]/20 backdrop-blur-xl border border-[#d4a373]/40 rounded-full shadow-2xl flex items-center justify-center text-[#d4a373] transition-all hover:scale-110 active:scale-95 group">
          <Disc className={`w-7 h-7 ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

