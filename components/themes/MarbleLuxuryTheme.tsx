"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";

export default function MarbleLuxuryTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
      const musicSrc = data.music_url || "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808d7a4f4.mp3?filename=luxury-wedding-110620.mp3";
      audioRef.current = new Audio(musicSrc);
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={`bg-white min-h-screen text-[#1a1a1a] font-serif selection:bg-[#d4af37] selection:text-white ${previewMode ? 'relative' : ''}`}>
      <div className="fixed inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')]"></div>
      
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-[#1a1a1a] p-6 text-center">
              <div className="w-24 h-24 border border-[#d4af37] rotate-45 flex items-center justify-center mb-16 shadow-[0_0_50px_rgba(212,175,55,0.1)]"><Heart className="-rotate-45 text-[#d4af37] w-10 h-10" /></div>
              <FadeIn><h1 className="text-5xl font-light uppercase tracking-[0.6em] mb-6 italic">{data.bride_data.groom} & {data.bride_data.bride}</h1></FadeIn>
              <FadeIn delay={0.2}><p className="mb-16 opacity-40 uppercase tracking-[0.4em] text-[10px]">A Marble Luxe Serenity for {guestName}</p></FadeIn>
              <button onClick={openInvitation} className="px-20 py-5 bg-[#1a1a1a] text-white rounded-none font-bold uppercase text-[10px] tracking-[0.6em] hover:bg-[#d4af37] transition-all">Open Invitation</button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 pb-32">
          
          <section className="h-screen flex flex-col items-center justify-center text-center p-6 bg-white border-b-[12px] border-[#d4af37]/10">
             <FadeIn>
                <p className="tracking-[1em] uppercase text-[9px] mb-16 text-[#d4af37] font-bold">The Marble Luxury</p>
                <h2 className="text-6xl md:text-9xl font-light uppercase tracking-tighter mb-16 italic text-[#1a1a1a] leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>
                <div className="w-32 h-px bg-[#d4af37] mx-auto mb-16"></div>
                <p className="text-3xl font-light mb-20 text-[#1a1a1a]/60 tracking-[0.4em] italic uppercase">{eventDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="max-w-md mx-auto p-12 border border-[#d4af37]/20 bg-white/50 backdrop-blur-md">
                   <Countdown targetDate={eventDate} />
                </div>
             </FadeIn>
          </section>

          <section className="py-32 px-6 text-center italic max-w-2xl mx-auto text-[#1a1a1a]/40 leading-relaxed font-light">
            <FadeIn>
              <p className="text-2xl tracking-widest leading-loose">
                {data.quote || "Love is the beauty of the soul. In every grain of marble, in every whisper of the wind, I find you."}
              </p>
            </FadeIn>
          </section>

          <section className="py-24 px-6 grid md:grid-cols-2 gap-px bg-[#d4af37]/5 max-w-7xl mx-auto border border-[#d4af37]/10 shadow-2xl">
             <FadeIn className="p-24 text-center bg-white">
                <div className="relative group mb-16">
                   <div className="absolute inset-0 border border-[#d4af37]/20 group-hover:scale-110 transition-all duration-1000"></div>
                   <div className="aspect-[3/4] overflow-hidden shadow-2xl relative border-8 border-white grayscale brightness-105 group-hover:grayscale-0 transition duration-1000"><img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" /></div>
                </div>
                <h3 className="text-4xl font-light uppercase text-[#1a1a1a] mb-4 tracking-[0.4em] italic leading-none">{data.bride_data.groom}</h3>
                <p className="text-[#d4af37] uppercase text-[9px] tracking-[0.5em] font-bold mb-4 italic">Son of</p>
                <p className="text-xl font-light italic text-[#1a1a1a]/60">{data.bride_data.parents_groom}</p>
             </FadeIn>
             <FadeIn className="p-24 text-center bg-white" delay={0.2}>
                <div className="relative group mb-16">
                   <div className="absolute inset-0 border border-[#d4af37]/20 group-hover:scale-110 transition-all duration-1000"></div>
                   <div className="aspect-[3/4] overflow-hidden shadow-2xl relative border-8 border-white grayscale brightness-105 group-hover:grayscale-0 transition duration-1000"><img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" /></div>
                </div>
                <h3 className="text-4xl font-light uppercase text-[#1a1a1a] mb-4 tracking-[0.4em] italic leading-none">{data.bride_data.bride}</h3>
                <p className="text-[#d4af37] uppercase text-[9px] tracking-[0.5em] font-bold mb-4 italic">Daughter of</p>
                <p className="text-xl font-light italic text-[#1a1a1a]/60">{data.bride_data.parents_bride}</p>
             </FadeIn>
          </section>

          {data.love_story && data.love_story.length > 0 && (
            <section className="py-32 px-6 bg-white border-y border-[#d4af37]/10">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-24"><h2 className="text-4xl font-light uppercase tracking-[0.6em] text-[#1a1a1a] italic">The Luxe Timeline</h2></FadeIn>
                  <div className="space-y-20">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="relative pl-24 border-l border-[#d4af37]/20 py-10 group">
                              <div className="absolute -left-1 top-12 w-2 h-16 bg-[#d4af37] opacity-20 group-hover:opacity-100 transition duration-500"></div>
                              <p className="text-6xl font-light text-[#d4af37]/10 group-hover:text-[#d4af37] transition-colors duration-700 mb-6 tracking-tighter italic leading-none">{story.year}</p>
                              <h4 className="text-2xl font-light text-[#1a1a1a] mb-4 uppercase tracking-[0.3em] italic leading-none">{story.title}</h4>
                              <p className="text-[#1a1a1a]/40 italic font-light leading-relaxed text-xl tracking-wide">{story.desc}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-px bg-[#d4af37]/20">
               <FadeIn className="p-20 bg-white text-center border border-[#d4af37]/5">
                  <p className="tracking-[0.8em] uppercase text-[8px] mb-16 text-[#d4af37] font-bold italic">The Matrimony</p>
                  <p className="text-5xl font-light uppercase mb-8 leading-none italic">{data.event_data.akad_time}</p>
                  <p className="text-[#1a1a1a]/40 italic mb-16 text-lg max-w-xs mx-auto leading-relaxed">{data.event_data.akad_location}</p>
                  <a href={data.event_data.akad_map} target="_blank" className="inline-block px-12 py-5 bg-[#1a1a1a] text-white font-bold uppercase tracking-[0.4em] text-[8px] rounded-none hover:bg-[#d4af37] transition-all shadow-2xl">View Map</a>
               </FadeIn>
               <FadeIn className="p-20 bg-white text-center border border-[#d4af37]/5" delay={0.2}>
                  <p className="tracking-[0.8em] uppercase text-[8px] mb-16 text-[#d4af37] font-bold italic">The Banquet</p>
                  <p className="text-5xl font-light uppercase mb-8 leading-none italic">{data.event_data.resepsi_time}</p>
                  <p className="text-[#1a1a1a]/40 italic mb-16 text-lg max-w-xs mx-auto leading-relaxed">{data.event_data.resepsi_location}</p>
                  <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-12 py-5 bg-[#1a1a1a] text-white font-bold uppercase tracking-[0.4em] text-[8px] rounded-none hover:bg-[#d4af37] transition-all shadow-2xl">View Map</a>
               </FadeIn>
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

          {data.video && (
            <section className="py-32 px-6 text-center bg-white">
              <FadeIn><h3 className="text-2xl font-light uppercase mb-20 text-[#d4af37] tracking-[0.8em] italic">The Cinematography</h3></FadeIn>
              <div className="max-w-5xl mx-auto aspect-video border border-[#d4af37]/20 p-8 bg-white shadow-2xl">
                <iframe className="w-full h-full grayscale hover:grayscale-0 transition duration-1000" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {data.gifts && data.gifts.length > 0 && (
            <section className="py-32 px-6 text-center bg-white/50">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-24">
                     <Gift className="w-16 h-16 text-[#d4af37] mx-auto mb-12 opacity-30 shadow-[0_0_30px_rgba(212,175,55,0.2)]" />
                     <h2 className="text-5xl font-light uppercase tracking-[0.4em] text-[#1a1a1a] italic">Luxe Gift</h2>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-px bg-[#d4af37]/10 border border-[#d4af37]/10">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-white p-24 group relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-[#d4af37] opacity-10 group-hover:h-full transition-all duration-700"></div>
                              <p className="uppercase text-[8px] tracking-[1em] font-bold text-[#d4af37] mb-12 italic">{gift.bank}</p>
                              <p className="text-3xl font-light text-[#1a1a1a] mb-6 tracking-widest italic leading-none">{gift.acc}</p>
                              <p className="text-[10px] uppercase tracking-[0.5em] text-[#1a1a1a]/40 font-bold italic">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6 bg-white border-t border-[#d4af37]/10 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
            <div className="max-w-2xl mx-auto text-center">
               <FadeIn className="mb-24">
                  <h2 className="text-5xl font-light uppercase tracking-[0.4em] text-[#1a1a1a] mb-10 italic">Luxe Wishes</h2>
                  <p className="text-[#d4af37] uppercase text-[9px] tracking-[1em] italic font-bold">RSVP & MESSAGE</p>
               </FadeIn>
               <FadeIn delay={0.2}>
                  <form className="space-y-12 mb-32 text-left" onSubmit={async (e) => {
                    e.preventDefault();
                    if (previewMode) return alert("Preview mode active.");
                    if (!data.slug) return;
                    setIsSubmitting(true);
                    const newWish: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                    try {
                        const success = await submitWish(data.slug, newWish);
                        if (success) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); alert("Thank you for your wishes."); }
                    } finally { setIsSubmitting(false); }
                  }}>
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Full Name" className="w-full px-0 py-8 bg-transparent border-b border-[#d4af37]/20 text-[#1a1a1a] focus:outline-none focus:border-[#d4af37] text-[10px] uppercase tracking-[0.6em] italic font-light" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-0 py-8 bg-white border-b border-[#d4af37]/20 text-[#1a1a1a] focus:outline-none focus:border-[#d4af37] text-[10px] uppercase tracking-[0.6em] italic font-light" required>
                        <option value="">Availability</option>
                        <option value="hadir">Attending</option>
                        <option value="tidak">Respectfully Decline</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Your Heartfelt Message" className="w-full px-0 py-8 bg-transparent border-b border-[#d4af37]/20 text-[#1a1a1a] focus:outline-none focus:border-[#d4af37] text-[10px] uppercase tracking-[0.6em] italic font-light" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-8 bg-[#1a1a1a] text-white font-bold uppercase tracking-[1em] text-[10px] hover:bg-[#d4af37] transition-all disabled:opacity-50 shadow-2xl">
                        {isSubmitting ? "Processing..." : "Submit Message"}
                    </button>
                  </form>
               </FadeIn>
               <div className="space-y-24 max-h-[700px] overflow-y-auto pr-10 text-left custom-scrollbar">
                  {wishes.map((wish, idx) => (
                    <div key={idx} className="pb-16 border-b border-[#d4af37]/5 group">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-3xl font-light uppercase tracking-[0.2em] text-[#1a1a1a] italic">{wish.name}</span>
                            <span className="text-[9px] border border-[#d4af37]/20 px-4 py-2 text-[#d4af37] uppercase font-bold tracking-[0.4em] italic">{wish.presence === 'hadir' ? 'Yes' : 'No'}</span>
                        </div>
                        <p className="text-[#1a1a1a]/40 italic font-light leading-relaxed text-2xl tracking-wide">&quot;{wish.message}&quot;</p>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          <footer className="py-40 text-center text-[#d4af37]/20 uppercase text-[9px] tracking-[4em]"> Marble White Luxury </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-12 right-12 z-40 w-16 h-16 bg-white border border-[#d4af37]/20 rounded-full shadow-2xl flex items-center justify-center text-[#d4af37] transition-all hover:scale-110 active:scale-95 group">
          <Disc className={`w-9 h-9 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

