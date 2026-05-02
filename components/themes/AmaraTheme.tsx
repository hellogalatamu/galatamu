"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, ArrowRight } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import GalleryLightbox from "../GalleryLightbox";
import { InvitationData, WishData } from "./types";
import VideoPlayer from "../VideoPlayer";
import { generateGoogleCalendarLink, generateICalLink } from "@/lib/calendarHelper";

export default function AmaraTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData; previewMode?: boolean; guestName?: string }) {
  const [isOpen, setIsOpen] = useState(previewMode);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef(null);

  const [wishes, setWishes] = useState<WishData[]>(data.wishes || []);
  const [rsvpName, setRsvpName] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [rsvpPresence, setRsvpPresence] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    if (!previewMode) {
      const musicSrc = data.music_url || "/music/wedding.mp3";
      audioRef.current = new Audio(musicSrc);
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
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
    <div ref={containerRef} className="bg-[#faf9f6] min-h-screen text-[#1a1a1a] font-sans selection:bg-[#1a1a1a] selection:text-white overflow-hidden">
      {data.bg_image && (
        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: `url('${data.bg_image}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }}></div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;600&display=swap');
        .font-serif-display { font-family: 'Playfair Display', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .text-huge { font-size: clamp(4rem, 15vw, 12rem); line-height: 0.8; }
        .outline-text { -webkit-text-stroke: 1px #1a1a1a; color: transparent; }
      `}</style>

      {/*  ENVELOPE / COVER  */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 1 }} 
              exit={{ y: "-100%", opacity: 0 }} 
              transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
              className="fixed inset-0 z-[100] bg-[#1a1a1a] flex items-center justify-center overflow-hidden"
            >
              <motion.div 
                initial={{ scale: 1.2, opacity: 0 }} 
                animate={{ scale: 1, opacity: 0.4 }} 
                transition={{ duration: 2 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${data.hero_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80'}')` }}
              />
              <div className="relative z-10 text-center text-white px-6">
                <FadeIn delay={0.5}>
                  <p className="font-inter tracking-[0.5em] uppercase text-[10px] mb-8 text-white/60">Private Invitation</p>
                  <h1 className="font-serif-display text-huge mb-12 italic">
                    {data.bride_data.groom.split(' ')[0]} <span className="text-white/20">&</span> {data.bride_data.bride.split(' ')[0]}
                  </h1>
                  <p className="font-inter text-sm tracking-widest mb-16 text-white/80">FOR <span className="font-bold border-b border-white/30 pb-1">{guestName}</span></p>
                  <button 
                    onClick={openInvitation}
                    className="group relative px-12 py-5 bg-white text-black font-inter text-[10px] uppercase tracking-[0.4em] overflow-hidden transition-all hover:pr-16"
                  >
                    <span className="relative z-10">Open Invitation</span>
                    <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={16} />
                  </button>
                </FadeIn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/*  MAIN CONTENT  */}
      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
          
          {/* Section 1: Hero Editorial */}
          <section className="relative min-h-screen flex flex-col justify-end p-8 md:p-20">
            <div className="absolute top-0 right-0 w-full md:w-2/3 h-2/3 md:h-full z-0 overflow-hidden">
               <motion.img 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                src={data.hero_image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"} 
                className="w-full h-full object-cover grayscale brightness-90"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-transparent to-transparent md:bg-gradient-to-r md:from-[#faf9f6] md:via-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl">
              <FadeIn>
                <p className="font-inter tracking-[0.4em] uppercase text-[10px] text-gray-400 mb-6">The Wedding Of</p>
                <h2 className="font-serif-display text-huge mb-6">
                  {data.bride_data.groom}
                  <span className="block outline-text italic -mt-4 mb-4">& {data.bride_data.bride}</span>
                </h2>
                <div className="flex flex-col md:flex-row md:items-end gap-8 mt-12">
                   <div className="border-l border-black/10 pl-6 py-2">
                      <p className="font-serif-display text-3xl italic">{eventDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      <p className="font-inter text-[10px] tracking-widest uppercase text-gray-400 mt-2">Save the date</p>
                   </div>
                   <div className="md:mb-1">
                      <Countdown targetDate={eventDate} />
                   </div>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* Section 2: Split Profiles */}
          <section className="py-32 px-8 md:px-20 bg-white">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <FadeIn>
                <div className="relative aspect-[3/4] overflow-hidden group">
                  <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute bottom-0 left-0 p-8 text-white z-10">
                    <p className="font-inter text-[9px] tracking-[0.5em] uppercase mb-2 text-white/60">Groom</p>
                    <h3 className="font-serif-display text-4xl italic">{data.bride_data.groom}</h3>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <p className="font-inter text-sm text-gray-400 mt-6 max-w-xs leading-relaxed italic">Putra dari Bapak {data.bride_data.parents_groom.split('&')[0]} & Ibu {data.bride_data.parents_groom.split('&')[1] || data.bride_data.parents_groom}</p>
              </FadeIn>

              <FadeIn delay={0.2} className="md:mt-40">
                <div className="relative aspect-[3/4] overflow-hidden group">
                  <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute bottom-0 left-0 p-8 text-white z-10">
                    <p className="font-inter text-[9px] tracking-[0.5em] uppercase mb-2 text-white/60">Bride</p>
                    <h3 className="font-serif-display text-4xl italic text-[#d4af37]">{data.bride_data.bride}</h3>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <p className="font-inter text-sm text-gray-400 mt-6 max-w-xs leading-relaxed italic md:ml-auto md:text-right">Putri dari Bapak {data.bride_data.parents_bride.split('&')[0]} & Ibu {data.bride_data.parents_bride.split('&')[1] || data.bride_data.parents_bride}</p>
              </FadeIn>
            </div>
          </section>

          {/* Section 3: Love Story Editorial */}
          <section className="py-32 px-8 md:px-20 bg-[#faf9f6]">
            <div className="max-w-6xl mx-auto">
               <FadeIn className="mb-20">
                  <h2 className="font-serif-display text-7xl md:text-9xl outline-text italic">Our Journey</h2>
               </FadeIn>
               
               <div className="space-y-40">
                  {data.love_story?.map((story, i) => (
                    <FadeIn key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
                      <div className="w-full md:w-1/2 aspect-video bg-gray-200 overflow-hidden grayscale">
                         <img src={data.gallery?.[i] || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"} className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div className="w-full md:w-1/2">
                         <p className="font-serif-display text-6xl text-gray-200 mb-4">{story.year}</p>
                         <h4 className="font-inter text-xl font-bold tracking-widest uppercase mb-6">{story.title}</h4>
                         <p className="font-inter text-gray-500 leading-relaxed font-light text-lg">{story.desc}</p>
                      </div>
                    </FadeIn>
                  ))}
               </div>
            </div>
          </section>

          {/* New Section: Video Story */}
          {data.video && (
            <section className="py-32 px-8 md:px-20 bg-white">
              <div className="max-w-4xl mx-auto">
                <FadeIn className="text-center mb-16">
                  <p className="font-inter tracking-[0.4em] uppercase text-[10px] text-gray-400 mb-6 font-bold">Watch Our Story</p>
                  <h2 className="font-serif-display text-5xl italic">Pre-Wedding Video</h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <VideoPlayer url={data.video} />
                </FadeIn>
              </div>
            </section>
          )}

          {/* Section 4: Event Details Asymmetric */}
          <section className="py-32 px-8 md:px-20 bg-white">
            <div className="grid md:grid-cols-2 gap-px bg-black/5 border border-black/5">
               <FadeIn className="p-16 bg-white flex flex-col justify-between min-h-[400px]">
                  <div>
                    <p className="font-inter tracking-[0.5em] uppercase text-[9px] mb-8 text-gray-300 font-bold">The Ceremony</p>
                    <h3 className="font-serif-display text-4xl mb-6">Akad Nikah</h3>
                    <p className="font-inter text-2xl font-light mb-2">{data.event_data.akad_time}</p>
                    <p className="font-inter text-gray-400 italic text-sm leading-relaxed max-w-xs">{data.event_data.akad_location}</p>
                  </div>
                  <a href={data.event_data.akad_map} target="_blank" className="mt-12 flex items-center gap-4 font-inter text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-all">
                     <span className="w-10 h-px bg-black/10" /> View On Maps
                  </a>
               </FadeIn>

               <FadeIn className="p-16 bg-white flex flex-col justify-between min-h-[400px]" delay={0.2}>
                  <div>
                    <p className="font-inter tracking-[0.5em] uppercase text-[9px] mb-8 text-gray-300 font-bold">The Celebration</p>
                    <h3 className="font-serif-display text-4xl mb-6 italic text-[#d4af37]">Resepsi</h3>
                    <p className="font-inter text-2xl font-light mb-2">{data.event_data.resepsi_time}</p>
                    <p className="font-inter text-gray-400 italic text-sm leading-relaxed max-w-xs">{data.event_data.resepsi_location}</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <a href={data.event_data.resepsi_map} target="_blank" className="mt-12 flex items-center gap-4 font-inter text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-all">
                       <span className="w-10 h-px bg-black/10" /> View On Maps
                    </a>
                    <div className="flex gap-4">
                      <a 
                        href={generateGoogleCalendarLink(`Wedding of ${data.bride_data.groom} & ${data.bride_data.bride}`, data.event_data.date, data.event_data.resepsi_location)} 
                        target="_blank"
                        className="text-[9px] uppercase tracking-[0.2em] bg-gray-50 px-4 py-2 rounded-full text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-all font-bold"
                      >
                        + Google Calendar
                      </a>
                      <a 
                        href={generateICalLink(`Wedding of ${data.bride_data.groom} & ${data.bride_data.bride}`, data.event_data.date, data.event_data.resepsi_location)} 
                        className="text-[9px] uppercase tracking-[0.2em] bg-gray-50 px-4 py-2 rounded-full text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-all font-bold"
                      >
                        + iCal
                      </a>
                    </div>
                  </div>
               </FadeIn>
            </div>

            {/* New: Live Stream Button */}
            {data.event_data.live_stream && (
              <FadeIn className="mt-12 text-center">
                <a 
                  href={data.event_data.live_stream} 
                  target="_blank"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-[#d4af37] text-white rounded-full font-inter text-xs uppercase tracking-[0.3em] font-bold hover:bg-black transition-all shadow-xl"
                >
                  <Video size={16} /> Join Live Streaming
                </a>
              </FadeIn>
            )}
          </section>

          {/* Section 5: Gallery Mosaic */}
          <GalleryLightbox
            images={data.gallery || []}
            title="The Memories"
            titleClassName="font-serif-display text-7xl md:text-9xl text-center mb-24 outline-text italic"
            sectionClassName="py-32 px-4 md:px-20 bg-[#faf9f6]"
            gridClassName="columns-2 md:columns-3 gap-4 space-y-4 max-w-7xl mx-auto"
            itemClassName="break-inside-avoid overflow-hidden group cursor-pointer relative bg-gray-100"
            imgClassName="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          />

          {/* Section 6: Gift Section Modern */}
          <section className="py-32 px-8 md:px-20 bg-white text-center">
            <div className="max-w-2xl mx-auto">
               <FadeIn>
                  <p className="font-inter tracking-[0.4em] uppercase text-[10px] text-gray-300 mb-8 font-bold">Digital Envelope</p>
                  <h3 className="font-serif-display text-5xl mb-12 italic">Wedding Gift</h3>
                  <p className="font-inter text-gray-400 font-light mb-16 leading-relaxed">Kehadiran Anda adalah hadiah terbaik bagi kami. Namun jika ingin memberikan tanda kasih, silakan melalui saluran berikut:</p>
               </FadeIn>
               
               <div className="space-y-6">
                  {data.gifts?.map((gift, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <div className="p-12 border border-black/5 bg-[#faf9f6] flex flex-col items-center group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                           <Gift size={24} />
                        </div>
                        <p className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-4 italic">{gift.bank}</p>
                        <p className="font-inter text-3xl font-light mb-2 tracking-widest">{gift.acc}</p>
                        <p className="font-inter text-xs text-gray-500 font-bold uppercase tracking-widest">{gift.name}</p>
                      </div>
                    </FadeIn>
                  ))}
               </div>
            </div>
          </section>

          {/* Section 7: RSVP Dark Editorial */}
          <section className="py-32 px-8 md:px-20 bg-[#1a1a1a] text-white">
             <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-20">
                <FadeIn>
                   <h2 className="font-serif-display text-6xl md:text-8xl italic text-white/20 mb-8 leading-none">The RSVP</h2>
                   <p className="font-inter text-white/40 leading-relaxed font-light mb-12 italic">Mohon konfirmasi kehadiran Anda untuk membantu kami dalam persiapan acara yang lebih baik. Terima kasih.</p>
                   
                   <div className="space-y-8 mt-20 hidden md:block">
                      <div className="w-12 h-px bg-white/20" />
                      <p className="font-serif-display text-4xl italic text-white/60">We can't wait to see you there.</p>
                   </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                   <form className="space-y-8" onSubmit={async (e) => {
                      e.preventDefault();
                      if (previewMode) return alert("Preview.");
                      if (!data.slug) return;
                      setIsSubmitting(true);
                      const w: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                      try {
                        const success = await submitWish(data.slug, w);
                        if (success) { setWishes([...wishes, w]); setRsvpMessage(""); setRsvpPresence(""); alert("Sent."); }
                      } finally { setIsSubmitting(false); }
                   }}>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold ml-1">Name</label>
                        <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} className="w-full bg-white/5 border-b border-white/10 px-4 py-5 focus:outline-none focus:border-white transition-all text-sm font-inter" placeholder="Enter your name" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold ml-1">Attendance</label>
                        <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full bg-[#1a1a1a] border-b border-white/10 px-4 py-5 focus:outline-none focus:border-white transition-all text-sm font-inter" required>
                            <option value="">Will you attend?</option>
                            <option value="hadir">I am attending</option>
                            <option value="tidak">I am unable to attend</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold ml-1">Message</label>
                        <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} className="w-full bg-white/5 border-b border-white/10 px-4 py-5 focus:outline-none focus:border-white transition-all text-sm font-inter resize-none" placeholder="Leave a warm wish" required></textarea>
                      </div>
                      <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-white text-black font-inter text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-gray-200 transition-all disabled:opacity-30">
                        {isSubmitting ? "Processing..." : "Send Wishes"}
                      </button>
                   </form>
                </FadeIn>
             </div>

             <FadeIn className="mt-32 border-t border-white/5 pt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {wishes.slice(0, 6).map((wish, idx) => (
                      <div key={idx} className="bg-white/[0.03] p-8 border border-white/[0.05]">
                         <div className="flex justify-between items-start mb-6">
                            <h4 className="font-serif-display text-xl italic">{wish.name}</h4>
                            <span className="text-[8px] uppercase tracking-widest text-white/20 border border-white/10 px-2 py-1">{wish.presence === 'hadir' ? 'Attending' : 'Absent'}</span>
                         </div>
                         <p className="text-white/40 font-inter text-sm leading-relaxed italic">&ldquo;{wish.message}&rdquo;</p>
                      </div>
                   ))}
                </div>
             </FadeIn>
          </section>

          {/* Footer Minimalist */}
          <footer className="py-32 px-8 bg-white text-center">
            <h2 className="font-serif-display text-4xl italic mb-6">
               {data.bride_data.groom.split(' ')[0]} <span className="text-gray-200">&</span> {data.bride_data.bride.split(' ')[0]}
            </h2>
            <p className="font-inter text-[9px] tracking-[0.8em] text-gray-300 uppercase">Editorial Series  Galatamu</p>
          </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 p-5 rounded-full bg-black text-white shadow-2xl transition-all hover:scale-110">
          <Disc className={`w-5 h-5 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}
