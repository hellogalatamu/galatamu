"use client";

import { useState } from "react";
import { Download, MessageCircle, CheckCircle } from "lucide-react";
import { WishData } from "@/components/themes/types";
import { updateWishes } from "@/app/actions";

export default function GuestbookTab({ 
  wishes, 
  slug, 
  onUpdate 
}: { 
  wishes: WishData[]; 
  slug: string; 
  onUpdate: (wishes: WishData[]) => void;
}) {
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [isReplying, setIsReplying] = useState<{ [key: number]: boolean }>({});
  const [activeReplyBox, setActiveReplyBox] = useState<number | null>(null);

  const totalHadir = wishes.filter(w => w.presence === 'hadir').length;
  const totalTidak = wishes.filter(w => w.presence === 'tidak').length;

  const exportGuestbookCSV = () => {
    const headers = ["Nama Tamu", "Kehadiran", "Pesan", "Balasan Mempelai", "Waktu"];
    const rows = wishes.map(w => [
      `"${w.name.replace(/"/g, '""')}"`,
      `"${w.presence === 'hadir' ? 'Hadir' : 'Tidak Hadir'}"`,
      `"${w.message.replace(/"/g, '""')}"`,
      `"${w.reply ? w.reply.replace(/"/g, '""') : ''}"`,
      `"${new Date(w.timestamp).toLocaleString('id-ID')}"`
    ]);
    
    const csvContent = [headers.join(","), ...rows].join("\\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Buku_Tamu_${slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReplySubmit = async (wishIndex: number) => {
    const currentReply = replyText[wishIndex];
    if (!currentReply) return;

    setIsReplying(prev => ({ ...prev, [wishIndex]: true }));
    const newWishes = [...wishes];
    newWishes[wishIndex] = { ...newWishes[wishIndex], reply: currentReply };

    const success = await updateWishes(slug, newWishes);
    if (success) {
      onUpdate(newWishes);
      setReplyText(prev => ({ ...prev, [wishIndex]: '' }));
      setActiveReplyBox(null);
    } else {
      alert('Gagal menyimpan balasan.');
    }
    setIsReplying(prev => ({ ...prev, [wishIndex]: false }));
  };

  if (!wishes || wishes.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
        <div className="text-5xl mb-4">📖</div>
        <p className="text-gray-500 font-light">Belum ada tamu yang mengisi buku tamu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      {/* Statistik Section */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Hadir</p>
          <p className="text-4xl font-serif font-bold text-green-600">{totalHadir}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Tidak Hadir</p>
          <p className="text-4xl font-serif font-bold text-gray-400">{totalTidak}</p>
        </div>
      </section>

      {/* Daftar Tamu Section */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-medium">Daftar Ucapan & Kehadiran</h2>
          <button 
            onClick={exportGuestbookCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-sm"
          >
            <Download size={16} /> Download CSV
          </button>
        </div>
        
        <div className="divide-y divide-gray-100 max-h-[800px] overflow-y-auto">
          {wishes.map((wish, idx) => (
            <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-[#1a1a1a] text-lg">{wish.name}</h3>
                  <p className="text-xs text-gray-400">{new Date(wish.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${wish.presence === 'hadir' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {wish.presence === 'hadir' ? '✓ Hadir' : '✕ Tidak Hadir'}
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                <p className="text-gray-700 text-sm leading-relaxed">&quot;{wish.message}&quot;</p>
              </div>

              {/* Reply Section */}
              {wish.reply ? (
                <div className="ml-8 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={14} className="text-blue-500" />
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Balasan Anda</p>
                  </div>
                  <p className="text-sm text-blue-900 leading-relaxed">{wish.reply}</p>
                </div>
              ) : (
                <div className="ml-8">
                  {activeReplyBox === idx ? (
                    <div className="space-y-3">
                      <textarea
                        value={replyText[idx] || ""}
                        onChange={(e) => setReplyText(prev => ({ ...prev, [idx]: e.target.value }))}
                        placeholder="Tulis balasan Anda untuk tamu ini..."
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReplySubmit(idx)}
                          disabled={isReplying[idx] || !replyText[idx]}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                        >
                          {isReplying[idx] ? 'Menyimpan...' : 'Kirim Balasan'}
                        </button>
                        <button
                          onClick={() => {
                            setActiveReplyBox(null);
                            setReplyText(prev => ({ ...prev, [idx]: '' }));
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveReplyBox(idx)}
                      className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-800 transition"
                    >
                      <MessageCircle size={16} /> Balas Ucapan
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
