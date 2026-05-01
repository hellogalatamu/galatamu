"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Gift, Send, Crown, Gem, Heart, MapPin, Video } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./AmaraTheme";
import GalleryLightbox from "../GalleryLightbox";

export default function RoyalTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData; previewMode?: boolean; guestName?: string }) {
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
      audioRef.current = new Audio(data.music_url || "https://cdn.pixabay.com/download/audio/2021/11/17/audio_0974b9f5e3.mp3?filename=orchestra-wedding-1153.mp3");
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={`min-h-screen bg-[#06060f] text-[#e8d5a3] selection:bg-[#e8d5a3] selection:text-black ${previewMode ? "relative" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,400&display=swap');
        .font-royal { font-family: 'Cinzel', serif; }
        .font-script { font-family: 'Pinyon Script', cursive; }
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .royal-gradient { background: linear-gradient(135deg, #0c0b1e 0%, #06060f 100%); }
        .gold-border { border: 1px solid #c8973e; }
        .ornament { color: #c8973e; opacity: 0.5; }
      `}</style>

      {/* ── CURTAIN REVEAL (COVER) ── */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
              className="fixed inset-0 z-50 royal-gradient flex overflow-hidden">
               {/* Left Curtain */}
               <motion.div exit={{ x: "-100%" }} transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
                 className="flex-1 bg-[#1a0b0b] border-r border-[#c8973e]/30 relative">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-20" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 ornament"><Crown size={40} /></div>
               </motion.div>
               {/* Right Curtain */}
               <motion.div exit={{ x: "100%" }} transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
                 className="flex-1 bg-[#1a0b0b] border-l border-[#c8973e]/30 relative">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-20" />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 ornament"><Crown size={40} /></div>
               </motion.div>
               {/* Center content on top of curtains */}
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
                  <FadeIn>
                     <Gem className="w-12 h-12 text-[#c8973e] mb-10 animate-pulse" />
                     <p className="font-royal text-[10px] tracking-[0.8em] mb-12 text-[#c8973e]">The Royal Proclamation</p>
                     <h1 className="font-script text-7xl md:text-9xl mb-8 leading-none">{data.bride_data.groom} <span className="font-serif italic text-4xl block my-4">&amp;</span> {data.bride_data.bride}</h1>
                     <p className="font-royal text-[10px] tracking-[0.5em] mb-16 text-[#e8d5a3]/40">FOR {guestName.toUpperCase()}</p>
                     <button onClick={openInvitation}
                       className="px-16 py-5 border border-[#c8973e] text-[#c8973e] font-royal text-[10px] uppercase tracking-[0.6em] hover:bg-[#c8973e] hover:text-black transition-all duration-700 shadow-[0_0_40px_rgba(200,151,62,0.15)]">
                       Reveal Invitation
                     </button>
                  </FadeIn>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 overflow-hidden">
          
          {/* HERO */}
          <section className="relative min-h-screen flex flex-col items-center justify-center p-10 overflow-hidden">
             <div className="absolute inset-0 z-0 opacity-20">
                <img src={data.hero_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" />
             </div>
             <div className="relative z-10 max-w-4xl w-full border-2 border-[#c8973e]/40 p-10 md:p-20 text-center royal-gradient shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#06060f] px-6 py-2 border border-[#c8973e]/40">
                   <Crown className="text-[#c8973e]" size={24} />
                </div>
                <FadeIn>
                   <p className="font-royal text-[10px] tracking-[1em] mb-16 text-[#c8973e]">THE WEDDING CELEBRATION</p>
                   <h2 className="font-script text-7xl md:text-9xl mb-4 leading-none">{data.bride_data.groom}</h2>
                   <p className="font-serif italic text-3xl my-6 text-[#c8973e]/60">&amp;</p>
                   <h2 className="font-script text-7xl md:text-9xl mb-16 leading-none">{data.bride_data.bride}</h2>
                   <div className="border-t border-[#c8973e]/20 pt-12">
                      <p className="font-royal text-xl tracking-[0.4em] mb-8">{eventDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</p>
                      <Countdown targetDate={eventDate} />
                   </div>
                </FadeIn>
             </div>
          </section>

          {/* QUOTE */}
          <section className="py-32 px-10 text-center">
             <FadeIn className="max-w-3xl mx-auto">
                <p className="font-serif text-3xl italic leading-relaxed opacity-80">
                   &ldquo;{data.quote || "To love is to recognize yourself in another."}&rdquo;
                </p>
                <div className="mt-12 h-px w-24 bg-[#c8973e]/40 mx-auto" />
             </FadeIn>
          </section>

          {/* PROFILES */}
          <section className="py-24 px-10 grid md:grid-cols-2 gap-20 max-w-7xl mx-auto">
             <FadeIn className="text-center group">
                <div className="relative aspect-[3/4] mb-12 p-4 border border-[#c8973e]/20">
                   <div className="absolute inset-0 border-2 border-[#c8973e] m-[-8px] scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700" />
                   <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover sepia-[0.3]" />
                </div>
                <h3 className="font-royal text-3xl mb-4 tracking-widest">{data.bride_data.groom}</h3>
                <p className="font-serif italic text-xl opacity-40">Son of {data.bride_data.parents_groom}</p>
             </FadeIn>
             <FadeIn className="text-center group" delay={0.2}>
                <div className="relative aspect-[3/4] mb-12 p-4 border border-[#c8973e]/20">
                   <div className="absolute inset-0 border-2 border-[#c8973e] m-[-8px] scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700" />
                   <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover sepia-[0.3]" />
                </div>
                <h3 className="font-royal text-3xl mb-4 tracking-widest">{data.bride_data.bride}</h3>
                <p className="font-serif italic text-xl opacity-40">Daughter of {data.bride_data.parents_bride}</p>
             </FadeIn>
          </section>

          {/* EVENTS */}
          <section className="py-32 px-10 royal-gradient relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/antique-texture.png')]" />
             <div className="max-w-5xl mx-auto border-t border-b border-[#c8973e]/30 py-20">
                <div className="grid md:grid-cols-2 gap-16">
                   <FadeIn className="text-center">
                      <p className="font-royal text-[10px] tracking-[0.5em] mb-10 text-[#c8973e]">HOLY MATRIMONY</p>
                      <h4 className="font-script text-5xl mb-6">{data.event_data.akad_time}</h4>
                      <p className="font-serif italic text-xl mb-12 px-10 leading-relaxed opacity-60">{data.event_data.akad_location}</p>
                      <a href={data.event_data.akad_map} className="font-royal text-[9px] border border-[#c8973e]/40 px-10 py-4 hover:bg-[#c8973e] hover:text-black transition-all">VIEW LOCATION</a>
                   </FadeIn>
                   <FadeIn className="text-center" delay={0.2}>
                      <p className="font-royal text-[10px] tracking-[0.5em] mb-10 text-[#c8973e]">GRAND RECEPTION</p>
                      <h4 className="font-script text-5xl mb-6">{data.event_data.resepsi_time}</h4>
                      <p className="font-serif italic text-xl mb-12 px-10 leading-relaxed opacity-60">{data.event_data.resepsi_location}</p>
                      <a href={data.event_data.resepsi_map} className="font-royal text-[9px] border border-[#c8973e]/40 px-10 py-4 hover:bg-[#c8973e] hover:text-black transition-all">VIEW LOCATION</a>
                   </FadeIn>
                </div>
             </div>
          </section>

          {/* GALLERY */}
          <section className="py-32 px-10">
             <div className="text-center mb-20">
                <Crown size={24} className="mx-auto mb-8 ornament" />
                <h3 className="font-royal text-3xl tracking-[0.6em] uppercase">The Royal Archives</h3>
             </div>
             <GalleryLightbox 
                images={data.gallery || []}
                title=""
                sectionClassName=""
                gridClassName="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto"
                itemClassName="aspect-square border border-[#c8973e]/10 hover:border-[#c8973e]/50 transition-all p-2"
                imgClassName="w-full h-full object-cover sepia-[0.4] grayscale-[0.2] hover:sepia-0 hover:grayscale-0 transition-all duration-1000"
             />
          </section>

          {/* GIFTS */}
          <section className="py-32 px-10 royal-gradient">
             <div className="max-w-4xl mx-auto text-center border border-[#c8973e]/20 p-20 relative">
                <div className="absolute inset-2 border border-[#c8973e]/5" />
                <FadeIn>
                   <h3 className="font-royal text-3xl mb-12 tracking-widest text-[#c8973e]">WEDDING GIFT</h3>
                   <p className="font-serif italic text-xl mb-16 opacity-60">Your presence is our greatest honor. However, should you wish to send a gift, we appreciate your generosity through these channels.</p>
                   <div className="grid md:grid-cols-2 gap-10">
                      {data.gifts?.map((g, i) => (
                         <div key={i} className="p-10 border border-[#c8973e]/10 bg-black/20 group hover:border-[#c8973e]/40 transition-all">
                            <p className="font-royal text-[10px] mb-6 opacity-40">{g.bank.toUpperCase()}</p>
                            <p className="font-royal text-2xl tracking-[0.3em] mb-4 text-[#c8973e]">{g.acc}</p>
                            <p className="font-serif italic opacity-60">A.N {g.name}</p>
                         </div>
                      ))}
                   </div>
                </FadeIn>
             </div>
          </section>

          {/* RSVP */}
          <section className="py-32 px-10 max-w-3xl mx-auto text-center">
             <FadeIn>
                <h3 className="font-royal text-3xl mb-12 tracking-[0.4em]">ATTENDANCE REGISTRY</h3>
                <form className="space-y-8" onSubmit={async (e) => {
                   e.preventDefault();
                   if (previewMode) return;
                   setIsSubmitting(true);
                   const w: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                   try { const ok = await submitWish(data.slug || "", w); if (ok) { setWishes([...wishes, w]); setRsvpMessage(""); setRsvpPresence(""); } }
                   finally { setIsSubmitting(false); }
                }}>
                   <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="FULL NAME" className="w-full bg-transparent border-b border-[#c8973e]/30 px-4 py-6 font-royal text-[10px] focus:outline-none focus:border-[#c8973e] text-[#e8d5a3]" required />
                   <select value={rsvpPresence} onChange={e => setRsvpPresence(e.target.value)} className="w-full bg-[#06060f] border-b border-[#c8973e]/30 px-4 py-6 font-royal text-[10px] focus:outline-none focus:border-[#c8973e] text-[#e8d5a3]" required>
                      <option value="">CONFIRMATION</option>
                      <option value="hadir">WILL ATTEND</option>
                      <option value="tidak">REGRETFULLY DECLINE</option>
                   </select>
                   <textarea rows={4} value={rsvpMessage} onChange={e => setRsvpMessage(e.target.value)} placeholder="GRACIOUS WISHES" className="w-full bg-transparent border-b border-[#c8973e]/30 px-4 py-6 font-royal text-[10px] focus:outline-none focus:border-[#c8973e] text-[#e8d5a3] resize-none" required></textarea>
                   <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-[#c8973e] text-black font-royal text-[10px] font-bold tracking-[0.6em] hover:bg-white transition-all duration-500">
                      {isSubmitting ? "TRANSMITTING..." : "SUBMIT PROTOCOL"}
                   </button>
                </form>
             </FadeIn>
             
             <div className="mt-32 space-y-12 text-left">
                {wishes.slice(0, 5).map((w, i) => (
                   <div key={i} className="border-l border-[#c8973e]/30 pl-10">
                      <div className="flex justify-between items-start mb-4">
                         <span className="font-royal text-lg tracking-widest">{w.name.toUpperCase()}</span>
                         <span className="font-serif italic opacity-40 text-sm">{w.presence === 'hadir' ? 'Attending' : 'Regrets'}</span>
                      </div>
                      <p className="font-serif text-xl italic opacity-60 leading-relaxed">&ldquo;{w.message}&rdquo;</p>
                   </div>
                ))}
             </div>
          </section>

          {/* FOOTER */}
          <footer className="py-40 text-center royal-gradient">
             <div className="h-px w-64 bg-[#c8973e]/20 mx-auto mb-20" />
             <h2 className="font-script text-7xl md:text-9xl mb-10 leading-none">{data.bride_data.groom} &amp; {data.bride_data.bride}</h2>
             <p className="font-royal text-[9px] tracking-[1em] text-[#c8973e]/40">— SUPREME COLLECTION —</p>
          </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-12 h-12 border border-[#c8973e]/40 bg-[#06060f] flex items-center justify-center rounded-full hover:scale-110 transition-all text-[#c8973e]">
          <Disc className={`w-5 h-5 ${isPlaying ? 'animate-[spin_5s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}
