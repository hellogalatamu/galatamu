"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Heart, MapPin, Calendar, Gift, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./AmaraTheme";
import GalleryLightbox from "../GalleryLightbox";

export default function JawaModernTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
    <div className="bg-white min-h-screen text-[#1a1a1a] font-sans selection:bg-[#af944d] selection:text-white">
      {/* Subtle Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white via-[#fdfbf7] to-white"></div>
              <FadeIn className="z-10 text-center px-6">
                 <div className="mb-12">
                    <span className="text-[10px] uppercase tracking-[0.6em] text-[#af944d] font-bold">ꦩꦤꦸꦁꦱꦩꦸꦭꦾ</span>
                 </div>
                 <p className="tracking-[0.4em] uppercase text-[9px] mb-8 text-gray-400">Pernikahan Mulia</p>
                 <h1 className="text-6xl font-serif font-light mb-16 text-[#1a1a1a] italic tracking-tighter">
                   {data.bride_data.groom} <br/> <span className="text-2xl not-italic font-sans text-[#af944d] opacity-50">&</span> <br/> {data.bride_data.bride}
                 </h1>
                 <div className="mb-16">
                    <p className="text-[10px] uppercase tracking-widest text-gray-300 mb-4 italic">— Spesial kagem —</p>
                    <h2 className="text-4xl font-serif font-bold italic text-[#1a1a1a]">{guestName}</h2>
                 </div>
                 <button onClick={openInvitation} className="group relative px-12 py-5 overflow-hidden rounded-full border border-[#af944d] transition-all hover:bg-[#af944d]">
                    <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.4em] text-[#af944d] group-hover:text-white transition">Buka Undangan</span>
                    <div className="absolute inset-0 bg-[#af944d] translate-y-full group-hover:translate-y-0 transition-transform"></div>
                 </button>
              </FadeIn>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 relative z-10">
          
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
             <FadeIn>
                <div className="mb-12">
                   <img src="https://www.freeiconspng.com/uploads/gold-line-png-17.png" className="w-64 h-auto mx-auto opacity-20" alt="Gold Line" />
                </div>
                <h2 className="text-7xl md:text-9xl font-serif font-light italic mb-10 tracking-tighter text-[#1a1a1a]">
                   {data.bride_data.groom} & {data.bride_data.bride}
                </h2>
                <p className="text-lg tracking-[0.5em] uppercase text-[#af944d] mb-20 font-bold">
                   {eventDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <div className="max-w-4xl mx-auto">
                   <Countdown targetDate={eventDate} />
                </div>
             </FadeIn>
          </section>

          <section className="py-32 px-6 text-center max-w-3xl mx-auto">
             <FadeIn>
                <p className="text-2xl font-serif italic text-gray-500 leading-relaxed font-light">
                   {data.quote || `"Mugi-mugi berkah Gusti Allah SWT paring kabahagyan dhumateng kita sedaya."`}
                </p>
                <div className="w-12 h-px bg-[#af944d] mx-auto mt-12"></div>
             </FadeIn>
          </section>

          <section className="py-24 px-6 bg-[#fafafa]">
             <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
                <FadeIn className="flex-1 text-right">
                   <div className="aspect-[3/4] rounded-full overflow-hidden shadow-2xl mb-8 border-[12px] border-white">
                      <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80"} className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-1000" alt="Groom" />
                   </div>
                   <h3 className="text-4xl font-serif italic font-bold mb-2 text-[#1a1a1a]">{data.bride_data.groom}</h3>
                   <p className="text-sm tracking-widest text-[#af944d] mb-4 uppercase font-bold">Putra saking</p>
                   <p className="text-lg text-gray-400 italic">{data.bride_data.parents_groom}</p>
                </FadeIn>
                <div className="text-6xl text-[#af944d]/20 font-serif italic hidden md:block">ꦱꦩꦾ</div>
                <FadeIn className="flex-1 text-left" delay={0.2}>
                   <div className="aspect-[3/4] rounded-full overflow-hidden shadow-2xl mb-8 border-[12px] border-white">
                      <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80"} className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-1000" alt="Bride" />
                   </div>
                   <h3 className="text-4xl font-serif italic font-bold mb-2 text-[#1a1a1a]">{data.bride_data.bride}</h3>
                   <p className="text-sm tracking-widest text-[#af944d] mb-4 uppercase font-bold">Putri saking</p>
                   <p className="text-lg text-gray-400 italic">{data.bride_data.parents_bride}</p>
                </FadeIn>
             </div>
          </section>

          <section className="py-32 px-6">
             <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
                <FadeIn className="bg-white p-16 shadow-2xl rounded-3xl border-t-8 border-[#af944d]">
                   <h4 className="text-[10px] uppercase tracking-[0.5em] text-[#af944d] mb-8 font-bold">ꦄꦏꦢ꧀ꦤꦶꦏꦃ</h4>
                   <h3 className="text-4xl font-serif italic font-bold mb-8">Akad Nikah</h3>
                   <div className="space-y-6 mb-12">
                      <div>
                         <p className="text-xs uppercase text-gray-400 mb-1">Wanci</p>
                         <p className="text-2xl font-serif">{data.event_data.akad_time}</p>
                      </div>
                      <div>
                         <p className="text-xs uppercase text-gray-400 mb-1">Mapan ing</p>
                         <p className="text-xl font-serif text-gray-600">{data.event_data.akad_location}</p>
                      </div>
                   </div>
                   <a href={data.event_data.akad_map} target="_blank" className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#af944d] group">
                      Lihat Lokasi <MapPin size={16} className="group-hover:translate-x-2 transition" />
                   </a>
                </FadeIn>
                <FadeIn className="bg-white p-16 shadow-2xl rounded-3xl border-t-8 border-[#af944d]" delay={0.2}>
                   <h4 className="text-[10px] uppercase tracking-[0.5em] text-[#af944d] mb-8 font-bold">ꦫꦺꦱꦺꦥ꧀ꦱꦶ</h4>
                   <h3 className="text-4xl font-serif italic font-bold mb-8">Resepsi</h3>
                   <div className="space-y-6 mb-12">
                      <div>
                         <p className="text-xs uppercase text-gray-400 mb-1">Wanci</p>
                         <p className="text-2xl font-serif">{data.event_data.resepsi_time}</p>
                      </div>
                      <div>
                         <p className="text-xs uppercase text-gray-400 mb-1">Mapan ing</p>
                         <p className="text-xl font-serif text-gray-600">{data.event_data.resepsi_location}</p>
                      </div>
                   </div>
                   <a href={data.event_data.resepsi_map} target="_blank" className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#af944d] group">
                      Lihat Lokasi <MapPin size={16} className="group-hover:translate-x-2 transition" />
                   </a>
                </FadeIn>
             </div>
          </section>

          <GalleryLightbox 
             images={data.gallery || []} title="Galeri" 
             titleClassName="text-5xl font-serif italic font-bold text-center mb-24"
             sectionClassName="py-32 px-6"
             gridClassName="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto"
             itemClassName="aspect-[3/4] overflow-hidden rounded-3xl"
          />

          <section className="py-32 px-6 bg-[#1a1a1a] text-white">
             <div className="max-w-4xl mx-auto text-center">
                <FadeIn>
                   <h2 className="text-5xl font-serif italic mb-16 tracking-widest">Atur Pangajab</h2>
                   <div className="grid md:grid-cols-2 gap-16 text-left">
                      <form className="space-y-6" onSubmit={async (e) => {
                         e.preventDefault();
                         if (previewMode || !data.slug) return;
                         setIsSubmitting(true);
                         const newWish: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                         if (await submitWish(data.slug, newWish)) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); }
                         setIsSubmitting(false);
                      }}>
                         <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Asma Panjenengan" className="w-full px-0 py-4 bg-transparent border-b border-white/20 focus:border-[#af944d] outline-none transition text-sm italic" required />
                         <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-0 py-4 bg-transparent border-b border-white/20 focus:border-[#af944d] outline-none transition text-sm italic" required>
                            <option value="" className="bg-[#1a1a1a]">Konfirmasi Rawuh</option>
                            <option value="hadir" className="bg-[#1a1a1a]">Insya Allah Rawuh</option>
                            <option value="tidak" className="bg-[#1a1a1a]">Mboten Saged Rawuh</option>
                         </select>
                         <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Doa & Pangajab" className="w-full px-0 py-4 bg-transparent border-b border-white/20 focus:border-[#af944d] outline-none transition text-sm italic" required></textarea>
                         <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-[#af944d] text-white font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-white hover:text-[#1a1a1a] transition">
                            {isSubmitting ? "Ngirim..." : "Kirim Pangajab"}
                         </button>
                      </form>
                      <div className="max-h-[500px] overflow-y-auto pr-8 custom-scrollbar">
                         {wishes.length > 0 ? (
                            [...wishes].reverse().map((wish, i) => (
                               <div key={i} className="mb-10 border-b border-white/10 pb-8">
                                  <div className="flex items-center justify-between mb-2">
                                     <span className="text-xl font-serif italic text-white">{wish.name}</span>
                                     <span className="text-[9px] uppercase tracking-widest text-[#af944d]">{wish.presence === 'hadir' ? 'Rawuh' : 'Absen'}</span>
                                  </div>
                                  <p className="text-white/40 italic font-light leading-relaxed">&quot;{wish.message}&quot;</p>
                               </div>
                            ))
                         ) : (
                            <p className="text-center text-white/20 italic">Dereng wonten pangajab...</p>
                         )}
                      </div>
                   </div>
                </FadeIn>
             </div>
          </section>

          <footer className="py-32 text-center">
             <h2 className="text-5xl font-serif italic mb-4">{data.bride_data.groom} & {data.bride_data.bride}</h2>
             <p className="text-[10px] uppercase tracking-[0.5em] text-gray-300">— Galatamu Jawi Moderen —</p>
          </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-16 h-16 bg-white border border-gray-100 shadow-2xl rounded-full flex items-center justify-center text-[#af944d]">
          <Disc className={`w-8 h-8 ${isPlaying ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}
