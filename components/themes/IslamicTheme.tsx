"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Gift, Send } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./AmaraTheme";
import GalleryLightbox from "../GalleryLightbox";

// Islamic geometric star SVG pattern as inline background
const STAR_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a4d2e' fill-opacity='0.07'%3E%3Cpath d='M30 0l7.5 22.5L60 30l-22.5 7.5L30 60l-7.5-22.5L0 30l22.5-7.5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

export default function IslamicTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: { data: InvitationData; previewMode?: boolean; guestName?: string }) {
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
      audioRef.current = new Audio(data.music_url || "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7aff99ea66.mp3?filename=islamic-background-music-21074.mp3");
      audioRef.current.loop = true;
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [previewMode, data.music_url]);

  const openInvitation = () => { setIsOpen(true); if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); };
  const toggleMusic = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={`min-h-screen bg-[#fdfcf0] text-[#1a4d2e] ${previewMode ? "relative" : ""}`} style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Lato:wght@300;400;700&display=swap');
        .font-amiri { font-family: 'Amiri', Georgia, serif; }
        .font-lato { font-family: 'Lato', sans-serif; }
        .arch-clip { clip-path: ellipse(50% 58% at 50% 42%); }
        .arch-frame { border-radius: 50% 50% 4px 4px / 60% 60% 4px 4px; }
        .islamic-border { border: 2px solid #c8973e; position: relative; }
        .islamic-border::before { content: '✦'; position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #fdfcf0; padding: 0 8px; color: #c8973e; font-size: 18px; }
        .ornament-divider { display: flex; align-items: center; gap: 16px; }
        .ornament-divider::before, .ornament-divider::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, transparent, #c8973e, transparent); }
      `}</style>

      {/* COVER */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
              style={{ background: "linear-gradient(160deg, #0d2b1a 0%, #1a4d2e 50%, #0d2b1a 100%)", backgroundImage: STAR_PATTERN }}>
              {/* Outer ornate border */}
              <div className="absolute inset-4 border border-[#c8973e]/30 pointer-events-none" />
              <div className="absolute inset-6 border border-[#c8973e]/10 pointer-events-none" />
              {/* Corner ornaments */}
              {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map((pos, i) => (
                <div key={i} className={`absolute ${pos} text-[#c8973e]/50 text-2xl`}>✦</div>
              ))}
              <FadeIn className="text-center px-8 max-w-lg relative z-10">
                <div className="text-[#c8973e] text-5xl mb-6 font-amiri">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</div>
                <p className="font-lato text-[#c8973e]/70 text-[10px] tracking-[0.4em] uppercase mb-10">In The Name of Allah, The Most Gracious</p>
                <div className="ornament-divider mb-10"><span className="text-[#c8973e] text-xs tracking-widest">THE WEDDING OF</span></div>
                <h1 className="font-amiri text-5xl md:text-7xl text-[#fdfcf0] italic mb-3 leading-tight">{data.bride_data.groom}</h1>
                <div className="text-[#c8973e] text-3xl my-2 font-amiri">&</div>
                <h1 className="font-amiri text-5xl md:text-7xl text-[#fdfcf0] italic mb-10 leading-tight">{data.bride_data.bride}</h1>
                <p className="font-lato text-[#fdfcf0]/50 text-xs tracking-widest mb-12">Kepada Yth. <span className="text-[#c8973e] font-bold">{guestName}</span></p>
                <button onClick={openInvitation}
                  className="font-lato px-12 py-4 bg-[#c8973e] text-[#0d2b1a] font-bold text-xs tracking-[0.4em] uppercase hover:bg-[#fdfcf0] transition-all shadow-[0_0_30px_rgba(200,151,62,0.4)]">
                  Buka Undangan ✦
                </button>
              </FadeIn>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="pb-20">

          {/* ── HERO ── Islamic arch hero */}
          <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
            style={{ backgroundImage: STAR_PATTERN, backgroundColor: "#fdfcf0" }}>
            {/* Top decorative strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1a4d2e] via-[#c8973e] to-[#1a4d2e]" />
            <div className="absolute inset-4 border border-[#1a4d2e]/10 pointer-events-none" />
            <FadeIn className="relative z-10 px-6 max-w-2xl mx-auto pt-16">
              <div className="text-[#c8973e] font-amiri text-4xl mb-4">﷽</div>
              <p className="font-lato text-[10px] tracking-[0.5em] uppercase text-[#1a4d2e]/60 mb-12">Mengundang dengan penuh kebahagiaan</p>
              {/* Arch photo frame */}
              {data.hero_image && (
                <div className="relative mx-auto w-48 h-56 mb-10">
                  <div className="w-full h-full overflow-hidden arch-frame border-4 border-[#c8973e]/40 shadow-xl">
                    <img src={data.hero_image} alt="Hero" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              <h2 className="font-amiri text-6xl md:text-8xl italic text-[#1a4d2e] leading-none mb-4">{data.bride_data.groom}</h2>
              <div className="ornament-divider my-6 max-w-xs mx-auto"><span className="text-[#c8973e] font-amiri text-2xl">&</span></div>
              <h2 className="font-amiri text-6xl md:text-8xl italic text-[#1a4d2e] leading-none mb-12">{data.bride_data.bride}</h2>
              <div className="max-w-sm mx-auto islamic-border p-8 bg-white/60 backdrop-blur-sm">
                <Countdown targetDate={eventDate} />
              </div>
              <p className="font-lato mt-8 text-sm text-[#1a4d2e]/70 tracking-widest">
                {eventDate.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </FadeIn>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1a4d2e] via-[#c8973e] to-[#1a4d2e]" />
          </section>

          {/* ── QUOTE ── */}
          <section className="py-20 px-6 bg-[#1a4d2e] text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: STAR_PATTERN }} />
            <FadeIn className="relative z-10 max-w-3xl mx-auto">
              <div className="text-[#c8973e] font-amiri text-5xl mb-6">"</div>
              <p className="font-amiri text-xl md:text-2xl italic text-[#fdfcf0]/90 leading-relaxed mb-6">
                {data.quote || "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."}
              </p>
              <p className="font-lato text-[#c8973e]/70 text-xs tracking-widest">— QS. Ar-Rum: 21 —</p>
            </FadeIn>
          </section>

          {/* ── MEMPELAI ── Arch-framed portraits */}
          <section className="py-24 px-6" style={{ backgroundImage: STAR_PATTERN, backgroundColor: "#fdfcf0" }}>
            <FadeIn className="text-center mb-16">
              <div className="ornament-divider max-w-xs mx-auto mb-6"><span className="font-amiri text-[#c8973e] text-2xl italic">Mempelai</span></div>
            </FadeIn>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
              {[
                { photo: data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80", name: data.bride_data.groom, label: "Putra dari", parent: data.bride_data.parents_groom },
                { photo: data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80", name: data.bride_data.bride, label: "Putri dari", parent: data.bride_data.parents_bride },
              ].map((p, i) => (
                <FadeIn key={i} delay={i * 0.2} className="flex flex-col items-center text-center">
                  {/* Arch portrait */}
                  <div className="relative w-48 h-64 mb-8 group">
                    <div className="absolute -inset-2 border-2 border-[#c8973e]/30 arch-frame transition-all duration-700 group-hover:-inset-4" />
                    <div className="w-full h-full overflow-hidden arch-frame border-4 border-[#c8973e]/60 shadow-2xl">
                      <img src={p.photo} alt={p.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                  </div>
                  <h3 className="font-amiri text-4xl italic text-[#1a4d2e] mb-2">{p.name}</h3>
                  <p className="font-lato text-[10px] tracking-[0.3em] uppercase text-[#c8973e] mb-1">{p.label}</p>
                  <p className="font-amiri text-lg italic text-[#1a4d2e]/70">{p.parent}</p>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* ── LOVE STORY ── */}
          {data.love_story && data.love_story.length > 0 && (
            <section className="py-24 px-6 bg-[#1a4d2e] relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: STAR_PATTERN }} />
              <div className="max-w-3xl mx-auto relative z-10">
                <FadeIn className="text-center mb-16">
                  <div className="ornament-divider max-w-xs mx-auto mb-6"><span className="font-amiri text-[#c8973e] text-2xl italic">Kisah Kami</span></div>
                </FadeIn>
                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-[#c8973e]/20" />
                  {data.love_story.map((s, i) => (
                    <FadeIn key={i} delay={i * 0.1} className="relative flex flex-col md:flex-row gap-8 mb-16">
                      <div className={`md:w-1/2 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:order-2 md:pl-12"}`}>
                        <span className="font-lato text-4xl font-bold text-[#c8973e]/30">{s.year}</span>
                        <h4 className="font-amiri text-2xl italic text-[#fdfcf0] mb-2">{s.title}</h4>
                        <p className="font-lato text-sm text-[#fdfcf0]/60 leading-relaxed">{s.desc}</p>
                      </div>
                      <div className="absolute left-1/2 top-3 -translate-x-1/2 w-4 h-4 bg-[#c8973e] rotate-45" />
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── ACARA ── Mosque-window style cards */}
          <section className="py-24 px-6" style={{ backgroundImage: STAR_PATTERN, backgroundColor: "#fdfcf0" }}>
            <FadeIn className="text-center mb-16">
              <div className="ornament-divider max-w-xs mx-auto mb-6"><span className="font-amiri text-[#c8973e] text-2xl italic">Waktu & Tempat</span></div>
            </FadeIn>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
              {[
                { label: "Akad Nikah", time: data.event_data.akad_time, loc: data.event_data.akad_location, map: data.event_data.akad_map },
                { label: "Resepsi", time: data.event_data.resepsi_time, loc: data.event_data.resepsi_location, map: data.event_data.resepsi_map },
              ].map((ev, i) => (
                <FadeIn key={i} delay={i * 0.15} className="text-center">
                  {/* Mosque arch card */}
                  <div className="relative bg-white shadow-xl overflow-hidden" style={{ borderRadius: "50% 50% 4px 4px / 30% 30% 4px 4px", paddingTop: "2rem" }}>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a4d2e] via-[#c8973e] to-[#1a4d2e]" />
                    <div className="px-8 pb-10 pt-6">
                      <div className="text-[#c8973e] text-3xl mb-3">✦</div>
                      <p className="font-lato text-[10px] tracking-[0.4em] uppercase text-[#c8973e] mb-4">{ev.label}</p>
                      <p className="font-amiri text-3xl italic text-[#1a4d2e] mb-3">{ev.time}</p>
                      <p className="font-lato text-sm text-[#1a4d2e]/60 leading-relaxed mb-6">{ev.loc}</p>
                      <a href={ev.map || "#"} target="_blank"
                        className="font-lato inline-block px-8 py-3 border-2 border-[#c8973e] text-[#c8973e] text-xs tracking-widest uppercase hover:bg-[#c8973e] hover:text-white transition-all">
                        Lihat Peta
                      </a>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
            {data.event_data.live_stream && (
              <FadeIn className="text-center mt-10">
                <a href={data.event_data.live_stream} target="_blank"
                  className="font-lato inline-block px-10 py-3 bg-[#1a4d2e] text-[#c8973e] text-xs tracking-widest uppercase hover:bg-[#0d2b1a] transition-all">
                  ▶ Live Streaming
                </a>
              </FadeIn>
            )}
          </section>

          {/* ── GALLERY ── */}
          <GalleryLightbox
            images={data.gallery || []}
            title="Gallery Foto"
            titleClassName="font-amiri text-4xl italic text-[#1a4d2e] text-center mb-12"
            sectionClassName="py-24 px-6 bg-[#1a4d2e]"
            gridClassName="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto"
            itemClassName="overflow-hidden shadow-lg group cursor-pointer relative arch-frame"
            imgClassName="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />

          {/* ── VIDEO ── */}
          {data.video && (
            <section className="py-24 px-6 text-center" style={{ backgroundImage: STAR_PATTERN, backgroundColor: "#fdfcf0" }}>
              <FadeIn>
                <div className="ornament-divider max-w-xs mx-auto mb-12"><span className="font-amiri text-[#c8973e] text-xl italic">Video Undangan</span></div>
                <div className="max-w-4xl mx-auto aspect-video border-4 border-[#c8973e]/30 shadow-2xl overflow-hidden">
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${data.video.includes("v=") ? data.video.split("v=")[1].split("&")[0] : data.video.split("/").pop()}`} frameBorder="0" allowFullScreen />
                </div>
              </FadeIn>
            </section>
          )}

          {/* ── AMPLOP DIGITAL ── */}
          {data.gifts && data.gifts.length > 0 && (
            <section className="py-24 px-6 bg-[#1a4d2e] text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: STAR_PATTERN }} />
              <div className="max-w-3xl mx-auto relative z-10">
                <FadeIn className="mb-12">
                  <Gift className="w-10 h-10 text-[#c8973e] mx-auto mb-4" />
                  <div className="ornament-divider max-w-xs mx-auto"><span className="font-amiri text-[#c8973e] text-2xl italic">Amplop Digital</span></div>
                </FadeIn>
                <div className="grid sm:grid-cols-2 gap-8">
                  {data.gifts.map((g, i) => (
                    <FadeIn key={i} delay={i * 0.1} className="bg-white/5 border border-[#c8973e]/20 p-8 text-center">
                      <p className="font-lato text-[10px] tracking-widest uppercase text-[#c8973e] mb-3">{g.bank}</p>
                      <p className="font-amiri text-3xl italic text-[#fdfcf0] mb-2">{g.acc}</p>
                      <p className="font-lato text-xs text-[#fdfcf0]/40">a.n {g.name}</p>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── RSVP ── */}
          <section className="py-24 px-6" style={{ backgroundImage: STAR_PATTERN, backgroundColor: "#fdfcf0" }}>
            <div className="max-w-xl mx-auto">
              <FadeIn className="text-center mb-12">
                <div className="ornament-divider max-w-xs mx-auto mb-6"><span className="font-amiri text-[#c8973e] text-2xl italic">RSVP & Ucapan</span></div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <form className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  if (previewMode) return alert("Preview mode.");
                  if (!data.slug) return;
                  setIsSubmitting(true);
                  const w: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                  try { const ok = await submitWish(data.slug, w); if (ok) { setWishes([...wishes, w]); setRsvpMessage(""); setRsvpPresence(""); alert("Jazakallah khairan! 🌿"); } }
                  finally { setIsSubmitting(false); }
                }}>
                  <input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Nama Lengkap"
                    className="w-full px-5 py-4 border-2 border-[#1a4d2e]/20 bg-white font-lato text-sm focus:outline-none focus:border-[#c8973e] text-[#1a4d2e] placeholder:text-[#1a4d2e]/40" required />
                  <select value={rsvpPresence} onChange={e => setRsvpPresence(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-[#1a4d2e]/20 bg-white font-lato text-sm focus:outline-none focus:border-[#c8973e] text-[#1a4d2e]" required>
                    <option value="">Konfirmasi Kehadiran</option>
                    <option value="hadir">Insya Allah Hadir ✓</option>
                    <option value="tidak">Mohon Maaf, Berhalangan</option>
                  </select>
                  <textarea rows={3} value={rsvpMessage} onChange={e => setRsvpMessage(e.target.value)} placeholder="Tuliskan doa & ucapan..."
                    className="w-full px-5 py-4 border-2 border-[#1a4d2e]/20 bg-white font-lato text-sm focus:outline-none focus:border-[#c8973e] text-[#1a4d2e] placeholder:text-[#1a4d2e]/40 resize-none" required />
                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-4 bg-[#1a4d2e] text-[#c8973e] font-lato text-xs tracking-[0.4em] uppercase hover:bg-[#0d2b1a] disabled:opacity-50 transition flex items-center justify-center gap-2">
                    <Send size={14} /> {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                  </button>
                </form>
              </FadeIn>
              {wishes.length > 0 && (
                <div className="mt-12 space-y-6 max-h-80 overflow-y-auto">
                  {[...wishes].reverse().map((w, i) => (
                    <div key={i} className="border-l-4 border-[#c8973e] pl-5 py-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-amiri text-lg italic text-[#1a4d2e]">{w.name}</span>
                        <span className="font-lato text-[10px] uppercase tracking-widest text-[#c8973e]">{w.presence === "hadir" ? "Hadir ✓" : "Absen"}</span>
                      </div>
                      <p className="font-lato text-sm text-[#1a4d2e]/60 italic">&ldquo;{w.message}&rdquo;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="py-16 text-center bg-[#1a4d2e] relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: STAR_PATTERN }} />
            <div className="relative z-10">
              <div className="text-[#c8973e] font-amiri text-4xl mb-4">بَارَكَ اللَّهُ لَكُمَا</div>
              <p className="font-lato text-[#fdfcf0]/40 text-xs tracking-widest uppercase mb-4">Barakallahu Lakuma wa Baraka Alaikuma</p>
              <div className="ornament-divider max-w-xs mx-auto">
                <span className="font-amiri text-xl italic text-[#c8973e]">{data.bride_data.groom} & {data.bride_data.bride}</span>
              </div>
              <p className="font-lato text-[#fdfcf0]/30 text-[10px] tracking-widest mt-6">— Galatamu —</p>
            </div>
          </footer>
        </motion.main>
      )}

      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-[#1a4d2e] border-2 border-[#c8973e]/40 rounded-full shadow-xl flex items-center justify-center text-[#c8973e] hover:scale-110 transition-all">
          <Disc className={`w-6 h-6 ${isPlaying ? "animate-[spin_4s_linear_infinite]" : ""}`} />
        </button>
      )}
    </div>
  );
}
