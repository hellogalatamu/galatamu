"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, Music, Heart, MapPin, Camera, Mail, Sparkles, ChevronRight, Menu, CreditCard } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import ThemeRegistry from "@/components/ThemeRegistry";
import PhoneMockup from "@/components/PhoneMockup";
import PremiumPhoneMockup from "@/components/PremiumPhoneMockup";
import PreviewModal from "@/components/PreviewModal";
import Link from "next/link";

import PricingTable from "@/components/PricingTable";
import FAQ from "@/components/FAQ";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import HowToOrder from "@/components/HowToOrder";

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
const TIERS = [
  { key: "Semua", label: "Semua Tema", icon: "✦" },
  { key: "basic", label: "Basic", icon: "○", color: "text-gray-500", duration: "Masa Aktif 3 Bulan" },
  { key: "premium", label: "Premium", icon: "★", color: "text-amber-500", duration: "Masa Aktif 6 Bulan" },
  { key: "exclusive", label: "Exclusive", icon: "♦", color: "text-purple-600", duration: "Masa Aktif 1 Tahun" },
];

import { THEMES } from "@/lib/themes";


const FEATURES = [
  { icon: <Music className="w-6 h-6" />, title: "Musik Otomatis", desc: "Alunan musik indah yang berputar secara otomatis saat undangan dibuka." },
  { icon: <Sparkles className="w-6 h-6" />, title: "Fitur Premium", desc: "Dilengkapi fitur Calendar Sync, Video Player, dan Live Streaming link." },
  { icon: <MapPin className="w-6 h-6" />, title: "Navigasi Lokasi", desc: "Integrasi Google Maps untuk memudahkan tamu menemukan lokasi acara." },
  { icon: <Camera className="w-6 h-6" />, title: "Galeri Eksklusif", desc: "Tampilkan foto-foto pre-wedding terbaik Anda dalam galeri yang memukau." },
  { icon: <Mail className="w-6 h-6" />, title: "RSVP & Ucapan", desc: "Tamu dapat mengonfirmasi kehadiran dan memberikan ucapan doa secara langsung." },
  { icon: <CreditCard className="w-6 h-6" />, title: "Amplop Digital", desc: "Fitur cashless (transfer bank/E-wallet) untuk mempermudah pemberian hadiah." },
];

export default function LandingPage() {
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTier, setActiveTier] = useState("Semua");

  const filteredThemes = THEMES.filter(theme => activeTier === "Semua" || theme.tier === activeTier);

  const TIER_BADGE: Record<string, { label: string; className: string; glow?: boolean }> = {
    basic: { label: "Basic", className: "bg-gray-100 text-gray-500 border border-gray-200" },
    premium: { label: "Premium", className: "bg-amber-50 text-amber-600 border border-amber-200" },
    exclusive: { label: "Exclusive", className: "bg-purple-900 text-purple-200 border border-purple-700", glow: true },
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans selection:bg-[#1a1a1a] selection:text-white scroll-smooth">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#faf9f6]/90 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-wider italic">Galatamu.</Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-[0.2em] uppercase">
            <a href="#beranda" className="text-gray-400 hover:text-[#1a1a1a] transition">Beranda</a>
            <a href="#fitur" className="text-gray-400 hover:text-[#1a1a1a] transition">Fitur</a>
            <a href="#katalog" className="text-gray-400 hover:text-[#1a1a1a] transition">Katalog</a>
            <a href="#harga" className="text-gray-400 hover:text-[#1a1a1a] transition">Harga</a>
            <a href="#faq" className="text-gray-400 hover:text-[#1a1a1a] transition">FAQ</a>
            <Link href="/editor" className="px-8 py-3 bg-[#1a1a1a] text-white rounded-full hover:bg-gray-800 transition shadow-xl shadow-gray-200">
              Buat Undangan
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-[#1a1a1a]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`md:hidden fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center gap-8 transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <button className="absolute top-6 right-6 p-2 text-[#1a1a1a]" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={32} />
        </button>
        <a href="#beranda" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif font-bold text-[#1a1a1a] hover:italic transition-all">Beranda</a>
        <a href="#fitur" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif font-bold text-[#1a1a1a] hover:italic transition-all">Fitur</a>
        <a href="#katalog" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif font-bold text-[#1a1a1a] hover:italic transition-all">Katalog</a>
        <a href="#harga" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif font-bold text-[#1a1a1a] hover:italic transition-all">Harga</a>
        <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif font-bold text-[#1a1a1a] hover:italic transition-all">FAQ</a>
        <Link href="/editor" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 px-10 py-4 bg-[#1a1a1a] text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-xl">
          Buat Undangan
        </Link>
      </div>

      {/* Hero Section */}
      <section id="beranda" className="relative min-h-[100vh] flex items-center justify-center pt-20 overflow-hidden bg-[#faf9f6]">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" alt="Wedding" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f6]/95 via-[#faf9f6]/80 to-[#faf9f6]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
          <FadeIn>
            <span className="inline-block py-1.5 px-5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-8 shadow-sm">
              Undangan Digital Premium #1
            </span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter mb-8 text-[#1a1a1a] leading-[0.9] px-2 italic">
              Simple. Mewah. <br className="hidden sm:block"/>Berkesan.
            </h1>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Buat undangan digital eksklusif hanya dalam 10 menit. Tanpa ribet, langsung aktif, dan bisa diisi sendiri. Harga mulai <span className="font-bold text-[#1a1a1a]">Rp 69.000</span>.
            </p>
          </FadeIn>
          <FadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#katalog" className="w-full sm:w-auto px-10 py-5 bg-[#1a1a1a] text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2">
                Lihat Katalog <ChevronRight size={18} />
              </a>
              <Link href="/editor" className="w-full sm:w-auto px-10 py-5 bg-white border border-gray-200 text-[#1a1a1a] rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center">
                Pesan Sekarang
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale group">
               <div className="flex flex-col items-center"><p className="text-[9px] font-bold uppercase tracking-widest">Premium Quality</p></div>
               <div className="w-px h-4 bg-gray-300" />
               <div className="flex flex-col items-center"><p className="text-[9px] font-bold uppercase tracking-widest">Fast Delivery</p></div>
               <div className="w-px h-4 bg-gray-300" />
               <div className="flex flex-col items-center"><p className="text-[9px] font-bold uppercase tracking-widest">Self Editor</p></div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-24">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-4 block italic">Our Ecosystem</span>
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#1a1a1a]">Fitur Modern & Eksklusif</h2>
            </div>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {FEATURES.map((feat, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="group flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-[#faf9f6] border border-gray-100 rounded-[2.5rem] flex items-center justify-center text-[#1a1a1a] mb-8 group-hover:scale-110 group-hover:bg-[#1a1a1a] group-hover:text-white transition-all duration-700 shadow-xl shadow-gray-100/50">
                    {feat.icon}
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-4 text-[#1a1a1a]">{feat.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed max-w-xs text-sm">{feat.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How To Order */}
      <HowToOrder />

      {/* Katalog Tema */}
      <section id="katalog" className="py-32 px-6 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-4 block italic">Our Gallery</span>
              <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8 text-[#1a1a1a]">Pilih Tema Impian</h2>
              <p className="text-gray-500 font-light max-w-2xl mx-auto text-lg mb-12">
                Desain eksklusif yang dirancang oleh desainer profesional untuk memastikan undangan Anda tampil memukau di layar tamu.
              </p>
              
              {/* Tier Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {TIERS.map((tier) => (
                  <button
                    key={tier.key}
                    onClick={() => setActiveTier(tier.key)}
                    className={`group px-7 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                      activeTier === tier.key
                        ? tier.key === "exclusive"
                          ? "bg-gradient-to-r from-purple-900 to-purple-700 text-white shadow-2xl shadow-purple-500/40 scale-105"
                          : tier.key === "premium"
                          ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-2xl shadow-amber-400/40 scale-105"
                          : "bg-[#1a1a1a] text-white shadow-2xl shadow-gray-400"
                        : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:text-[#1a1a1a]"
                    }`}
                  >
                    <span>{tier.icon}</span>
                    {tier.label}
                    {tier.key !== "Semua" && (
                      <span className={`text-[8px] opacity-60 hidden sm:inline ${
                        activeTier === tier.key ? "text-white" : ""
                      }`}>— {tier.duration}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredThemes.map((theme, idx) => {
              const badge = TIER_BADGE[theme.tier || "basic"];
              const isExclusive = theme.tier === "exclusive";
              return (
              <FadeIn key={theme.id} delay={0.2 + idx * 0.1}>
                <div className={`group rounded-[3rem] overflow-hidden ${theme.bg} border ${theme.border} shadow-2xl transition-all duration-700 hover:-translate-y-2 relative ${
                  isExclusive ? "shadow-purple-500/20 hover:shadow-purple-500/40 hover:shadow-2xl" : "shadow-gray-200/50 hover:shadow-2xl"
                }`}>
                  {/* Tier Badge */}
                  <div className="absolute top-4 left-4 z-[150]">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm ${
                      badge?.className
                    } ${
                      isExclusive ? "animate-pulse" : ""
                    }`}>
                      {theme.tier === "exclusive" && <span>♦</span>}
                      {theme.tier === "premium" && <span>★</span>}
                      {theme.tier === "basic" && <span>○</span>}
                      {badge?.label}
                    </span>
                  </div>
                  {/* Preview Area */}
                  <div className={`aspect-[3/4] relative overflow-hidden p-8 bg-gradient-to-br ${theme.previewBg} flex items-center justify-center cursor-pointer group`} onClick={() => setPreviewTheme(theme.id)}>
                    <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-1000">
                      <PremiumPhoneMockup className="scale-[0.8] origin-top">
                         <div className={`w-full h-full flex flex-col p-4 ${theme.bg} overflow-hidden`}>
                            {/* Timeline-like Preview */}
                            <div className="flex gap-4 h-full">
                               <div className="w-px bg-gray-200 relative">
                                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                                     <Heart size={8} className="text-red-400 fill-current" />
                                  </div>
                                  <div className="absolute top-48 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                                     <Heart size={8} className="text-red-400 fill-current" />
                                  </div>
                               </div>
                               <div className="flex-1 space-y-6 pt-4">
                                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                                     <div className="aspect-video bg-gray-100">
                                        <img src={theme.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                     </div>
                                     <div className="p-4">
                                        <h5 className={`font-serif font-bold text-xs ${theme.textColor}`}>The Wedding of</h5>
                                        <p className="text-[8px] text-gray-400 mt-1">20 December 2026</p>
                                        <p className="text-[8px] text-gray-500 mt-2 line-clamp-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...</p>
                                     </div>
                                  </div>

                                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                                     <div className="aspect-video bg-gray-100">
                                        <img src={theme.thumbnail2} alt="Preview" className="w-full h-full object-cover" />
                                     </div>
                                     <div className="p-4">
                                        <h5 className={`font-serif font-bold text-xs ${theme.textColor}`}>Our Journey</h5>
                                        <p className="text-[8px] text-gray-500 mt-2 line-clamp-2">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore...</p>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </PremiumPhoneMockup>
                    </div>

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center z-[140]">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 bg-white px-8 py-4 rounded-full flex items-center gap-3 shadow-2xl text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest transform translate-y-8 group-hover:translate-y-0">
                        <Eye size={16} /> Live Preview
                      </div>
                    </div>
                  </div>

                  <div className={`p-10 text-center bg-white`}>
                    <h3 className={`font-serif font-bold text-3xl ${theme.textColor} mb-1 italic`}>{theme.name}</h3>
                    <p className={`${theme.tagColor} text-[10px] mb-2 font-bold uppercase tracking-[0.3em] opacity-60`}>{theme.tagline}</p>
                    {/* Duration badge */}
                    <div className="flex justify-center mb-8">
                      <span className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        theme.tier === "exclusive"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : theme.tier === "premium"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : "bg-gray-50 text-gray-500 border border-gray-200"
                      }`}>
                        ⏱ {theme.duration}
                      </span>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => setPreviewTheme(theme.id)} className={`flex-1 py-4 border ${theme.btnBorder} rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all duration-500 flex items-center justify-center gap-2`}>
                         Preview
                       </button>
                       <Link href={`/editor?theme=${theme.id}`} className={`flex-1 py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all duration-500 text-center shadow-xl hover:bg-orange-500`}>
                         Gunakan
                       </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <PricingTable />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-40 px-6 bg-[#1a1a1a] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
             <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 mb-8 block italic">Limited Offer</span>
            <h2 className="font-serif text-5xl md:text-8xl font-bold mb-10 tracking-tighter leading-none italic">Abadikan Momen <br/> Terbaik Anda.</h2>
            <p className="text-white/40 font-light text-xl mb-16 max-w-2xl mx-auto leading-relaxed">Jangan tunda kebahagiaan Anda. Buat undangan digital premium sekarang dan nikmati penawaran spesial kami.</p>
            <Link href="/editor" className="inline-flex px-12 py-6 bg-white text-[#1a1a1a] rounded-full font-bold tracking-[0.4em] uppercase text-xs hover:bg-orange-500 hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95">
              Buat Undangan Saya
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* WhatsApp Floating */}
      <WhatsAppFloat />

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-white/5 pt-32 pb-16 px-6 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <h2 className="font-serif text-4xl font-bold tracking-wider italic mb-8">Galatamu.</h2>
            <p className="text-white/30 font-light max-w-sm leading-relaxed text-sm">
              Solusi undangan digital premium untuk hari spesial Anda. Kami menggabungkan seni desain klasik dengan kemudahan teknologi modern untuk menciptakan pengalaman yang tak terlupakan.
            </p>
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-[0.3em] text-[10px] mb-8 text-white/50">Navigasi</h3>
            <ul className="space-y-4 text-white/30 font-medium text-xs tracking-widest uppercase">
              <li><a href="#beranda" className="hover:text-white transition">Beranda</a></li>
              <li><a href="#fitur" className="hover:text-white transition">Fitur</a></li>
              <li><a href="#katalog" className="hover:text-white transition">Katalog</a></li>
              <li><a href="#harga" className="hover:text-white transition">Harga</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-[0.3em] text-[10px] mb-8 text-white/50">Connect</h3>
            <ul className="space-y-4 text-white/30 font-medium text-xs tracking-widest uppercase">
              <li><a href="https://wa.me/6289687934761" className="hover:text-white transition">WhatsApp Admin</a></li>
              <li><a href="https://instagram.com/galatamu" className="hover:text-white transition">Instagram</a></li>
              <li><a href="mailto:hello@galatamu.com" className="hover:text-white transition">Email Support</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center border-t border-white/5 pt-16 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-white/20 font-bold tracking-[0.5em] uppercase">
          <p>&copy; {new Date().getFullYear()} Galatamu Invitation — All Rights Reserved.</p>
          <div className="flex gap-8">
             <span>Terms</span>
             <span>Privacy</span>
          </div>
        </div>
      </footer>

      {/* Live Preview Modal */}
      <PreviewModal
        isOpen={!!previewTheme}
        onClose={() => setPreviewTheme(null)}
        data={{ ...DEMO_DATA, theme_id: previewTheme || "amara_01", slug: "demo" } as any}
        themeId={previewTheme || "amara_01"}
        backButtonText="Tutup Preview"
      />
    </main>
  );
}
