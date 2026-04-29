"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Gift, Send, ArrowRight } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./AmaraTheme";
import GalleryLightbox from "../GalleryLightbox";

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
      audioRef.current = new Audio(data.music_url || "https://cdn.pixabay.com/download/audio/2022/11/06/audio_f5eb8dfcb7.mp3?filename=beautiful-wedding-125026.mp3");
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();
  const groomFirst = data.bride_data.groom.split(" ")[0] || "Groom";
  const brideFirst = data.bride_data.bride.split(" ")[0] || "Bride";

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-white ${previewMode ? "relative" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Bebas+Neue&display=swap');
        .font-bebas { font-family: 'Bebas Neue', Impact, sans-serif; letter-spacing: 0.02em; }
        .font-grotesk { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .accent-line { height: 3px; background: #ff6b6b; }
        .big-num { font-family: 'Bebas Neue', Impact, sans-serif; font-size: clamp(5rem,18vw,16rem); line-height: 0.9; color: rgba(255,255,255,0.04); position: absolute; top: -20px; left: -10px; pointer-events: none; user-select: none; }
        .scroll-gallery { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px; scroll-snap-type: x mandatory; }
        .scroll-gallery::-webkit-scrollbar { height: 3px; }
        .scroll-gallery::-webkit-scrollbar-track { background: #1a1a1a; }
        .scroll-gallery::-webkit-scrollbar-thumb { background: #ff6b6b; }
        .scroll-item { flex: 0 0 280px; scroll-snap-align: start; }
      `}</style>

      {/* ── COVER ── */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.8 }}
              className="fixed inset-0 z-50 bg-[#0a0a0a] flex overflow-hidden">
              {/* Left half — huge text */}
              <div className="flex-1 flex flex-col justify-center pl-8 md:pl-16 relative">
                <div className="accent-line w-16 mb-8" />
                <p className="font-grotesk text-[10px] tracking-[0.6em] uppercase text-white/30 mb-6">You Are Invited</p>
                <div className="font-bebas text-[18vw] md:text-[12vw] leading-none text-white overflow-hidden">
                  <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.16,1,0.3,1] }}>{groomFirst}</motion.div>
                </div>
                <div className="font-grotesk text-lg text-white/30 my-2 pl-1">×</div>
                <div className="font-bebas text-[18vw] md:text-[12vw] leading-none text-[#ff6b6b] overflow-hidden">
                  <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.16,1,0.3,1] }}>{brideFirst}</motion.div>
                </div>
                <div className="mt-8 font-grotesk text-xs text-white/30 tracking-widest">
                  {eventDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
                </div>
              </div>
              {/* Right half — photo */}
              <div className="hidden md:block w-[40%] relative overflow-hidden">
                <img src={data.hero_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80"}
                  alt="Cover" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />
              </div>
              {/* CTA */}
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                onClick={openInvitation}
                className="absolute bottom-10 left-8 md:left-16 flex items-center gap-3 font-grotesk text-xs tracking-[0.3em] uppercase text-white/60 hover:text-white group transition-all">
                <span className="w-12 h-px bg-white/30 group-hover:w-20 group-hover:bg-[#ff6b6b] transition-all duration-500" />
                Open Invitation
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
              <p className="font-grotesk absolute bottom-10 right-8 text-[10px] text-white/20 tracking-widest">{guestName}</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>

          {/* ── HERO ── */}
          <section className="min-h-screen flex overflow-hidden relative">
            {/* Left: giant name */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-24 relative z-10">
              <div className="accent-line w-12 mb-10" />
              <p className="font-grotesk text-[10px] tracking-[0.6em] uppercase text-white/30 mb-4">The Wedding Of</p>
              <h2 className="font-bebas text-[15vw] md:text-[10vw] leading-none text-white">{groomFirst}</h2>
              <div className="font-grotesk text-2xl text-[#ff6b6b] my-1 font-light">&times;</div>
              <h2 className="font-bebas text-[15vw] md:text-[10vw] leading-none text-[#ff6b6b]">{brideFirst}</h2>
              <div className="mt-10 max-w-xs">
                <Countdown targetDate={eventDate} />
              </div>
              <p className="font-grotesk mt-6 text-xs text-white/30 tracking-widest">
                {eventDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
              </p>
            </div>
            {/* Right: full-bleed photo */}
            <div className="hidden md:block w-[45%] relative overflow-hidden">
              <img src={data.hero_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80"}
                alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
            </div>
          </section>

          {/* ── COUPLE ── alternating strips */}
          <section>
            {/* Groom strip */}
            <FadeIn>
              <div className="relative flex items-stretch overflow-hidden border-t border-white/5">
                <div className="font-bebas absolute text-[12vw] text-white/[0.03] top-0 left-4">01</div>
                <div className="w-1/2 md:w-1/3 aspect-square overflow-hidden flex-shrink-0">
                  <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"}
                    alt="Groom" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700" />
                </div>
                <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12">
                  <div className="accent-line w-8 mb-6" />
                  <p className="font-grotesk text-[10px] tracking-[0.5em] uppercase text-white/30 mb-2">The Groom</p>
                  <h3 className="font-bebas text-4xl md:text-6xl text-white mb-2">{data.bride_data.groom}</h3>
                  <p className="font-grotesk text-sm text-white/40">Son of {data.bride_data.parents_groom}</p>
                </div>
              </div>
            </FadeIn>
            {/* Bride strip — reversed */}
            <FadeIn delay={0.1}>
              <div className="relative flex items-stretch overflow-hidden flex-row-reverse border-t border-white/5">
                <div className="font-bebas absolute text-[12vw] text-white/[0.03] top-0 right-4">02</div>
                <div className="w-1/2 md:w-1/3 aspect-square overflow-hidden flex-shrink-0">
                  <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"}
                    alt="Bride" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700" />
                </div>
                <div className="flex-1 flex flex-col justify-center items-end text-right px-8 md:px-16 py-12">
                  <div className="accent-line w-8 mb-6 ml-auto" />
                  <p className="font-grotesk text-[10px] tracking-[0.5em] uppercase text-white/30 mb-2">The Bride</p>
                  <h3 className="font-bebas text-4xl md:text-6xl text-[#ff6b6b] mb-2">{data.bride_data.bride}</h3>
                  <p className="font-grotesk text-sm text-white/40">Daughter of {data.bride_data.parents_bride}</p>
                </div>
              </div>
            </FadeIn>
          </section>

          {/* ── LOVE STORY ── numbered sections */}
          {data.love_story && data.love_story.length > 0 && (
            <section className="py-24 px-8 md:px-16 border-t border-white/5">
              <FadeIn className="mb-16">
                <div className="accent-line w-12 mb-4" />
                <h3 className="font-bebas text-5xl text-white">Our Story</h3>
              </FadeIn>
              <div className="space-y-0">
                {data.love_story.map((s, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="relative py-10 border-b border-white/5 flex gap-8 md:gap-16 items-start group hover:bg-white/[0.02] transition px-4">
                      <span className="font-bebas text-6xl text-white/10 group-hover:text-[#ff6b6b]/30 transition-colors w-16 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <p className="font-grotesk text-xs text-[#ff6b6b] tracking-widest mb-1">{s.year}</p>
                        <h4 className="font-bebas text-2xl text-white mb-2">{s.title}</h4>
                        <p className="font-grotesk text-sm text-white/40 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </section>
          )}

          {/* ── QUOTE ── */}
          {data.quote && (
            <section className="py-24 px-8 md:px-16 bg-[#ff6b6b] text-[#0a0a0a]">
              <FadeIn className="max-w-3xl">
                <div className="font-bebas text-9xl text-[#0a0a0a]/10 leading-none mb-0">"</div>
                <p className="font-grotesk text-xl md:text-2xl font-light leading-relaxed -mt-8">{data.quote}</p>
              </FadeIn>
            </section>
          )}

          {/* ── ACARA ── bold numbered */}
          <section className="border-t border-white/5">
            {[
              { num: "01", label: "Holy Matrimony", time: data.event_data.akad_time, loc: data.event_data.akad_location, map: data.event_data.akad_map },
              { num: "02", label: "Reception", time: data.event_data.resepsi_time, loc: data.event_data.resepsi_location, map: data.event_data.resepsi_map },
            ].map((ev, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex items-center gap-8 px-8 md:px-16 py-12 border-b border-white/5 group hover:bg-white/[0.02] transition">
                  <span className="font-bebas text-7xl text-[#ff6b6b]/20 group-hover:text-[#ff6b6b]/50 transition w-24 flex-shrink-0">{ev.num}</span>
                  <div className="flex-1">
                    <p className="font-grotesk text-[10px] tracking-[0.5em] uppercase text-white/30 mb-1">{ev.label}</p>
                    <h4 className="font-bebas text-3xl text-white mb-1">{ev.time}</h4>
                    <p className="font-grotesk text-sm text-white/40">{ev.loc}</p>
                  </div>
                  <a href={ev.map || "#"} target="_blank"
                    className="font-grotesk text-[10px] tracking-widest uppercase text-[#ff6b6b] border border-[#ff6b6b]/30 px-6 py-3 hover:bg-[#ff6b6b] hover:text-[#0a0a0a] transition flex items-center gap-2">
                    Maps <ArrowRight size={12} />
                  </a>
                </div>
              </FadeIn>
            ))}
          </section>

          {/* ── GALLERY — horizontal scroll ── */}
          {data.gallery && data.gallery.filter(img => img).length > 0 && (
            <section className="py-16 border-t border-white/5">
              <div className="px-8 md:px-16 mb-8">
                <FadeIn>
                  <div className="accent-line w-12 mb-4" />
                  <h3 className="font-bebas text-5xl text-white">Gallery</h3>
                </FadeIn>
              </div>
              <FadeIn className="px-8 md:px-16">
                <div className="scroll-gallery">
                  {data.gallery.filter(img => img).map((img, i) => (
                    <div key={i} className="scroll-item aspect-[3/4] overflow-hidden flex-shrink-0 group cursor-pointer">
                      <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 grayscale group-hover:grayscale-0" />
                    </div>
                  ))}
                </div>
              </FadeIn>
            </section>
          )}

          {/* ── VIDEO ── */}
          {data.video && (
            <section className="py-16 px-8 md:px-16 border-t border-white/5">
              <FadeIn>
                <div className="accent-line w-12 mb-8" />
                <h3 className="font-bebas text-5xl text-white mb-10">Film</h3>
                <div className="aspect-video overflow-hidden border border-white/5">
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${data.video.includes("v=") ? data.video.split("v=")[1].split("&")[0] : data.video.split("/").pop()}`} frameBorder="0" allowFullScreen />
                </div>
              </FadeIn>
            </section>
          )}

          {/* ── GIFT ── */}
          {data.gifts && data.gifts.length > 0 && (
            <section className="py-16 px-8 md:px-16 border-t border-white/5">
              <FadeIn>
                <div className="accent-line w-12 mb-4" />
                <div className="flex items-center gap-4 mb-10">
                  <h3 className="font-bebas text-5xl text-white">Gift</h3>
                  <Gift className="text-[#ff6b6b]" size={28} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {data.gifts.map((g, i) => (
                    <div key={i} className="border border-white/10 p-8 hover:border-[#ff6b6b]/40 transition group">
                      <p className="font-grotesk text-[10px] tracking-widest uppercase text-[#ff6b6b] mb-3">{g.bank}</p>
                      <p className="font-bebas text-3xl text-white mb-1">{g.acc}</p>
                      <p className="font-grotesk text-xs text-white/30">a.n {g.name}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </section>
          )}

          {/* ── RSVP ── */}
          <section className="py-16 px-8 md:px-16 bg-[#111] border-t border-white/5">
            <div className="max-w-xl">
              <FadeIn>
                <div className="accent-line w-12 mb-4" />
                <h3 className="font-bebas text-5xl text-white mb-10">RSVP</h3>
                <form className="space-y-0" onSubmit={async (e) => {
                  e.preventDefault();
                  if (previewMode) return alert("Preview mode.");
                  if (!data.slug) return;
                  setIsSubmitting(true);
                  const w: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                  try { const ok = await submitWish(data.slug, w); if (ok) { setWishes([...wishes, w]); setRsvpMessage(""); setRsvpPresence(""); alert("Sent!"); } }
                  finally { setIsSubmitting(false); }
                }}>
                  {[
                    { ph: "Your Name", val: rsvpName, set: setRsvpName, type: "text" },
                  ].map((f, i) => (
                    <input key={i} type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                      placeholder={f.ph} required
                      className="w-full px-0 py-5 bg-transparent border-b border-white/10 font-grotesk text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff6b6b] transition" />
                  ))}
                  <select value={rsvpPresence} onChange={e => setRsvpPresence(e.target.value)} required
                    className="w-full px-0 py-5 bg-transparent border-b border-white/10 font-grotesk text-sm text-white focus:outline-none focus:border-[#ff6b6b] transition">
                    <option value="" className="bg-[#111]">Will you attend?</option>
                    <option value="hadir" className="bg-[#111]">Yes, I will be there</option>
                    <option value="tidak" className="bg-[#111]">Regretfully decline</option>
                  </select>
                  <textarea rows={3} value={rsvpMessage} onChange={e => setRsvpMessage(e.target.value)} placeholder="Your message" required
                    className="w-full px-0 py-5 bg-transparent border-b border-white/10 font-grotesk text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff6b6b] transition resize-none" />
                  <button type="submit" disabled={isSubmitting}
                    className="mt-8 flex items-center gap-3 font-grotesk text-xs tracking-[0.4em] uppercase text-[#ff6b6b] hover:gap-6 transition-all group">
                    <span>{isSubmitting ? "Sending..." : "Submit"}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </form>
              </FadeIn>
              {wishes.length > 0 && (
                <div className="mt-16 space-y-8">
                  <div className="accent-line w-8" />
                  {[...wishes].reverse().map((w, i) => (
                    <div key={i} className="border-b border-white/5 pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bebas text-xl text-white">{w.name}</span>
                        <span className="font-grotesk text-[10px] text-[#ff6b6b] tracking-widest">{w.presence === "hadir" ? "ATTENDING" : "ABSENT"}</span>
                      </div>
                      <p className="font-grotesk text-sm text-white/40">&ldquo;{w.message}&rdquo;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="py-20 px-8 md:px-16 bg-[#0a0a0a] flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-t border-white/5">
            <div>
              <div className="accent-line w-12 mb-4" />
              <h2 className="font-bebas text-5xl md:text-7xl text-white leading-none">{groomFirst} <span className="text-[#ff6b6b]">&times;</span> {brideFirst}</h2>
            </div>
            <p className="font-grotesk text-[10px] text-white/20 tracking-widest">— GALATAMU —</p>
          </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-[#ff6b6b] flex items-center justify-center text-white hover:bg-white hover:text-[#0a0a0a] transition-all shadow-lg">
          <Disc className={`w-5 h-5 ${isPlaying ? "animate-[spin_3s_linear_infinite]" : ""}`} />
        </button>
      )}
    </div>
  );
}
