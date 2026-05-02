"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";

export default function RomanticRoseTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
    <div className={`bg-[#fff1f2] min-h-screen text-[#881337] font-serif selection:bg-[#fb7185] selection:text-white ${previewMode ? 'relative' : ''}`}>
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')]"></div>
      
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fecaca] text-[#881337] p-6 text-center">
              <Heart className="w-16 h-16 text-[#881337] mb-12 animate-pulse fill-[#881337]/10" />
              <FadeIn><h1 className="text-5xl font-bold italic mb-6 tracking-tight">{data.bride_data.groom} & {data.bride_data.bride}</h1></FadeIn>
              <FadeIn delay={0.2}><p className="mb-16 opacity-60 uppercase tracking-[0.4em] text-[10px]">A Romantic Invite for {guestName}</p></FadeIn>
              <button onClick={openInvitation} className="px-16 py-5 bg-[#881337] text-white rounded-full font-bold uppercase text-[10px] tracking-[0.5em] hover:bg-[#9f1239] transition-all shadow-xl shadow-rose-200">Open Invitation</button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 pb-32">
          
          <section className="h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-[#fecaca] to-[#fff1f2]">
             <FadeIn>
                <p className="tracking-[0.8em] uppercase text-[9px] mb-12 text-[#e11d48] font-bold">The Wedding Of</p>
                <h2 className="text-6xl md:text-9xl font-bold italic mb-12 text-[#881337] tracking-tighter leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>
                <div className="w-24 h-1 bg-[#fb7185] mx-auto mb-12 rounded-full opacity-30"></div>
                <p className="text-2xl font-bold mb-16 text-[#9f1239] tracking-widest">{eventDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="max-w-md mx-auto p-12 bg-white shadow-2xl rounded-[3rem] border border-rose-100">
                   <Countdown targetDate={eventDate} />
                </div>
             </FadeIn>
          </section>

          <section className="py-32 px-6 text-center italic max-w-2xl mx-auto text-[#881337]/60 leading-relaxed font-light">
            <FadeIn>
              <p className="text-2xl font-serif leading-loose">
                {data.quote || "I want to be your favorite hello and your hardest goodbye. Two hearts, one soul, one love forever."}
              </p>
            </FadeIn>
          </section>

          <section className="py-24 px-6 grid md:grid-cols-2 gap-32 max-w-7xl mx-auto">
             <FadeIn className="text-center">
                <div className="relative group mb-12">
                   <div className="absolute -inset-4 bg-[#fecaca]/30 rounded-full group-hover:-inset-8 transition-all duration-1000"></div>
                   <div className="aspect-square rounded-full overflow-hidden shadow-2xl relative border-8 border-white group-hover:rotate-6 transition-all duration-700"><img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" /></div>
                </div>
                <h3 className="text-4xl font-bold italic text-[#881337] mb-2">{data.bride_data.groom}</h3>
                <p className="text-[#e11d48] uppercase text-[10px] tracking-[0.4em] font-bold mb-4 italic">Son of</p>
                <p className="text-xl italic text-[#881337]/60">{data.bride_data.parents_groom}</p>
             </FadeIn>
             <FadeIn className="text-center" delay={0.2}>
                <div className="relative group mb-12">
                   <div className="absolute -inset-4 bg-[#fecaca]/30 rounded-full group-hover:-inset-8 transition-all duration-1000"></div>
                   <div className="aspect-square rounded-full overflow-hidden shadow-2xl relative border-8 border-white group-hover:-rotate-6 transition-all duration-700"><img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" /></div>
                </div>
                <h3 className="text-4xl font-bold italic text-[#881337] mb-2">{data.bride_data.bride}</h3>
                <p className="text-[#e11d48] uppercase text-[10px] tracking-[0.4em] font-bold mb-4 italic">Daughter of</p>
                <p className="text-xl italic text-[#881337]/60">{data.bride_data.parents_bride}</p>
             </FadeIn>
          </section>

          {data.love_story && data.love_story.length > 0 && (
            <section className="py-32 px-6 bg-white/40 border-y border-[#fb7185]/5">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-24"><h2 className="text-4xl italic font-bold tracking-widest text-[#881337]">Our Love Story</h2></FadeIn>
                  <div className="space-y-12">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="p-12 bg-white rounded-[2rem] shadow-xl border-t-8 border-[#fb7185] relative overflow-hidden group">
                              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#fecaca]/20 rounded-full group-hover:scale-150 transition duration-700"></div>
                              <p className="text-3xl font-bold text-[#e11d48] mb-4 italic leading-none">{story.year}</p>
                              <h4 className="text-2xl font-bold text-[#881337] mb-4 italic tracking-widest leading-none">{story.title}</h4>
                              <p className="text-[#881337]/60 italic font-light leading-relaxed text-lg">{story.desc}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
               <FadeIn className="p-16 bg-white rounded-[3rem] shadow-2xl text-center group border border-rose-50">
                  <p className="tracking-[0.8em] uppercase text-[9px] mb-12 text-[#e11d48] font-bold italic opacity-60">The Vows</p>
                  <p className="text-5xl font-bold italic text-[#881337] mb-8 leading-none">{data.event_data.akad_time}</p>
                  <p className="text-[#881337]/60 italic mb-12 text-xl max-w-xs mx-auto leading-relaxed">{data.event_data.akad_location}</p>
                  <a href={data.event_data.akad_map} target="_blank" className="inline-block px-12 py-5 bg-[#e11d48] text-white font-bold uppercase tracking-[0.4em] text-[9px] rounded-full hover:bg-[#881337] transition-all shadow-xl shadow-rose-100">See Map</a>
               </FadeIn>
               <FadeIn className="p-16 bg-white rounded-[3rem] shadow-2xl text-center group border border-rose-50" delay={0.2}>
                  <p className="tracking-[0.8em] uppercase text-[9px] mb-12 text-[#e11d48] font-bold italic opacity-60">The Party</p>
                  <p className="text-5xl font-bold italic text-[#881337] mb-8 leading-none">{data.event_data.resepsi_time}</p>
                  <p className="text-[#881337]/60 italic mb-12 text-xl max-w-xs mx-auto leading-relaxed">{data.event_data.resepsi_location}</p>
                  <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-12 py-5 bg-[#e11d48] text-white font-bold uppercase tracking-[0.4em] text-[9px] rounded-full hover:bg-[#881337] transition-all shadow-xl shadow-rose-100">See Map</a>
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
            <section className="py-32 px-6 text-center">
              <FadeIn><h3 className="text-2xl italic font-bold text-[#881337] mb-16 tracking-widest uppercase opacity-40">Film Documentation</h3></FadeIn>
              <div className="max-w-5xl mx-auto aspect-video border-[12px] border-white shadow-2xl rounded-[3rem] overflow-hidden bg-black">
                <iframe className="w-full h-full opacity-90 hover:opacity-100 transition duration-700" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {data.gifts && data.gifts.length > 0 && (
            <section className="py-32 px-6 text-center">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-24">
                     <Gift className="w-16 h-16 text-[#e11d48] mx-auto mb-10 opacity-30 shadow-rose-200" />
                     <h2 className="text-5xl font-bold italic text-[#881337] tracking-widest uppercase">Rose Gift</h2>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-12">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-white p-16 shadow-2xl rounded-[3rem] relative group overflow-hidden border border-rose-50">
                              <div className="absolute top-0 left-0 w-full h-2 bg-[#fb7185] opacity-10 group-hover:h-full transition-all duration-700"></div>
                              <p className="uppercase text-[9px] tracking-[0.5em] font-bold text-[#e11d48] mb-10 italic">{gift.bank}</p>
                              <p className="text-3xl font-bold text-[#881337] mb-4 tracking-widest italic leading-none">{gift.acc}</p>
                              <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6 bg-white/40 border-t border-rose-100">
            <div className="max-w-2xl mx-auto text-center">
               <FadeIn className="mb-16">
                  <h2 className="text-5xl font-bold italic text-[#881337] tracking-widest mb-8 leading-tight uppercase opacity-40">Rose Wishes</h2>
                  <p className="text-[#e11d48] uppercase text-[9px] tracking-[0.6em] italic font-bold">RSVP & MESSAGE</p>
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
                        if (success) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); alert("Thank you for your warm wishes!"); }
                    } finally { setIsSubmitting(false); }
                  }}>
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Full Name" className="w-full px-10 py-6 bg-white border border-rose-100 rounded-2xl text-[#881337] focus:outline-none focus:border-[#fb7185] text-[10px] uppercase tracking-[0.4em] italic" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-10 py-6 bg-white border border-rose-100 rounded-2xl text-[#881337] focus:outline-none text-[10px] uppercase tracking-[0.4em] italic" required>
                        <option value="">Status Kehadiran</option>
                        <option value="hadir">Attending</option>
                        <option value="tidak">Decline</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Your Heartfelt Message" className="w-full px-10 py-6 bg-white border border-rose-100 rounded-2xl text-[#881337] focus:outline-none focus:border-[#fb7185] text-[10px] uppercase tracking-[0.4em] italic" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-7 bg-[#881337] text-white rounded-2xl font-bold uppercase tracking-[0.8em] text-[10px] hover:bg-[#9f1239] transition-all shadow-xl shadow-rose-200 disabled:opacity-50">
                        {isSubmitting ? "Sending..." : "Submit Message"}
                    </button>
                  </form>
               </FadeIn>
               <div className="space-y-12 max-h-[600px] overflow-y-auto pr-8 text-left custom-scrollbar">
                  {wishes.map((wish, idx) => (
                    <div key={idx} className="bg-white p-12 rounded-[2rem] shadow-xl border border-rose-50 group border-l-8 border-l-[#fb7185]">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-3xl font-bold italic text-[#881337] tracking-tighter leading-none">{wish.name}</span>
                            <span className="text-[10px] bg-rose-50 px-4 py-2 text-[#e11d48] rounded-full uppercase font-bold tracking-widest">{wish.presence === 'hadir' ? 'Hadir' : 'Absen'}</span>
                        </div>
                        <p className="text-[#881337]/60 italic font-light leading-relaxed text-xl">&quot;{wish.message}&quot;</p>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          <footer className="py-40 text-center text-[#881337]/20 uppercase text-[10px] tracking-[3em]"> Romantic Dusty Rose </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-12 right-12 z-40 w-16 h-16 bg-white border border-rose-100 rounded-full shadow-2xl flex items-center justify-center text-[#e11d48] transition-all hover:scale-110 active:scale-95 group">
          <Disc className={`w-9 h-9 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

