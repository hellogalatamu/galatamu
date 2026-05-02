"use client";

import { useState, Suspense, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InvitationData } from "@/components/themes/types";
import { saveInvitationLocal } from "@/app/actions";
import { useSearchParams } from "next/navigation";
import PhotoUpload from "@/components/PhotoUpload";
import { THEMES } from "@/lib/themes";
import { Eye } from "lucide-react";
import PreviewModal from "@/components/PreviewModal";

function EditorContent() {
  const searchParams = useSearchParams();
  const initialTheme = searchParams?.get("theme") || "amara_01";

  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<InvitationData>({
    theme_id: initialTheme,
    category: "Pernikahan",
    bride_data: { groom: "", bride: "", parents_groom: "", parents_bride: "" },
    event_data: { date: "", akad_time: "", akad_location: "", resepsi_time: "", resepsi_location: "" },
    hero_image: "", bg_middle: "", bg_bottom: "",
    groom_photo: "", bride_photo: "",
    gallery: [] as string[],
    love_story: [] as { year: string; title: string; desc: string }[],
    gifts: [] as { bank: string; acc: string; name: string }[],
    video: "", music_url: "", quote: "",
  });

  useEffect(() => {
    if (initialTheme && initialTheme !== formData.theme_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({ ...prev, theme_id: initialTheme }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTheme]);

  const handleBrideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, bride_data: { ...prev.bride_data, [name]: value } }));
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, event_data: { ...prev.event_data, [name]: value } }));
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const groomSlug = formData.bride_data.groom.toLowerCase().replace(/[^a-z0-9]/g, "");
      const brideSlug = formData.bride_data.bride.toLowerCase().replace(/[^a-z0-9]/g, "");
      const slug = `${groomSlug}-${brideSlug}-${Math.floor(Math.random() * 1000)}`;
      const edit_token = crypto.randomUUID();
      const dataToSave = { ...formData, slug, is_paid: false, edit_token, createdAt: new Date().toISOString() };
      try {
        const isDummy = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "dummy-api-key";
        if (isDummy) { await saveInvitationLocal(dataToSave); }
        else {
          await Promise.race([
            addDoc(collection(db, "invitations"), dataToSave),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
          ]);
        }
      } catch { await saveInvitationLocal(dataToSave); }
      localStorage.setItem(`galatamu_token_${slug}`, edit_token);
      const THEMES_MAP: Record<string, string> = {};
      THEMES.forEach(t => THEMES_MAP[t.id] = t.name);
      const themeName = THEMES_MAP[formData.theme_id || ""] || formData.theme_id;
      const waMessage = encodeURIComponent(
        `Assalamu'alaikum, Kak Admin Galatamu 👋\n\nSaya ingin melanjutkan proses pembuatan undangan digital saya.\n\n` +
        `👰🤵 *Nama:* ${formData.bride_data.groom} & ${formData.bride_data.bride}\n` +
        `🎨 *Tema:* ${themeName}\n` +
        `🔗 *Link:* ${window.location.origin}/${slug}\n\nMohon informasi selanjutnya. 🙏`
      );
      window.open(`https://wa.me/6289687934761?text=${waMessage}`, "_blank");
      alert("Pesanan berhasil dibuat! Silakan lanjutkan konfirmasi via WhatsApp.");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none transition-shadow text-sm";
  const sectionCls = "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <>
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={formData}
        themeId={formData.theme_id || "amara_01"}
      />

      <div className="min-h-screen bg-[#f7f6f3] text-[#1a1a1a]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
            <div>
              <h1 className="text-lg font-serif font-bold">Editor Undangan</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest hidden sm:block">Galatamu</p>
            </div>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white rounded-full text-sm font-semibold hover:bg-gray-800 active:scale-95 transition-all shadow-md"
            >
              <Eye size={16} />
              Preview Hasil
            </button>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-32 space-y-6">
          <div className="text-center py-4">
            <p className="text-gray-500 font-light">Pilih tema & isi data undangan. Klik <strong>Preview Hasil</strong> untuk melihat tampilan.</p>
          </div>



          {/* Data Pemilik Acara */}
          <div className={sectionCls}>
            <h2 className="text-base font-bold">Data Pemilik Acara</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Nama Pria</label><input type="text" name="groom" value={formData.bride_data.groom} onChange={handleBrideChange} className={inputCls} placeholder="Contoh: Andi" /></div>
              <div><label className={labelCls}>Nama Wanita</label><input type="text" name="bride" value={formData.bride_data.bride} onChange={handleBrideChange} className={inputCls} placeholder="Contoh: Rina" /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Orang Tua Pria</label><input type="text" name="parents_groom" value={formData.bride_data.parents_groom} onChange={handleBrideChange} className={inputCls} placeholder="Bapak X & Ibu Y" /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Orang Tua Wanita</label><input type="text" name="parents_bride" value={formData.bride_data.parents_bride} onChange={handleBrideChange} className={inputCls} placeholder="Bapak A & Ibu B" /></div>
            </div>
          </div>

          {/* Detail Acara */}
          <div className={sectionCls}>
            <h2 className="text-base font-bold">Detail Acara</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className={labelCls}>Tanggal Acara</label><input type="date" name="date" value={formData.event_data.date} onChange={handleEventChange} className={inputCls} /></div>
              <div><label className={labelCls}>Waktu Akad</label><input type="text" name="akad_time" value={formData.event_data.akad_time} onChange={handleEventChange} className={inputCls} placeholder="08:00 - Selesai" /></div>
              <div><label className={labelCls}>Waktu Resepsi</label><input type="text" name="resepsi_time" value={formData.event_data.resepsi_time} onChange={handleEventChange} className={inputCls} placeholder="11:00 - 14:00" /></div>
              <div><label className={labelCls}>Lokasi Akad</label><input type="text" name="akad_location" value={formData.event_data.akad_location} onChange={handleEventChange} className={inputCls} placeholder="Nama Tempat" /></div>
              <div><label className={labelCls}>Lokasi Resepsi</label><input type="text" name="resepsi_location" value={formData.event_data.resepsi_location} onChange={handleEventChange} className={inputCls} placeholder="Nama Tempat" /></div>
              <div><label className={labelCls}>Link Maps Akad</label><input type="text" name="akad_map" value={formData.event_data.akad_map || ""} onChange={handleEventChange} className={inputCls} placeholder="https://maps.app.goo.gl/..." /></div>
              <div><label className={labelCls}>Link Maps Resepsi</label><input type="text" name="resepsi_map" value={formData.event_data.resepsi_map || ""} onChange={handleEventChange} className={inputCls} placeholder="https://maps.app.goo.gl/..." /></div>
            </div>
          </div>

          {/* Konten Tambahan */}
          <div className={sectionCls}>
            <h2 className="text-base font-bold">Konten Tambahan</h2>
            <div><label className={labelCls}>Link Musik (URL MP3)</label><input type="text" value={formData.music_url || ""} onChange={(e) => setFormData(prev => ({ ...prev, music_url: e.target.value }))} className={inputCls} placeholder="https://domain.com/musik.mp3" /></div>
            <div><label className={labelCls}>Quote / Ayat Suci</label><textarea value={formData.quote || ""} onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))} className={inputCls + " resize-none"} rows={3} placeholder="Tuliskan kata mutiara..." /></div>
          </div>

          {/* Foto */}
          <div className={sectionCls}>
            <h2 className="text-base font-bold">Foto Mempelai</h2>
            <div className="grid grid-cols-2 gap-4">
              <PhotoUpload label="Foto Pria" value={formData.groom_photo} onChange={(b) => setFormData(prev => ({ ...prev, groom_photo: b }))} onClear={() => setFormData(prev => ({ ...prev, groom_photo: "" }))} />
              <PhotoUpload label="Foto Wanita" value={formData.bride_photo} onChange={(b) => setFormData(prev => ({ ...prev, bride_photo: b }))} onClear={() => setFormData(prev => ({ ...prev, bride_photo: "" }))} />
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <button
              onClick={() => setShowPreview(true)}
              className="w-full py-4 mb-4 border-2 border-[#1a1a1a] text-[#1a1a1a] rounded-2xl font-bold text-base flex items-center justify-center gap-3 hover:bg-[#1a1a1a] hover:text-white transition-all"
            >
              <Eye size={20} /> Preview Hasil Undangan
            </button>
            <button
              onClick={handleCheckout}
              disabled={isLoading || !formData.bride_data.groom || !formData.bride_data.bride}
              className="w-full py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold text-base hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isLoading ? "Memproses..." : "Pesan & Aktifkan via WhatsApp 🚀"}
            </button>
            <p className="text-xs text-gray-400 mt-3 text-center">Setelah pesan, Anda akan diarahkan ke WhatsApp untuk aktivasi.</p>
          </div>
        </main>
      </div>
    </>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat Editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}
