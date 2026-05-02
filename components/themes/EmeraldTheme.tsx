"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";

export default function EmeraldTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
    <div className={`bg-[#022c22] min-h-screen text-white font-serif selection:bg-[#10b981] selection:text-white ${previewMode ? 'relative' : ''}`}>
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#064e3b] text-white p-6 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20"></div>
              <Sparkles className="w-16 h-16 text-[#10b981] mb-12 animate-pulse" />
              <FadeIn><h1 className="text-6xl font-bold uppercase tracking-[0.2em] mb-6">{data.bride_data.groom} & {data.bride_data.bride}</h1></FadeIn>
              <FadeIn delay={0.2}><p className="mb-16 opacity-60 uppercase tracking-[0.4em] text-[10px]">Exclusive Invitation for {guestName}</p></FadeIn>
              <button onClick={openInvitation} className="px-16 py-6 border-2 border-[#10b981] text-white font-bold uppercase text-[10px] tracking-[0.6em] hover:bg-[#10b981] transition-all shadow-[0_0_50px_rgba(16,185,129,0.3)]">Open Invitation</button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 pb-32">
          
          <section className="h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-[#022c22] to-[#064e3b]">
             <FadeIn>
                <p className="tracking-[1em] uppercase text-[9px] mb-12 text-[#10b981] font-bold">The Wedding Of</p>
                <h2 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter mb-12 leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>
                <div className="w-32 h-px bg-[#10b981]/30 mx-auto mb-12"></div>
                <p className="text-3xl font-bold mb-20 tracking-widest text-[#10b981] uppercase">{eventDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="max-w-md mx-auto p-12 border border-[#10b981]/20 bg-black/20 backdrop-blur-md">
                   <Countdown targetDate={eventDate} />
                </div>
             </FadeIn>
          </section>

          <section className="py-32 px-6 text-center italic max-w-2xl mx-auto text-white/50 leading-relaxed font-light">
            <FadeIn>
              <p className="text-xl italic">
                {data.quote || "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy."}
              </p>
            </FadeIn>
          </section>

          <section className="py-24 px-6 grid md:grid-cols-2 gap-32 max-w-7xl mx-auto">
             <FadeIn className="text-center">
                <div className="relative group mb-12">
                   <div className="absolute -inset-4 border border-[#10b981]/30 group-hover:inset-0 transition-all duration-1000"></div>
                   <div className="aspect-[3/4] overflow-hidden shadow-2xl relative border-8 border-white/5 grayscale group-hover:grayscale-0 transition duration-1000"><img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" /></div>
                </div>
                <h3 className="text-5xl font-bold uppercase text-white mb-4 tracking-tighter">{data.bride_data.groom}</h3>
                <p className="text-[#10b981] uppercase text-[10px] tracking-[0.4em] font-bold mb-4 italic">Son of</p>
                <p className="text-2xl font-bold italic text-white/60">{data.bride_data.parents_groom}</p>
             </FadeIn>
             <FadeIn className="text-center" delay={0.2}>
                <div className="relative group mb-12">
                   <div className="absolute -inset-4 border border-[#10b981]/30 group-hover:inset-0 transition-all duration-1000"></div>
                   <div className="aspect-[3/4] overflow-hidden shadow-2xl relative border-8 border-white/5 grayscale group-hover:grayscale-0 transition duration-1000"><img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" /></div>
                </div>
                <h3 className="text-5xl font-bold uppercase text-white mb-4 tracking-tighter">{data.bride_data.bride}</h3>
                <p className="text-[#10b981] uppercase text-[10px] tracking-[0.4em] font-bold mb-4 italic">Daughter of</p>
                <p className="text-2xl font-bold italic text-white/60">{data.bride_data.parents_bride}</p>
             </FadeIn>
          </section>

          {data.love_story && data.love_story.length > 0 && (
            <section className="py-32 px-6 bg-white/5 border-y border-white/5">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-24"><h2 className="text-4xl italic font-bold tracking-widest text-[#10b981] uppercase">Our Journey</h2></FadeIn>
                  <div className="space-y-16">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="relative pl-20 border-l border-[#10b981]/30 py-8 group">
                              <div className="absolute -left-1.5 top-10 w-3 h-3 bg-[#10b981] group-hover:scale-[3] transition duration-500 shadow-[0_0_10px_#10b981]"></div>
                              <p className="text-4xl font-bold text-[#10b981] mb-4 opacity-40 group-hover:opacity-100 transition duration-700 italic">{story.year}</p>
                              <h4 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest leading-none">{story.title}</h4>
                              <p className="text-white/40 italic font-light leading-relaxed text-lg">{story.desc}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
               <FadeIn className="p-20 border border-[#10b981]/10 bg-black/20 backdrop-blur-md text-center group">
                  <p className="tracking-[0.8em] uppercase text-[9px] mb-12 text-[#10b981] font-bold italic opacity-60">Ceremony</p>
                  <p className="text-5xl font-bold italic text-white mb-8">{data.event_data.akad_time}</p>
                  <p className="text-white/40 italic mb-12 text-xl max-w-xs mx-auto leading-relaxed">{data.event_data.akad_location}</p>
                  <a href={data.event_data.akad_map} target="_blank" className="inline-block px-12 py-5 border border-[#10b981] text-[#10b981] font-bold uppercase tracking-[0.4em] text-[9px] hover:bg-[#10b981] hover:text-white transition-all shadow-lg">View Location</a>
               </FadeIn>
               <FadeIn className="p-20 border border-[#10b981]/10 bg-black/20 backdrop-blur-md text-center group" delay={0.2}>
                  <p className="tracking-[0.8em] uppercase text-[9px] mb-12 text-[#10b981] font-bold italic opacity-60">Reception</p>
                  <p className="text-5xl font-bold italic text-white mb-8">{data.event_data.resepsi_time}</p>
                  <p className="text-white/40 italic mb-12 text-xl max-w-xs mx-auto leading-relaxed">{data.event_data.resepsi_location}</p>
                  <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-12 py-5 border border-[#10b981] text-[#10b981] font-bold uppercase tracking-[0.4em] text-[9px] hover:bg-[#10b981] hover:text-white transition-all shadow-lg">View Location</a>
               </FadeIn>
            </div>
          </section>

          <GalleryLightbox
            images={data.gallery || []}
            title="Visual Gallery"
            titleClassName="text-5xl font-bold uppercase tracking-[0.2em] text-white text-center mb-24"
            sectionClassName="py-24 px-6 bg-[#022c22]"
            gridClassName="grid grid-cols-2 md:grid-cols-3 gap-12 max-w-7xl mx-auto"
            itemClassName="aspect-[4/5] overflow-hidden bg-black border-2 border-[#10b981]/10 shadow-2xl group p-4 cursor-pointer relative"
            imgClassName="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition duration-1000"
          />

          {data.video && (
            <section className="py-32 px-6 text-center">
              <FadeIn><h3 className="text-2xl italic font-bold text-white mb-16 tracking-[1em] uppercase opacity-40">Film Documentation</h3></FadeIn>
              <div className="max-w-5xl mx-auto aspect-video border-8 border-white/5 shadow-2xl bg-black overflow-hidden rounded-3xl">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {data.gifts && data.gifts.length > 0 && (
            <section className="py-32 px-6 text-center">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-24">
                     <Gift className="w-16 h-16 text-[#10b981] mx-auto mb-10 opacity-30 shadow-[0_0_20px_#10b981]" />
                     <h2 className="text-5xl font-bold uppercase tracking-widest text-white">Digital Gift</h2>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-16">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-black/20 border border-[#10b981]/10 p-20 shadow-2xl relative group overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-[#10b981] opacity-20 group-hover:h-full transition-all duration-700"></div>
                              <p className="uppercase text-[9px] tracking-[0.5em] font-bold text-[#10b981] mb-10 italic">{gift.bank}</p>
                              <p className="text-4xl font-bold text-white mb-4 tracking-[0.2em] italic leading-none">{gift.acc}</p>
                              <p className="text-xs uppercase tracking-widest opacity-40 font-bold">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6 bg-black/20 border-t border-white/5">
            <div className="max-w-2xl mx-auto text-center">
               <FadeIn className="mb-16">
                  <h2 className="text-5xl font-bold italic text-white tracking-widest mb-8 leading-tight">Emerald Wishes</h2>
                  <p className="text-[#10b981] uppercase text-[9px] tracking-[0.6em] italic font-bold">RSVP & MESSAGE</p>
               </FadeIn>
               <FadeIn delay={0.2}>
                  <form className="space-y-6 mb-24 text-left" onSubmit={async (e) => {
                    e.preventDefault();
                    if (previewMode) return alert("Preview mode active.");
                    if (!data.slug) return;
                    setIsSubmitting(true);
                    const newWish: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                    try {
                        const success = await submitWish(data.slug, newWish);
                        if (success) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); alert("Thank you for your wishes!"); }
                    } finally { setIsSubmitting(false); }
                  }}>
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Full Name" className="w-full px-10 py-6 bg-white/5 border border-[#10b981]/10 text-white focus:outline-none focus:border-[#10b981]/40 text-[10px] uppercase tracking-[0.4em] italic" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-10 py-6 bg-[#022c22] border border-[#10b981]/10 text-white focus:outline-none text-[10px] uppercase tracking-[0.4em] italic" required>
                        <option value="">Will You Attend?</option>
                        <option value="hadir">Attending</option>
                        <option value="tidak">Respectfully Decline</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Your Heartfelt Message" className="w-full px-10 py-6 bg-white/5 border border-[#10b981]/10 text-white focus:outline-none focus:border-[#10b981]/40 text-[10px] uppercase tracking-[0.4em] italic" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-7 bg-[#10b981] text-white font-bold uppercase tracking-[0.8em] text-[10px] hover:bg-white hover:text-[#022c22] transition-all disabled:opacity-50">
                        {isSubmitting ? "Sending..." : "Submit Message"}
                    </button>
                  </form>
               </FadeIn>
               <div className="space-y-16 max-h-[600px] overflow-y-auto pr-8 text-left custom-scrollbar">
                  {wishes.map((wish, idx) => (
                    <div key={idx} className="border-b border-white/5 pb-16 relative group">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-4xl font-bold italic text-white tracking-tighter leading-none">{wish.name}</span>
                            <span className="text-[10px] bg-[#10b981]/10 px-4 py-2 text-[#10b981] border border-[#10b981]/20 uppercase font-bold tracking-widest leading-none">{wish.presence === 'hadir' ? 'Attending' : 'Decline'}</span>
                        </div>
                        <p className="text-white/40 italic font-light leading-relaxed text-2xl">&quot;{wish.message}&quot;</p>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          <footer className="py-40 text-center text-white/10 uppercase text-[10px] tracking-[3em]"> Emerald Green Glow </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-12 right-12 z-40 w-16 h-16 bg-[#022c22] border border-[#10b981]/30 rounded-full shadow-2xl flex items-center justify-center text-[#10b981] transition-all hover:scale-110 active:scale-95 group">
          <Disc className={`w-9 h-9 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

