"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";

export default function NavyTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
    <div className={`bg-[#0f172a] min-h-screen text-white font-sans selection:bg-[#334155] selection:text-white ${previewMode ? 'relative' : ''}`}>
      {data.bg_image && (
        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: `url('${data.bg_image}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }}></div>
      )}
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] text-white p-6 text-center">
              <div className="mb-12"><Sparkles className="w-16 h-16 text-[#94a3b8] animate-pulse" /></div>
              <FadeIn><h1 className="text-6xl font-black uppercase tracking-tighter mb-6 leading-none">{data.bride_data.groom} & {data.bride_data.bride}</h1></FadeIn>
              <FadeIn delay={0.2}><p className="mb-16 opacity-40 uppercase tracking-[0.5em] text-[10px]">A Signature Union for {guestName}</p></FadeIn>
              <button onClick={openInvitation} className="px-16 py-5 bg-white text-[#0f172a] rounded-none font-bold uppercase text-[10px] tracking-[0.6em] hover:bg-[#94a3b8] hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">Open Invitation</button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 pb-32">
          
          <section className="h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-b border-white/5">
             <FadeIn>
                <p className="tracking-[1em] uppercase text-[9px] mb-12 text-[#94a3b8] font-bold">The Signature Wedding</p>
                <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12 text-white leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>
                <div className="w-40 h-1 bg-white/20 mx-auto mb-12"></div>
                <p className="text-3xl font-bold mb-20 text-[#94a3b8] tracking-[0.3em] uppercase">{eventDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="max-w-md mx-auto p-12 border border-white/10 bg-white/5 backdrop-blur-md rounded-none">
                   <Countdown targetDate={eventDate} />
                </div>
             </FadeIn>
          </section>

          <section className="py-32 px-6 text-center italic max-w-2xl mx-auto text-white/40 leading-relaxed font-light">
            <FadeIn>
              <p className="text-xl tracking-widest leading-loose">
                {data.quote || "I have found the one whom my soul loves. Our love is like the ocean, vast and deep, steady and eternal."}
              </p>
            </FadeIn>
          </section>

          <section className="py-24 px-6 grid md:grid-cols-2 gap-px bg-white/5 max-w-7xl mx-auto border border-white/10">
             <FadeIn className="p-20 text-center bg-[#0f172a]">
                <div className="relative group mb-12">
                   <div className="absolute inset-0 bg-[#94a3b8]/20 group-hover:scale-110 transition-all duration-1000"></div>
                   <div className="aspect-[3/4] overflow-hidden shadow-2xl relative grayscale group-hover:grayscale-0 transition duration-1000"><img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" /></div>
                </div>
                <h3 className="text-4xl font-black uppercase text-white mb-4 tracking-tighter">{data.bride_data.groom}</h3>
                <p className="text-[#94a3b8] uppercase text-[9px] tracking-[0.4em] font-bold mb-4 italic">Son of</p>
                <p className="text-xl font-light text-white/60">{data.bride_data.parents_groom}</p>
             </FadeIn>
             <FadeIn className="p-20 text-center bg-[#0f172a]" delay={0.2}>
                <div className="relative group mb-12">
                   <div className="absolute inset-0 bg-[#94a3b8]/20 group-hover:scale-110 transition-all duration-1000"></div>
                   <div className="aspect-[3/4] overflow-hidden shadow-2xl relative grayscale group-hover:grayscale-0 transition duration-1000"><img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" /></div>
                </div>
                <h3 className="text-4xl font-black uppercase text-white mb-4 tracking-tighter">{data.bride_data.bride}</h3>
                <p className="text-[#94a3b8] uppercase text-[9px] tracking-[0.4em] font-bold mb-4 italic">Daughter of</p>
                <p className="text-xl font-light text-white/60">{data.bride_data.parents_bride}</p>
             </FadeIn>
          </section>

          {data.love_story && data.love_story.length > 0 && (
            <section className="py-32 px-6">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-24"><h2 className="text-4xl font-black uppercase tracking-[0.4em] text-white">Our Timeline</h2></FadeIn>
                  <div className="space-y-16">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="relative pl-16 border-l-2 border-white/10 py-8 group">
                              <div className="absolute -left-[5px] top-10 w-2 h-10 bg-[#94a3b8] opacity-20 group-hover:opacity-100 transition duration-500"></div>
                              <p className="text-5xl font-black text-white/10 group-hover:text-[#94a3b8] transition-colors duration-700 mb-4 tracking-tighter">{story.year}</p>
                              <h4 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest">{story.title}</h4>
                              <p className="text-white/40 italic font-light leading-relaxed text-lg tracking-wide">{story.desc}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6 bg-white/5 border-y border-white/5">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-px bg-white/10">
               <FadeIn className="p-20 bg-[#0f172a] text-center border border-white/5">
                  <p className="tracking-[0.8em] uppercase text-[8px] mb-12 text-[#94a3b8] font-bold italic">The Vows</p>
                  <p className="text-5xl font-black uppercase mb-8 leading-none">{data.event_data.akad_time}</p>
                  <p className="text-white/40 italic mb-16 text-lg max-w-xs mx-auto leading-relaxed">{data.event_data.akad_location}</p>
                  <a href={data.event_data.akad_map} target="_blank" className="inline-block px-12 py-5 bg-white text-[#0f172a] font-bold uppercase tracking-[0.4em] text-[8px] hover:bg-[#94a3b8] hover:text-white transition-all shadow-2xl">Locate On Map</a>
               </FadeIn>
               <FadeIn className="p-20 bg-[#0f172a] text-center border border-white/5" delay={0.2}>
                  <p className="tracking-[0.8em] uppercase text-[8px] mb-12 text-[#94a3b8] font-bold italic">The Party</p>
                  <p className="text-5xl font-black uppercase mb-8 leading-none">{data.event_data.resepsi_time}</p>
                  <p className="text-white/40 italic mb-16 text-lg max-w-xs mx-auto leading-relaxed">{data.event_data.resepsi_location}</p>
                  <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-12 py-5 bg-white text-[#0f172a] font-bold uppercase tracking-[0.4em] text-[8px] hover:bg-[#94a3b8] hover:text-white transition-all shadow-2xl">Locate On Map</a>
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
            <section className="py-32 px-6 text-center bg-white/5">
              <FadeIn><h3 className="text-2xl font-black uppercase mb-20 text-[#94a3b8] tracking-[0.8em] italic">The Film</h3></FadeIn>
              <div className="max-w-5xl mx-auto aspect-video border-[1px] border-white/10 p-6 bg-black shadow-2xl">
                <iframe className="w-full h-full opacity-60 hover:opacity-100 transition duration-700" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {data.gifts && data.gifts.length > 0 && (
            <section className="py-32 px-6 text-center">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-24">
                     <Gift className="w-16 h-16 text-[#94a3b8] mx-auto mb-10 opacity-20" />
                     <h2 className="text-5xl font-black uppercase tracking-widest text-white">Registry</h2>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-[#0f172a] p-20 group relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-[#94a3b8] opacity-10 group-hover:h-full transition-all duration-700"></div>
                              <p className="uppercase text-[8px] tracking-[0.8em] font-bold text-[#94a3b8] mb-12 italic">{gift.bank}</p>
                              <p className="text-3xl font-black text-white mb-6 tracking-widest italic">{gift.acc}</p>
                              <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-bold">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6 bg-[#0f172a] border-t border-white/5">
            <div className="max-w-2xl mx-auto text-center">
               <FadeIn className="mb-24">
                  <h2 className="text-5xl font-black uppercase tracking-[0.4em] text-white mb-8">Wishes</h2>
                  <p className="text-white/20 uppercase text-[8px] tracking-[0.8em] italic font-bold">RSVP & MESSAGE</p>
               </FadeIn>
               <FadeIn delay={0.2}>
                  <form className="space-y-8 mb-32 text-left" onSubmit={async (e) => {
                    e.preventDefault();
                    if (previewMode) return alert("Preview mode active.");
                    if (!data.slug) return;
                    setIsSubmitting(true);
                    const newWish: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                    try {
                        const success = await submitWish(data.slug, newWish);
                        if (success) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); alert("Thank you."); }
                    } finally { setIsSubmitting(false); }
                  }}>
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Full Name" className="w-full px-8 py-6 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40 text-[10px] uppercase tracking-[0.6em] font-bold" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-8 py-6 bg-[#0f172a] border border-white/10 text-white focus:outline-none text-[10px] uppercase tracking-[0.6em] font-bold" required>
                        <option value="">Status</option>
                        <option value="hadir">Attending</option>
                        <option value="tidak">Decline</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Your Message" className="w-full px-8 py-6 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40 text-[10px] uppercase tracking-[0.6em] font-bold" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-8 bg-white text-[#0f172a] font-black uppercase tracking-[1em] text-[10px] hover:bg-[#94a3b8] hover:text-white transition-all disabled:opacity-50 shadow-2xl">
                        {isSubmitting ? "Sending..." : "Submit Message"}
                    </button>
                  </form>
               </FadeIn>
               <div className="space-y-16 max-h-[600px] overflow-y-auto pr-8 text-left custom-scrollbar">
                  {wishes.map((wish, idx) => (
                    <div key={idx} className="border-l-4 border-white/10 pl-12 py-4 group">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-3xl font-black uppercase tracking-tighter text-white">{wish.name}</span>
                            <span className="text-[8px] bg-white/10 px-4 py-2 text-white uppercase font-bold tracking-[0.4em]">{wish.presence === 'hadir' ? 'Attending' : 'Absen'}</span>
                        </div>
                        <p className="text-white/40 italic font-light leading-relaxed text-xl tracking-wide">&quot;{wish.message}&quot;</p>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          <footer className="py-40 text-center text-white/5 uppercase text-[9px] tracking-[4em]"> Navy Blue Signature </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-12 right-12 z-40 w-16 h-16 bg-[#0f172a] border border-white/10 rounded-none shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 group">
          <Disc className={`w-9 h-9 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

