"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import FadeIn from "./FadeIn";

const FAQS = [
  {
    q: "Berapa lama proses pembuatannya?",
    a: "Sangat cepat! Anda bisa membuat undangan sendiri melalui editor kami dalam waktu kurang dari 10 menit. Setelah data diisi dan pembayaran dikonfirmasi, undangan Anda langsung aktif."
  },
  {
    q: "Apakah data undangan bisa diubah setelah dipublikasi?",
    a: "Tentu saja. Anda akan mendapatkan link khusus untuk mengedit data kapan saja tanpa batas, baik itu mengubah foto, mengganti lagu, atau mengupdate lokasi acara."
  },
  {
    q: "Bagaimana cara menyebarkan undangannya?",
    a: "Anda cukup menyalin link undangan yang telah kami buatkan. Anda bisa membagikannya melalui WhatsApp, Instagram, Facebook, atau media sosial lainnya."
  },
  {
    q: "Apakah ada fitur RSVP untuk tamu?",
    a: "Ya, setiap tema sudah dilengkapi dengan fitur RSVP otomatis. Tamu bisa memberikan konfirmasi kehadiran dan pesan doa, yang datanya bisa Anda lihat langsung di dashboard admin."
  },
  {
    q: "Apakah musik latar bisa diganti?",
    a: "Sangat bisa. Kami menyediakan library musik premium, atau Anda juga bisa memasukkan link musik (MP3) kustom pilihan Anda sendiri."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 px-6 bg-[#faf9f6]">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="text-center mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block">Bantuan</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a]">Pertanyaan Umum</h2>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm transition-all hover:shadow-md">
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-8 py-7 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-serif text-lg md:text-xl font-bold text-[#1a1a1a]">{faq.q}</span>
                  <div className={`p-2 rounded-full transition-colors ${openIndex === idx ? 'bg-[#1a1a1a] text-white' : 'bg-gray-50 text-gray-400'}`}>
                    {openIndex === idx ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-8 text-gray-500 font-light leading-relaxed">
                        <div className="w-full h-px bg-gray-50 mb-6" />
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
