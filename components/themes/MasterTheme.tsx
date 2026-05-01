'use client';

import React, { useState } from 'react';
import Countdown from '../logic/Countdown';
import { submitWish } from "@/app/actions";
import { InvitationData, WishData } from "./types";

interface MasterThemeProps {
  data: InvitationData;
  guestName?: string;
  previewMode?: boolean;
}

export default function MasterTheme({ data, guestName = "Tamu Undangan", previewMode = false }: MasterThemeProps) {
  // RSVP State
  const [wishes, setWishes] = useState<WishData[]>(data.wishes || []);
  const [rsvpName, setRsvpName] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [rsvpPresence, setRsvpPresence] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(previewMode);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    // Give a little time for DOM update before scroll
    setTimeout(() => {
      const section2 = document.getElementById('section-2');
      if (section2) {
        section2.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();
  const formattedDate = eventDate.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' . ');

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (previewMode) return alert("Mode preview: Form tidak dikirim.");
    if (!data.slug) return;
    
    setIsSubmitting(true);
    const newWish: WishData = {
      name: rsvpName || guestName,
      presence: rsvpPresence,
      message: rsvpMessage,
      timestamp: new Date().toISOString()
    };

    try {
      const success = await submitWish(data.slug, newWish);
      if (success) {
        setWishes([...wishes, newWish]);
        setRsvpMessage("");
        setRsvpPresence("");
        alert("Ucapan berhasil dikirim!");
      } else {
        alert("Gagal mengirim ucapan, coba lagi.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className={`flex flex-col w-full text-gray-800 transition-all duration-1000 ease-in-out ${
        !isOpen ? 'h-screen overflow-hidden' : 'min-h-screen overflow-auto'
      }`}
    >
      {/* Section 1: Hero / Cover */}
      <section 
        id="section-1"
        className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-slate-50 to-slate-100 relative shrink-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        
        <div className="z-10 flex flex-col items-center justify-center space-y-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Pernikahan</p>
          
          <h1 className="text-4xl md:text-5xl font-light tracking-wider text-slate-900 leading-tight">
            The Wedding of <br /> <span className="font-medium">{data.bride_data.groom} & {data.bride_data.bride}</span>
          </h1>
          
          <div className="w-12 h-px bg-slate-300 my-4"></div>
          
          <p className="text-sm text-slate-600 font-medium tracking-[0.2em]">
            {formattedDate}
          </p>
          
          <div className={`mt-8 transition-opacity duration-700 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button 
              onClick={handleOpenInvitation}
              className="px-8 py-3 bg-slate-900 text-white rounded-full text-xs uppercase tracking-[0.2em] font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
            >
              Buka Undangan
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Countdown & Mempelai */}
      {(isOpen || previewMode) && (
        <>
          <section 
            id="section-2"
            className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-white border-y border-slate-100 shrink-0"
          >
            <h2 className="text-sm font-semibold text-slate-800 mb-8 uppercase tracking-[0.3em]">
              Menuju Hari Bahagia
            </h2>

            <div className="mb-10 text-slate-600 space-y-3">
              <p className="text-lg font-serif italic text-slate-800">{data.bride_data.parents_groom}</p>
              <p className="text-xs uppercase tracking-widest text-slate-400">&</p>
              <p className="text-lg font-serif italic text-slate-800">{data.bride_data.parents_bride}</p>
              <div className="mt-4 inline-block px-4 py-2 bg-slate-50 border border-slate-100 rounded-full">
                <p className="text-[10px] tracking-widest uppercase font-semibold text-slate-500">Lokasi Akad: {data.event_data.akad_location}</p>
              </div>
            </div>
            
            <div className="w-full max-w-sm p-8 bg-slate-50 rounded-3xl shadow-inner border border-slate-100">
              <Countdown targetDate={eventDate} />
            </div>
          </section>

          {/* Section 3: RSVP & Buku Tamu */}
          <section 
            id="section-3"
            className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 shrink-0"
          >
            <div className="w-full max-w-sm mx-auto text-center">
              <h2 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-[0.3em]">
                RSVP & Kehadiran
              </h2>
              <p className="text-xs text-slate-500 mb-10 leading-relaxed max-w-[250px] mx-auto">
                Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
              </p>
              
              <form className="space-y-4 text-left w-full" onSubmit={handleSubmitRsvp}>
                <div>
                  <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                    Nama Lengkap
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all text-sm placeholder-slate-400 shadow-sm" 
                    placeholder="Tulis nama Anda" 
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="attendance" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                    Kehadiran
                  </label>
                  <select 
                    id="attendance" 
                    value={rsvpPresence}
                    onChange={(e) => setRsvpPresence(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all text-sm appearance-none shadow-sm"
                    required
                  >
                    <option value="">Pilih konfirmasi</option>
                    <option value="hadir">Ya, Saya akan hadir</option>
                    <option value="tidak">Maaf, tidak bisa hadir</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                    Pesan & Doa
                  </label>
                  <textarea 
                    id="message" 
                    rows={4}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all text-sm resize-none placeholder-slate-400 shadow-sm" 
                    placeholder="Berikan ucapan untuk kami"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 mt-4 bg-slate-900 text-white rounded-xl text-xs uppercase tracking-[0.2em] font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                </button>
              </form>

              {/* Ucapan List */}
              <div className="mt-12 space-y-4 text-left">
                {wishes.length > 0 && wishes.map((wish, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-800">{wish.name}</p>
                    <p className="text-[10px] text-slate-400 mb-2">{new Date(wish.timestamp).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-600">{wish.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
