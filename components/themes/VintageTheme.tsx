"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Gift, Send, Heart, MapPin, Printer } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";
import VideoPlayer from "../VideoPlayer";
import { generateGoogleCalendarLink, generateICalLink } from "@/lib/calendarHelper";
import { Video } from "lucide-react";

export default function VintageTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData; previewMode?: boolean; guestName?: string }) {
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

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={`min-h-screen bg-[#f1ede3] text-[#2c2c2c] font-serif selection:bg-[#2c2c2c] selection:text-white ${previewMode ? "relative" : ""}`}>
      {(data.bg_image || data.bg_middle || data.bg_bottom) && (
        <div className="absolute inset-0 pointer-events-none z-0 flex flex-col opacity-15">
          <div className="flex-1 relative overflow-hidden"><div className="sticky top-0 w-full h-screen bg-cover bg-center" style={data.bg_image ? { backgroundImage: `url('${data.bg_image}')` } : {}}></div></div>
          <div className="flex-1 relative overflow-hidden"><div className="sticky top-0 w-full h-screen bg-cover bg-center" style={data.bg_middle ? { backgroundImage: `url('${data.bg_middle}')` } : {}}></div></div>
          <div className="flex-1 relative overflow-hidden"><div className="sticky top-0 w-full h-screen bg-cover bg-center" style={data.bg_bottom ? { backgroundImage: `url('${data.bg_bottom}')` } : {}}></div></div>
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap');
        .font-paper { font-family: 'Old Standard TT', serif; }
        .font-display { font-family: 'Playfair Display', serif; }
        .paper-texture { background-image: url('https://www.transparenttextures.com/patterns/paper-fibers.png'); }
        .newspaper-border { border: 1px solid #000; border-width: 4px 1px 1px 1px; }
        .newspaper-double-border { border-top: 3px double #000; border-bottom: 3px double #000; }
      `}</style>

      {/*  ENVELOPE (COVER)  */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.8 }}
              className="fixed inset-0 z-50 bg-[#e8e4d9] paper-texture flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-[#fdfcf8] p-10 shadow-[20px_20px_60px_rgba(0,0,0,0.1)] newspaper-border text-center">
                 <p className="font-paper text-[10px] uppercase tracking-[0.4em] mb-8 border-b border-black pb-2">Volume I  Special Edition</p>
                 <h1 className="font-display text-5xl font-black mb-4">THE DAILY WEDDING</h1>
                 <p className="font-paper italic text-sm mb-12 border-y border-black py-1">Est. {new Date().getFullYear()}</p>
                 <div className="mb-12">
                    <p className="font-paper text-xs uppercase mb-2">Exclusive for</p>
                    <h2 className="font-display text-3xl italic font-bold">{guestName}</h2>
                 </div>
                 <button onClick={openInvitation}
                   className="w-full py-4 bg-black text-white font-paper uppercase text-xs tracking-widest hover:bg-[#333] transition-all flex items-center justify-center gap-3">
                   READ FULL STORY <Printer size={14} />
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-4 md:p-10 paper-texture">
          
          {/* Masthead */}
          <header className="text-center mb-10">
             <div className="flex justify-between items-end border-b-4 border-black pb-4 mb-2">
                <div className="text-left font-paper text-[10px] hidden md:block">
                   NO. 001 <br/> PRICE: YOUR BLESSING
                </div>
                <h1 className="font-display text-4xl md:text-8xl font-black tracking-tighter">THE DAILY WEDDING</h1>
                <div className="text-right font-paper text-[10px] hidden md:block">
                   {eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} <br/> WEATHER: ROMANTIC
                </div>
             </div>
             <div className="newspaper-double-border py-1 text-[10px] font-paper font-bold tracking-[0.5em] uppercase">
                {data.bride_data.groom} & {data.bride_data.bride} ARE GETTING MARRIED
             </div>
          </header>

          <div className="grid md:grid-cols-12 gap-8">
             {/* Main Content (Left) */}
             <div className="md:col-span-8 space-y-12">
                {/* Hero Feature */}
                <section>
                   <div className="relative aspect-video mb-6 border border-black p-1">
                      <img src={data.hero_image || "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&q=80"}
                        className="w-full h-full object-cover grayscale" />
                      <div className="absolute bottom-4 left-4 bg-white px-4 py-1 text-[10px] font-paper border border-black italic">
                         Exclusive Photo: The Happy Couple
                      </div>
                   </div>
                   <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">A Journey of Love: Two Hearts Finally Unite in Sacred Bond</h2>
                   <div className="flex gap-4 border-t border-black pt-4 mb-6 italic text-sm">
                      <span>By Galatamu Press</span>
                      <span></span>
                      <span>{data.event_data.akad_location}</span>
                   </div>
                   <p className="font-paper text-lg leading-relaxed text-justify first-letter:text-7xl first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                      {data.quote || "In a world full of noise, we found our silent harmony. Today, we stand before you to declare a commitment that has been blooming for years. This is not just a ceremony, but the beginning of a legacy built on trust and mutual adoration."}
                   </p>
                </section>

                {/* The Couple (Split Columns) */}
                <section className="grid md:grid-cols-2 gap-8 pt-10 border-t border-black">
                   <div>
                      <h3 className="font-display text-2xl font-bold mb-4 uppercase border-b-2 border-black inline-block">The Groom</h3>
                      <div className="aspect-square border border-black p-1 mb-4">
                         <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover grayscale" />
                      </div>
                      <p className="font-display text-xl font-bold">{data.bride_data.groom}</p>
                      <p className="font-paper text-sm italic opacity-70">Son of {data.bride_data.parents_groom}</p>
                   </div>
                   <div>
                      <h3 className="font-display text-2xl font-bold mb-4 uppercase border-b-2 border-black inline-block">The Bride</h3>
                      <div className="aspect-square border border-black p-1 mb-4">
                         <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover grayscale" />
                      </div>
                      <p className="font-display text-xl font-bold">{data.bride_data.bride}</p>
                      <p className="font-paper text-sm italic opacity-70">Daughter of {data.bride_data.parents_bride}</p>
                   </div>
                </section>

                {/* Love Story Timeline */}
                <section className="pt-10 border-t border-black">
                   <h3 className="font-display text-3xl font-bold mb-8">Timeline of Events</h3>
                   <div className="space-y-8">
                      {data.love_story?.map((s, i) => (
                         <div key={i} className="flex gap-6 pb-6 border-b border-black/10">
                            <span className="font-display text-3xl font-bold opacity-30">{s.year}</span>
                            <div>
                               <h4 className="font-display text-xl font-bold">{s.title}</h4>
                               <p className="font-paper text-sm leading-relaxed opacity-70">{s.desc}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </section>

                {/* Exclusive Video Feature */}
                {data.video && (
                  <section className="pt-10 border-t border-black">
                    <h3 className="font-display text-3xl font-bold mb-8 uppercase tracking-tighter">Exclusive Video Footage</h3>
                    <div className="border border-black p-1">
                      <VideoPlayer url={data.video} />
                    </div>
                    <p className="font-paper text-[10px] mt-2 italic text-center">Press Play to view the full documentary</p>
                  </section>
                )}
             </div>

             {/* Sidebar (Right) */}
             <aside className="md:col-span-4 space-y-12 border-l border-black pl-8">
                {/* Countdown Box */}
                <div className="bg-black text-white p-6 text-center">
                   <p className="font-paper text-[10px] uppercase mb-4 tracking-widest">Time Remaining</p>
                   <Countdown targetDate={eventDate} />
                </div>

                {/* Ceremony Details */}
                <div className="border border-black p-6 space-y-6">
                   <h4 className="font-display text-xl font-bold border-b border-black pb-2 text-center">OFFICIAL PROGRAM</h4>
                   <div>
                      <p className="font-paper text-[10px] font-bold uppercase mb-1">Holy Matrimony</p>
                      <p className="font-display font-bold">{data.event_data.akad_time}</p>
                      <p className="font-paper text-xs opacity-70">{data.event_data.akad_location}</p>
                      <a href={data.event_data.akad_map} className="text-[10px] underline font-bold mt-2 inline-block">MAPS.PDF</a>
                   </div>
                   <div className="border-t border-black pt-4">
                      <p className="font-paper text-[10px] font-bold uppercase mb-1">Reception</p>
                      <p className="font-display font-bold">{data.event_data.resepsi_time}</p>
                      <p className="font-paper text-xs opacity-70">{data.event_data.resepsi_location}</p>
                      <a href={data.event_data.resepsi_map} className="text-[10px] underline font-bold mt-2 inline-block">MAPS.PDF</a>
                   </div>
                </div>

                {/* Gift Registry */}
                <div className="space-y-4">
                   <h4 className="font-display text-xl font-bold uppercase">Classifieds: Gifts</h4>
                   {data.gifts?.map((g, i) => (
                      <div key={i} className="border-t border-black py-4">
                         <p className="font-paper text-[10px] font-bold mb-1">{g.bank.toUpperCase()}</p>
                         <p className="font-display text-lg tracking-widest">{g.acc}</p>
                         <p className="font-paper text-xs">A.N {g.name.toUpperCase()}</p>
                      </div>
                   ))}
                </div>

                {/* RSVP Advertisement */}
                <div className="border-4 border-black p-6 bg-[#fdfcf8] rotate-1 shadow-lg">
                   <h4 className="font-display text-2xl font-black text-center mb-4">RSVP NOW!</h4>
                   <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault();
                      if (previewMode) return;
                      setIsSubmitting(true);
                      const w: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                      try { const ok = await submitWish(data.slug || "", w); if (ok) { setWishes([...wishes, w]); setRsvpMessage(""); setRsvpPresence(""); } }
                      finally { setIsSubmitting(false); }
                   }}>
                      <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Name" className="w-full bg-transparent border-b border-black font-paper text-sm p-2 focus:outline-none" required />
                      <select value={rsvpPresence} onChange={e => setRsvpPresence(e.target.value)} className="w-full bg-transparent border-b border-black font-paper text-sm p-2 focus:outline-none" required>
                         <option value="">Confirmation</option>
                         <option value="hadir">Attending</option>
                         <option value="tidak">Absent</option>
                      </select>
                      <textarea rows={3} value={rsvpMessage} onChange={e => setRsvpMessage(e.target.value)} placeholder="Your message..." className="w-full bg-transparent border-b border-black font-paper text-sm p-2 focus:outline-none resize-none" required />
                      <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-black text-white font-paper text-xs font-bold uppercase">
                         {isSubmitting ? "SENDING..." : "SUBMIT RESPONSE"}
                      </button>
                   </form>
                </div>
             </aside>
          </div>

          {/* Full Width Gallery */}
          <section className="mt-20 pt-10 border-t-4 border-black">
             <h3 className="font-display text-4xl font-bold mb-10 text-center uppercase tracking-widest">Visual Archives</h3>
             <GalleryLightbox 
                images={data.gallery || []}
                title=""
                sectionClassName=""
                gridClassName="grid grid-cols-2 md:grid-cols-3 gap-2"
                itemClassName="aspect-square grayscale hover:grayscale-0 transition-all border border-black"
                imgClassName="w-full h-full object-cover"
             />
          </section>

          {/* Wishes Section (Letters to Editor) */}
          <section className="mt-20 pt-10 border-t border-black">
             <h3 className="font-display text-3xl font-bold mb-10 italic">Letters to the Couple</h3>
             <div className="grid md:grid-cols-2 gap-8">
                {wishes.slice(0, 8).map((w, i) => (
                   <div key={i} className="border-b border-black/20 pb-4">
                      <p className="font-display font-bold mb-1">{w.name} says:</p>
                      <p className="font-paper italic text-sm opacity-80 leading-relaxed">&ldquo;{w.message}&rdquo;</p>
                   </div>
                ))}
             </div>
          </section>

          {/* Footer */}
          <footer className="mt-20 pt-10 border-t-4 border-black text-center space-y-6 pb-20">
             <h2 className="font-display text-4xl md:text-6xl font-black">{data.bride_data.groom} & {data.bride_data.bride}</h2>
             <div className="newspaper-double-border py-2 text-[10px] font-paper font-bold uppercase max-w-xs mx-auto">
                END OF THIS EDITION
             </div>
             <p className="font-paper text-[9px] opacity-40 italic">PUBLISHED BY GALATAMU PRESS  ALL RIGHTS RESERVED 2024</p>
          </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-12 h-12 bg-black text-white flex items-center justify-center rounded-full shadow-2xl hover:scale-110 transition-all">
          <Disc className={`w-5 h-5 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}
