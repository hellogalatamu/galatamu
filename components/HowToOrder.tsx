"use client";

import FadeIn from "./FadeIn";
import { Search, Edit3, CreditCard, Send } from "lucide-react";

const STEPS = [
  {
    icon: <Search className="w-8 h-8" />,
    title: "Pilih Tema",
    desc: "Pilih desain yang paling sesuai dengan karakter Anda dari katalog kami."
  },
  {
    icon: <Edit3 className="w-8 h-8" />,
    title: "Isi Data",
    desc: "Lengkapi data mempelai, detail acara, foto galeri, hingga musik pilihan."
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Konfirmasi",
    desc: "Lakukan pembayaran dan admin akan mengaktifkan undangan Anda segera."
  },
  {
    icon: <Send className="w-8 h-8" />,
    title: "Sebarkan",
    desc: "Undangan siap disebarkan ke keluarga dan teman tercinta melalui link khusus."
  }
];

export default function HowToOrder() {
  return (
    <section id="alur" className="py-32 px-6 bg-[#1a1a1a] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-24">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/30 mb-4 block italic">Simple Process</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Langkah Mudah Memesan</h2>
            <div className="w-24 h-1 bg-white/10 mx-auto rounded-full"></div>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-4 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-white/5 z-0"></div>

          {STEPS.map((step, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-serif font-bold text-sm">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-white/40 font-light leading-relaxed text-sm max-w-[200px]">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
