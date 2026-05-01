"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Gift, Send, Terminal, Cpu, Database, Activity, Code, MapPin, ExternalLink, Calendar } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";
import VideoPlayer from "../VideoPlayer";
import { generateGoogleCalendarLink, generateICalLink } from "@/lib/calendarHelper";
import { Video } from "lucide-react";

export default function ModernTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData; previewMode?: boolean; guestName?: string }) {
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
      audioRef.current = new Audio(data.music_url || "https://cdn.pixabay.com/download/audio/2022/10/30/audio_b5a19859f7.mp3?filename=lofi-study-112191.mp3");
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={`min-h-screen bg-[#050505] text-[#00ff41] font-mono selection:bg-[#00ff41] selection:text-black ${previewMode ? "relative" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&display=swap');
        .font-mono-tech { font-family: 'JetBrains Mono', monospace; }
        .glitch-text { text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff; }
        .scanline { width: 100%; height: 2px; background: rgba(0, 255, 65, 0.1); position: fixed; top: 0; left: 0; pointer-events: none; z-index: 100; animation: scan 8s linear infinite; }
        @keyframes scan { from { transform: translateY(0); } to { transform: translateY(100vh); } }
        .border-tech { border: 1px solid rgba(0, 255, 65, 0.2); }
        .bg-tech { background: rgba(0, 255, 65, 0.03); }
      `}</style>
      
      <div className="scanline" />

      {/*  BOOT SEQUENCE (COVER)  */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
              className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-8">
              <div className="max-w-md w-full border-tech p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-2 bg-[#00ff41]" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-[#00ff41]" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#00ff41]" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#00ff41]" />
                
                <FadeIn>
                  <p className="text-[10px] mb-4 opacity-50 tracking-widest font-mono-tech">[ SYSTEM BOOT: SUCCESS ]</p>
                  <h1 className="text-3xl font-bold mb-8 glitch-text font-mono-tech">PROTOCOL: WEDDING_{data.bride_data.groom.split(' ')[0].toUpperCase()}X{data.bride_data.bride.split(' ')[0].toUpperCase()}</h1>
                  <div className="space-y-2 mb-12 font-mono-tech">
                    <p className="text-[10px]">&gt; TARGET: {guestName.toUpperCase()}</p>
                    <p className="text-[10px]">&gt; LOCATION: DETECTING...</p>
                    <p className="text-[10px]">&gt; ACCESS: RESTRICTED</p>
                  </div>
                  <button onClick={openInvitation}
                    className="w-full py-4 border-tech bg-tech hover:bg-[#00ff41] hover:text-black transition-all text-xs tracking-[0.5em] font-bold font-mono-tech">
                    INITIALIZE ACCESS
                  </button>
                </FadeIn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-10 space-y-10 font-mono-tech">
          
          {/* HEADER SECTION */}
          <section className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 border-tech p-10 bg-tech relative group">
               <div className="flex justify-between items-start mb-10">
                  <Terminal size={16} />
                  <span className="text-[10px] opacity-40">U_ID: {data.slug || '000'}</span>
               </div>
               <FadeIn>
                  <h2 className="text-5xl md:text-8xl font-bold mb-8 leading-none">
                     {data.bride_data.groom.toUpperCase()}
                     <br/><span className="opacity-20">&amp;</span> {data.bride_data.bride.toUpperCase()}
                  </h2>
                  <p className="text-sm opacity-60 leading-relaxed max-w-xl">
                     WE ARE CONNECTING TWO SOULS INTO ONE NETWORK. JOIN US IN CELEBRATING THE MERGE OF OUR LIVES.
                  </p>
               </FadeIn>
            </div>
            <div className="border-tech p-10 flex flex-col justify-center items-center text-center space-y-8 bg-tech">
               <Cpu className="w-12 h-12 opacity-50 animate-pulse" />
               <div>
                  <p className="text-[10px] opacity-40 mb-4 uppercase tracking-[0.3em]">Countdown to event</p>
                  <Countdown targetDate={eventDate} />
               </div>
            </div>
          </section>

          {/* BIO SECTION */}
          <section className="grid md:grid-cols-2 gap-6">
             <FadeIn className="border-tech bg-tech p-10 relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-[10px] opacity-20 group-hover:opacity-100 transition-opacity">01_GROOM</div>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
                   <div className="w-40 h-40 border-tech grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-bold mb-2">{data.bride_data.groom.toUpperCase()}</h3>
                      <p className="text-xs opacity-50">ORIGIN: {data.bride_data.parents_groom.toUpperCase()}</p>
                   </div>
                </div>
             </FadeIn>
             <FadeIn className="border-tech bg-tech p-10 relative overflow-hidden group" delay={0.2}>
                <div className="absolute top-4 right-4 text-[10px] opacity-20 group-hover:opacity-100 transition-opacity">02_BRIDE</div>
                <div className="flex flex-col md:flex-row-reverse gap-8 items-center md:items-end">
                   <div className="w-40 h-40 border-tech grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" />
                   </div>
                   <div className="md:text-right">
                      <h3 className="text-2xl font-bold mb-2">{data.bride_data.bride.toUpperCase()}</h3>
                      <p className="text-xs opacity-50">ORIGIN: {data.bride_data.parents_bride.toUpperCase()}</p>
                   </div>
                </div>
             </FadeIn>
          </section>

          {/* LOGS SECTION (STORY) */}
          <section className="border-tech bg-tech p-10">
             <div className="flex items-center gap-4 mb-10">
                <Database size={20} />
                <h3 className="text-xl font-bold tracking-widest uppercase">System logs: Our_Story</h3>
             </div>
             <div className="space-y-6">
                {data.love_story?.map((log, i) => (
                   <FadeIn key={i} delay={i * 0.1} className="flex gap-6 items-start group">
                      <span className="text-[10px] opacity-30 mt-1">[{log.year}]</span>
                      <div className="flex-1 border-l border-[#00ff41]/20 pl-6 group-hover:border-[#00ff41] transition-all">
                         <h4 className="text-sm font-bold mb-2 uppercase tracking-tighter">{log.title}</h4>
                         <p className="text-xs opacity-50 leading-relaxed">{log.desc.toUpperCase()}</p>
                      </div>
                   </FadeIn>
                ))}
             </div>
          </section>

          {/* VISUAL_LOGS (VIDEO) */}
          {data.video && (
            <section className="border-tech bg-tech p-10">
              <div className="flex items-center gap-4 mb-10">
                <Video size={20} />
                <h3 className="text-xl font-bold tracking-widest uppercase">Visual_Logs.mp4</h3>
              </div>
              <VideoPlayer url={data.video} />
            </section>
          )}

          {/* EVENTS SECTION */}
          <section className="grid md:grid-cols-2 gap-6">
             <FadeIn className="border-tech p-10 bg-tech">
                <div className="flex items-center gap-4 mb-8">
                   <Activity size={18} />
                   <h4 className="text-sm font-bold uppercase tracking-widest">Protocol: Akad_Nikah</h4>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between text-xs"><span>TIME</span><span>{data.event_data.akad_time}</span></div>
                   <div className="flex justify-between text-xs"><span>LOC</span><span className="text-right">{data.event_data.akad_location.toUpperCase()}</span></div>
                </div>
                <a href={data.event_data.akad_map} target="_blank" className="mt-8 flex items-center justify-center gap-2 w-full py-3 border-tech text-[10px] hover:bg-[#00ff41] hover:text-black transition-all font-bold">
                   <MapPin size={12} /> INITIALIZE_MAPS
                </a>
             </FadeIn>
             <FadeIn className="border-tech p-10 bg-tech" delay={0.2}>
                <div className="flex items-center gap-4 mb-8">
                   <Activity size={18} />
                   <h4 className="text-sm font-bold uppercase tracking-widest">Protocol: Resepsi</h4>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between text-xs"><span>TIME</span><span>{data.event_data.resepsi_time}</span></div>
                   <div className="flex justify-between text-xs"><span>LOC</span><span className="text-right">{data.event_data.resepsi_location.toUpperCase()}</span></div>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-8">
                  <a href={data.event_data.resepsi_map} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 border-tech text-[10px] hover:bg-[#00ff41] hover:text-black transition-all font-bold tracking-widest">
                     <MapPin size={12} /> INITIALIZE_MAPS
                  </a>
                  <div className="flex gap-2">
                    <a href={generateGoogleCalendarLink(`Wedding of ${data.bride_data.groom} & ${data.bride_data.bride}`, data.event_data.date, data.event_data.resepsi_location)} target="_blank" className="flex-1 flex items-center justify-center py-2 border-tech text-[8px] hover:bg-[#00ff41] hover:text-black transition-all font-bold">
                       SYNC_GOOGLE
                    </a>
                    <a href={generateICalLink(`Wedding of ${data.bride_data.groom} & ${data.bride_data.bride}`, data.event_data.date, data.event_data.resepsi_location)} className="flex-1 flex items-center justify-center py-2 border-tech text-[8px] hover:bg-[#00ff41] hover:text-black transition-all font-bold">
                       SYNC_ICAL
                    </a>
                  </div>
                </div>
             </FadeIn>
          </section>

          {/* REMOTE_CONNECTION (LIVE) */}
          {data.event_data.live_stream && (
            <FadeIn className="border-tech bg-tech p-10 text-center">
              <h4 className="text-[10px] opacity-40 mb-6 tracking-[0.5em]">REMOTE_ACCESS_AVAILABLE</h4>
              <a href={data.event_data.live_stream} target="_blank" className="inline-flex items-center gap-3 px-8 py-4 bg-[#00ff41] text-black font-bold text-xs tracking-[0.3em] hover:bg-black hover:text-[#00ff41] border border-[#00ff41] transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)]">
                <Video size={16} /> ESTABLISH_LIVE_CONNECTION
              </a>
            </FadeIn>
          )}

          {/* GALLERY SECTION */}
          <section className="border-tech bg-tech p-10">
             <div className="flex items-center gap-4 mb-10">
                <Code size={20} />
                <h3 className="text-xl font-bold tracking-widest uppercase">Visual_Data.zip</h3>
             </div>
             <GalleryLightbox 
                images={data.gallery || []}
                title=""
                sectionClassName=""
                gridClassName="grid grid-cols-2 md:grid-cols-4 gap-4"
                itemClassName="aspect-square border-tech overflow-hidden grayscale hover:grayscale-0 transition-all duration-700"
                imgClassName="w-full h-full object-cover"
             />
          </section>

          {/* RSVP SECTION */}
          <section className="grid md:grid-cols-2 gap-6">
             <div className="border-tech p-10 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-6 glitch-text">TRANSMIT_WISHES</h3>
                <p className="text-xs opacity-40 leading-relaxed mb-10">
                   PLEASE PROVIDE YOUR INPUT DATA TO COMPLETE THE TRANSMISSION. YOUR WISHES WILL BE STORED IN OUR PERMANENT MEMORY.
                </p>
                <div className="space-y-4 opacity-20">
                   <div className="h-1 bg-[#00ff41] w-full" />
                   <div className="h-1 bg-[#00ff41] w-2/3" />
                   <div className="h-1 bg-[#00ff41] w-1/3" />
                </div>
             </div>
             <FadeIn className="border-tech p-10 bg-tech">
                <form className="space-y-6" onSubmit={async (e) => {
                   e.preventDefault();
                   if (previewMode) return;
                   setIsSubmitting(true);
                   const w: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                   try { const ok = await submitWish(data.slug || "", w); if (ok) { setWishes([...wishes, w]); setRsvpMessage(""); setRsvpPresence(""); } }
                   finally { setIsSubmitting(false); }
                }}>
                   <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="IDENT_NAME" className="w-full bg-black border-tech px-4 py-4 focus:outline-none focus:bg-tech text-xs text-[#00ff41]" required />
                   <select value={rsvpPresence} onChange={e => setRsvpPresence(e.target.value)} className="w-full bg-black border-tech px-4 py-4 focus:outline-none focus:bg-tech text-xs text-[#00ff41]" required>
                      <option value="">STATUS_PRESENCE</option>
                      <option value="hadir">CONFIRMED: ONLINE</option>
                      <option value="tidak">CONFIRMED: OFFLINE</option>
                   </select>
                   <textarea rows={4} value={rsvpMessage} onChange={e => setRsvpMessage(e.target.value)} placeholder="MESSAGE_DATA" className="w-full bg-black border-tech px-4 py-4 focus:outline-none focus:bg-tech text-xs resize-none text-[#00ff41]" required></textarea>
                   <button type="submit" disabled={isSubmitting} className="w-full py-4 border-tech bg-tech hover:bg-[#00ff41] hover:text-black transition-all text-[10px] font-bold tracking-[0.4em]">
                      {isSubmitting ? "TRANSMITTING..." : "PUSH_DATA"}
                   </button>
                </form>
             </FadeIn>
          </section>

          {/* WISHES DISPLAY */}
          <section className="border-tech bg-tech p-10">
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishes.slice(0, 9).map((w, i) => (
                   <div key={i} className="border-tech p-6 text-[10px] space-y-4">
                      <div className="flex justify-between items-start">
                         <span className="font-bold opacity-80">{w.name.toUpperCase()}</span>
                         <span className="opacity-40">{w.presence === 'hadir' ? 'ONLINE' : 'OFFLINE'}</span>
                      </div>
                      <p className="opacity-50 italic leading-relaxed">&gt; {w.message.toUpperCase()}</p>
                   </div>
                ))}
             </div>
          </section>

          {/* FOOTER */}
          <footer className="border-tech p-10 text-center space-y-4 bg-tech">
             <p className="text-[10px] opacity-30">END_OF_TRANSMISSION</p>
             <h2 className="text-2xl font-bold tracking-[0.5em]">{data.bride_data.groom.toUpperCase()} &amp; {data.bride_data.bride.toUpperCase()}</h2>
             <p className="text-[8px] opacity-20 italic"> GALATAMU_CORE_OS_v2.0.4</p>
          </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-12 h-12 border-tech bg-black flex items-center justify-center hover:bg-[#00ff41] hover:text-black transition-all">
          <Disc className={`w-5 h-5 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}
