"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./AmaraTheme";
import GalleryLightbox from "../GalleryLightbox";

export default function BatakTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
      const musicSrc = data.music_url || "https://cdn.pixabay.com/download/audio/2021/11/17/audio_0974b9f5e3.mp3?filename=batak-traditional-1123.mp3";
      audioRef.current = new Audio(musicSrc);
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={`bg-[#1a1a1a] min-h-screen text-white font-serif selection:bg-[#8b0000] selection:text-white ${previewMode ? 'relative' : ''}`}>
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#8b0000] text-white p-6 text-center">
              <div className="w-24 h-24 border-4 border-white rotate-45 flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(255,255,255,0.3)] animate-pulse"><Sparkles className="-rotate-45" /></div>
              <FadeIn><h1 className="text-5xl font-bold uppercase tracking-[0.2em] mb-4">{data.bride_data.groom} & {data.bride_data.bride}</h1></FadeIn>
              <FadeIn delay={0.2}><p className="mb-12 opacity-80 uppercase tracking-[0.4em] text-xs">Gokhon dohot Jou-jou tu {guestName}</p></FadeIn>
              <button onClick={openInvitation} className="px-12 py-4 border-2 border-white text-white rounded-none font-bold uppercase text-[10px] tracking-[0.5em] hover:bg-white hover:text-[#8b0000] transition-all">Buka Undangan</button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 pb-32">
          
          <section className="h-screen flex flex-col items-center justify-center text-center p-6 border-b-8 border-[#8b0000]">
            <FadeIn>
              <p className="tracking-[1em] uppercase text-[9px] mb-12 text-[#8b0000] font-bold">The Royal Batak Wedding</p>
              <h2 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter mb-12 leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>
              <div className="w-full h-px bg-white/20 mb-12"></div>
              <p className="text-3xl font-bold mb-16 tracking-widest">{eventDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div className="max-w-md mx-auto p-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-none">
                <Countdown targetDate={eventDate} />
              </div>
            </FadeIn>
          </section>

          <section className="py-24 px-6 text-center italic max-w-3xl mx-auto text-white/60">
            <FadeIn>
              <p className="text-xl leading-relaxed">
                {data.quote || "“Sai songon pargaulan ni bagot ma hamu, sai saksang sitiruon, sai ripe sonang ma hamu na mardongan tubu. Panggabean parhorasan di hamu saluhutna.”"}
              </p>
            </FadeIn>
          </section>

          <section className="py-24 px-6 grid md:grid-cols-2 gap-24 max-w-6xl mx-auto">
            <FadeIn className="text-center">
              <div className="relative group mb-12">
                <div className="absolute -inset-4 bg-[#8b0000]/20 rotate-6 group-hover:rotate-0 transition-all duration-700"></div>
                <div className="aspect-[3/4] bg-white p-3 shadow-2xl relative"><img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover grayscale" /></div>
              </div>
              <h3 className="text-4xl font-bold uppercase tracking-widest mb-2">{data.bride_data.groom}</h3>
              <p className="text-[#8b0000] font-bold uppercase tracking-[0.2em] text-xs mb-4">Anak ni</p>
              <p className="text-xl italic text-white/80">{data.bride_data.parents_groom}</p>
            </FadeIn>
            <FadeIn className="text-center" delay={0.2}>
              <div className="relative group mb-12">
                <div className="absolute -inset-4 bg-[#8b0000]/20 -rotate-6 group-hover:rotate-0 transition-all duration-700"></div>
                <div className="aspect-[3/4] bg-white p-3 shadow-2xl relative"><img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover grayscale" /></div>
              </div>
              <h3 className="text-4xl font-bold uppercase tracking-widest mb-2">{data.bride_data.bride}</h3>
              <p className="text-[#8b0000] font-bold uppercase tracking-[0.2em] text-xs mb-4">Boru ni</p>
              <p className="text-xl italic text-white/80">{data.bride_data.parents_bride}</p>
            </FadeIn>
          </section>

          {data.love_story && data.love_story.length > 0 && (
            <section className="py-24 px-6 bg-white/5">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-20"><h2 className="text-5xl font-bold uppercase tracking-tighter">Love Journey</h2></FadeIn>
                  <div className="space-y-12">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="relative pl-12 border-l-4 border-[#8b0000] py-4 group">
                              <div className="absolute -left-[14px] top-6 w-6 h-6 bg-[#8b0000] rounded-none group-hover:scale-150 transition-transform"></div>
                              <p className="text-2xl font-bold text-[#8b0000] mb-2">{story.year}</p>
                              <h4 className="text-2xl font-bold mb-2">{story.title}</h4>
                              <p className="text-white/60 italic leading-relaxed">{story.desc}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-24 px-6 bg-[#8b0000]">
             <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
                <FadeIn className="p-16 bg-[#8b0000] text-center">
                   <p className="uppercase text-[10px] tracking-[0.5em] mb-10 opacity-60 font-bold">Pamasumasuon</p>
                   <p className="text-4xl font-bold mb-4">{data.event_data.akad_time}</p>
                   <p className="opacity-80 italic mb-12 text-lg">{data.event_data.akad_location}</p>
                   <a href={data.event_data.akad_map} target="_blank" className="inline-block px-10 py-4 border-2 border-white text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-[#8b0000] transition-all">Google Maps</a>
                </FadeIn>
                <FadeIn className="p-16 bg-[#8b0000] text-center" delay={0.2}>
                   <p className="uppercase text-[10px] tracking-[0.5em] mb-10 opacity-60 font-bold">Ulaon Unjuk</p>
                   <p className="text-4xl font-bold mb-4">{data.event_data.resepsi_time}</p>
                   <p className="opacity-80 italic mb-12 text-lg">{data.event_data.resepsi_location}</p>
                   <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-10 py-4 border-2 border-white text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-[#8b0000] transition-all">Google Maps</a>
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
            <section className="py-24 px-6 text-center bg-white/5">
              <FadeIn><h3 className="text-5xl font-bold uppercase mb-16 tracking-tighter">Wedding Video</h3></FadeIn>
              <div className="max-w-4xl mx-auto aspect-video rounded-none overflow-hidden shadow-2xl border-4 border-white/20">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {data.gifts && data.gifts.length > 0 && (
            <section className="py-24 px-6 text-center">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-20">
                     <Gift className="w-20 h-20 text-[#8b0000] mx-auto mb-8 opacity-60" />
                     <h2 className="text-5xl font-bold uppercase tracking-widest">Tumpak Digital</h2>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-12">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-white/5 border border-white/10 p-12 relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-1 h-full bg-[#8b0000] group-hover:w-full opacity-20 transition-all duration-700"></div>
                              <p className="uppercase text-[10px] tracking-[0.4em] font-bold text-[#8b0000] mb-8">{gift.bank}</p>
                              <p className="text-3xl font-bold mb-4 tracking-widest">{gift.acc}</p>
                              <p className="text-xs uppercase tracking-widest opacity-40">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-24 px-6 bg-[#111] border-y border-white/5">
            <div className="max-w-2xl mx-auto text-center">
               <FadeIn className="mb-16">
                  <h2 className="text-5xl font-bold uppercase tracking-widest mb-4">Tumpak Doa</h2>
                  <p className="text-white/40 uppercase text-[10px] tracking-[0.4em]">Konfirmasi Kehadiran & Doa</p>
               </FadeIn>
               <FadeIn delay={0.2}>
                  <form className="space-y-6 mb-24 text-left" onSubmit={async (e) => {
                    e.preventDefault();
                    if (previewMode) return alert("Preview: Form mboten dikirim.");
                    if (!data.slug) return;
                    setIsSubmitting(true);
                    const newWish: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                    try {
                        const success = await submitWish(data.slug, newWish);
                        if (success) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); alert("Matur Nuwun!"); }
                    } finally { setIsSubmitting(false); }
                  }}>
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Nama Lengkap" className="w-full px-8 py-5 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#8b0000] text-[10px] uppercase tracking-widest" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-8 py-5 bg-[#111] border border-white/10 text-white focus:outline-none text-[10px] uppercase tracking-widest" required>
                        <option value="">Kehadiran</option>
                        <option value="hadir">Hadir</option>
                        <option value="tidak">Absen</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Pesan & Doa" className="w-full px-8 py-5 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#8b0000] text-[10px] uppercase tracking-widest" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-[#8b0000] text-white font-bold uppercase tracking-[0.5em] text-[10px] hover:bg-white hover:text-[#8b0000] transition disabled:opacity-50">
                        {isSubmitting ? "Mengirim..." : "Kirim Doa"}
                    </button>
                  </form>
               </FadeIn>
               <div className="space-y-8 max-h-[500px] overflow-y-auto pr-6 text-left">
                  {wishes.map((wish, idx) => (
                    <div key={idx} className="border-l-2 border-[#8b0000] pl-8 py-4 bg-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold uppercase tracking-widest">{wish.name}</span>
                            <span className="text-[9px] bg-[#8b0000] px-2 py-1 uppercase">{wish.presence}</span>
                        </div>
                        <p className="text-white/60 italic font-light leading-relaxed">&quot;{wish.message}&quot;</p>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          <footer className="py-24 text-center opacity-40 uppercase text-[10px] tracking-[2em]">— Batak Horas Pride —</footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-16 h-16 bg-[#8b0000] border-2 border-white rounded-none shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 group">
          <Disc className={`w-8 h-8 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

