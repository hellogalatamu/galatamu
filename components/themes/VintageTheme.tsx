"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Flower2 } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./AmaraTheme";
import GalleryLightbox from "../GalleryLightbox";

interface VintageThemeProps {
  data: InvitationData;
  previewMode?: boolean;
  guestName?: string;
}

export default function VintageTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: VintageThemeProps) {
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
    <div className={`bg-[#fdf8f3] min-h-screen text-[#4a3f35] font-serif selection:bg-[#4a3f35] selection:text-white ${previewMode ? 'relative' : ''}`}>
      {/* Cover Overlay */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fdf8f3] overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20 sepia-[.3]"
                style={{ backgroundImage: `url('${data.hero_image || 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&q=80'}')` }}
              ></div>
              
              <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
                 <FadeIn delay={0.2} className="mb-8">
                    <div className="w-24 h-px bg-[#8c7a6b] mx-auto relative">
                        <Heart className="absolute left-1/2 -top-2 -translate-x-1/2 text-[#8c7a6b] w-4 h-4 fill-[#fdf8f3]" />
                    </div>
                 </FadeIn>
                 <FadeIn delay={0.4}>
                   <p className="font-sans tracking-[0.3em] uppercase text-[10px] mb-6 text-[#8c7a6b]">The Wedding Celebration of</p>
                   <h1 className="text-5xl md:text-7xl font-bold mb-6 italic text-[#382f27] leading-tight">
                     {data.bride_data.groom} <span className="text-3xl block md:inline font-serif not-italic opacity-40">&</span> {data.bride_data.bride}
                   </h1>
                 </FadeIn>
                 <FadeIn delay={0.6}>
                   <div className="mb-12 py-6 border-y border-[#d4c3b3]">
                      <p className="font-sans text-[10px] uppercase tracking-widest text-[#8c7a6b] mb-4">Honored Guest:</p>
                      <h2 className="text-2xl font-bold italic mb-2">{guestName}</h2>
                      <p className="text-xs italic opacity-60">We invite you to celebrate with us</p>
                   </div>
                 </FadeIn>
                 <FadeIn delay={0.8}>
                   <button 
                     onClick={openInvitation}
                     className="px-10 py-4 bg-[#4a3f35] text-[#fdf8f3] rounded-full font-sans uppercase tracking-[0.2em] text-[10px] hover:bg-[#382f27] transition shadow-xl"
                   >
                     Open Invitation
                   </button>
                 </FadeIn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="pb-32">
          
          {/* Section 1: Hero */}
          <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
             <div className="absolute inset-0 z-0">
                <img src={data.hero_image || "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&q=80"} className="w-full h-full object-cover sepia-[.2]" alt="Hero" />
                <div className="absolute inset-0 bg-[#fdf8f3]/40"></div>
             </div>
             <div className="relative z-10 bg-[#fdf8f3]/80 backdrop-blur-sm p-12 md:p-20 border border-white shadow-2xl">
                <FadeIn>
                    <p className="font-sans tracking-[0.5em] uppercase text-[10px] mb-8 text-[#8c7a6b]">Save Our Date</p>
                    <h2 className="text-4xl md:text-6xl font-bold italic mb-10 text-[#382f27]">{data.bride_data.groom} & {data.bride_data.bride}</h2>
                    <p className="text-xl italic mb-12 border-b border-[#d4c3b3] pb-8">{eventDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <Countdown targetDate={eventDate} />
                </FadeIn>
             </div>
          </section>

          {/* Section 2: Quotes */}
          <section className="py-24 px-6 text-center">
             <div className="max-w-2xl mx-auto">
                <FadeIn>
                    <Flower2 className="w-12 h-12 text-[#8c7a6b] mx-auto mb-8 opacity-40" />
                    <p className="text-lg md:text-xl leading-relaxed italic text-[#5c4d42]">
                        {data.quote || "Love is a smoke made with the fume of sighs. Being purged, a fire sparkling in lovers' eyes. Being vexed, a sea nourished with lovers' tears."}
                    </p>
                    <p className="mt-8 font-sans text-[10px] uppercase tracking-widest text-[#8c7a6b]">— {data.bride_data.groom} & {data.bride_data.bride}</p>
                </FadeIn>
             </div>
          </section>

          {/* Section 3: Mempelai */}
          <section className="py-24 px-6">
             <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-20">
                   <FadeIn className="text-center">
                      <div className="aspect-[4/5] bg-[#e5ddd5] p-3 shadow-2xl relative mb-10 group">
                         <div className="w-full h-full border border-white relative overflow-hidden">
                            <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover sepia-[.3] group-hover:scale-110 transition duration-700" alt="Groom" />
                         </div>
                         <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-[#fdf8f3] border border-[#d4c3b3] p-4 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                            <Flower2 className="text-[#8c7a6b]" />
                         </div>
                      </div>
                      <h3 className="text-4xl font-bold italic mb-2 text-[#382f27]">{data.bride_data.groom}</h3>
                      <p className="text-sm font-sans uppercase tracking-[0.2em] text-[#8c7a6b]">Son of {data.bride_data.parents_groom}</p>
                   </FadeIn>
                   <FadeIn className="text-center" delay={0.2}>
                      <div className="aspect-[4/5] bg-[#e5ddd5] p-3 shadow-2xl relative mb-10 group">
                         <div className="w-full h-full border border-white relative overflow-hidden">
                            <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover sepia-[.3] group-hover:scale-110 transition duration-700" alt="Bride" />
                         </div>
                         <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[#fdf8f3] border border-[#d4c3b3] p-4 flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-transform">
                            <Flower2 className="text-[#8c7a6b]" />
                         </div>
                      </div>
                      <h3 className="text-4xl font-bold italic mb-2 text-[#382f27]">{data.bride_data.bride}</h3>
                      <p className="text-sm font-sans uppercase tracking-[0.2em] text-[#8c7a6b]">Daughter of {data.bride_data.parents_bride}</p>
                   </FadeIn>
                </div>
             </div>
          </section>

          {/* Section 4: Story */}
          {data.love_story && data.love_story.length > 0 && (
            <section className="py-24 px-6 bg-[#f7f1eb]">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="text-center mb-20">
                     <h2 className="text-4xl italic font-bold text-[#382f27] mb-4">Our Love Story</h2>
                     <div className="w-16 h-px bg-[#8c7a6b] mx-auto"></div>
                  </FadeIn>
                  <div className="space-y-16">
                     {data.love_story.map((story, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="flex flex-col md:flex-row items-center gap-12 group">
                              <div className="md:w-1/4 text-center">
                                 <span className="text-5xl font-bold italic text-[#d4c3b3] group-hover:text-[#8c7a6b] transition-colors">{story.year}</span>
                              </div>
                              <div className="md:w-3/4 p-10 bg-[#fdf8f3] border border-white shadow-lg relative">
                                 <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#fdf8f3] border-l border-b border-white rotate-45 hidden md:block"></div>
                                 <h4 className="text-2xl font-bold italic mb-4 text-[#382f27]">{story.title}</h4>
                                 <p className="text-[#5c4d42] leading-relaxed italic">{story.desc}</p>
                              </div>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          {/* Section 5: Events */}
          <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
               <div className="grid md:grid-cols-2 gap-px bg-[#d4c3b3]">
                  <FadeIn className="bg-[#fdf8f3] p-12 text-center">
                     <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#8c7a6b] mb-10">Holy Matrimony</p>
                     <p className="text-3xl font-bold italic mb-4">{data.event_data.akad_time}</p>
                     <p className="text-[#5c4d42] mb-12 font-light italic leading-relaxed px-6">{data.event_data.akad_location}</p>
                     <a href={data.event_data.akad_map} target="_blank" className="inline-block px-8 py-3 border border-[#8c7a6b] text-[#8c7a6b] font-sans text-[10px] uppercase tracking-widest hover:bg-[#8c7a6b] hover:text-white transition">View Map</a>
                  </FadeIn>
                  <FadeIn className="bg-[#fdf8f3] p-12 text-center" delay={0.2}>
                     <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#8c7a6b] mb-10">Wedding Reception</p>
                     <p className="text-3xl font-bold italic mb-4">{data.event_data.resepsi_time}</p>
                     <p className="text-[#5c4d42] mb-12 font-light italic leading-relaxed px-6">{data.event_data.resepsi_location}</p>
                     <a href={data.event_data.resepsi_map} target="_blank" className="inline-block px-8 py-3 border border-[#8c7a6b] text-[#8c7a6b] font-sans text-[10px] uppercase tracking-widest hover:bg-[#8c7a6b] hover:text-white transition">View Map</a>
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
            <section className="py-24 px-6 text-center bg-[#fdf8f3]">
              <FadeIn><h3 className="text-3xl font-bold italic mb-16 text-[#382f27]">Cinematography</h3></FadeIn>
              <div className="max-w-5xl mx-auto aspect-video border-[12px] border-white shadow-2xl overflow-hidden">
                <iframe className="w-full h-full grayscale hover:grayscale-0 transition duration-1000" src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`} title="Wedding Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </section>
          )}

          {/* Digital Gift */}
          {data.gifts && data.gifts.length > 0 && (
            <section className="py-24 px-6 text-center">
               <div className="max-w-4xl mx-auto">
                  <FadeIn className="mb-16">
                     <Flower2 className="w-12 h-12 text-[#8c7a6b] mx-auto mb-6 opacity-30" />
                     <h2 className="text-4xl italic font-bold text-[#382f27] mb-4">Digital Gift</h2>
                     <p className="text-[#8c7a6b] italic font-light">Your blessing is enough for us, but if you want to give a gift, we provide cashless options.</p>
                  </FadeIn>
                  <div className="grid sm:grid-cols-2 gap-8">
                     {data.gifts.map((gift, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                           <div className="bg-[#fdf8f3] border border-[#d4c3b3] p-10 shadow-sm relative group">
                              <div className="absolute top-4 right-4 text-[#d4c3b3] group-hover:text-[#8c7a6b] transition-colors"><Gift size={20}/></div>
                              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#8c7a6b] mb-4">{gift.bank}</p>
                              <p className="text-2xl font-bold mb-2 tracking-widest text-[#382f27]">{gift.acc}</p>
                              <p className="text-xs italic text-[#8c7a6b]">a.n {gift.name}</p>
                           </div>
                        </FadeIn>
                     ))}
                  </div>
               </div>
            </section>
          )}

          {/* RSVP */}
          <section className="py-24 px-6 bg-[#382f27] text-[#fdf8f3] relative">
            <div className="max-w-2xl mx-auto text-center relative z-10">
               <FadeIn className="mb-12">
                  <h2 className="text-4xl italic font-bold mb-4">Wishes & RSVP</h2>
                  <p className="text-[#8c7a6b] font-sans text-[10px] uppercase tracking-widest">Share your warmth wishes with us</p>
               </FadeIn>
               
               <FadeIn delay={0.2}>
                  <form className="space-y-4 mb-20 font-sans" onSubmit={async (e) => {
                    e.preventDefault();
                    if (previewMode) return alert("Preview mode: Form not submitted.");
                    if (!data.slug) return;
                    setIsSubmitting(true);
                    const newWish: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                    try {
                        const success = await submitWish(data.slug, newWish);
                        if (success) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); alert("Thank you!"); }
                    } finally { setIsSubmitting(false); }
                  }}>
                    <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Full Name" className="w-full px-6 py-4 bg-white/5 border border-white/10 focus:outline-none focus:border-[#d4c3b3] text-white placeholder:text-[#8c7a6b] text-xs uppercase tracking-widest" required />
                    <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-6 py-4 bg-white/5 border border-white/10 focus:outline-none focus:border-[#d4c3b3] text-white text-xs uppercase tracking-widest" required>
                        <option value="" className="text-slate-900">Confirmation</option>
                        <option value="hadir" className="text-slate-900">Attending</option>
                        <option value="tidak" className="text-slate-900">Absent</option>
                    </select>
                    <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Your Wishes" className="w-full px-6 py-4 bg-white/5 border border-white/10 focus:outline-none focus:border-[#d4c3b3] text-white placeholder:text-[#8c7a6b] text-xs uppercase tracking-widest" required></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-[#fdf8f3] text-[#382f27] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#d4c3b3] transition disabled:opacity-50">
                        {isSubmitting ? "Sending..." : "Submit Wishes"}
                    </button>
                  </form>
               </FadeIn>

               <div className="space-y-10 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar text-left">
                  {wishes.length > 0 ? (
                     [...wishes].reverse().map((wish, idx) => (
                        <div key={idx} className="border-b border-white/10 pb-8">
                           <div className="flex items-center justify-between mb-4">
                              <span className="text-xl font-bold italic">{wish.name}</span>
                              <span className="text-[9px] uppercase tracking-widest bg-white/10 px-2 py-1">{wish.presence === 'hadir' ? 'Attending' : 'Absent'}</span>
                           </div>
                           <p className="text-[#8c7a6b] italic font-light leading-relaxed">&quot;{wish.message}&quot;</p>
                        </div>
                     ))
                  ) : (
                     <p className="text-center text-[#8c7a6b] italic font-sans text-xs">Be the first to wish!</p>
                  )}
               </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-24 text-center">
             <p className="text-4xl italic font-bold text-[#382f27] mb-4">{data.bride_data.groom} & {data.bride_data.bride}</p>
             <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#8c7a6b]">Galatamu Invitation — 2024</p>
          </footer>

        </motion.main>
      )}

      {/* Floating Music Player */}
      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-14 h-14 bg-[#fdf8f3]/80 backdrop-blur-md border border-[#d4c3b3] rounded-full shadow-2xl flex items-center justify-center text-[#382f27] transition-all hover:scale-110 active:scale-95">
          <Disc className={`w-6 h-6 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

