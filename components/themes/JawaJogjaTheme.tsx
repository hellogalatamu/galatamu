"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Heart, MapPin, Calendar, Gift, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";

export default function JawaJogjaTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
      const musicSrc = data.music_url || "/music/wedding.mp3";
      audioRef.current = new Audio(musicSrc);
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className="bg-[#002b24] min-h-screen text-[#d4af37] font-serif selection:bg-[#d4af37] selection:text-[#002b24]">
      {data.bg_image && (
        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: `url('${data.bg_image}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }}></div>
      )}
      {/* Batik Parang Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>
      
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#002b24] p-6 text-center overflow-hidden"
            >
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1590054701041-39e2365996e3?q=80&w=2000')] bg-cover bg-center grayscale"></div>
              <div className="relative z-10 max-w-lg w-full bg-[#002b24]/80 backdrop-blur-md border border-[#d4af37]/30 p-12 rounded-t-[100px] rounded-b-[20px] shadow-2xl">
                <FadeIn>
                  <div className="w-20 h-20 mx-auto border-2 border-[#d4af37] rounded-full flex items-center justify-center mb-8 rotate-45">
                    <Heart className="w-8 h-8 -rotate-45 fill-[#d4af37]/20" />
                  </div>
                  <p className="tracking-[0.5em] uppercase text-[10px] mb-4 text-[#d4af37]/80">The Wedding of</p>
                  <h1 className="text-5xl font-bold mb-8 italic text-white leading-tight">
                    {data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}
                  </h1>
                  <div className="py-6 border-y border-[#d4af37]/20 mb-10">
                    <p className="text-[10px] uppercase tracking-widest text-[#d4af37]/60 mb-2">Dear Honorable Guest:</p>
                    <h2 className="text-3xl font-bold italic text-white">{guestName}</h2>
                  </div>
                  <button onClick={openInvitation} className="w-full py-4 bg-[#d4af37] text-[#002b24] font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-white transition-all shadow-xl">
                    Open Invitation
                  </button>
                </FadeIn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 relative z-10">
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
            <div className="absolute top-0 w-full h-64 bg-gradient-to-b from-[#002b24] to-transparent"></div>
            <FadeIn>
              <div className="mb-8">
                <span className="text-[10px] uppercase tracking-[0.8em] text-[#d4af37]">Pawiwahan Ageng</span>
              </div>
              <h2 className="text-6xl md:text-9xl font-bold italic mb-10 text-white drop-shadow-2xl">
                {data.bride_data.groom} <span className="text-4xl not-italic opacity-30">&</span> {data.bride_data.bride}
              </h2>
              <p className="text-2xl font-light tracking-[0.2em] mb-12 text-[#d4af37]/80 uppercase">
                {eventDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <div className="max-w-md mx-auto p-8 border border-[#d4af37]/20 bg-black/20 backdrop-blur-sm rounded-2xl">
                <Countdown targetDate={eventDate} />
              </div>
            </FadeIn>
          </section>

          <section className="py-24 px-6 text-center bg-[#001f1a]">
            <FadeIn className="max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl leading-relaxed italic text-white/70 font-light">
                {data.quote || `"Sura Dira Jayaningrat, Lebur Dening Pangastuti. Segala sifat keras hati, picik, angkara murka, hanya bisa dikalahkan dengan sikap bijak, lembut hati dan sabar."`}
              </p>
            </FadeIn>
          </section>

          <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20">
              <FadeIn className="text-center group">
                <div className="relative mb-10 inline-block">
                  <div className="absolute -inset-4 border border-[#d4af37]/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#d4af37]/40 shadow-2xl relative">
                    <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80"} className="w-full h-full object-cover" alt="Groom" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold italic mb-2 text-white">{data.bride_data.groom}</h3>
                <p className="text-xs tracking-widest text-[#d4af37] mb-4 uppercase">Putra saking</p>
                <p className="text-lg text-white/50 italic">{data.bride_data.parents_groom}</p>
              </FadeIn>
              <FadeIn className="text-center group" delay={0.2}>
                <div className="relative mb-10 inline-block">
                  <div className="absolute -inset-4 border border-[#d4af37]/20 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
                  <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#d4af37]/40 shadow-2xl relative">
                    <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80"} className="w-full h-full object-cover" alt="Bride" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold italic mb-2 text-white">{data.bride_data.bride}</h3>
                <p className="text-xs tracking-widest text-[#d4af37] mb-4 uppercase">Putri saking</p>
                <p className="text-lg text-white/50 italic">{data.bride_data.parents_bride}</p>
              </FadeIn>
            </div>
          </section>

          <section className="py-24 px-6 bg-[#001f1a]">
             <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
                <FadeIn className="bg-[#002b24] p-10 rounded-3xl border border-[#d4af37]/10 text-center">
                   <Calendar className="w-8 h-8 mx-auto mb-6 text-[#d4af37]" />
                   <h3 className="text-2xl font-bold italic mb-4 text-white">Akad Nikah</h3>
                   <p className="text-xl text-[#d4af37] mb-4">{data.event_data.akad_time}</p>
                   <p className="text-white/40 mb-10 text-sm leading-relaxed">{data.event_data.akad_location}</p>
                   <a href={data.event_data.akad_map} target="_blank" className="px-8 py-3 bg-[#d4af37] text-[#002b24] rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-white transition">Lihat Peta</a>
                </FadeIn>
                <FadeIn className="bg-[#002b24] p-10 rounded-3xl border border-[#d4af37]/10 text-center" delay={0.2}>
                   <Heart className="w-8 h-8 mx-auto mb-6 text-[#d4af37]" />
                   <h3 className="text-2xl font-bold italic mb-4 text-white">Resepsi</h3>
                   <p className="text-xl text-[#d4af37] mb-4">{data.event_data.resepsi_time}</p>
                   <p className="text-white/40 mb-10 text-sm leading-relaxed">{data.event_data.resepsi_location}</p>
                   <a href={data.event_data.resepsi_map} target="_blank" className="px-8 py-3 bg-[#d4af37] text-[#002b24] rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-white transition">Lihat Peta</a>
                </FadeIn>
             </div>
          </section>

          <GalleryLightbox 
            images={data.gallery || []} title="Galeri Kebahagiaan" 
            titleClassName="text-4xl italic font-bold text-center mb-16 text-white" 
            sectionClassName="py-24 px-6"
            gridClassName="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto"
            itemClassName="aspect-[3/4] overflow-hidden rounded-2xl border border-[#d4af37]/20"
          />

          <section className="py-24 px-6 text-center">
             <div className="max-w-2xl mx-auto">
                <FadeIn>
                   <h2 className="text-4xl italic font-bold text-white mb-10">Buku Tamu</h2>
                   <form className="space-y-4 text-left" onSubmit={async (e) => {
                      e.preventDefault();
                      if (previewMode || !data.slug) return;
                      setIsSubmitting(true);
                      const newWish: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                      if (await submitWish(data.slug, newWish)) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); }
                      setIsSubmitting(false);
                   }}>
                      <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Nama Lengkap" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#d4af37] outline-none text-white" required />
                      <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#d4af37] outline-none text-white" required>
                         <option value="" className="bg-[#002b24]">Konfirmasi Kehadiran</option>
                         <option value="hadir" className="bg-[#002b24]">Hadir</option>
                         <option value="tidak" className="bg-[#002b24]">Tidak Hadir</option>
                      </select>
                      <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Ucapan & Doa" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#d4af37] outline-none text-white" required></textarea>
                      <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#d4af37] text-[#002b24] rounded-xl font-bold uppercase tracking-widest hover:bg-white transition">
                         {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                      </button>
                   </form>
                </FadeIn>
             </div>
          </section>

          <footer className="py-24 text-center border-t border-white/5 mt-24">
             <p className="text-3xl italic font-bold text-white mb-4">{data.bride_data.groom} & {data.bride_data.bride}</p>
             <p className="text-[10px] tracking-[0.5em] uppercase text-[#d4af37]/60">Yogyakarta Royal Heritage</p>
          </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-14 h-14 bg-[#d4af37] text-[#002b24] rounded-full shadow-2xl flex items-center justify-center animate-bounce">
          <Disc className={`w-7 h-7 ${isPlaying ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}
