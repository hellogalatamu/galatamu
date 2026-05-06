"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Heart, ArrowRight, Video } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";
import DigitalEnvelope from "../DigitalEnvelope";
import VideoPlayer from "../VideoPlayer";
import { generateGoogleCalendarLink, generateICalLink } from "@/lib/calendarHelper";
import { getFontStyle } from "@/lib/fontStyles";

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
      audioRef.current = new Audio(data.music_url || "/music/wedding.mp3");
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={`bg-white min-h-screen text-black font-sans selection:bg-black selection:text-white ${previewMode ? 'relative' : ''}`}>
      {(data.bg_image || data.bg_middle || data.bg_bottom) && (
        <div className="absolute inset-0 pointer-events-none z-0 flex flex-col opacity-15">
          <div className="flex-1 relative overflow-hidden"><div className="sticky top-0 w-full h-screen bg-cover bg-center" style={data.bg_image ? { backgroundImage: `url('${data.bg_image}')` } : {}}></div></div>
          <div className="flex-1 relative overflow-hidden"><div className="sticky top-0 w-full h-screen bg-cover bg-center" style={data.bg_middle ? { backgroundImage: `url('${data.bg_middle}')` } : {}}></div></div>
          <div className="flex-1 relative overflow-hidden"><div className="sticky top-0 w-full h-screen bg-cover bg-center" style={data.bg_bottom ? { backgroundImage: `url('${data.bg_bottom}')` } : {}}></div></div>
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
        ${getFontStyle(data.font_style) ? `@import url('${getFontStyle(data.font_style)!.googleUrl}');` : ''}
        .font-ultra { font-family: 'Inter', sans-serif; }
        .font-playfair { font-family: ${getFontStyle(data.font_style)?.fontFamily ?? "'Playfair Display', serif"}; }
        .tracking-ultra { letter-spacing: 0.8em; }
      
        ${data.fonts?.bride_name || data.font_style ? `@import url('${getFontStyle(data.fonts?.bride_name || data.font_style)?.googleUrl}');` : ''}
        ${data.fonts?.parents_name ? `@import url('${getFontStyle(data.fonts.parents_name)?.googleUrl}');` : ''}
        ${data.fonts?.event_details ? `@import url('${getFontStyle(data.fonts.event_details)?.googleUrl}');` : ''}
        ${data.fonts?.quote ? `@import url('${getFontStyle(data.fonts.quote)?.googleUrl}');` : ''}
        .font-bride { font-family: ${data.fonts?.bride_name || data.font_style ? `'${getFontStyle(data.fonts?.bride_name || data.font_style)?.fontFamily}'` : "inherit"} !important; }
        .font-parents { font-family: ${data.fonts?.parents_name ? `'${getFontStyle(data.fonts.parents_name)?.fontFamily}'` : "inherit"} !important; }
        .font-event { font-family: ${data.fonts?.event_details ? `'${getFontStyle(data.fonts.event_details)?.fontFamily}'` : "inherit"} !important; }
        .font-quote { font-family: ${data.fonts?.quote ? `'${getFontStyle(data.fonts.quote)?.fontFamily}'` : "inherit"} !important; }
  `}</style>

      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-10 text-center">
              <FadeIn>
                <p className="font-ultra text-[10px] tracking-ultra uppercase mb-20 text-gray-400">MEMORANDUM OF UNION</p>
                <h1 className="font-playfair text-6xl md:text-8xl italic font-light mb-24 leading-none">
                  {data.bride_data.groom.split(' ')[0]} <br/> <span className="text-gray-200">&amp;</span> <br/> {data.bride_data.bride.split(' ')[0]}
                </h1>
                <p className="font-ultra text-[11px] tracking-widest mb-20 text-gray-500">FOR {guestName.toUpperCase()}</p>
                <button onClick={openInvitation}
                  className="group flex items-center gap-4 font-ultra text-[10px] tracking-[0.5em] uppercase hover:gap-8 transition-all">
                  Open Undangan <ArrowRight size={14} />
                </button>
              </FadeIn>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto px-6 md:px-10 pb-40">
          
          {/* Section 1: Hero */}
          <section className="min-h-screen flex flex-col justify-center py-20">
             <FadeIn>
                <p className="font-ultra text-[9px] tracking-ultra mb-12 text-gray-400">ESTABLISHED {eventDate.getFullYear()}</p>
                <h2 className="font-playfair text-7xl md:text-[10rem] leading-none italic mb-20">
                   {data.bride_data.groom} <br/> <span className="text-gray-100">&amp;</span> {data.bride_data.bride}
                </h2>
                <div className="flex flex-col md:flex-row md:items-end gap-12">
                   <p className="font-playfair text-3xl italic">{eventDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                   <div className="md:mb-1">
                      <Countdown targetDate={eventDate} />
                   </div>
                </div>
             </FadeIn>
          </section>

          {/* Section 2: Profiles */}
          <section className="py-40 grid md:grid-cols-2 gap-20">
             <FadeIn>
                <div className="aspect-[4/5] bg-gray-50 mb-10 overflow-hidden grayscale brightness-110">
                   <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-ultra text-[10px] tracking-ultra uppercase mb-4 font-bold">The Groom</h3>
                <p className="font-playfair text-4xl italic mb-6">{data.bride_data.groom}</p>
                <p className="font-ultra text-xs text-gray-400 leading-relaxed max-w-xs">{data.bride_data.parents_groom}</p>
             </FadeIn>
             <FadeIn delay={0.2} className="md:mt-40">
                <div className="aspect-[4/5] bg-gray-50 mb-10 overflow-hidden grayscale brightness-110">
                   <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-ultra text-[10px] tracking-ultra uppercase mb-4 font-bold">The Bride</h3>
                <p className="font-playfair text-4xl italic mb-6">{data.bride_data.bride}</p>
                <p className="font-ultra text-xs text-gray-400 leading-relaxed max-w-xs">{data.bride_data.parents_bride}</p>
             </FadeIn>
          </section>

          {/* Section 3: Events */}
          <section className="py-40 border-t border-gray-100">
             <div className="grid md:grid-cols-2 gap-20">
                <FadeIn>
                   <p className="font-ultra text-[10px] tracking-ultra uppercase mb-12 text-gray-300">01. Ceremony</p>
                   <p className="font-playfair text-5xl italic mb-8">{data.event_data.akad_time}</p>
                   <p className="font-ultra text-sm text-gray-500 leading-relaxed mb-12 max-w-xs">{data.event_data.akad_location}</p>
                   <a href={data.event_data.akad_map} className="font-ultra text-[10px] border-b border-black pb-1 tracking-widest hover:border-gray-200 transition-all">LOCATION</a>
                </FadeIn>
                <FadeIn delay={0.2}>
                   <p className="font-ultra text-[10px] tracking-ultra uppercase mb-12 text-gray-300">02. Reception</p>
                   <p className="font-playfair text-5xl italic mb-8">{data.event_data.resepsi_time}</p>
                   <p className="font-ultra text-sm text-gray-500 leading-relaxed mb-12 max-w-xs">{data.event_data.resepsi_location}</p>
                   <div className="flex flex-wrap gap-x-8 gap-y-4">
                     <a href={data.event_data.resepsi_map} className="font-ultra text-[10px] border-b border-black pb-1 tracking-widest hover:border-gray-200 transition-all">LOCATION</a>
                     <a 
                       href={generateGoogleCalendarLink(`Wedding of ${data.bride_data.groom} & ${data.bride_data.bride}`, data.event_data.date, data.event_data.resepsi_location)} 
                       target="_blank"
                       className="font-ultra text-[10px] border-b border-gray-100 pb-1 tracking-widest hover:border-black transition-all text-gray-400"
                     >
                       GOOGLE CALENDAR
                     </a>
                     <a 
                       href={generateICalLink(`Wedding of ${data.bride_data.groom} & ${data.bride_data.bride}`, data.event_data.date, data.event_data.resepsi_location)}
                       className="font-ultra text-[10px] border-b border-gray-100 pb-1 tracking-widest hover:border-black transition-all text-gray-400"
                     >
                       ICAL
                     </a>
                   </div>
                </FadeIn>
             </div>

             {data.event_data.live_stream && (
               <FadeIn className="mt-20 text-center">
                 <a href={data.event_data.live_stream} target="_blank" className="font-ultra text-[11px] tracking-[0.6em] uppercase hover:opacity-50 transition-all flex items-center justify-center gap-4">
                   <Video size={14} /> Live Stream
                 </a>
               </FadeIn>
             )}
          </section>

          {/* Section 4: Gallery */}
          <section className="py-40">
             <h3 className="font-playfair text-6xl italic mb-20">Visuals</h3>
             <GalleryLightbox 
                images={data.gallery || []}
                title=""
                sectionClassName=""
                gridClassName="grid grid-cols-1 md:grid-cols-2 gap-4"
                itemClassName="aspect-video grayscale hover:grayscale-0 transition-all duration-700 bg-gray-50"
                imgClassName="w-full h-full object-cover"
             />
             
             {data.video && (
                <div className="mt-20">
                  <p className="font-ultra text-[10px] tracking-ultra mb-12 text-gray-400 text-center uppercase">Motion</p>
                  <VideoPlayer url={data.video} />
                </div>
              )}
          </section>

{/* Section 5: Gifts */}
          <section className="py-32 px-6 text-center">
            <DigitalEnvelope
              gifts={data.gifts}
              gift_address={data.gift_address}
              primaryColor="#111827"
              bgColor="#ffffff"
              textColor="#111827"
              envelopeStyle="light"
              titleClassName="text-3xl tracking-[0.2em] uppercase font-light"
              subtitleClassName="hidden"
            />
          </section>
          {/* Section 6: RSVP */}
          <section className="py-40 border-t border-gray-100">
             <div className="max-w-xl mx-auto">
                <p className="font-ultra text-[10px] tracking-ultra uppercase mb-20 text-gray-300 text-center">CONFIRMATION</p>
                <form className="space-y-12 mb-32" onSubmit={async (e) => {
                   e.preventDefault();
                   if (previewMode) return;
                   setIsSubmitting(true);
                   const w: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                   try { const ok = await submitWish(data.slug || "", w); if (ok) { setWishes([...wishes, w]); setRsvpMessage(""); setRsvpPresence(""); } }
                   finally { setIsSubmitting(false); }
                }}>
                   <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="NAME" className="w-full bg-transparent border-b border-gray-100 py-6 font-ultra text-[10px] tracking-widest focus:outline-none focus:border-black" required />
                   <select value={rsvpPresence} onChange={e => setRsvpPresence(e.target.value)} className="w-full bg-transparent border-b border-gray-100 py-6 font-ultra text-[10px] tracking-widest focus:outline-none focus:border-black" required>
                      <option value="">PRESENCE</option>
                      <option value="hadir">WILL ATTEND</option>
                      <option value="tidak">WILL NOT ATTEND</option>
                   </select>
                   <textarea rows={4} value={rsvpMessage} onChange={e => setRsvpMessage(e.target.value)} placeholder="WISHES" className="w-full bg-transparent border-b border-gray-100 py-6 font-ultra text-[10px] tracking-widest focus:outline-none focus:border-black resize-none" required></textarea>
                   <button type="submit" disabled={isSubmitting} className="w-full py-8 bg-black text-white font-ultra text-[10px] tracking-ultra uppercase hover:bg-gray-800 transition-all">
                      {isSubmitting ? "SENDING..." : "SUBMIT"}
                   </button>
                </form>

                <div className="space-y-16">
                   {wishes.slice(0, 5).map((w, i) => (
                      <div key={i} className="pb-12 border-b border-gray-50">
                         <div className="flex justify-between items-center mb-6">
                            <span className="font-playfair text-2xl italic">{w.name}</span>
                            <span className="font-ultra text-[8px] tracking-widest text-gray-300">{w.presence === 'hadir' ? 'YES' : 'NO'}</span>
                         </div>
                         <p className="font-ultra text-xs text-gray-400 italic leading-relaxed tracking-wider">&quot;{w.message}&quot;</p>
                        {w.reply && (
                          <div className="mt-3 p-3 bg-white/5 border border-current/10 rounded-xl relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-30 rounded-l-xl"></div>
                            <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Balasan Mempelai</p>
                            <p className="text-sm opacity-90">{w.reply}</p>
                          </div>
                        )}
                      </div>
                   ))}
                </div>
             </div>
          </section>

          {/* Footer */}
          <footer className="py-40 text-center">
             <p className="font-ultra text-[8px] tracking-ultra text-gray-200"> ULTRA MINIMAL SERIES  GALATAMU</p>
          </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:scale-110 transition-all">
          <Disc className={`w-5 h-5 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}
