"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";

interface MinangThemeProps {
  data: InvitationData;
  previewMode?: boolean;
  guestName?: string;
}

export default function MinangTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: MinangThemeProps) {
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
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [previewMode, data.music_url]);

  const openInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(err => console.log(err));
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } 
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={`bg-[#4a0404] min-h-screen text-[#f2cc8f] font-serif selection:bg-[#f2cc8f] selection:text-[#4a0404] ${previewMode ? 'relative' : ''}`}>
      {data.bg_image && (
        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: `url('${data.bg_image}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }}></div>
      )}
      {/* Songket Pattern Overlay */}
      <div className="fixed inset-0 opacity-10 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/weave.png')]"></div>

      {/* Cover Overlay */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#4a0404] overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 grayscale sepia-[.4]"
                style={{ backgroundImage: `url('${data.hero_image || 'https://images.unsplash.com/photo-1616091216791-a5360b5fc58e?auto=format&fit=crop&q=80'}')` }}
              ></div>
              
              {/* Ornate Gold Border */}
              <div className="absolute inset-10 border-2 border-[#f2cc8f]/30 pointer-events-none"></div>

              <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                 <FadeIn delay={0.2} className="mb-8">
                    <img src="https://www.pngkit.com/png/full/222-2225244_house-vector-minangkabau-rumah-gadang-vector-png.png" className="w-32 h-auto mx-auto invert sepia-[.5] brightness-[1.5]" alt="Rumah Gadang" />
                 </FadeIn>
                 <FadeIn delay={0.4}>
                   <p className="tracking-[0.5em] uppercase text-[10px] mb-8 text-[#f2cc8f]">Baralek Gadang</p>
                   <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white leading-tight italic tracking-tighter">
                     {data.bride_data.groom.split(' ')[0]} <br/> & <br/> {data.bride_data.bride.split(' ')[0]}
                   </h1>
                 </FadeIn>
                 <FadeIn delay={0.6}>
                   <div className="mb-12">
                      <p className="text-[10px] uppercase tracking-widest text-[#f2cc8f]/60 mb-4 font-sans">Kapado Nan Tahormat Bapak/Ibu/Sdr/i:</p>
                      <h2 className="text-3xl font-bold italic mb-2 text-white tracking-wide border-b border-[#f2cc8f]/20 pb-4 inline-block px-8">{guestName}</h2>
                   </div>
                 </FadeIn>
                 <FadeIn delay={0.8}>
                   <button 
                     onClick={openInvitation}
                     className="group relative px-12 py-5 bg-[#f2cc8f] text-[#4a0404] font-bold uppercase tracking-[0.3em] text-[10px] transition-all overflow-hidden shadow-[0_15px_35px_rgba(74,4,4,0.5)]"
                   >
                     <span className="relative z-10">Bukak Alek</span>
                     <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                   </button>
                 </FadeIn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="pb-32 relative z-10">
          
          {/* Hero Section */}
          <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
             <div className="absolute inset-0 z-0">
                <img src={data.hero_image || "https://images.unsplash.com/photo-1616091216791-a5360b5fc58e?auto=format&fit=crop&q=80"} className="w-full h-full object-cover opacity-30" alt="Hero" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#4a0404] via-transparent to-[#4a0404]"></div>
             </div>
             <div className="relative z-10">
                <FadeIn>
                    <Sparkles className="w-12 h-12 text-[#f2cc8f] mx-auto mb-10 opacity-60" />
                    <p className="tracking-[0.8em] uppercase text-[10px] mb-8 text-[#f2cc8f]">Maranjai Alek Gadang</p>
                    <h2 className="text-5xl md:text-8xl font-bold italic mb-12 text-white leading-tight tracking-tighter">
                        {data.bride_data.groom} & {data.bride_data.bride}
                    </h2>
                    <div className="w-32 h-px bg-[#f2cc8f] mx-auto mb-12 opacity-30"></div>
                    <p className="text-2xl tracking-[0.2em] mb-12 text-[#f2cc8f]">
                        {eventDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <div className="max-w-md mx-auto p-12 border border-[#f2cc8f]/20 bg-[#4a0404]/60 backdrop-blur-md">
                        <Countdown targetDate={eventDate} />
                    </div>
                </FadeIn>
             </div>
          </section>

          {/* Pantun / Quote */}
          <section className="py-32 px-6 text-center relative overflow-hidden">
             <div className="max-w-3xl mx-auto relative z-10">
                <FadeIn>
                    <p className="text-xl md:text-2xl leading-relaxed italic text-[#f2cc8f] font-light mb-8">
                        {data.quote || `"Anak urang di Koto Gadang, Pai ka pakan mambali suto. Baralek gadang denai undang, tando kasiah nan denai bao."`}
                    </p>
                </FadeIn>
             </div>
          </section>

          {/* Profil Mempelai */}
          <section className="py-32 px-6 relative overflow-hidden">
             <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-32">
                   <FadeIn className="text-center">
                      <div className="relative group mx-auto max-w-sm mb-12">
                         <div className="absolute -inset-2 bg-[#f2cc8f] group-hover:-inset-4 transition-all duration-700 -z-10 rotate-3"></div>
                         <div className="aspect-[4/5] overflow-hidden bg-[#1a0101] relative shadow-2xl">
                            <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover grayscale" alt="Groom" />
                         </div>
                      </div>
                      <h4 className="text-4xl font-bold italic mb-4 text-white tracking-tighter">{data.bride_data.groom}</h4>
                      <p className="text-xs tracking-[0.4em] uppercase text-[#f2cc8f]/60 mb-4">Anak saking</p>
                      <p className="text-lg italic text-[#f2cc8f]">{data.bride_data.parents_groom}</p>
                   </FadeIn>
                   <FadeIn className="text-center" delay={0.2}>
                      <div className="relative group mx-auto max-w-sm mb-12">
                         <div className="absolute -inset-2 bg-[#f2cc8f] group-hover:-inset-4 transition-all duration-700 -z-10 -rotate-3"></div>
                         <div className="aspect-[4/5] overflow-hidden bg-[#1a0101] relative shadow-2xl">
                            <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover grayscale" alt="Bride" />
                         </div>
                      </div>
                      <h4 className="text-4xl font-bold italic mb-4 text-white tracking-tighter">{data.bride_data.bride}</h4>
                      <p className="text-xs tracking-[0.4em] uppercase text-[#f2cc8f]/60 mb-4">Anak saking</p>
                      <p className="text-lg italic text-[#f2cc8f]">{data.bride_data.parents_bride}</p>
                   </FadeIn>
                </div>
             </div>
          </section>

          {/* Love Story */}
          {data.love_story && data.love_story.length > 0 && (
            <section className="py-32 px-6 bg-[#1a0101]">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-24">
                     <h2 className="text-4xl md:text-5xl font-bold italic mb-6 text-white tracking-widest uppercase">Ranah Cinto</h2>
                     <div className="w-16 h-px bg-[#f2cc8f] mx-auto opacity-40"></div>
                  </FadeIn>
                  <div className="space-y-16">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="flex flex-col md:flex-row items-center gap-12 group">
                              <div className="md:w-1/4 text-center">
                                 <span className="text-5xl font-bold italic text-[#f2cc8f]/20 group-hover:text-[#f2cc8f] transition-colors">{story.year}</span>
                              </div>
                              <div className="md:w-3/4 p-12 border-2 border-[#f2cc8f]/10 bg-[#4a0404] shadow-2xl relative">
                                 <h4 className="text-2xl font-bold italic mb-4 text-white">{story.title}</h4>
                                 <p className="text-[#f2cc8f]/60 leading-relaxed italic">{story.desc}</p>
                              </div>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          {/* Details */}
          <section className="py-32 px-6">
            <div className="max-w-6xl mx-auto">
               <div className="grid md:grid-cols-2 gap-12">
                  <FadeIn className="p-16 border border-[#f2cc8f]/20 bg-[#1a0101]/80 backdrop-blur-sm relative group text-center">
                     <p className="tracking-[0.5em] uppercase text-[10px] mb-12 text-[#f2cc8f]/60 italic">Akad Nikah</p>
                     <p className="text-4xl font-bold italic mb-6 text-white">{data.event_data.akad_time}</p>
                     <p className="text-[#f2cc8f]/60 mb-12 italic leading-relaxed text-lg max-w-xs mx-auto">{data.event_data.akad_location}</p>
                     <a href={data.event_data.akad_map} target="_blank" className="inline-block px-12 py-4 bg-[#f2cc8f] text-[#4a0404] font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all">Lokasi Alek</a>
                  </FadeIn>
                  <FadeIn className="p-16 border border-[#f2cc8f]/20 bg-[#1a0101]/80 backdrop-blur-sm relative group text-center" delay={0.2}>
                     <p className="tracking-[0.5em] uppercase text-[10px] mb-12 text-[#f2cc8f]/60 italic">Resepsi Alek Gadang</p>
                     <p className="text-4xl font-bold italic mb-6 text-white">{data.event_data.resepsi_time}</p>
                     <p className="text-[#f2cc8f]/60 mb-12 italic leading-relaxed text-lg max-w-xs mx-auto">{data.event_data.resepsi_location}</p>
                     <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-12 py-4 bg-[#f2cc8f] text-[#4a0404] font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all">Lokasi Alek</a>
                  </FadeIn>
               </div>
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

          {/* Video */}
          {data.video && (
            <section className="py-32 px-6 text-center">
              <FadeIn><h3 className="text-4xl font-bold italic mb-20 text-[#f2cc8f] tracking-widest uppercase">Sinematografi</h3></FadeIn>
              <div className="max-w-5xl mx-auto aspect-video border-[16px] border-[#f2cc8f]/10 shadow-2xl overflow-hidden">
                <iframe className="w-full h-full grayscale hover:grayscale-0 transition duration-1000" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {/* Kado Digital */}
          {data.gifts && data.gifts.length > 0 && (
            <section className="py-32 px-6 text-center">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-24">
                     <Gift className="w-16 h-16 text-[#f2cc8f] mx-auto mb-8 opacity-40" />
                     <h2 className="text-4xl md:text-5xl font-bold italic text-white tracking-widest mb-6">Tando Kasiah</h2>
                     <p className="text-[#f2cc8f]/60 italic max-w-md mx-auto">Doa restu Bapak/Ibu adolah kado nan paliang berharga kagem kami. Namun jiko Bapak/Ibu kersa paring kado cashless, saged liwat link di bawah.</p>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-12">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-[#1a0101] border border-[#f2cc8f]/10 p-16 shadow-2xl relative group overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-[#f2cc8f] opacity-40 group-hover:h-full group-hover:opacity-5 transition-all duration-700"></div>
                              <p className="tracking-[0.4em] uppercase text-[10px] text-[#f2cc8f]/60 mb-8">{gift.bank}</p>
                              <p className="text-3xl font-bold text-white mb-4 tracking-widest">{gift.acc}</p>
                              <p className="text-xs tracking-[0.2em] uppercase text-[#f2cc8f]">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          {/* RSVP */}
          <section className="py-32 px-6 bg-[#1a0101] relative overflow-hidden">
            <div className="max-w-2xl mx-auto text-center relative z-10">
               <FadeIn className="mb-16">
                  <h2 className="text-5xl font-bold italic text-white tracking-widest mb-4">Ucapan & Konfirmasi</h2>
                  <p className="text-[#f2cc8f]/40 tracking-[0.3em] uppercase text-[10px]">Silahkan kirim pasan untuak kami</p>
               </FadeIn>
               
               <FadeIn delay={0.2}>
                  <form className="space-y-6 mb-24" onSubmit={async (e) => {
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
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Namo Sanak" className="w-full px-10 py-5 bg-white/5 border border-white/10 focus:outline-none focus:border-[#f2cc8f] text-white placeholder:text-white/20 text-[10px] uppercase tracking-[0.3em]" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-10 py-5 bg-white/5 border border-white/10 focus:outline-none focus:border-[#f2cc8f] text-white text-[10px] uppercase tracking-[0.3em]" required>
                        <option value="" className="bg-[#1a0101]">Konfirmasi Hadia</option>
                        <option value="hadir" className="bg-[#1a0101]">Insya Allah Tibo</option>
                        <option value="tidak" className="bg-[#1a0101]">Alangan Tibo</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Pasan & Doa" className="w-full px-10 py-5 bg-white/5 border border-white/10 focus:outline-none focus:border-[#f2cc8f] text-white placeholder:text-white/20 text-[10px] uppercase tracking-[0.3em]" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-[#f2cc8f] text-[#4a0404] font-bold uppercase tracking-[0.5em] text-[10px] hover:bg-white transition-all disabled:opacity-50">
                        {isSubmitting ? "Sedang Mengirim..." : "Kirim Pasan"}
                    </button>
                  </form>
               </FadeIn>

               <div className="space-y-12 max-h-[600px] overflow-y-auto pr-6 custom-scrollbar text-left">
                  {wishes.length > 0 ? (
                     [...wishes].reverse().map((wish, idx) => (
                        <div key={idx} className="border-l border-[#f2cc8f]/20 pl-10 py-4 relative group">
                           <div className="flex items-center justify-between mb-4">
                              <span className="text-2xl font-bold italic text-white">{wish.name}</span>
                              <span className="text-[9px] uppercase tracking-[0.2em] bg-white/5 px-3 py-1 text-[#f2cc8f]">{wish.presence === 'hadir' ? 'Tibo' : 'Alangan'}</span>
                           </div>
                           <p className="text-white/60 italic font-light leading-relaxed">&quot;{wish.message}&quot;</p>
                        </div>
                     ))
                  ) : (
                     <p className="text-center text-[#f2cc8f]/40 tracking-widest uppercase text-[10px]">Alun ado pasan...</p>
                  )}
               </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-32 text-center relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-6xl font-bold italic text-white mb-4 tracking-tighter">{data.bride_data.groom} & {data.bride_data.bride}</h2>
                <p className="tracking-[0.8em] uppercase text-[10px] text-[#f2cc8f]/60"> Galatamu Minang </p>
             </div>
          </footer>

        </motion.main>
      )}

      {/* Floating Music Player */}
      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-12 right-12 z-40 w-16 h-16 bg-[#f2cc8f] rounded-full shadow-2xl flex items-center justify-center text-[#4a0404] transition-all hover:scale-110 active:scale-95 group">
          <Disc className={`w-8 h-8 ${isPlaying ? 'animate-[spin_5s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

