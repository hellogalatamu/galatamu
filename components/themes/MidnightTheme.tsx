"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";

export default function MidnightTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
    <div className={`bg-[#1e1b4b] min-h-screen text-[#e0e7ff] font-sans selection:bg-[#c7d2fe] selection:text-[#1e1b4b] ${previewMode ? 'relative' : ''}`}>
      {(data.bg_image || data.bg_middle || data.bg_bottom) && (
        <div className="absolute inset-0 pointer-events-none z-0 flex flex-col opacity-15">
          <div className="flex-1 relative overflow-hidden"><div className="sticky top-0 w-full h-screen bg-cover bg-center" style={data.bg_image ? { backgroundImage: `url('${data.bg_image}')` } : {}}></div></div>
          <div className="flex-1 relative overflow-hidden"><div className="sticky top-0 w-full h-screen bg-cover bg-center" style={data.bg_middle ? { backgroundImage: `url('${data.bg_middle}')` } : {}}></div></div>
          <div className="flex-1 relative overflow-hidden"><div className="sticky top-0 w-full h-screen bg-cover bg-center" style={data.bg_bottom ? { backgroundImage: `url('${data.bg_bottom}')` } : {}}></div></div>
        </div>
      )}
      <div className="fixed inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ scale: 2, opacity: 0 }} transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1e1b4b] text-white p-6 text-center">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4338ca] via-[#1e1b4b] to-transparent pointer-events-none"></motion.div>
              <FadeIn><h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h1></FadeIn>
              <FadeIn delay={0.2}><p className="mb-16 opacity-40 uppercase tracking-[1em] text-[9px] font-bold italic">The Midnight Invitation for {guestName}</p></FadeIn>
              <button onClick={openInvitation} className="px-20 py-6 bg-[#4338ca] text-white rounded-full font-bold uppercase text-[10px] tracking-[0.8em] hover:bg-[#c7d2fe] hover:text-[#1e1b4b] transition-all shadow-[0_0_80px_rgba(67,56,202,0.6)]">Enter Magic</button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 pb-32">
          
          <section className="h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-[#312e81] to-[#1e1b4b] border-b border-white/5 overflow-hidden">
             <FadeIn className="relative">
                <Sparkles className="w-16 h-16 text-[#c7d2fe] mx-auto mb-16 opacity-40 animate-pulse" />
                <p className="tracking-[1.2em] uppercase text-[9px] mb-12 text-[#c7d2fe] font-black">The Midnight Union</p>
                <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-16 text-white leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>
                <div className="w-40 h-1 bg-[#4338ca] mx-auto mb-16 rounded-full shadow-[0_0_20px_#4338ca]"></div>
                <p className="text-3xl font-bold mb-20 text-white tracking-[0.3em] uppercase">{eventDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="max-w-md mx-auto p-12 border border-[#c7d2fe]/20 bg-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl">
                   <Countdown targetDate={eventDate} />
                </div>
             </FadeIn>
          </section>

          <section className="py-32 px-6 text-center italic max-w-3xl mx-auto text-[#c7d2fe]/50 leading-relaxed font-light">
            <FadeIn>
              <p className="text-2xl font-bold tracking-widest leading-loose uppercase">
                {data.quote || "I want to be your favorite hello and your hardest goodbye. Under the stars, in the middle of the night, our hearts beat as one forever."}
              </p>
            </FadeIn>
          </section>

          <section className="py-24 px-6 grid md:grid-cols-2 gap-32 max-w-7xl mx-auto">
             <FadeIn className="text-center">
                <div className="relative group mb-16">
                   <div className="absolute inset-0 bg-[#4338ca]/20 rounded-[4rem] group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000"></div>
                   <div className="aspect-[3/4] overflow-hidden rounded-[3.5rem] shadow-2xl relative border-8 border-white/5 group-hover:-rotate-3 transition-all duration-700"><img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" /></div>
                </div>
                <h3 className="text-5xl font-black uppercase text-white mb-4 tracking-tighter">{data.bride_data.groom}</h3>
                <p className="text-[#c7d2fe] uppercase text-[10px] tracking-[0.6em] font-black mb-4 italic opacity-40">Son of</p>
                <p className="text-2xl font-bold italic text-[#c7d2fe]">{data.bride_data.parents_groom}</p>
             </FadeIn>
             <FadeIn className="text-center" delay={0.2}>
                <div className="relative group mb-16">
                   <div className="absolute inset-0 bg-[#4338ca]/20 rounded-[4rem] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-1000"></div>
                   <div className="aspect-[3/4] overflow-hidden rounded-[3.5rem] shadow-2xl relative border-8 border-white/5 group-hover:rotate-3 transition-all duration-700"><img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" /></div>
                </div>
                <h3 className="text-5xl font-black uppercase text-white mb-4 tracking-tighter">{data.bride_data.bride}</h3>
                <p className="text-[#c7d2fe] uppercase text-[10px] tracking-[0.6em] font-black mb-4 italic opacity-40">Daughter of</p>
                <p className="text-2xl font-bold italic text-[#c7d2fe]">{data.bride_data.parents_bride}</p>
             </FadeIn>
          </section>

          {data.love_story && data.love_story.length > 0 && (
            <section className="py-32 px-6 bg-white/5 border-y border-white/5">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-24"><h2 className="text-5xl font-black uppercase tracking-[0.6em] text-white">Midnight Story</h2></FadeIn>
                  <div className="space-y-20">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="relative pl-24 border-l-4 border-[#4338ca] py-12 group overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4338ca]/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition duration-1000"></div>
                              <p className="text-7xl font-black text-[#4338ca]/20 group-hover:text-[#4338ca] transition-colors duration-700 mb-6 tracking-tighter leading-none italic">{story.year}</p>
                              <h4 className="text-3xl font-black text-white mb-4 uppercase tracking-[0.4em] italic leading-none">{story.title}</h4>
                              <p className="text-[#c7d2fe]/40 italic font-light leading-relaxed text-xl tracking-wide">{story.desc}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
               <FadeIn className="p-20 border border-white/10 bg-[#312e81]/40 backdrop-blur-md text-center group rounded-[4rem] relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#4338ca]"></div>
                  <p className="tracking-[1em] uppercase text-[9px] mb-12 text-[#c7d2fe] font-black italic opacity-40">The Magic Vows</p>
                  <p className="text-5xl font-black uppercase mb-8 leading-none italic">{data.event_data.akad_time}</p>
                  <p className="text-[#c7d2fe]/60 italic mb-16 text-xl max-w-xs mx-auto leading-relaxed">{data.event_data.akad_location}</p>
                  <a href={data.event_data.akad_map} target="_blank" className="inline-block px-16 py-6 bg-[#4338ca] text-white font-bold uppercase tracking-[0.5em] text-[9px] rounded-full hover:bg-[#c7d2fe] hover:text-[#1e1b4b] transition-all shadow-xl shadow-indigo-500/20">Navigate</a>
               </FadeIn>
               <FadeIn className="p-20 border border-white/10 bg-[#312e81]/40 backdrop-blur-md text-center group rounded-[4rem] relative overflow-hidden shadow-2xl" delay={0.2}>
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#4338ca]"></div>
                  <p className="tracking-[1em] uppercase text-[9px] mb-12 text-[#c7d2fe] font-black italic opacity-40">The Midnight Ball</p>
                  <p className="text-5xl font-black uppercase mb-8 leading-none italic">{data.event_data.resepsi_time}</p>
                  <p className="text-[#c7d2fe]/60 italic mb-16 text-xl max-w-xs mx-auto leading-relaxed">{data.event_data.resepsi_location}</p>
                  <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-16 py-6 bg-[#4338ca] text-white font-bold uppercase tracking-[0.5em] text-[9px] rounded-full hover:bg-[#c7d2fe] hover:text-[#1e1b4b] transition-all shadow-xl shadow-indigo-500/20">Navigate</a>
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
              <FadeIn><h3 className="text-3xl font-black uppercase mb-20 text-[#c7d2fe] tracking-[1.5em] opacity-20">The Magic Film</h3></FadeIn>
              <div className="max-w-5xl mx-auto aspect-video border-[20px] border-white/5 shadow-2xl bg-black overflow-hidden rounded-[5rem]">
                <iframe className="w-full h-full opacity-80 hover:opacity-100 transition duration-1000" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {data.gifts && data.gifts.length > 0 && (
            <section className="py-32 px-6 text-center">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-24">
                     <Gift className="w-20 h-20 text-[#4338ca] mx-auto mb-12 opacity-30 shadow-[0_0_50px_rgba(67,56,202,0.5)]" />
                     <h2 className="text-5xl font-black uppercase tracking-[0.6em] text-white">Midnight Gift</h2>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-16">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-[#312e81]/20 border border-white/10 p-24 rounded-[4rem] group relative overflow-hidden shadow-2xl">
                              <div className="absolute top-0 left-0 w-full h-full bg-[#4338ca] opacity-5 group-hover:opacity-20 transition-all duration-700"></div>
                              <p className="uppercase text-[9px] tracking-[1em] font-black text-[#c7d2fe]/40 mb-12 italic">{gift.bank}</p>
                              <p className="text-4xl font-black text-white mb-6 tracking-widest leading-none italic">{gift.acc}</p>
                              <p className="text-[11px] uppercase tracking-[0.6em] text-[#c7d2fe] font-black opacity-40">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6 bg-black/30 border-t border-white/5">
            <div className="max-w-2xl mx-auto text-center">
               <FadeIn className="mb-24">
                  <h2 className="text-6xl font-black uppercase tracking-[0.4em] text-white mb-12 leading-tight italic">Midnight Wishes</h2>
                  <p className="text-[#c7d2fe] uppercase text-[9px] tracking-[1.5em] italic font-black opacity-20">RSVP & MESSAGE</p>
               </FadeIn>
               <FadeIn delay={0.2}>
                  <form className="space-y-10 mb-40 text-left" onSubmit={async (e) => {
                    e.preventDefault();
                    if (previewMode) return alert("Preview mode active.");
                    if (!data.slug) return;
                    setIsSubmitting(true);
                    const newWish: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                    try {
                        const success = await submitWish(data.slug, newWish);
                        if (success) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); alert("Magical wishes received."); }
                    } finally { setIsSubmitting(false); }
                  }}>
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Secret Name" className="w-full px-10 py-8 bg-white/5 border border-white/10 rounded-full text-white focus:outline-none focus:border-[#4338ca] text-[11px] uppercase tracking-[0.8em] font-black italic shadow-2xl" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-10 py-8 bg-[#1e1b4b] border border-white/10 rounded-full text-white focus:outline-none text-[11px] uppercase tracking-[0.8em] font-black italic shadow-2xl" required>
                        <option value="">Joining the ball?</option>
                        <option value="hadir">Attending</option>
                        <option value="tidak">Decline</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Your Secret Wish" className="w-full px-10 py-8 bg-white/5 border border-white/10 rounded-[3rem] text-white focus:outline-none focus:border-[#4338ca] text-[11px] uppercase tracking-[0.8em] font-black italic shadow-2xl" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-10 bg-[#4338ca] text-white font-black uppercase tracking-[1.5em] text-[11px] rounded-full hover:bg-[#c7d2fe] hover:text-[#1e1b4b] transition-all disabled:opacity-50 shadow-[0_0_80px_rgba(67,56,202,0.5)]">
                        {isSubmitting ? "Casting Spell..." : "Cast Wishes"}
                    </button>
                  </form>
               </FadeIn>
               <div className="space-y-32 max-h-[800px] overflow-y-auto pr-12 text-left custom-scrollbar">
                  {wishes.map((wish, idx) => (
                    <div key={idx} className="pb-24 border-b border-white/5 group relative">
                        <div className="absolute -left-12 top-0 w-2 h-full bg-[#4338ca] opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-5xl font-black uppercase tracking-tighter text-white leading-none italic">{wish.name}</span>
                            <span className="text-[10px] bg-[#4338ca]/20 border border-[#4338ca]/40 px-6 py-2 text-[#c7d2fe] uppercase font-black tracking-[0.6em] italic rounded-full shadow-2xl">{wish.presence === 'hadir' ? 'Attending' : 'Absen'}</span>
                        </div>
                        <p className="text-[#c7d2fe]/30 italic font-black leading-relaxed text-3xl tracking-wide group-hover:text-white transition duration-700">&quot;{wish.message}&quot;</p>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          <footer className="py-40 text-center text-white/5 uppercase text-[10px] tracking-[5em]"> Midnight Glamour </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-12 right-12 z-40 w-20 h-20 bg-[#4338ca] border border-white/10 rounded-full shadow-[0_0_50px_rgba(67,56,202,0.6)] flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 group">
          <Disc className={`w-10 h-10 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

