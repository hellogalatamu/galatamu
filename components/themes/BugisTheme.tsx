"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./AmaraTheme";
import GalleryLightbox from "../GalleryLightbox";

export default function BugisTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
      const musicSrc = data.music_url || "https://cdn.pixabay.com/download/audio/2021/11/17/audio_0974b9f5e3.mp3?filename=makassar-traditional-1123.mp3";
      audioRef.current = new Audio(musicSrc);
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={`bg-[#0b3d2e] min-h-screen text-[#f2cc8f] font-serif selection:bg-[#f2cc8f] selection:text-black ${previewMode ? 'relative' : ''}`}>
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/weave.png')]"></div>
      
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ y: "-100%" }} transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b3d2e] text-[#f2cc8f] p-6 text-center">
              <div className="mb-12 text-[#f2cc8f] animate-pulse"><Sparkles className="w-20 h-20" /></div>
              <FadeIn><h1 className="text-6xl font-bold uppercase tracking-[0.2em] mb-6">{data.bride_data.groom} & {data.bride_data.bride}</h1></FadeIn>
              <FadeIn delay={0.2}><p className="mb-16 opacity-60 uppercase tracking-[0.4em] text-[10px]">Mappacci Tuwu kagem {guestName}</p></FadeIn>
              <button onClick={openInvitation} className="px-16 py-6 border-2 border-[#f2cc8f] text-[#f2cc8f] font-bold uppercase text-[10px] tracking-[0.6em] hover:bg-[#f2cc8f] hover:text-[#0b3d2e] transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]">Bukak Alek</button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 pb-32">
          
          <section className="h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-[#0b3d2e] to-[#072a1f] border-b border-[#f2cc8f]/10">
             <FadeIn>
                <p className="tracking-[1em] uppercase text-[9px] mb-12 text-[#f2cc8f]/40 font-bold">The Royal Bugis Wedding</p>
                <h2 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter mb-12 text-white leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>
                <div className="w-32 h-px bg-[#f2cc8f]/20 mx-auto mb-12"></div>
                <p className="text-3xl font-bold mb-16 text-[#f2cc8f] tracking-widest uppercase">{eventDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="max-w-md mx-auto p-12 border border-[#f2cc8f]/20 bg-white/5 backdrop-blur-md">
                   <Countdown targetDate={eventDate} />
                </div>
             </FadeIn>
          </section>

          <section className="py-32 px-6 text-center italic max-w-2xl mx-auto text-[#f2cc8f]/60 leading-relaxed font-light">
            <FadeIn>
              <p className="text-2xl italic">
                {data.quote || "“Sikali Mappaccing, Dua Kali Mappacci, Telu Kali Mappacci. Kesucian hati membawa berkah selamanya dalam ikatan yang sakral.”"}
              </p>
            </FadeIn>
          </section>

          <section className="py-24 px-6 grid md:grid-cols-2 gap-32 max-w-7xl mx-auto">
             <FadeIn className="text-center">
                <div className="relative group mb-12">
                   <div className="absolute -inset-4 border-2 border-[#f2cc8f]/30 group-hover:inset-0 transition-all duration-700"></div>
                   <div className="aspect-[3/4] border-8 border-[#f2cc8f]/10 p-4 shadow-2xl relative grayscale group-hover:grayscale-0 transition duration-1000 bg-[#072a1f]"><img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" /></div>
                </div>
                <h3 className="text-5xl font-bold uppercase text-white mb-4 tracking-tighter">{data.bride_data.groom}</h3>
                <p className="text-[#f2cc8f]/60 uppercase text-[10px] tracking-[0.4em] font-bold mb-4 italic">Ana’na saking</p>
                <p className="text-2xl font-bold italic text-[#f2cc8f]">{data.bride_data.parents_groom}</p>
             </FadeIn>
             <FadeIn className="text-center" delay={0.2}>
                <div className="relative group mb-12">
                   <div className="absolute -inset-4 border-2 border-[#f2cc8f]/30 group-hover:inset-0 transition-all duration-700"></div>
                   <div className="aspect-[3/4] border-8 border-[#f2cc8f]/10 p-4 shadow-2xl relative grayscale group-hover:grayscale-0 transition duration-1000 bg-[#072a1f]"><img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" /></div>
                </div>
                <h3 className="text-5xl font-bold uppercase text-white mb-4 tracking-tighter">{data.bride_data.bride}</h3>
                <p className="text-[#f2cc8f]/60 uppercase text-[10px] tracking-[0.4em] font-bold mb-4 italic">Ana’na saking</p>
                <p className="text-2xl font-bold italic text-[#f2cc8f]">{data.bride_data.parents_bride}</p>
             </FadeIn>
          </section>

          {data.love_story && data.love_story.length > 0 && (
            <section className="py-24 px-6 bg-white/5 border-y border-[#f2cc8f]/5">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-24"><h2 className="text-5xl font-bold uppercase tracking-widest text-white">Mappacci Journey</h2></FadeIn>
                  <div className="space-y-16">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="relative pl-16 border-l border-[#f2cc8f]/20 py-8 group">
                              <div className="absolute -left-1.5 top-10 w-3 h-3 bg-[#f2cc8f] rounded-full group-hover:scale-[3] transition duration-500"></div>
                              <p className="text-4xl font-bold text-[#f2cc8f] mb-4 opacity-40 group-hover:opacity-100 transition duration-700 italic">{story.year}</p>
                              <h4 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest">{story.title}</h4>
                              <p className="text-[#f2cc8f]/40 italic font-light leading-relaxed text-lg">{story.desc}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
               <FadeIn className="p-16 border border-[#f2cc8f]/10 bg-[#072a1f]/80 backdrop-blur-sm text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#f2cc8f] opacity-20"></div>
                  <p className="tracking-[0.8em] uppercase text-[9px] mb-12 text-[#f2cc8f]/40 font-bold italic">Akad Alek</p>
                  <p className="text-5xl font-bold italic text-white mb-8">{data.event_data.akad_time}</p>
                  <p className="text-[#f2cc8f]/60 italic mb-12 text-xl max-w-xs mx-auto leading-relaxed">{data.event_data.akad_location}</p>
                  <a href={data.event_data.akad_map} target="_blank" className="inline-block px-12 py-5 bg-[#f2cc8f] text-[#0b3d2e] font-bold uppercase tracking-[0.4em] text-[9px] hover:bg-white transition-all shadow-xl">Peta Alek</a>
               </FadeIn>
               <FadeIn className="p-16 border border-[#f2cc8f]/10 bg-[#072a1f]/80 backdrop-blur-sm text-center relative overflow-hidden group" delay={0.2}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#f2cc8f] opacity-20"></div>
                  <p className="tracking-[0.8em] uppercase text-[9px] mb-12 text-[#f2cc8f]/40 font-bold italic">Resepsi Alek</p>
                  <p className="text-5xl font-bold italic text-white mb-8">{data.event_data.resepsi_time}</p>
                  <p className="text-[#f2cc8f]/60 italic mb-12 text-xl max-w-xs mx-auto leading-relaxed">{data.event_data.resepsi_location}</p>
                  <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-12 py-5 bg-[#f2cc8f] text-[#0b3d2e] font-bold uppercase tracking-[0.4em] text-[9px] hover:bg-white transition-all shadow-xl">Peta Alek</a>
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
            <section className="py-24 px-6 text-center">
              <FadeIn><h3 className="text-4xl italic font-bold text-white mb-16 tracking-widest uppercase opacity-40">Dokumentasi Video</h3></FadeIn>
              <div className="max-w-5xl mx-auto aspect-video border-8 border-[#f2cc8f]/5 shadow-2xl bg-black">
                <iframe className="w-full h-full opacity-80 hover:opacity-100 transition duration-700" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {data.gifts && data.gifts.length > 0 && (
            <section className="py-32 px-6 text-center">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-24">
                     <Gift className="w-16 h-16 text-[#f2cc8f] mx-auto mb-10 opacity-20" />
                     <h2 className="text-5xl font-bold uppercase tracking-widest text-white">Tando Kasiah</h2>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-16">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-white/5 border border-[#f2cc8f]/10 p-20 shadow-2xl relative group overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-2 bg-[#f2cc8f] opacity-20 group-hover:h-full transition-all duration-700"></div>
                              <p className="uppercase text-[9px] tracking-[0.5em] font-bold text-[#f2cc8f]/40 mb-10 italic">{gift.bank}</p>
                              <p className="text-4xl font-bold text-white mb-4 tracking-[0.2em] italic">{gift.acc}</p>
                              <p className="text-xs uppercase tracking-widest opacity-40 font-bold">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6 bg-[#072a1f] border-t border-[#f2cc8f]/5">
            <div className="max-w-2xl mx-auto text-center">
               <FadeIn className="mb-16">
                  <h2 className="text-5xl font-bold uppercase tracking-widest text-white mb-8 leading-tight">Konfirmasi & Pasan</h2>
                  <p className="text-[#f2cc8f]/40 uppercase text-[9px] tracking-[0.6em] italic font-bold">Mappacci Wishes</p>
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
                        if (success) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); alert("Matur Sembah Nuwun!"); }
                    } finally { setIsSubmitting(false); }
                  }}>
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Namo Sanak" className="w-full px-10 py-6 bg-white/5 border border-[#f2cc8f]/10 text-white focus:outline-none focus:border-[#f2cc8f]/40 text-[10px] uppercase tracking-[0.4em] italic" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-10 py-6 bg-[#0b3d2e] border border-[#f2cc8f]/10 text-white focus:outline-none text-[10px] uppercase tracking-[0.4em] italic" required>
                        <option value="">Konfirmasi Tibo</option>
                        <option value="hadir">Insya Allah Tibo</option>
                        <option value="tidak">Alangan Tibo</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Atur Pasan & Doa" className="w-full px-10 py-6 bg-white/5 border border-[#f2cc8f]/10 text-white focus:outline-none focus:border-[#f2cc8f]/40 text-[10px] uppercase tracking-[0.4em] italic" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-7 bg-[#f2cc8f] text-[#0b3d2e] font-bold uppercase tracking-[0.8em] text-[10px] hover:bg-white transition-all disabled:opacity-50">
                        {isSubmitting ? "Ngirim..." : "Kirim Pasan"}
                    </button>
                  </form>
               </FadeIn>
               <div className="space-y-16 max-h-[600px] overflow-y-auto pr-8 text-left custom-scrollbar">
                  {wishes.map((wish, idx) => (
                    <div key={idx} className="border-b border-[#f2cc8f]/5 pb-16 relative group">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-4xl font-bold italic text-white tracking-tighter">{wish.name}</span>
                            <span className="text-[10px] bg-[#f2cc8f]/10 px-4 py-2 text-[#f2cc8f] uppercase font-bold tracking-widest">{wish.presence === 'hadir' ? 'Tibo' : 'Alangan'}</span>
                        </div>
                        <p className="text-[#f2cc8f]/40 italic font-light leading-relaxed text-2xl">&quot;{wish.message}&quot;</p>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          <footer className="py-40 text-center text-[#f2cc8f]/20 uppercase text-[10px] tracking-[2.5em]">— Bugis Makassar Pride —</footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-12 right-12 z-40 w-16 h-16 bg-[#0b3d2e] border border-[#f2cc8f]/30 rounded-full shadow-2xl flex items-center justify-center text-[#f2cc8f] transition-all hover:scale-110 active:scale-95 group">
          <Disc className={`w-8 h-8 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

