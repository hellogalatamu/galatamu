"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";

export default function BaliTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
    <div className={`bg-[#1a1a1a] min-h-screen text-[#d4af37] font-serif selection:bg-[#d4af37] selection:text-black ${previewMode ? 'relative' : ''}`}>
      {(data.bg_image || data.bg_middle || data.bg_bottom) && (
        <div className="absolute inset-0 pointer-events-none z-0 flex flex-col opacity-15">
          <div className="flex-1 relative overflow-hidden"><div className="sticky top-0 w-full h-screen bg-cover bg-center" style={data.bg_image ? { backgroundImage: `url('${data.bg_image}')` } : {}}></div></div>
          <div className="flex-1 relative overflow-hidden"><div className="sticky top-0 w-full h-screen bg-cover bg-center" style={data.bg_middle ? { backgroundImage: `url('${data.bg_middle}')` } : {}}></div></div>
          <div className="flex-1 relative overflow-hidden"><div className="sticky top-0 w-full h-screen bg-cover bg-center" style={data.bg_bottom ? { backgroundImage: `url('${data.bg_bottom}')` } : {}}></div></div>
        </div>
      )}
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>
      
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1a1a] text-[#d4af37] p-6 text-center">
              <div className="mb-12"><Sparkles className="w-16 h-16 animate-pulse" /></div>
              <FadeIn><h1 className="text-6xl font-bold italic mb-6 tracking-tighter">{data.bride_data.groom} & {data.bride_data.bride}</h1></FadeIn>
              <FadeIn delay={0.2}><p className="mb-16 opacity-60 uppercase tracking-[0.4em] text-[10px]">Om Swastiastu Tuwuhtu, {guestName}</p></FadeIn>
              <button onClick={openInvitation} className="px-16 py-5 border border-[#d4af37] text-[#d4af37] rounded-none font-bold uppercase text-[10px] tracking-[0.5em] hover:bg-[#d4af37] hover:text-black transition-all shadow-[0_0_40px_rgba(212,175,55,0.2)]">Buka Undangan</button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 pb-32">
          
          <section className="h-screen flex flex-col items-center justify-center text-center p-6 border-b border-[#d4af37]/10">
             <FadeIn>
                <p className="tracking-[0.8em] uppercase text-[9px] mb-10 text-white/30 font-bold italic">Pawiwahan Agung</p>
                <h2 className="text-6xl md:text-9xl font-bold italic mb-12 text-white tracking-tighter leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>
                <div className="w-px h-32 bg-[#d4af37]/30 mx-auto mb-12"></div>
                <p className="text-3xl font-bold mb-16 text-[#d4af37] tracking-[0.2em]">{eventDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="max-w-md mx-auto p-12 border border-[#d4af37]/10 bg-white/5 backdrop-blur-md">
                   <Countdown targetDate={eventDate} />
                </div>
             </FadeIn>
          </section>

          <section className="py-24 px-6 text-center italic max-w-2xl mx-auto text-white/50 leading-relaxed font-light">
            <FadeIn>
              <p className="text-xl">
                {data.quote || "Grhayastam Kusala Bhavantu. Semoga terwujud keluarga yang sejahtera, bahagia, dan damai dalam lindungan Ida Sang Hyang Widhi Wasa."}
              </p>
            </FadeIn>
          </section>

          <section className="py-24 px-6 grid md:grid-cols-2 gap-32 max-w-6xl mx-auto">
             <FadeIn className="text-center">
                <div className="relative group mb-12">
                   <div className="absolute -inset-4 border border-[#d4af37]/20 group-hover:-inset-6 transition-all duration-700"></div>
                   <div className="aspect-[4/5] overflow-hidden shadow-2xl relative grayscale group-hover:grayscale-0 transition-all duration-1000"><img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover brightness-75 group-hover:brightness-100" /></div>
                </div>
                <h3 className="text-5xl font-bold italic text-white mb-4 tracking-tighter">{data.bride_data.groom}</h3>
                <p className="text-[#d4af37]/60 uppercase text-[10px] tracking-[0.3em] font-bold italic mb-2">Putra saking</p>
                <p className="text-xl italic text-white/60">{data.bride_data.parents_groom}</p>
             </FadeIn>
             <FadeIn className="text-center" delay={0.2}>
                <div className="relative group mb-12">
                   <div className="absolute -inset-4 border border-[#d4af37]/20 group-hover:-inset-6 transition-all duration-700"></div>
                   <div className="aspect-[4/5] overflow-hidden shadow-2xl relative grayscale group-hover:grayscale-0 transition-all duration-1000"><img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover brightness-75 group-hover:brightness-100" /></div>
                </div>
                <h3 className="text-5xl font-bold italic text-white mb-4 tracking-tighter">{data.bride_data.bride}</h3>
                <p className="text-[#d4af37]/60 uppercase text-[10px] tracking-[0.3em] font-bold italic mb-2">Putri saking</p>
                <p className="text-xl italic text-white/60">{data.bride_data.parents_bride}</p>
             </FadeIn>
          </section>

          {data.love_story && data.love_story.length > 0 && (
            <section className="py-24 px-6 bg-white/5 border-y border-[#d4af37]/5">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-20"><h2 className="text-4xl italic font-bold tracking-widest text-white">Pratista Katresnan</h2></FadeIn>
                  <div className="space-y-16">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="text-center group">
                              <p className="text-3xl font-bold text-[#d4af37] mb-4 opacity-40 group-hover:opacity-100 transition duration-700 italic">{story.year}</p>
                              <h4 className="text-2xl font-bold text-white mb-4 italic tracking-widest">{story.title}</h4>
                              <p className="text-white/40 italic font-light max-w-xl mx-auto leading-relaxed">{story.desc}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
               <FadeIn className="p-16 border border-[#d4af37]/10 bg-white/5 backdrop-blur-sm text-center group">
                  <p className="tracking-[0.6em] uppercase text-[9px] mb-12 text-[#d4af37] font-bold italic opacity-60">Pawiwahan</p>
                  <p className="text-4xl font-bold italic text-white mb-6">{data.event_data.akad_time}</p>
                  <p className="text-white/40 italic mb-12 text-lg max-w-xs mx-auto leading-relaxed">{data.event_data.akad_location}</p>
                  <a href={data.event_data.akad_map} target="_blank" className="inline-block px-12 py-4 border border-[#d4af37] text-[#d4af37] font-bold uppercase tracking-[0.3em] text-[9px] hover:bg-[#d4af37] hover:text-black transition-all">Lokasi Pawiwahan</a>
               </FadeIn>
               <FadeIn className="p-16 border border-[#d4af37]/10 bg-white/5 backdrop-blur-sm text-center group" delay={0.2}>
                  <p className="tracking-[0.6em] uppercase text-[9px] mb-12 text-[#d4af37] font-bold italic opacity-60">Resepsi</p>
                  <p className="text-4xl font-bold italic text-white mb-6">{data.event_data.resepsi_time}</p>
                  <p className="text-white/40 italic mb-12 text-lg max-w-xs mx-auto leading-relaxed">{data.event_data.resepsi_location}</p>
                  <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-12 py-4 border border-[#d4af37] text-[#d4af37] font-bold uppercase tracking-[0.3em] text-[9px] hover:bg-[#d4af37] hover:text-black transition-all">Lokasi Resepsi</a>
               </FadeIn>
            </div>
          </section>

          <GalleryLightbox
            images={data.gallery || []}
            title="Pramana Galeri"
            titleClassName="text-5xl font-bold italic text-white tracking-widest uppercase text-center mb-20"
            sectionClassName="py-24 px-6 bg-white/5"
            gridClassName="grid grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto"
            itemClassName="aspect-[4/5] overflow-hidden bg-[#111] border-2 border-[#d4af37]/10 group p-4 shadow-2xl cursor-pointer relative"
            imgClassName="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-1000"
          />

          {data.video && (
            <section className="py-24 px-6 text-center">
              <FadeIn><h3 className="text-4xl italic font-bold text-white mb-16 tracking-widest">Warna Video</h3></FadeIn>
              <div className="max-w-5xl mx-auto aspect-video border-2 border-[#d4af37]/10 p-4 bg-white/5 shadow-2xl">
                <iframe className="w-full h-full grayscale hover:grayscale-0 transition duration-1000" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {data.gifts && data.gifts.length > 0 && (
            <section className="py-24 px-6 text-center">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-20">
                     <Gift className="w-16 h-16 text-[#d4af37] mx-auto mb-10 opacity-30" />
                     <h2 className="text-5xl font-bold italic text-white tracking-widest">Punnia Digital</h2>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-12">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-white/5 border border-[#d4af37]/10 p-16 shadow-2xl relative group overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-[#d4af37] opacity-20 group-hover:h-full transition-all duration-700"></div>
                              <p className="uppercase text-[9px] tracking-[0.4em] font-bold text-[#d4af37] mb-8 italic">{gift.bank}</p>
                              <p className="text-3xl font-bold text-white mb-4 tracking-widest italic">{gift.acc}</p>
                              <p className="text-xs uppercase tracking-widest opacity-40 font-bold">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-24 px-6 bg-[#111] border-t border-[#d4af37]/5">
            <div className="max-w-2xl mx-auto text-center">
               <FadeIn className="mb-16">
                  <h2 className="text-5xl font-bold italic text-white tracking-widest mb-6">Atur Pangayubagia</h2>
                  <p className="text-[#d4af37]/40 uppercase text-[9px] tracking-[0.4em] italic font-bold">RSVP & Ucapan Doa</p>
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
                        if (success) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); alert("Matur Suksma!"); }
                    } finally { setIsSubmitting(false); }
                  }}>
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Pesengan" className="w-full px-10 py-6 bg-white/5 border border-[#d4af37]/10 text-white focus:outline-none focus:border-[#d4af37]/40 text-[10px] uppercase tracking-widest italic" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-10 py-6 bg-[#111] border border-[#d4af37]/10 text-white focus:outline-none text-[10px] uppercase tracking-widest italic" required>
                        <option value="">Presensi</option>
                        <option value="hadir">Rawuh</option>
                        <option value="tidak">Mboten Rawuh</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Atur Pangastuti" className="w-full px-10 py-6 bg-white/5 border border-[#d4af37]/10 text-white focus:outline-none focus:border-[#d4af37]/40 text-[10px] uppercase tracking-widest italic" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-7 bg-[#d4af37] text-black font-bold uppercase tracking-[0.6em] text-[10px] hover:bg-white transition-all disabled:opacity-50">
                        {isSubmitting ? "Ngirim..." : "Kirim Doa"}
                    </button>
                  </form>
               </FadeIn>
               <div className="space-y-12 max-h-[600px] overflow-y-auto pr-8 text-left custom-scrollbar">
                  {wishes.map((wish, idx) => (
                    <div key={idx} className="border-b border-[#d4af37]/5 pb-12 group">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-3xl font-bold italic text-white tracking-tighter">{wish.name}</span>
                            <span className="text-[9px] bg-[#d4af37]/10 px-3 py-1 text-[#d4af37] uppercase font-bold tracking-widest">{wish.presence === 'hadir' ? 'Rawuh' : 'Absen'}</span>
                        </div>
                        <p className="text-white/40 italic font-light leading-relaxed text-lg">&quot;{wish.message}&quot;</p>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          <footer className="py-32 text-center text-[#d4af37]/40 uppercase text-[9px] tracking-[2em]"> Balinese Signature </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-12 right-12 z-40 w-16 h-16 bg-[#1a1a1a] border border-[#d4af37]/30 rounded-full shadow-2xl flex items-center justify-center text-[#d4af37] transition-all hover:scale-110 active:scale-95 group">
          <Disc className={`w-9 h-9 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}
