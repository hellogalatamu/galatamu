"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Gift, Send, Heart, MapPin, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";
import VideoPlayer from "../VideoPlayer";
import { generateGoogleCalendarLink, generateICalLink } from "@/lib/calendarHelper";
import { Video } from "lucide-react";

export default function JawaTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData; previewMode?: boolean; guestName?: string }) {
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
      audioRef.current = new Audio(data.music_url || "/music/wedding.mp3");
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={`min-h-screen bg-[#1a0f0a] text-[#d4a373] selection:bg-[#d4a373] selection:text-black ${previewMode ? "relative" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Charm:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,700;1,400&display=swap');
        .font-ethnic { font-family: 'Cinzel Decorative', cursive; }
        .font-script { font-family: 'Charm', cursive; }
        .font-serif { font-family: 'Crimson Text', serif; }
        .wood-texture { background-image: url('https://www.transparenttextures.com/patterns/dark-wood.png'); }
        .batik-overlay { background-image: url('https://www.transparenttextures.com/patterns/batik-fabric.png'); opacity: 0.05; }
        .gunungan-reveal { background: radial-gradient(circle at center, #3d2317 0%, #1a0f0a 100%); }
      `}</style>

      {/*  GUNUNGAN OPENING (COVER)  */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
              className="fixed inset-0 z-50 gunungan-reveal wood-texture flex flex-col items-center justify-center p-6 text-center">
               <div className="batik-overlay absolute inset-0 pointer-events-none" />
               <FadeIn>
                  <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }} className="mb-12">
                     <img src="https://pngimg.com/uploads/border/border_PNG56.png" className="w-48 h-auto mx-auto invert opacity-20" />
                  </motion.div>
                  <p className="font-ethnic text-[10px] tracking-[0.6em] mb-10 text-[#d4a373]/60">PAWIWAHAN AGENG</p>
                  <h1 className="font-script text-6xl md:text-8xl mb-8 leading-tight">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h1>
                  <div className="w-24 h-px bg-[#d4a373]/20 mx-auto mb-10" />
                  <p className="font-serif italic text-xl mb-16 text-white/40">Katur dumateng: <br/> <span className="text-[#d4a373] text-2xl font-bold not-italic">{guestName}</span></p>
                  <button onClick={openInvitation}
                    className="group relative px-16 py-5 bg-[#3d2317] border border-[#d4a373]/40 text-[#d4a373] font-ethnic text-[10px] uppercase tracking-[0.4em] overflow-hidden hover:bg-[#d4a373] hover:text-black transition-all duration-700">
                    <span className="relative z-10">BUKA SERAT</span>
                    <div className="absolute inset-0 bg-[#d4a373] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                  </button>
               </FadeIn>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 relative">
          <div className="batik-overlay absolute inset-0 pointer-events-none z-0" />
          
          {/* HERO */}
          <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
             <div className="absolute inset-0 z-0 opacity-20 wood-texture">
                <img src={data.hero_image || "https://images.unsplash.com/photo-1590054701041-39e2365996e3?auto=format&fit=crop&q=80"} className="w-full h-full object-cover grayscale sepia-[0.5]" />
             </div>
             <div className="relative z-10">
                <FadeIn>
                   <p className="font-ethnic text-[10px] tracking-[0.8em] mb-12 text-[#d4a373]/60">SERAT UNDANGAN</p>
                   <h2 className="font-script text-7xl md:text-9xl mb-8">{data.bride_data.groom}</h2>
                   <p className="font-ethnic text-2xl my-4 text-[#d4a373]/20">KALIAN</p>
                   <h2 className="font-script text-7xl md:text-9xl mb-12">{data.bride_data.bride}</h2>
                   <div className="flex flex-col items-center gap-8">
                      <p className="font-serif italic text-2xl text-white/60">{eventDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      <div className="p-8 border border-[#d4a373]/10 bg-black/20 backdrop-blur-sm">
                         <Countdown targetDate={eventDate} />
                      </div>
                   </div>
                </FadeIn>
             </div>
          </section>

          {/* QUOTE */}
          <section className="py-32 px-10 text-center">
             <FadeIn className="max-w-3xl mx-auto">
                <Sparkles className="w-8 h-8 mx-auto mb-10 text-[#d4a373]/20" />
                <p className="font-serif text-2xl md:text-3xl italic leading-relaxed text-[#d4a373]/80">
                   &ldquo;{data.quote || "Witing tresno jalaran soko kulino. Katresnan kang sejati iku ora bakal luntur dening wektu."}&rdquo;
                </p>
                <div className="mt-12 h-px w-32 bg-gradient-to-r from-transparent via-[#d4a373]/40 to-transparent mx-auto" />
             </FadeIn>
          </section>

          {/* PROFILES */}
          <section className="py-24 px-10 grid md:grid-cols-2 gap-24 max-w-6xl mx-auto">
             <FadeIn className="text-center">
                <div className="relative w-64 h-80 mx-auto mb-10 group">
                   <div className="absolute inset-0 border border-[#d4a373]/20 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
                   <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover grayscale sepia-[0.4] relative z-10" />
                </div>
                <h3 className="font-ethnic text-3xl mb-4">{data.bride_data.groom}</h3>
                <p className="font-serif italic text-lg text-white/40">
                  {data.bride_data.parents_groom.includes('&') ? (
                    <>Putra saking Bapak {data.bride_data.parents_groom.split('&')[0]} &amp; Ibu {data.bride_data.parents_groom.split('&')[1]}</>
                  ) : (
                    <>Putra saking {data.bride_data.parents_groom}</>
                  )}
                </p>
             </FadeIn>
             <FadeIn className="text-center" delay={0.2}>
                <div className="relative w-64 h-80 mx-auto mb-10 group">
                   <div className="absolute inset-0 border border-[#d4a373]/20 -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
                   <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover grayscale sepia-[0.4] relative z-10" />
                </div>
                <h3 className="font-ethnic text-3xl mb-4">{data.bride_data.bride}</h3>
                <p className="font-serif italic text-lg text-white/40">
                  {data.bride_data.parents_bride.includes('&') ? (
                    <>Putri saking Bapak {data.bride_data.parents_bride.split('&')[0]} &amp; Ibu {data.bride_data.parents_bride.split('&')[1]}</>
                  ) : (
                    <>Putri saking {data.bride_data.parents_bride}</>
                  )}
                </p>
             </FadeIn>
          </section>

          {/* EVENTS */}
          <section className="py-32 px-10 bg-[#3d2317]/20 border-y border-[#d4a373]/10">
             <div className="max-w-4xl mx-auto space-y-24">
                <FadeIn className="flex flex-col md:flex-row gap-12 items-center">
                   <div className="w-full md:w-1/2 text-center md:text-right">
                      <p className="font-ethnic text-[10px] tracking-[0.4em] mb-4 text-[#d4a373]/60 uppercase">Akad Nikah</p>
                      <h4 className="font-script text-5xl mb-6">{data.event_data.akad_time}</h4>
                      <p className="font-serif italic text-lg opacity-60">{data.event_data.akad_location}</p>
                   </div>
                   <div className="w-px h-32 bg-[#d4a373]/20 hidden md:block" />
                   <div className="flex-1">
                      <a href={data.event_data.akad_map} className="px-10 py-4 border border-[#d4a373]/40 font-ethnic text-[10px] tracking-widest hover:bg-[#d4a373] hover:text-black transition-all inline-block w-full text-center">BUKA PETA</a>
                   </div>
                </FadeIn>
                <FadeIn className="flex flex-col md:flex-row-reverse gap-12 items-center" delay={0.2}>
                   <div className="w-full md:w-1/2 text-center md:text-left">
                      <p className="font-ethnic text-[10px] tracking-[0.4em] mb-4 text-[#d4a373]/60 uppercase">Resepsi</p>
                      <h4 className="font-script text-5xl mb-6">{data.event_data.resepsi_time}</h4>
                      <p className="font-serif italic text-lg opacity-60">{data.event_data.resepsi_location}</p>
                   </div>
                   <div className="w-px h-32 bg-[#d4a373]/20 hidden md:block" />
                   <div className="flex-1">
                      <a href={data.event_data.resepsi_map} className="px-10 py-4 border border-[#d4a373]/40 font-ethnic text-[10px] tracking-widest hover:bg-[#d4a373] hover:text-black transition-all inline-block w-full text-center">BUKA PETA</a>
                   </div>
                </FadeIn>
             </div>
          </section>

          {/* GALLERY */}
          <section className="py-32 px-10">
             <h3 className="font-ethnic text-3xl mb-16 text-center tracking-[0.4em]">KENANGAN INDAH</h3>
             <GalleryLightbox 
                images={data.gallery || []}
                title=""
                sectionClassName=""
                gridClassName="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto"
                itemClassName="aspect-[3/4] border border-[#d4a373]/10 overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000"
                imgClassName="w-full h-full object-cover"
             />
          </section>

          {/* GIFTS */}
          <section className="py-32 px-10 wood-texture bg-black/40">
             <div className="max-w-4xl mx-auto text-center">
                <FadeIn>
                   <h3 className="font-ethnic text-3xl mb-12 tracking-widest">KADO DIGITAL</h3>
                   <p className="font-serif italic text-lg mb-16 text-white/40">Kehadiran panjenengan sampun dados hadiah paling sae kagem kita sedaya.</p>
                   <div className="grid md:grid-cols-2 gap-8">
                      {data.gifts?.map((g, i) => (
                         <div key={i} className="p-12 border border-[#d4a373]/10 bg-[#3d2317]/40 relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full batik-overlay" />
                            <p className="font-ethnic text-[10px] mb-6 opacity-40 uppercase">{g.bank}</p>
                            <p className="font-ethnic text-2xl tracking-[0.2em] mb-4 text-[#d4a373]">{g.acc}</p>
                            <p className="font-serif italic opacity-60">a.n {g.name}</p>
                         </div>
                      ))}
                   </div>
                </FadeIn>
             </div>
          </section>

          {/* RSVP */}
          <section className="py-32 px-10 max-w-2xl mx-auto">
             <FadeIn className="text-center mb-16">
                <h3 className="font-ethnic text-3xl mb-4 tracking-[0.4em]">RSVP &amp; DOA</h3>
                <p className="font-serif italic opacity-40">Mugi-mugi panjenengan sedaya saget rawuh.</p>
             </FadeIn>
             <FadeIn delay={0.2}>
                <form className="space-y-8" onSubmit={async (e) => {
                   e.preventDefault();
                   if (previewMode) return;
                   setIsSubmitting(true);
                   const w: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                   try { const ok = await submitWish(data.slug || "", w); if (ok) { setWishes([...wishes, w]); setRsvpMessage(""); setRsvpPresence(""); } }
                   finally { setIsSubmitting(false); }
                }}>
                   <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="ASMA PANJENENGAN" className="w-full bg-transparent border-b border-[#d4a373]/30 px-4 py-6 font-ethnic text-[10px] focus:outline-none focus:border-[#d4a373]" required />
                   <select value={rsvpPresence} onChange={e => setRsvpPresence(e.target.value)} className="w-full bg-[#1a0f0a] border-b border-[#d4a373]/30 px-4 py-6 font-ethnic text-[10px] focus:outline-none focus:border-[#d4a373]" required>
                      <option value="">KONFIRMASI RAWUH</option>
                      <option value="hadir">INSYA ALLAH RAWUH</option>
                      <option value="tidak">NYUWUN PANGAPUNTEN</option>
                   </select>
                   <textarea rows={4} value={rsvpMessage} onChange={e => setRsvpMessage(e.target.value)} placeholder="ATUR PANGAJAB" className="w-full bg-transparent border-b border-[#d4a373]/30 px-4 py-6 font-ethnic text-[10px] focus:outline-none focus:border-[#d4a373] resize-none" required></textarea>
                   <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-[#d4a373] text-black font-ethnic text-[10px] font-bold tracking-[0.5em] hover:bg-white transition-all duration-700">
                      {isSubmitting ? "NGIRIM..." : "KIRIM PESEN"}
                   </button>
                </form>
             </FadeIn>
             
             <div className="mt-32 space-y-12">
                {wishes.slice(0, 5).map((w, i) => (
                   <div key={i} className="border-l border-[#d4a373]/20 pl-8">
                      <div className="flex justify-between items-start mb-4">
                         <span className="font-ethnic text-xl">{w.name.toUpperCase()}</span>
                         <span className="font-serif italic opacity-40 text-sm">{w.presence === 'hadir' ? 'Rawuh' : 'Absen'}</span>
                      </div>
                      <p className="font-serif text-lg italic opacity-60 leading-relaxed">&ldquo;{w.message}&rdquo;</p>
                   </div>
                ))}
             </div>
          </section>

          {/* FOOTER */}
          <footer className="py-40 text-center relative overflow-hidden">
             <div className="h-px w-32 bg-[#d4a373]/20 mx-auto mb-20" />
             <h2 className="font-script text-7xl md:text-9xl mb-10">{data.bride_data.groom} &amp; {data.bride_data.bride}</h2>
             <p className="font-ethnic text-[9px] tracking-[1em] text-[#d4a373]/40"> GALATAMU JAWI </p>
          </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-12 h-12 bg-[#d4a373]/20 backdrop-blur-xl border border-[#d4a373]/40 rounded-full flex items-center justify-center text-[#d4a373] hover:scale-110 transition-all">
          <Disc className={`w-5 h-5 ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}
