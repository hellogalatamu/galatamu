"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Heart, MapPin, Calendar, Gift, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";

export default function JawaSoloTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className="bg-[#4e342e] min-h-screen text-[#d7ccc8] font-serif selection:bg-[#d7ccc8] selection:text-[#4e342e]">
      {/* Texture */}
      <div className="fixed inset-0 opacity-10 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
      
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 1 }} exit={{ opacity: 0, y: -1000 }} transition={{ duration: 1, ease: "easeInOut" }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#3e2723] overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-fabric.png')]"></div>
              <FadeIn className="z-10 text-center px-6">
                 <div className="mb-8">
                    <img src="https://www.freeiconspng.com/uploads/floral-design-png-image-free-download-23.png" className="w-32 h-auto mx-auto invert opacity-40" alt="Ornate" />
                 </div>
                 <p className="tracking-[0.4em] uppercase text-[10px] mb-6 text-[#d7ccc8]/60">Serat Undangan Pawiwahan</p>
                 <h1 className="text-6xl font-bold mb-12 italic text-white">{data.bride_data.groom} & {data.bride_data.bride}</h1>
                 <div className="mb-12">
                    <p className="text-[10px] uppercase tracking-widest mb-2">Katur Dhumateng:</p>
                    <p className="text-3xl font-bold italic text-[#d7ccc8]">{guestName}</p>
                 </div>
                 <button onClick={openInvitation} className="px-10 py-4 border border-[#d7ccc8] text-[#d7ccc8] hover:bg-[#d7ccc8] hover:text-[#3e2723] transition-all font-bold uppercase tracking-[0.3em] text-[10px] rounded-full">
                    Buka Undangan
                 </button>
              </FadeIn>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 relative z-10">
          <section className="py-32 px-6 text-center border-b border-[#d7ccc8]/10">
             <FadeIn>
                <div className="max-w-xs mx-auto mb-12">
                   <img src="https://www.freeiconspng.com/uploads/border-png-24.png" className="w-full h-auto invert opacity-20" alt="Ornate Border" />
                </div>
                <h2 className="text-7xl md:text-9xl font-bold italic mb-8 text-white">{data.bride_data.groom} & {data.bride_data.bride}</h2>
                <p className="text-xl tracking-[0.5em] uppercase text-[#d7ccc8] mb-16">{eventDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <div className="max-w-2xl mx-auto grid grid-cols-4 gap-4">
                   <Countdown targetDate={eventDate} />
                </div>
             </FadeIn>
          </section>

          <section className="py-24 px-6 text-center max-w-4xl mx-auto italic">
             <FadeIn>
                <p className="text-2xl text-white/80 leading-relaxed font-light">
                   {data.quote || `"Mugi Gusti Allah SWT paring berkah dhumateng kita sedaya, mliginipun dhumateng pinanganten kekalih ingkang badhe mbangun bale wisma."`}
                </p>
             </FadeIn>
          </section>

          <section className="py-24 px-6">
             <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32">
                <FadeIn className="text-center">
                   <div className="w-64 h-80 rounded-t-full overflow-hidden border-4 border-[#d7ccc8]/20 shadow-2xl mb-8 grayscale hover:grayscale-0 transition duration-1000">
                      <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80"} className="w-full h-full object-cover" alt="Groom" />
                   </div>
                   <h3 className="text-4xl font-bold italic text-white mb-2">{data.bride_data.groom}</h3>
                   <p className="text-lg text-[#d7ccc8]/60 italic">{data.bride_data.parents_groom}</p>
                </FadeIn>
                <div className="text-6xl text-[#d7ccc8]/20 font-serif italic hidden md:block">&</div>
                <FadeIn className="text-center" delay={0.2}>
                   <div className="w-64 h-80 rounded-t-full overflow-hidden border-4 border-[#d7ccc8]/20 shadow-2xl mb-8 grayscale hover:grayscale-0 transition duration-1000">
                      <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80"} className="w-full h-full object-cover" alt="Bride" />
                   </div>
                   <h3 className="text-4xl font-bold italic text-white mb-2">{data.bride_data.bride}</h3>
                   <p className="text-lg text-[#d7ccc8]/60 italic">{data.bride_data.parents_bride}</p>
                </FadeIn>
             </div>
          </section>

          <section className="py-24 px-6 bg-[#3e2723]">
             <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">
                   <FadeIn className="p-12 border border-[#d7ccc8]/10 text-center rounded-3xl backdrop-blur-md">
                      <Calendar className="w-10 h-10 mx-auto mb-8 text-[#d7ccc8]" />
                      <h4 className="text-3xl font-bold italic mb-6 text-white">Akad Nikah</h4>
                      <div className="space-y-4 mb-10">
                         <p className="text-2xl text-[#d7ccc8]">{data.event_data.akad_time}</p>
                         <p className="text-white/40 italic">{data.event_data.akad_location}</p>
                      </div>
                      <a href={data.event_data.akad_map} target="_blank" className="inline-block px-12 py-3 bg-[#d7ccc8] text-[#3e2723] rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition">Peta Lokasi</a>
                   </FadeIn>
                   <FadeIn className="p-12 border border-[#d7ccc8]/10 text-center rounded-3xl backdrop-blur-md" delay={0.2}>
                      <MapPin className="w-10 h-10 mx-auto mb-8 text-[#d7ccc8]" />
                      <h4 className="text-3xl font-bold italic mb-6 text-white">Resepsi</h4>
                      <div className="space-y-4 mb-10">
                         <p className="text-2xl text-[#d7ccc8]">{data.event_data.resepsi_time}</p>
                         <p className="text-white/40 italic">{data.event_data.resepsi_location}</p>
                      </div>
                      <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-12 py-3 bg-[#d7ccc8] text-[#3e2723] rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition">Peta Lokasi</a>
                   </FadeIn>
                </div>
             </div>
          </section>

          <GalleryLightbox 
             images={data.gallery || []} title="Dokumentasi" 
             titleClassName="text-5xl font-bold italic text-center mb-20 text-white"
             sectionClassName="py-32 px-6"
             gridClassName="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
             itemClassName="aspect-[4/5] rounded-3xl overflow-hidden border border-white/5"
          />

          <section className="py-24 px-6 text-center">
             <div className="max-w-3xl mx-auto">
                <FadeIn>
                   <h2 className="text-4xl italic font-bold text-white mb-6 tracking-widest">Kado Digital</h2>
                   <p className="text-[#d7ccc8]/40 mb-16 italic font-light">Matur nuwun dhumateng sedaya kado ingkang dipun paringaken.</p>
                   <div className="grid sm:grid-cols-2 gap-8">
                      {data.gifts?.map((gift, i) => (
                         <div key={i} className="p-8 bg-[#3e2723] border border-white/5 rounded-2xl">
                            <p className="text-[10px] uppercase tracking-widest text-[#d7ccc8]/40 mb-4">{gift.bank}</p>
                            <p className="text-2xl font-bold mb-2 text-white">{gift.acc}</p>
                            <p className="text-xs italic text-[#d7ccc8]/60 uppercase">a.n {gift.name}</p>
                         </div>
                      ))}
                   </div>
                </FadeIn>
             </div>
          </section>

          <footer className="py-32 text-center border-t border-white/5">
             <h2 className="text-5xl italic font-bold text-white mb-4">{data.bride_data.groom} & {data.bride_data.bride}</h2>
             <p className="text-[10px] uppercase tracking-[0.6em] text-[#d7ccc8]/30"> Surakarta Hadiningrat Classic </p>
          </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-16 h-16 bg-[#d7ccc8] text-[#3e2723] rounded-full shadow-2xl flex items-center justify-center">
          <Disc className={`w-8 h-8 ${isPlaying ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}
