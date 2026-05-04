"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import FadeIn from "./FadeIn";

const PACKAGES = [
  {
    name: "Basic",
    price: "Rp 69.000",
    period: "Masa Aktif 3 Bulan",
    features: [
      "Custom Nama Tamu",
      "Musik Latar (Standar)",
      "Navigasi Google Maps",
      "RSVP & Ucapan",
      "Galeri (Maks. 3 Foto)",
      "Digital Envelope (Amplop)",
    ],
    cta: "Pilih Paket Basic",
    highlight: false,
  },
  {
    name: "Premium",
    price: "Rp 99.000",
    period: "Masa Aktif 6 Bulan",
    features: [
      "Semua Fitur Basic",
      "Masa Aktif Lebih Lama",
      "Galeri (Maks. 10 Foto)",
      "Video Pre-wedding",
      "Musik Latar Premium",
      "Prioritas Support Admin",
    ],
    cta: "Pilih Paket Premium",
    highlight: true,
  },
  {
    name: "Exclusive",
    price: "Rp 149.000",
    period: "Masa Aktif 1 Tahun",
    features: [
      "Semua Fitur Premium",
      "Live Streaming Link",
      "Google Calendar Sync",
      "Tanpa Logo Galatamu",
      "Revisi Sepuasnya",
      "Galeri (Maks. 20 Foto)",
    ],
    cta: "Pilih Paket Exclusive",
    highlight: false,
  },
];

export default function PricingTable() {
  return (
    <section id="harga" className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-50 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-50 -ml-48 -mb-48"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3 block">Investasi Kebahagiaan</span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#1a1a1a] mb-6">Paket Harga Spesial</h2>
            <p className="text-gray-500 font-light max-w-2xl mx-auto text-lg leading-relaxed">
              Pilih paket yang sesuai dengan kebutuhan Anda. Semua paket sudah termasuk fitur utama undangan digital premium.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {PACKAGES.map((pkg, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className={`relative h-full flex flex-col p-10 rounded-[3rem] border transition-all duration-500 hover:-translate-y-2 ${pkg.highlight ? 'bg-[#1a1a1a] text-white border-transparent shadow-2xl scale-105 z-10' : 'bg-[#faf9f6] border-gray-100 text-[#1a1a1a] shadow-sm'}`}>
                {pkg.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                    <Sparkles size={12} /> Paling Populer
                  </div>
                )}
                
                <div className="mb-10">
                  <h3 className={`text-sm font-bold uppercase tracking-[0.3em] mb-4 ${pkg.highlight ? 'text-orange-400' : 'text-gray-400'}`}>{pkg.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-bold font-serif">{pkg.price}</span>
                  </div>
                  <p className={`text-xs mt-3 font-medium uppercase tracking-widest ${pkg.highlight ? 'text-white/40' : 'text-gray-400'}`}>{pkg.period}</p>
                </div>

                <div className="space-y-5 mb-12 flex-1">
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-1 p-0.5 rounded-full ${pkg.highlight ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        <Check size={10} />
                      </div>
                      <span className={`text-sm font-light leading-snug ${pkg.highlight ? 'text-white/80' : 'text-gray-600'}`}>{feat}</span>
                    </div>
                  ))}
                </div>

                <a 
                  href={`https://wa.me/6289687934761?text=${encodeURIComponent(`Halo Admin Galatamu! Saya tertarik memesan Paket *${pkg.name}* (${pkg.price}). Bagaimana langkah selanjutnya?`)}`}
                  target="_blank"
                  className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] text-center transition-all ${pkg.highlight ? 'bg-white text-black hover:bg-orange-500 hover:text-white shadow-xl' : 'bg-[#1a1a1a] text-white hover:bg-orange-500 shadow-md'}`}
                >
                  {pkg.cta}
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
