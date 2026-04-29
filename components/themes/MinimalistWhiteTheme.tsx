"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Sparkles } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./AmaraTheme";
import GalleryLightbox from "../GalleryLightbox";

export default function MinimalistWhiteTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData, previewMode?: boolean, guestName?: string }) {
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
      const musicSrc = data.music_url || "https://cdn.pixabay.com/download/audio/2022/01/26/audio_0e5458390b.mp3?filename=piano-wedding-8532.mp3";
      audioRef.current = new Audio(musicSrc);
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={`bg-white min-h-screen text-black font-sans selection:bg-black selection:text-white ${previewMode ? 'relative' : ''}`}>
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 text-center">
              <FadeIn><h1 className="text-4xl font-light uppercase tracking-[0.8em] mb-12">{data.bride_data.groom} & {data.bride_data.bride}</h1></FadeIn>
              <FadeIn delay={0.2}><p className="mb-20 text-[10px] uppercase tracking-[0.5em] text-gray-400 italic">Special Invitation for {guestName}</p></FadeIn>
              <button onClick={openInvitation} className="px-16 py-4 border border-black text-black font-light uppercase text-[10px] tracking-[0.6em] hover:bg-black hover:text-white transition-all">Open Undangan</button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 pb-32">
          
          <section className="h-screen flex flex-col items-center justify-center text-center p-6 bg-white">
             <FadeIn>
                <p className="tracking-[1em] uppercase text-[9px] mb-16 text-gray-300">The Wedding Of</p>
                <h2 className="text-6xl md:text-8xl font-thin uppercase tracking-tighter mb-20 leading-none">{data.bride_data.groom} <span className="block text-gray-100 text-9xl -mt-10 mb-[-2rem]">&</span> {data.bride_data.bride}</h2>
                <p className="text-xl font-light mb-24 tracking-[0.3em] text-gray-400">{eventDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="max-w-md mx-auto py-12 border-y border-gray-100">
                   <Countdown targetDate={eventDate} />
                </div>
             </FadeIn>
          </section>

          <section className="py-32 px-6 text-center max-w-2xl mx-auto text-gray-400 leading-relaxed font-light">
            <FadeIn>
              <p className="text-lg tracking-wide italic">
                {data.quote || "“And I knew exactly how old Walt Disney's Cinderella felt when she found her prince. It's a clean, quiet love that fills the soul.”"}
              </p>
            </FadeIn>
          </section>

          <section className="py-24 px-6 grid md:grid-cols-2 gap-px bg-gray-50 max-w-6xl mx-auto border border-gray-100">
             <FadeIn className="bg-white p-20 text-center">
                <div className="aspect-[4/5] overflow-hidden mb-12 grayscale brightness-105 group"><img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" /></div>
                <h3 className="text-3xl font-light uppercase tracking-widest mb-4">{data.bride_data.groom}</h3>
                <p className="text-gray-300 uppercase text-[9px] tracking-[0.5em] mb-4 italic">Son of</p>
                <p className="text-lg font-light text-gray-600">{data.bride_data.parents_groom}</p>
             </FadeIn>
             <FadeIn className="bg-white p-20 text-center" delay={0.2}>
                <div className="aspect-[4/5] overflow-hidden mb-12 grayscale brightness-105 group"><img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" /></div>
                <h3 className="text-3xl font-light uppercase tracking-widest mb-4">{data.bride_data.bride}</h3>
                <p className="text-gray-300 uppercase text-[9px] tracking-[0.5em] mb-4 italic">Daughter of</p>
                <p className="text-lg font-light text-gray-600">{data.bride_data.parents_bride}</p>
             </FadeIn>
          </section>

          {data.love_story && data.love_story.length > 0 && (
            <section className="py-32 px-6">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-24"><h2 className="text-3xl font-thin uppercase tracking-[0.8em]">Love Story</h2></FadeIn>
                  <div className="space-y-24">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="grid md:grid-cols-[1fr_2fr] gap-12 group items-center">
                              <p className="text-5xl font-thin text-gray-100 group-hover:text-black transition-colors duration-700 italic">{story.year}</p>
                              <div>
                                 <h4 className="text-xl font-light uppercase tracking-widest mb-4">{story.title}</h4>
                                 <p className="text-gray-400 font-light leading-relaxed">{story.desc}</p>
                              </div>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6 bg-gray-50 border-y border-gray-100">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-px bg-gray-200">
               <FadeIn className="p-20 bg-white text-center">
                  <p className="tracking-[0.8em] uppercase text-[8px] mb-16 text-gray-300 font-bold italic">Wedding Ceremony</p>
                  <p className="text-4xl font-thin uppercase mb-8">{data.event_data.akad_time}</p>
                  <p className="text-gray-400 italic mb-16 text-lg max-w-xs mx-auto leading-relaxed">{data.event_data.akad_location}</p>
                  <a href={data.event_data.akad_map} target="_blank" className="inline-block px-12 py-4 border border-black text-black font-light uppercase tracking-[0.4em] text-[8px] hover:bg-black hover:text-white transition-all">View Maps</a>
               </FadeIn>
               <FadeIn className="p-20 bg-white text-center" delay={0.2}>
                  <p className="tracking-[0.8em] uppercase text-[8px] mb-16 text-gray-300 font-bold italic">Wedding Reception</p>
                  <p className="text-4xl font-thin uppercase mb-8">{data.event_data.resepsi_time}</p>
                  <p className="text-gray-400 italic mb-16 text-lg max-w-xs mx-auto leading-relaxed">{data.event_data.resepsi_location}</p>
                  <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-12 py-4 border border-black text-black font-light uppercase tracking-[0.4em] text-[8px] hover:bg-black hover:text-white transition-all">View Maps</a>
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
            <section className="py-32 px-6 text-center bg-gray-50">
              <FadeIn><h3 className="text-2xl font-thin uppercase tracking-[0.8em] mb-20 text-gray-300 italic">Moving Image</h3></FadeIn>
              <div className="max-w-5xl mx-auto aspect-video border border-gray-200 p-8 bg-white shadow-sm">
                <iframe className="w-full h-full grayscale hover:grayscale-0 transition duration-1000" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {data.gifts && data.gifts.length > 0 && (
            <section className="py-32 px-6 text-center">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-24">
                     <Gift className="w-12 h-12 text-gray-200 mx-auto mb-10" />
                     <h2 className="text-3xl font-thin uppercase tracking-[0.8em]">Gift</h2>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-px bg-gray-100 border border-gray-100">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-white p-20 group relative overflow-hidden">
                              <p className="uppercase text-[8px] tracking-[0.8em] font-bold text-gray-300 mb-12 italic">{gift.bank}</p>
                              <p className="text-2xl font-light mb-6 tracking-widest">{gift.acc}</p>
                              <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          <section className="py-32 px-6 bg-white border-t border-gray-50">
            <div className="max-w-2xl mx-auto text-center">
               <FadeIn className="mb-24">
                  <h2 className="text-3xl font-thin uppercase tracking-[0.8em] mb-8">Wishes</h2>
                  <p className="text-gray-300 uppercase text-[8px] tracking-[0.6em] italic">RSVP & Message</p>
               </FadeIn>
               <FadeIn delay={0.2}>
                  <form className="space-y-12 mb-32 text-left" onSubmit={async (e) => {
                    e.preventDefault();
                    if (previewMode) return alert("Preview mode.");
                    if (!data.slug) return;
                    setIsSubmitting(true);
                    const newWish: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                    try {
                        const success = await submitWish(data.slug, newWish);
                        if (success) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); alert("Thank you."); }
                    } finally { setIsSubmitting(false); }
                  }}>
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Full Name" className="w-full px-0 py-6 border-b border-gray-100 text-black focus:outline-none focus:border-black text-[10px] uppercase tracking-[0.5em] font-light" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-0 py-6 border-b border-gray-100 text-black focus:outline-none focus:border-black text-[10px] uppercase tracking-[0.5em] font-light bg-white" required>
                        <option value="">Presence</option>
                        <option value="hadir">Attending</option>
                        <option value="tidak">Not Attending</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Your Message" className="w-full px-0 py-6 border-b border-gray-100 text-black focus:outline-none focus:border-black text-[10px] uppercase tracking-[0.5em] font-light" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-8 border border-black text-black font-light uppercase tracking-[0.8em] text-[10px] hover:bg-black hover:text-white transition-all disabled:opacity-50">
                        {isSubmitting ? "Sending..." : "Submit Wishes"}
                    </button>
                  </form>
               </FadeIn>
               <div className="space-y-20 max-h-[600px] overflow-y-auto pr-8 text-left custom-scrollbar">
                  {wishes.map((wish, idx) => (
                    <div key={idx} className="pb-12 border-b border-gray-50 group">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl font-light uppercase tracking-widest">{wish.name}</span>
                            <span className="text-[8px] border border-gray-100 px-3 py-1 text-gray-300 uppercase font-bold tracking-[0.4em]">{wish.presence === 'hadir' ? 'Yes' : 'No'}</span>
                        </div>
                        <p className="text-gray-400 italic font-light leading-relaxed tracking-wide">&quot;{wish.message}&quot;</p>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          <footer className="py-40 text-center text-gray-200 uppercase text-[8px] tracking-[3em]">— Minimalist Pure White —</footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-12 right-12 z-40 w-12 h-12 bg-white border border-gray-100 rounded-full shadow-sm flex items-center justify-center text-black transition-all hover:scale-110 active:scale-95 group">
          <Disc className={`w-6 h-6 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

