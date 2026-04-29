"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Gift, Send, Crown } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./AmaraTheme";
import GalleryLightbox from "../GalleryLightbox";

export default function RoyalTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData; previewMode?: boolean; guestName?: string }) {
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
      audioRef.current = new Audio(data.music_url || "https://cdn.pixabay.com/download/audio/2021/11/17/audio_0974b9f5e3.mp3?filename=orchestra-wedding-1153.mp3");
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={`min-h-screen bg-[#06060f] text-[#e8d5a3] ${previewMode ? "relative" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Cinzel:wght@400;600;700&display=swap');
        .font-cinzel { font-family: 'Cinzel', 'Times New Roman', serif; letter-spacing: 0.12em; }
        .font-cormorant { font-family: 'Cormorant Garamond', Georgia, serif; }
        .gold-line { background: linear-gradient(90deg, transparent, #c8973e, transparent); height: 1px; }
        .royal-bg { background: radial-gradient(ellipse at top, #12102a 0%, #06060f 70%); }
        .baroque-corner::before, .baroque-corner::after { content: ''; position: absolute; border: 1px solid rgba(200,151,62,0.25); }
        .baroque-corner::before { top: 8px; left: 8px; right: 8px; bottom: 8px; }
        .baroque-corner::after { top: 16px; left: 16px; right: 16px; bottom: 16px; }
      `}</style>

      {/* COVER */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
              className="fixed inset-0 z-50 royal-bg overflow-hidden flex">
              {/* Left — full photo */}
              <div className="hidden md:block w-1/2 relative overflow-hidden">
                <img src={data.hero_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80"}
                  alt="Cover" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#06060f]" />
              </div>
              {/* Right — text */}
              <div className="flex-1 flex flex-col justify-center items-center text-center px-10 relative">
                <div className="absolute inset-6 border border-[#c8973e]/20 pointer-events-none baroque-corner" />
                <FadeIn delay={0.3} className="relative z-10">
                  <Crown className="w-10 h-10 text-[#c8973e] mx-auto mb-8 opacity-60" />
                  <p className="font-cinzel text-[9px] tracking-[0.6em] text-[#c8973e]/60 mb-10">The Royal Wedding</p>
                  <h1 className="font-cormorant text-6xl md:text-8xl italic text-[#e8d5a3] leading-tight mb-2">{data.bride_data.groom}</h1>
                  <div className="gold-line my-6 mx-auto w-32" />
                  <h1 className="font-cormorant text-6xl md:text-8xl italic text-[#e8d5a3] leading-tight mb-10">{data.bride_data.bride}</h1>
                  <p className="font-cinzel text-[9px] tracking-[0.3em] text-[#e8d5a3]/40 mb-14">{guestName}</p>
                  <button onClick={openInvitation}
                    className="font-cinzel text-[9px] tracking-[0.5em] px-12 py-5 border border-[#c8973e] text-[#c8973e] hover:bg-[#c8973e] hover:text-[#06060f] transition-all duration-500 shadow-[0_0_40px_rgba(200,151,62,0.15)]">
                    Enter The Ceremony
                  </button>
                </FadeIn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="pb-20">

          {/* HERO — editorial split */}
          <section className="min-h-screen flex overflow-hidden royal-bg">
            {/* Left: photo full height */}
            <div className="w-1/2 relative overflow-hidden hidden md:block">
              <img src={data.hero_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80"}
                alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#06060f]" />
              {/* Date overlay on photo */}
              <div className="absolute bottom-16 left-10">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-white/50 mb-2">
                  {eventDate.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase()}
                </p>
              </div>
            </div>
            {/* Right: text + countdown */}
            <div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-24 relative">
              <div className="absolute inset-6 border border-[#c8973e]/10 pointer-events-none" />
              <FadeIn>
                <Crown className="w-8 h-8 text-[#c8973e]/50 mb-10" />
                <p className="font-cinzel text-[9px] tracking-[0.6em] text-[#c8973e]/60 mb-8">The Wedding Of</p>
                <h2 className="font-cormorant text-5xl md:text-7xl italic text-[#e8d5a3] leading-tight mb-3">{data.bride_data.groom}</h2>
                <div className="gold-line w-24 my-5" />
                <h2 className="font-cormorant text-5xl md:text-7xl italic text-[#e8d5a3] leading-tight mb-10">{data.bride_data.bride}</h2>
                <div className="max-w-xs">
                  <Countdown targetDate={eventDate} />
                </div>
              </FadeIn>
            </div>
          </section>

          {/* QUOTE */}
          {data.quote && (
            <section className="py-20 px-10 md:px-20 text-center border-y border-[#c8973e]/10">
              <FadeIn>
                <p className="font-cormorant text-2xl md:text-3xl italic text-[#e8d5a3]/70 max-w-3xl mx-auto leading-relaxed">&ldquo;{data.quote}&rdquo;</p>
              </FadeIn>
            </section>
          )}

          {/* COUPLE — staggered overlap */}
          <section className="py-24 px-10 md:px-20 royal-bg">
            <FadeIn className="text-center mb-16">
              <Crown className="w-6 h-6 text-[#c8973e]/40 mx-auto mb-6" />
              <h3 className="font-cinzel text-2xl text-[#e8d5a3] tracking-widest">The Couple</h3>
              <div className="gold-line w-24 mx-auto mt-6" />
            </FadeIn>
            {/* Groom — offset left */}
            <FadeIn className="max-w-5xl mx-auto mb-20">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="relative w-64 h-80 flex-shrink-0 group">
                  <div className="absolute -inset-3 border border-[#c8973e]/20 group-hover:-inset-5 transition-all duration-700" />
                  <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"}
                    alt="Groom" className="w-full h-full object-cover sepia-[0.3] group-hover:sepia-0 transition duration-1000" />
                </div>
                <div>
                  <p className="font-cinzel text-[9px] tracking-[0.5em] text-[#c8973e]/60 mb-3">The Groom</p>
                  <h4 className="font-cormorant text-5xl italic text-[#e8d5a3] mb-3">{data.bride_data.groom}</h4>
                  <div className="gold-line w-16 mb-3" />
                  <p className="font-cormorant text-xl italic text-[#e8d5a3]/50">Son of {data.bride_data.parents_groom}</p>
                </div>
              </div>
            </FadeIn>
            {/* Bride — offset right */}
            <FadeIn className="max-w-5xl mx-auto" delay={0.2}>
              <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="relative w-64 h-80 flex-shrink-0 group">
                  <div className="absolute -inset-3 border border-[#c8973e]/20 group-hover:-inset-5 transition-all duration-700" />
                  <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"}
                    alt="Bride" className="w-full h-full object-cover sepia-[0.3] group-hover:sepia-0 transition duration-1000" />
                </div>
                <div className="md:text-right">
                  <p className="font-cinzel text-[9px] tracking-[0.5em] text-[#c8973e]/60 mb-3">The Bride</p>
                  <h4 className="font-cormorant text-5xl italic text-[#e8d5a3] mb-3">{data.bride_data.bride}</h4>
                  <div className="gold-line w-16 mb-3 md:ml-auto" />
                  <p className="font-cormorant text-xl italic text-[#e8d5a3]/50">Daughter of {data.bride_data.parents_bride}</p>
                </div>
              </div>
            </FadeIn>
          </section>

          {/* LOVE STORY */}
          {data.love_story && data.love_story.length > 0 && (
            <section className="py-24 px-10 md:px-20 border-t border-[#c8973e]/10">
              <FadeIn className="text-center mb-16">
                <h3 className="font-cinzel text-2xl text-[#e8d5a3] tracking-widest">Our Journey</h3>
                <div className="gold-line w-24 mx-auto mt-6" />
              </FadeIn>
              <div className="max-w-3xl mx-auto space-y-0">
                {data.love_story.map((s, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="flex gap-8 py-10 border-b border-[#c8973e]/10 group hover:bg-[#c8973e]/[0.02] px-4 transition">
                      <div className="w-20 flex-shrink-0 text-right">
                        <span className="font-cormorant text-3xl italic text-[#c8973e]/30 group-hover:text-[#c8973e]/80 transition">{s.year}</span>
                      </div>
                      <div className="w-px bg-[#c8973e]/20 flex-shrink-0" />
                      <div>
                        <h4 className="font-cormorant text-2xl italic text-[#e8d5a3] mb-2">{s.title}</h4>
                        <p className="font-cormorant text-lg text-[#e8d5a3]/40 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </section>
          )}

          {/* ACARA */}
          <section className="py-24 px-10 md:px-20 royal-bg border-t border-[#c8973e]/10">
            <FadeIn className="text-center mb-16">
              <Crown className="w-6 h-6 text-[#c8973e]/40 mx-auto mb-6" />
              <h3 className="font-cinzel text-2xl text-[#e8d5a3] tracking-widest">The Ceremony</h3>
              <div className="gold-line w-24 mx-auto mt-6" />
            </FadeIn>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-1">
              {[
                { label: "Holy Matrimony", time: data.event_data.akad_time, loc: data.event_data.akad_location, map: data.event_data.akad_map },
                { label: "Wedding Reception", time: data.event_data.resepsi_time, loc: data.event_data.resepsi_location, map: data.event_data.resepsi_map },
              ].map((ev, i) => (
                <FadeIn key={i} delay={i * 0.15}>
                  <div className="relative border border-[#c8973e]/15 p-10 text-center group hover:border-[#c8973e]/40 transition">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#06060f] px-4">
                      <span className="font-cormorant text-2xl italic text-[#c8973e]">✦</span>
                    </div>
                    <p className="font-cinzel text-[9px] tracking-[0.5em] text-[#c8973e]/60 mb-6">{ev.label}</p>
                    <p className="font-cormorant text-3xl italic text-[#e8d5a3] mb-4">{ev.time}</p>
                    <p className="font-cormorant text-lg text-[#e8d5a3]/40 mb-8 leading-relaxed">{ev.loc}</p>
                    <a href={ev.map || "#"} target="_blank"
                      className="font-cinzel text-[9px] tracking-[0.4em] px-8 py-3 border border-[#c8973e]/40 text-[#c8973e] hover:bg-[#c8973e] hover:text-[#06060f] transition-all inline-block">
                      Location
                    </a>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* GALLERY — masonry-feel */}
          <GalleryLightbox
            images={data.gallery || []}
            title="The Royal Gallery"
            titleClassName="font-cinzel text-2xl text-[#e8d5a3] tracking-widest text-center mb-12"
            sectionClassName="py-24 px-10 md:px-20 border-t border-[#c8973e]/10"
            gridClassName="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto"
            itemClassName="overflow-hidden group cursor-pointer relative border border-[#c8973e]/10 hover:border-[#c8973e]/40 transition"
            imgClassName="w-full h-full object-cover aspect-square sepia-[0.4] group-hover:sepia-0 group-hover:scale-105 transition duration-1000"
          />

          {/* VIDEO */}
          {data.video && (
            <section className="py-20 px-10 md:px-20 text-center border-t border-[#c8973e]/10">
              <FadeIn>
                <h3 className="font-cinzel text-2xl text-[#e8d5a3] tracking-widest mb-12">The Royal Film</h3>
                <div className="max-w-4xl mx-auto aspect-video border border-[#c8973e]/20 overflow-hidden">
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${data.video.includes("v=") ? data.video.split("v=")[1].split("&")[0] : data.video.split("/").pop()}`} frameBorder="0" allowFullScreen />
                </div>
              </FadeIn>
            </section>
          )}

          {/* GIFT */}
          {data.gifts && data.gifts.length > 0 && (
            <section className="py-20 px-10 md:px-20 royal-bg border-t border-[#c8973e]/10 text-center">
              <div className="max-w-3xl mx-auto">
                <FadeIn className="mb-12">
                  <Gift className="w-8 h-8 text-[#c8973e]/40 mx-auto mb-6" />
                  <h3 className="font-cinzel text-2xl text-[#e8d5a3] tracking-widest">Wedding Gift</h3>
                  <div className="gold-line w-24 mx-auto mt-6" />
                </FadeIn>
                <div className="grid sm:grid-cols-2 gap-6">
                  {data.gifts.map((g, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <div className="border border-[#c8973e]/15 p-8 hover:border-[#c8973e]/40 transition">
                        <p className="font-cinzel text-[9px] tracking-widest text-[#c8973e]/60 mb-4">{g.bank}</p>
                        <p className="font-cormorant text-3xl italic text-[#e8d5a3] mb-2">{g.acc}</p>
                        <p className="font-cormorant text-lg text-[#e8d5a3]/40">a.n {g.name}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* RSVP */}
          <section className="py-20 px-10 md:px-20 border-t border-[#c8973e]/10">
            <div className="max-w-xl mx-auto">
              <FadeIn className="text-center mb-12">
                <h3 className="font-cinzel text-2xl text-[#e8d5a3] tracking-widest">Wishes & RSVP</h3>
                <div className="gold-line w-24 mx-auto mt-6" />
              </FadeIn>
              <FadeIn delay={0.1}>
                <form className="space-y-6" onSubmit={async (e) => {
                  e.preventDefault();
                  if (previewMode) return alert("Preview mode.");
                  if (!data.slug) return;
                  setIsSubmitting(true);
                  const w: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                  try { const ok = await submitWish(data.slug, w); if (ok) { setWishes([...wishes, w]); setRsvpMessage(""); setRsvpPresence(""); alert("Thank you!"); } }
                  finally { setIsSubmitting(false); }
                }}>
                  <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Your Full Name"
                    className="w-full px-6 py-4 bg-white/5 border border-[#c8973e]/15 font-cormorant text-lg text-[#e8d5a3] placeholder:text-[#e8d5a3]/20 focus:outline-none focus:border-[#c8973e]/50 transition" required />
                  <select value={rsvpPresence} onChange={e => setRsvpPresence(e.target.value)}
                    className="w-full px-6 py-4 bg-[#06060f] border border-[#c8973e]/15 font-cormorant text-lg text-[#e8d5a3] focus:outline-none focus:border-[#c8973e]/50 transition" required>
                    <option value="">Attendance Confirmation</option>
                    <option value="hadir">I Will Attend</option>
                    <option value="tidak">Regretfully Decline</option>
                  </select>
                  <textarea rows={4} value={rsvpMessage} onChange={e => setRsvpMessage(e.target.value)} placeholder="Your warmest wishes..."
                    className="w-full px-6 py-4 bg-white/5 border border-[#c8973e]/15 font-cormorant text-lg text-[#e8d5a3] placeholder:text-[#e8d5a3]/20 focus:outline-none focus:border-[#c8973e]/50 transition resize-none" required />
                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-5 border border-[#c8973e] text-[#c8973e] font-cinzel text-[9px] tracking-[0.5em] hover:bg-[#c8973e] hover:text-[#06060f] transition-all disabled:opacity-40 flex items-center justify-center gap-3">
                    <Send size={12} /> {isSubmitting ? "Sending..." : "Send RSVP"}
                  </button>
                </form>
              </FadeIn>
              {wishes.length > 0 && (
                <div className="mt-14 space-y-8 max-h-96 overflow-y-auto pr-2">
                  {[...wishes].reverse().map((w, i) => (
                    <div key={i} className="border-b border-[#c8973e]/10 pb-8">
                      <div className="flex justify-between mb-2">
                        <span className="font-cormorant text-xl italic text-[#e8d5a3]">{w.name}</span>
                        <span className="font-cinzel text-[9px] tracking-widest text-[#c8973e]/60">{w.presence === "hadir" ? "Attending" : "Absent"}</span>
                      </div>
                      <p className="font-cormorant text-lg text-[#e8d5a3]/40 italic">&ldquo;{w.message}&rdquo;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-24 text-center royal-bg border-t border-[#c8973e]/10">
            <Crown className="w-8 h-8 text-[#c8973e]/30 mx-auto mb-8" />
            <h2 className="font-cormorant text-5xl md:text-7xl italic text-[#e8d5a3] mb-4">
              {data.bride_data.groom} <span className="text-[#c8973e] not-italic text-3xl">&</span> {data.bride_data.bride}
            </h2>
            <div className="gold-line w-32 mx-auto my-6" />
            <p className="font-cinzel text-[9px] tracking-[0.6em] text-[#e8d5a3]/20">— Galatamu Signature —</p>
          </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-10 right-10 z-40 w-14 h-14 bg-[#06060f] border border-[#c8973e]/40 rounded-full shadow-[0_0_30px_rgba(200,151,62,0.15)] flex items-center justify-center text-[#c8973e] hover:scale-110 transition-all">
          <Disc className={`w-6 h-6 ${isPlaying ? "animate-[spin_5s_linear_infinite]" : ""}`} />
        </button>
      )}
    </div>
  );
}
