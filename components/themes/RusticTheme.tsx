"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, MapPin, Calendar as CalendarIcon, Video, Gift, Heart, Send, Leaf } from "lucide-react";
import FadeIn from "../FadeIn";
import Countdown from "../logic/Countdown";
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";
import GalleryLightbox from "../GalleryLightbox";

interface RusticThemeProps {
  data: InvitationData;
  previewMode?: boolean;
  guestName?: string;
}

export default function RusticTheme({ data, previewMode = false, guestName = "Tamu Undangan" }: RusticThemeProps) {
  const [isOpen, setIsOpen] = useState(previewMode); // Auto-open in preview mode
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // RSVP State
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
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [previewMode]);

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
    <div className={`bg-[#f4efe6] min-h-screen text-[#4a3f35] font-serif selection:bg-[#4a3f35] selection:text-white ${previewMode ? 'relative' : ''}`}>
      {/* Cover / Hero Overlay  hidden in preview mode */}
      {!previewMode && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#4a3f35] text-[#f4efe6] overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply"
                style={{ backgroundImage: `url('${data.hero_image || 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&q=80'}')` }}
              ></div>
              <div className="relative z-10 text-center px-6 border-4 border-[#8c7a6b] p-12 m-6 rounded-t-full">
                <FadeIn delay={0.2}>
                  <p className="tracking-widest uppercase text-xs mb-4 text-[#d4c3b3]"><Leaf className="inline w-4 h-4 mr-2" /> The Wedding Of <Leaf className="inline w-4 h-4 ml-2" /></p>
                </FadeIn>
                <FadeIn delay={0.4}>
                  <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 italic">
                    {data.bride_data.groom || "Groom"} & {data.bride_data.bride || "Bride"}
                  </h1>
                </FadeIn>
                <FadeIn delay={0.6}>
                  <p className="text-sm font-light text-[#d4c3b3] mb-4 max-w-md mx-auto italic whitespace-pre-wrap">
                    {data.quote || `"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."`}
                  </p>
                  <p className="text-sm font-light text-[#d4c3b3] mb-8">Kpd Bpk/Ibu/Saudara/i <br/><span className="font-bold text-lg mt-1 block tracking-wider">{guestName}</span></p>
                </FadeIn>
                <FadeIn delay={0.8}>
                  <button 
                    onClick={openInvitation}
                    className="px-8 py-3 bg-[#f4efe6] text-[#4a3f35] rounded-none font-medium hover:bg-[#d4c3b3] transition-colors shadow-lg flex items-center gap-2 mx-auto uppercase tracking-widest text-xs"
                  >
                    Buka Undangan
                  </button>
                </FadeIn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Preview Mode Banner */}
      {previewMode && (
        <div className="bg-[#4a3f35] text-[#f4efe6] text-center py-2 text-xs uppercase tracking-widest font-sans sticky top-0 z-20">
           Mode Preview  Tema Rustic Botanical 
        </div>
      )}

      {/* Main Content */}
      {(isOpen || previewMode) && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: previewMode ? 0 : 1 }} className="pb-32">
          
          {/* Hero Section */}
          <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
            <div className="relative z-10">
              <FadeIn><p className="tracking-[0.3em] uppercase text-sm mb-4 text-[#8c7a6b]">We Are Getting Married</p></FadeIn>
              <FadeIn delay={0.2}>
                <h2 className="font-serif text-6xl md:text-8xl font-bold mb-6 italic text-[#382f27]">{data.bride_data.groom || "Groom"} & {data.bride_data.bride || "Bride"}</h2>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="w-px h-16 bg-[#8c7a6b] mx-auto mb-8"></div>
                <p className="text-xl text-[#5c4d42] mb-12 uppercase tracking-widest">
                  {eventDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </FadeIn>
              <FadeIn delay={0.6}>
                <div className="p-6 border border-[#8c7a6b] rounded-t-full rounded-b-full">
                  <Countdown targetDate={eventDate} />
                </div>
              </FadeIn>
            </div>
          </section>

          <GalleryLightbox
            images={data.gallery?.filter(img => img) || []}
            title="Galeri Foto"
            titleClassName="text-4xl mb-12 italic text-[#382f27] text-center"
            sectionClassName="py-24 px-6 bg-[#f4efe6] text-center"
            gridClassName="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto"
            itemClassName="aspect-square rounded-none overflow-hidden bg-white border-4 border-white shadow-md group cursor-pointer relative"
            imgClassName="w-full h-full object-cover group-hover:scale-110 transition duration-700 sepia-[.2]"
          />


          {/* Love Story - Added for Wedding Theme */}
          {data.love_story && data.love_story.length > 0 && (
            <section className="py-24 px-6 bg-[#fffdfa] text-center">
              <FadeIn><h3 className="text-4xl mb-12 italic text-[#382f27]">Love Story</h3></FadeIn>
              <div className="max-w-3xl mx-auto space-y-12">
                {data.love_story.map((story, i) => (
                  <FadeIn key={i} delay={i * 0.2}>
                    <div className="relative pl-8 border-l-2 border-[#8c7a6b] text-left">
                      <div className="absolute -left-[11px] top-0 w-5 h-5 bg-[#8c7a6b] rounded-full border-4 border-[#fffdfa]"></div>
                      <span className="text-xl font-bold text-[#8c7a6b] mb-1 block">{story.year}</span>
                      <h4 className="text-2xl mb-2 italic text-[#382f27]">{story.title}</h4>
                      <p className="text-[#5c4d42] leading-relaxed">{story.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </section>
          )}

          {/* Video Undangan - Added for Wedding Theme */}
          {data.video && (
            <section className="py-24 px-6 bg-[#f4efe6] text-center">
              <FadeIn><h3 className="text-4xl mb-12 italic text-[#382f27]">Video Undangan</h3></FadeIn>
              <div className="max-w-4xl mx-auto aspect-video rounded-none overflow-hidden border-8 border-white shadow-2xl">
                <iframe 
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${data.video.includes('v=') ? data.video.split('v=')[1].split('&')[0] : data.video.split('/').pop()}`}
                  title="Wedding Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          )}

          {/* Profil Mempelai */}
          <section className="relative py-24 px-6 bg-[#fffdfa] text-center overflow-hidden">
            {data.bg_middle && (
              <div className="absolute inset-0 z-0">
                <img src={data.bg_middle} alt="Background Middle" className="w-full h-full object-cover opacity-20" />
              </div>
            )}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fffdfa] p-4 rounded-full border border-[#f4efe6]">
                <Heart className="text-[#8c7a6b] w-6 h-6" />
            </div>
            <div className="max-w-4xl mx-auto relative z-10">
              <FadeIn>
                <h3 className="text-4xl mb-6 italic text-[#382f27]">Mempelai</h3>
                <p className="text-[#8c7a6b] mb-16 max-w-2xl mx-auto leading-relaxed">Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri resepsi pernikahan kami.</p>
              </FadeIn>
              <div className="grid md:grid-cols-2 gap-16">
                {/* Groom */}
                <FadeIn delay={0.2}>
                  <div className="flex flex-col items-center">
                    <div className="w-56 h-72 rounded-t-full overflow-hidden mb-6 bg-[#f4efe6] border-4 border-[#fffdfa] shadow-xl">
                      <img src={data.groom_photo || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"} alt="Groom" className="w-full h-full object-cover sepia-[.3]" />
                    </div>
                    <h4 className="text-3xl font-bold mb-2 italic text-[#382f27]">{data.bride_data.groom || "Groom"}</h4>
                    <p className="text-sm text-[#8c7a6b] mb-4 uppercase tracking-widest">Putra dari {data.bride_data.parents_groom || "Nama Orang Tua"}</p>
                  </div>
                </FadeIn>
                {/* Bride */}
                <FadeIn delay={0.4}>
                  <div className="flex flex-col items-center">
                    <div className="w-56 h-72 rounded-t-full overflow-hidden mb-6 bg-[#f4efe6] border-4 border-[#fffdfa] shadow-xl">
                      <img src={data.bride_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"} alt="Bride" className="w-full h-full object-cover sepia-[.3]" />
                    </div>
                    <h4 className="text-3xl font-bold mb-2 italic text-[#382f27]">{data.bride_data.bride || "Bride"}</h4>
                    <p className="text-sm text-[#8c7a6b] mb-4 uppercase tracking-widest">Putri dari {data.bride_data.parents_bride || "Nama Orang Tua"}</p>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* Acara */}
          <section className="relative py-24 px-6 text-center overflow-hidden">
            {data.bg_middle && (
              <div className="absolute inset-0 z-0">
                <img src={data.bg_middle} alt="Background Middle" className="w-full h-full object-cover opacity-10" />
              </div>
            )}
            <div className="relative z-10">
              <FadeIn><h3 className="text-4xl mb-12 italic text-[#382f27]">Detail Acara</h3></FadeIn>
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
              <FadeIn delay={0.2}>
                <div className="p-10 border-2 border-[#8c7a6b] bg-[#fffdfa] relative">
                  <Leaf className="absolute -top-3 -left-3 text-[#8c7a6b] bg-[#fffdfa] w-6 h-6 p-1" />
                  <h4 className="text-3xl mb-4 italic">Akad Nikah</h4>
                  <p className="font-bold text-xl mb-1">{data.event_data.akad_time || "Waktu Akad"}</p>
                  <p className="text-[#8c7a6b] mb-6">{data.event_data.akad_location || "Lokasi Akad"}</p>
                  <a href={data.event_data.akad_map || "#"} target="_blank" className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#4a3f35] text-[#f4efe6] font-sans uppercase tracking-widest text-xs hover:bg-[#382f27] transition"><MapPin size={14}/> Buka Peta</a>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="p-10 border-2 border-[#8c7a6b] bg-[#fffdfa] relative">
                  <Leaf className="absolute -top-3 -right-3 text-[#8c7a6b] bg-[#fffdfa] w-6 h-6 p-1 transform scale-x-[-1]" />
                  <h4 className="text-3xl mb-4 italic">Resepsi</h4>
                  <p className="font-bold text-xl mb-1">{data.event_data.resepsi_time || "Waktu Resepsi"}</p>
                  <p className="text-[#8c7a6b] mb-6">{data.event_data.resepsi_location || "Lokasi Resepsi"}</p>
                  <a href={data.event_data.resepsi_map || "#"} target="_blank" className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#4a3f35] text-[#f4efe6] font-sans uppercase tracking-widest text-xs hover:bg-[#382f27] transition"><MapPin size={14}/> Buka Peta</a>
                </div>
              </FadeIn>
              </div>
            </div>
          </section>

          {/* Amplop Digital - Added for Wedding Theme */}
          <section className="py-24 px-6 bg-[#fffdfa] text-center">
            <FadeIn>
              <div className="w-16 h-16 bg-[#f4efe6] text-[#8c7a6b] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><Gift size={28}/></div>
              <h3 className="text-4xl mb-6 italic text-[#382f27]">Amplop Digital</h3>
              <p className="text-[#8c7a6b] mb-12 max-w-xl mx-auto leading-relaxed">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.</p>
            </FadeIn>
            <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
              {(data.gifts?.length ? data.gifts : [{bank: "BCA", acc: "123456789", name: "Groom Name"}]).map((gift, i) => (
                <FadeIn key={i} delay={i * 0.2}>
                  <div className="p-8 border-2 border-[#8c7a6b] bg-[#f4efe6] relative group">
                    <Leaf className="absolute -top-3 -left-3 text-[#8c7a6b] bg-[#fffdfa] w-6 h-6 p-1 group-hover:rotate-12 transition-transform" />
                    <p className="text-2xl font-bold mb-2 italic text-[#382f27]">{gift.bank}</p>
                    <p className="text-xl tracking-[0.2em] mb-2 text-[#4a3f35]">{gift.acc}</p>
                    <p className="text-sm uppercase tracking-widest text-[#8c7a6b]">a.n {gift.name}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* RSVP & Wedding Wish */}
          <section className="relative py-24 px-6 bg-[#382f27] text-[#f4efe6] overflow-hidden">
            {data.bg_bottom && (
              <div className="absolute inset-0 z-0">
                <img src={data.bg_bottom} alt="Background Bottom" className="w-full h-full object-cover opacity-30" />
              </div>
            )}
            <div className="max-w-2xl mx-auto relative z-10">
              <FadeIn>
                <h3 className="text-4xl mb-4 text-center italic">RSVP & Ucapan</h3>
                <p className="text-[#8c7a6b] mb-10 text-center font-sans">Tinggalkan pesan hangat untuk kedua mempelai.</p>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <form 
                  className="space-y-4 mb-16 font-sans" 
                  onSubmit={async (e) => { 
                    e.preventDefault(); 
                    if (previewMode) { alert("Preview: Form tidak dikirim."); return; }
                    if (!data.slug) return;
                    setIsSubmitting(true);
                    const newWish: WishData = { name: rsvpName || guestName, presence: rsvpPresence, message: rsvpMessage, timestamp: new Date().toISOString() };
                    try {
                      const success = await submitWish(data.slug, newWish);
                      if (success) { setWishes([...wishes, newWish]); setRsvpMessage(""); setRsvpPresence(""); alert("Terkirim!"); }
                    } finally { setIsSubmitting(false); }
                  }}
                >
                  <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Nama Anda" className="w-full px-4 py-3 bg-[#4a3f35] border border-[#5c4d42] focus:outline-none focus:border-[#d4c3b3] text-[#f4efe6] placeholder:text-[#8c7a6b]" required />
                  <select value={rsvpPresence} onChange={(e) => setRsvpPresence(e.target.value)} className="w-full px-4 py-3 bg-[#4a3f35] border border-[#5c4d42] focus:outline-none focus:border-[#d4c3b3] text-[#f4efe6]" required>
                    <option value="">Konfirmasi Kehadiran</option>
                    <option value="hadir">Ya, Saya akan hadir</option>
                    <option value="tidak">Maaf, tidak bisa hadir</option>
                  </select>
                  <textarea rows={4} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="Tuliskan ucapan & doa Anda..." className="w-full px-4 py-3 bg-[#4a3f35] border border-[#5c4d42] focus:outline-none focus:border-[#d4c3b3] text-[#f4efe6] placeholder:text-[#8c7a6b]" required></textarea>
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#d4c3b3] text-[#382f27] font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-2 hover:bg-[#f4efe6] transition disabled:opacity-50"><Send size={14}/> {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}</button>
                </form>
              </FadeIn>

              {/* List Ucapan */}
              <FadeIn delay={0.4}>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar font-sans">
                  {wishes.length > 0 ? (
                    [...wishes].reverse().map((wish, idx) => (
                      <div key={idx} className="bg-[#4a3f35] p-4 border border-[#5c4d42]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold">{wish.name}</span>
                          <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${wish.presence === 'hadir' ? 'bg-[#f4efe6]/10 text-[#d4c3b3]' : 'bg-black/20 text-[#8c7a6b]'}`}>
                            {wish.presence === 'hadir' ? 'Hadir' : 'Absen'}
                          </span>
                        </div>
                        <p className="text-[#f4efe6]/80 text-sm mb-2 italic">&quot;{wish.message}&quot;</p>
                        <p className="text-[#8c7a6b] text-xs text-right">
                          {new Date(wish.timestamp).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-[#8c7a6b]">Belum ada ucapan. Jadilah yang pertama!</p>
                  )}
                </div>
              </FadeIn>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 text-center bg-[#f4efe6] text-[#8c7a6b] border-t border-[#d4c3b3]">
            <p className="text-2xl italic text-[#382f27] mb-4">{data.bride_data.groom} & {data.bride_data.bride}</p>
            <p className="text-sm font-sans uppercase tracking-widest text-xs">Galatamu</p>
          </footer>
        </motion.main>
      )}

      {/* Floating Music Player */}
      {isOpen && !previewMode && (
        <button onClick={toggleMusic} className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-[#f4efe6]/80 backdrop-blur-md border border-[#d4c3b3] shadow-lg text-[#382f27] hover:bg-[#fffdfa] transition-all">
          <Disc className={`w-6 h-6 ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`} />
        </button>
      )}
    </div>
  );
}

