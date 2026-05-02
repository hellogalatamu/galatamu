"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";

export default function SundaTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
    <div className={`bg-[#f8faf2] min-h-screen text-[#2d4628] font-serif selection:bg-[#2d4628] selection:text-white ${previewMode ? 'relative' : ''}`}>
      <div className="fixed inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/bamboo.png')]"></div>
      
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2d4628] text-[#f8faf2] p-6 text-center">
              <FadeIn><h1 className="text-5xl font-bold italic mb-4">{data.bride_data.groom} & {data.bride_data.bride}</h1></FadeIn>
              <FadeIn delay={0.2}><p className="mb-12 opacity-80 uppercase tracking-widest text-xs">Panguleman kagem {guestName}</p></FadeIn>
              <button onClick={openInvitation} className="px-12 py-4 bg-[#f8faf2] text-[#2d4628] rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-2xl">Buka Undangan</button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 pb-32">
          
          <section className="h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-[#e8f3d6] to-[#f8faf2]">
            <FadeIn>
              <p className="tracking-[0.4em] uppercase text-[10px] mb-8 text-[#2d4628]/60">Pawiwahan Agung</p>
              <h2 className="text-5xl md:text-8xl font-bold italic mb-8">{data.bride_data.groom} & {data.bride_data.bride}</h2>
              <p className="text-xl italic mb-12 opacity-80">{eventDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div className="max-w-md mx-auto p-10 bg-white shadow-xl rounded-[2rem] border border-[#2d4628]/5">
                <Countdown targetDate={eventDate} />
              </div>
            </FadeIn>
          </section>

          <section className="py-24 px-6 text-center italic max-w-2xl mx-auto text-[#2d4628]/80 font-light">
            <FadeIn>
              <p className="text-lg leading-relaxed">
                {data.quote || "Mugi Allah SWT ngaberkahan hidep duaan, ngumpulkeun dina kahadean, sarta maparin turunan anu soleh sareng solehah. Sura dira jayaningrat lebur dening pangastuti."}
              </p>
            </FadeIn>
          </section>

          <section className="py-24 px-6 grid md:grid-cols-2 gap-24 max-w-6xl mx-auto">
            <FadeIn className="text-center">
              <div className="relative group mb-8">
                <div className="absolute -inset-2 bg-[#2d4628]/10 rounded-full group-hover:-inset-4 transition-all duration-700"></div>
                <div className="w-56 h-56 mx-auto rounded-full overflow-hidden border-4 border-white shadow-2xl relative"><img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" /></div>
              </div>
              <h3 className="text-4xl font-bold italic mb-2">{data.bride_data.groom}</h3>
              <p className="text-xs uppercase tracking-widest opacity-60">Putra ti Bapak & Ibu</p>
              <p className="text-lg italic">{data.bride_data.parents_groom}</p>
            </FadeIn>
            <FadeIn className="text-center" delay={0.2}>
              <div className="relative group mb-8">
                <div className="absolute -inset-2 bg-[#2d4628]/10 rounded-full group-hover:-inset-4 transition-all duration-700"></div>
                <div className="w-56 h-56 mx-auto rounded-full overflow-hidden border-4 border-white shadow-2xl relative"><img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" /></div>
              </div>
              <h3 className="text-4xl font-bold italic mb-2">{data.bride_data.bride}</h3>
              <p className="text-xs uppercase tracking-widest opacity-60">Putri ti Bapak & Ibu</p>
              <p className="text-lg italic">{data.bride_data.parents_bride}</p>
            </FadeIn>
          </section>

          {data.love_story && data.love_story.length > 0 && (
            <section className="py-24 px-6 bg-[#e8f3d6]/20">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-16"><h2 className="text-4xl italic font-bold">Cariyos Katresnan</h2></FadeIn>
                  <div className="space-y-8">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="p-10 bg-white shadow-sm border-l-4 border-[#2d4628]">
                              <p className="text-2xl font-bold italic text-[#2d4628] mb-2">{story.year}</p>
                              <h4 className="text-xl font-bold mb-2">{story.title}</h4>
                              <p className="opacity-60 italic">{story.desc}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-24 px-6">
             <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                <FadeIn className="p-12 bg-white shadow-xl rounded-[2rem] text-center border border-[#2d4628]/5">
                   <p className="uppercase text-[10px] tracking-widest mb-10 text-[#2d4628]/60 font-bold italic">Akad Nikah</p>
                   <p className="text-3xl font-bold mb-4">{data.event_data.akad_time}</p>
                   <p className="opacity-60 italic mb-10">{data.event_data.akad_location}</p>
                   <a href={data.event_data.akad_map} target="_blank" className="inline-block px-10 py-3 bg-[#2d4628] text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Peta Lokasi</a>
                </FadeIn>
                <FadeIn className="p-12 bg-white shadow-xl rounded-[2rem] text-center border border-[#2d4628]/5" delay={0.2}>
                   <p className="uppercase text-[10px] tracking-widest mb-10 text-[#2d4628]/60 font-bold italic">Resepsi</p>
                   <p className="text-3xl font-bold mb-4">{data.event_data.resepsi_time}</p>
                   <p className="opacity-60 italic mb-10">{data.event_data.resepsi_location}</p>
                   <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-10 py-3 bg-[#2d4628] text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Peta Lokasi</a>
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
              <FadeIn><h3 className="text-4xl italic font-bold mb-12">Video Undangan</h3></FadeIn>
              <div className="max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {data.gifts && data.gifts.length > 0 && (
            <section className="py-24 px-6 text-center">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-12">
                     <div className="w-16 h-16 bg-[#2d4628]/10 rounded-full flex items-center justify-center mx-auto mb-6"><Gift className="text-[#2d4628]" /></div>
                     <h2 className="text-4xl italic font-bold">Kado Digital</h2>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-8">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-white p-10 shadow-lg rounded-[2rem] border border-[#2d4628]/5 relative overflow-hidden">
                              <p className="uppercase text-[10px] tracking-widest font-bold text-[#2d4628]/40 mb-6">{gift.bank}</p>
                              <p className="text-2xl font-bold mb-2 tracking-widest">{gift.acc}</p>
                              <p className="text-xs uppercase tracking-widest opacity-60">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-24 px-6 bg-[#2d4628] text-[#f8faf2]">
            <div className="max-w-2xl mx-auto text-center">
               <FadeIn className="mb-12"><h2 className="text-4xl italic font-bold">Pangajab & RSVP</h2></FadeIn>
               <FadeIn delay={0.2}>
                  <form className="space-y-4 mb-20" onSubmit={async (e) => {
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
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Nami Lengkap" className="w-full px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-white/40" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-8 py-4 bg-[#2d4628] border border-white/10 rounded-2xl text-white focus:outline-none" required>
                        <option value="">Rawuh?</option>
                        <option value="hadir">Insya Allah Rawuh</option>
                        <option value="tidak">Nyuwun Pangapunten Mboten Rawuh</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Pesan & Doa" className="w-full px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-white/40" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-[#f8faf2] text-[#2d4628] font-bold uppercase tracking-widest rounded-2xl hover:bg-white transition disabled:opacity-50">
                        {isSubmitting ? "Ngirim..." : "Kirim Pangajab"}
                    </button>
                  </form>
               </FadeIn>
               <div className="space-y-6 max-h-[400px] overflow-y-auto pr-6 text-left">
                  {wishes.map((wish, idx) => (
                    <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-4 font-bold italic"><span>{wish.name}</span><span className="text-[10px] bg-white/10 px-2 py-1 rounded-full uppercase">{wish.presence}</span></div>
                        <p className="opacity-60 italic font-light leading-relaxed">&quot;{wish.message}&quot;</p>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          <footer className="py-24 text-center opacity-40 uppercase text-[10px] tracking-[1.5em]"> Sunda Parahyangan </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-[#2d4628] transition-all hover:scale-110 active:scale-95">
          <Disc className={`w-7 h-7 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

