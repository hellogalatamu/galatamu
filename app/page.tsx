"use client";

import { useState } from "react";
import { Eye, X, Music, Heart, MapPin, Camera, Mail, Sparkles, ChevronRight, Menu } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import ThemeRegistry from "@/components/ThemeRegistry";
import Link from "next/link";

// Demo Data for Live Preview
const DEMO_DATA = {
  bride_data: {
    groom: "Groom",
    bride: "Bride",
    parents_groom: "Bpk. Fulan & Ibu Fulanah",
    parents_bride: "Bpk. Fulan & Ibu Fulanah",
  },
  event_data: {
    date: new Date().toISOString(),
    akad_time: "08:00 - 10:00 WIB",
    akad_location: "Masjid Raya",
    resepsi_time: "11:00 - Selesai",
    resepsi_location: "Gedung Serbaguna",
  },
  gallery: [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80",
  ],
};

// Theme Catalog Data
const CATEGORIES = ["Semua", "Pernikahan", "Adat", "Aqiqah", "Ulang Tahun"];

const THEMES: any[] = [
  {
    id: "amara_01",
    name: "Amara Premium",
    category: "Pernikahan",
    tagline: "Elegan, Mewah & Minimalis",
    bg: "bg-[#faf9f6]",
    border: "border-gray-100",
    textColor: "text-[#1a1a1a]",
    tagColor: "text-gray-500",
    previewBg: "from-gray-300 to-gray-100",
    previewText: "text-gray-600",
    btnBorder: "border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white",
    waText: `Assalamu'alaikum, Kak Admin Galatamu 👋\n\nSaya tertarik dengan *Tema Amara Premium* dan ingin memesan undangan digital untuk pernikahan saya.\n\nBoleh saya tahu detailnya? 🙏`,
  },
  {
    id: "jawa_01",
    name: "Jawa Ningrat",
    category: "Adat",
    tagline: "Klasik, Sakral & Megah",
    bg: "bg-[#2d1b0d]",
    border: "border-[#8c7a6b]/30",
    textColor: "text-[#f4efe6]",
    tagColor: "text-[#c8973e]",
    previewBg: "from-[#2d1b0d] to-[#4a2c16]",
    previewText: "text-[#f4efe6]",
    btnBorder: "border-[#c8973e] text-[#c8973e] hover:bg-[#c8973e] hover:text-[#2d1b0d]",
    waText: `Assalamu'alaikum, Kak Admin Galatamu 👋\n\nSaya tertarik dengan *Tema Jawa Ningrat* untuk pernikahan saya.`,
  },
  {
    id: "aqiqah_01",
    name: "Baby Pastel Breeze",
    category: "Aqiqah",
    tagline: "Lembut, Ceria & Menggemaskan",
    bg: "bg-[#f0f9ff]",
    border: "border-blue-100",
    textColor: "text-blue-900",
    tagColor: "text-blue-400",
    previewBg: "from-blue-100 to-white",
    previewText: "text-blue-600",
    btnBorder: "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white",
    waText: `Assalamu'alaikum, Kak Admin Galatamu 👋\n\nSaya tertarik dengan *Tema Baby Pastel Breeze* untuk acara Aqiqah anak saya.`,
  },
  {
    id: "modern_01",
    name: "Modern Editorial",
    category: "Pernikahan",
    tagline: "Bold, Asymmetric & Magazine-Style",
    bg: "bg-[#0a0a0a]",
    border: "border-[#ff6b6b]/30",
    textColor: "text-white",
    tagColor: "text-[#ff6b6b]",
    previewBg: "from-[#0a0a0a] to-[#1a1a1a]",
    previewText: "text-white",
    btnBorder: "border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-[#0a0a0a]",
    waText: `Assalamu'alaikum, Kak Admin Galatamu 👋\n\nSaya tertarik dengan *Tema Modern Editorial* untuk pernikahan saya.`,
  },
  {
    id: "sweet17_01",
    name: "Midnight Glamour",
    category: "Ulang Tahun",
    tagline: "Glow, Party & Sophisticated",
    bg: "bg-[#06060f]",
    border: "border-purple-500/30",
    textColor: "text-white",
    tagColor: "text-purple-400",
    previewBg: "from-[#06060f] to-[#1a1a2e]",
    previewText: "text-purple-300",
    btnBorder: "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white",
    waText: `Assalamu'alaikum, Kak Admin Galatamu 👋\n\nSaya tertarik dengan *Tema Midnight Glamour* untuk Sweet 17 saya.`,
  },
  {
    id: "islamic_01",
    name: "Islamic Syar'i Barakah",
    category: "Pernikahan",
    tagline: "Kaligrafi, Arch & Ornamen Islami",
    bg: "bg-[#0d2b1a]",
    border: "border-[#c8973e]/30",
    textColor: "text-[#fdfcf0]",
    tagColor: "text-[#c8973e]",
    previewBg: "from-[#0d2b1a] to-[#1a4d2e]",
    previewText: "text-[#fdfcf0]",
    btnBorder: "border-[#c8973e] text-[#c8973e] hover:bg-[#c8973e] hover:text-[#0d2b1a]",
    waText: `Assalamu'alaikum, Kak Admin Galatamu 👋\n\nSaya tertarik dengan *Tema Islamic Syar'i Barakah* untuk pernikahan saya.`,
  }
];


const FEATURES = [
  { icon: <Music className="w-6 h-6" />, title: "Musik Otomatis", desc: "Alunan musik indah yang berputar secara otomatis saat undangan dibuka." },
  { icon: <Heart className="w-6 h-6" />, title: "Cerita Cinta", desc: "Bagikan perjalanan kisah cinta Anda dengan tata letak yang romantis." },
  { icon: <MapPin className="w-6 h-6" />, title: "Navigasi Lokasi", desc: "Integrasi Google Maps untuk memudahkan tamu menemukan lokasi acara." },
  { icon: <Camera className="w-6 h-6" />, title: "Galeri Eksklusif", desc: "Tampilkan foto-foto pre-wedding terbaik Anda dalam galeri yang memukau." },
  { icon: <Mail className="w-6 h-6" />, title: "RSVP & Ucapan", desc: "Tamu dapat mengonfirmasi kehadiran dan memberikan ucapan doa secara langsung." },
  { icon: <Sparkles className="w-6 h-6" />, title: "Amplop Digital", desc: "Fitur cashless (transfer bank/E-wallet) untuk mempermudah pemberian hadiah." },
];

export default function LandingPage() {
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredThemes = THEMES.filter(theme => activeCategory === "Semua" || theme.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans selection:bg-[#1a1a1a] selection:text-white scroll-smooth">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#faf9f6]/90 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-wider italic">Galatamu.</Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide uppercase">
            <a href="#beranda" className="text-gray-500 hover:text-[#1a1a1a] transition">Beranda</a>
            <a href="#fitur" className="text-gray-500 hover:text-[#1a1a1a] transition">Fitur</a>
            <a href="#katalog" className="text-gray-500 hover:text-[#1a1a1a] transition">Katalog Tema</a>
            <Link href="/editor" className="px-6 py-2.5 bg-[#1a1a1a] text-white rounded-full hover:bg-gray-800 transition shadow-sm">
              Buat Undangan
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-[#1a1a1a]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 py-4 px-6 flex flex-col gap-4 shadow-xl">
            <a href="#beranda" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1a1a1a] font-medium py-2 uppercase tracking-wide text-sm">Beranda</a>
            <a href="#fitur" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1a1a1a] font-medium py-2 uppercase tracking-wide text-sm">Fitur</a>
            <a href="#katalog" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1a1a1a] font-medium py-2 uppercase tracking-wide text-sm">Katalog Tema</a>
            <Link href="/editor" className="mt-2 text-center w-full py-3 bg-[#1a1a1a] text-white rounded-full font-medium uppercase tracking-wide text-sm">Buat Undangan</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="relative min-h-[100vh] flex items-center justify-center pt-20 overflow-hidden bg-[#faf9f6]">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" alt="Wedding" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f6]/95 via-[#faf9f6]/80 to-[#faf9f6]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
          <FadeIn>
            <span className="inline-block py-1.5 px-5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 shadow-sm">
              Undangan Digital Premium
            </span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-[#1a1a1a] leading-tight">
              Sempurnakan <br className="hidden md:block"/>Hari Bahagia Anda.
            </h1>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Sebarkan kabar bahagia Anda melalui undangan digital eksklusif, mewah, dan praktis. Desain berkelas yang akan selalu diingat oleh setiap tamu undangan Anda.
            </p>
          </FadeIn>
          <FadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#katalog" className="w-full sm:w-auto px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-medium tracking-wide hover:bg-gray-800 transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                Lihat Katalog <ChevronRight size={18} />
              </a>
              <Link href="/editor" className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-[#1a1a1a] rounded-full font-medium tracking-wide hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center">
                Pesan Sekarang
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block">Fasilitas Lengkap</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a]">Fitur Premium Galatamu</h2>
            </div>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {FEATURES.map((feat, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="group flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-[#faf9f6] border border-gray-100 rounded-3xl flex items-center justify-center text-[#1a1a1a] mb-6 group-hover:scale-110 group-hover:bg-[#1a1a1a] group-hover:text-white transition-all duration-500 shadow-sm">
                    {feat.icon}
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3 text-[#1a1a1a]">{feat.title}</h3>
                  <p className="text-gray-500 font-light leading-relaxed max-w-sm">{feat.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Katalog Tema */}
      <section id="katalog" className="py-32 px-6 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block">Karya Kami</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-[#1a1a1a]">Katalog Tema Eksklusif</h2>
              <p className="text-gray-500 font-light max-w-2xl mx-auto text-lg mb-10">
                Pilih desain yang paling mencerminkan kepribadian Anda. Semua tema dirancang secara hati-hati untuk memberikan pengalaman visual yang memukau.
              </p>
              
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat 
                        ? "bg-[#1a1a1a] text-white shadow-md" 
                        : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-[#1a1a1a]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredThemes.map((theme, idx) => (
              <FadeIn key={theme.id} delay={0.2 + idx * 0.1}>
                <div className={`group rounded-[2rem] overflow-hidden ${theme.bg} border ${theme.border} shadow-sm hover:shadow-2xl transition-all duration-500`}>
                  {/* Preview Area */}
                  <div className={`aspect-[3/4] relative overflow-hidden ${theme.isPlaceholder ? '' : 'cursor-pointer'}`} onClick={() => !theme.isPlaceholder && setPreviewTheme(theme.id)}>
                    <div className={`absolute inset-0 bg-gradient-to-tr ${theme.previewBg} flex flex-col items-center justify-center gap-4 group-hover:scale-105 transition-transform duration-700`}>
                      <span className={`font-serif text-3xl ${theme.previewText} opacity-80 italic tracking-wider`}>{theme.isPlaceholder ? 'Segera Hadir' : 'Galatamu.'}</span>
                      {!theme.isPlaceholder && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 backdrop-blur-sm px-8 py-4 rounded-full flex items-center gap-2 shadow-xl text-[#1a1a1a] font-medium transform translate-y-4 group-hover:translate-y-0">
                            <Eye size={18} /> Lihat Live Preview
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`p-8 text-center ${theme.id === 'sweet17_01' ? 'bg-[#111111] border-t border-[#333333]' : 'bg-white border-t border-gray-100'}`}>
                    <div className="flex justify-center mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{theme.category}</span>
                    </div>
                    <h3 className={`font-serif font-bold text-2xl ${theme.textColor} mb-2`}>{theme.name}</h3>
                    <p className={`${theme.tagColor} text-xs mb-8 font-bold uppercase tracking-widest`}>{theme.tagline}</p>
                    <div className="flex gap-3">
                      {theme.isPlaceholder ? (
                        <button disabled className="w-full py-3.5 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed text-sm">
                          Tahap Desain
                        </button>
                      ) : (
                        <>
                          <button onClick={() => setPreviewTheme(theme.id)} className={`flex-1 py-3.5 border ${theme.btnBorder} rounded-xl font-medium transition-colors duration-300 flex items-center justify-center gap-2 text-sm`}>
                            <Eye size={16} /> Preview
                          </button>
                          <Link href={`/editor?theme=${theme.id}`} className={`flex-1 py-3.5 bg-[#1a1a1a] text-white rounded-xl font-medium transition-colors duration-300 text-center text-sm shadow-md hover:bg-gray-800`}>
                            Gunakan
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-32 px-6 bg-[#1a1a1a] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8">Siap Memulai Perjalanan Anda?</h2>
            <p className="text-gray-400 font-light text-lg mb-12">Buat undangan impian Anda sekarang, proses cepat, mudah, dan langsung jadi.</p>
            <Link href="/editor" className="inline-flex px-10 py-5 bg-white text-[#1a1a1a] rounded-full font-bold tracking-widest uppercase text-sm hover:bg-gray-100 transition-all shadow-2xl hover:scale-105">
              Buat Undangan Saya Sekarang
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-white/10 pt-20 pb-10 px-6 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl font-bold tracking-wider italic mb-6">Galatamu.</h2>
            <p className="text-gray-400 font-light max-w-sm leading-relaxed">
              Platform pembuatan undangan digital premium terpercaya. Kami membantu menyempurnakan hari bahagia Anda dengan desain eksklusif dan fitur modern.
            </p>
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-300">Tautan Cepat</h3>
            <ul className="space-y-4 text-gray-400 font-light text-sm">
              <li><a href="#beranda" className="hover:text-white transition">Beranda</a></li>
              <li><a href="#fitur" className="hover:text-white transition">Fitur Premium</a></li>
              <li><a href="#katalog" className="hover:text-white transition">Katalog Tema</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-300">Kontak Kami</h3>
            <ul className="space-y-4 text-gray-400 font-light text-sm">
              <li><a href="https://wa.me/6289687934761" className="hover:text-white transition">WhatsApp Admin</a></li>
              <li><a href="mailto:hello@galatamu.com" className="hover:text-white transition">hello@galatamu.com</a></li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="text-center border-t border-white/10 pt-10 text-xs text-gray-500 font-light tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Galatamu Invitation. Hak Cipta Dilindungi.
        </div>
      </footer>

      {/* Live Preview Modal */}
      {previewTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all">
          <div className="relative w-full max-w-sm h-[90vh] bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setPreviewTheme(null)}
              className="absolute top-4 right-4 z-[110] p-2.5 bg-black/10 backdrop-blur-md rounded-full text-[#1a1a1a] hover:bg-black/20 transition-all pointer-events-auto"
            >
              <X size={20} />
            </button>

            {/* Theme Preview */}
            <div className="flex-1 overflow-y-auto">
              <ThemeRegistry themeId={previewTheme} data={{ ...DEMO_DATA, theme_id: previewTheme, slug: "demo" }} previewMode={true} />
            </div>
            
            <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-[100] pointer-events-none">
              <div className="flex gap-3 pointer-events-auto">
                <button 
                  onClick={() => setPreviewTheme(null)} 
                  className="flex-1 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all"
                >
                  Tutup
                </button>
                <Link 
                  href={`/editor?theme=${previewTheme}`}
                  className="flex-1 py-4 bg-white text-[#1a1a1a] rounded-2xl font-bold uppercase tracking-widest text-[10px] text-center hover:bg-gray-100 transition-all shadow-xl"
                >
                  Gunakan Desain
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
