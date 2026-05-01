"use client";

import { useState, Suspense, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InvitationData } from "@/components/themes/types";
import { saveInvitationLocal } from "@/app/actions";
import ThemeRegistry from "@/components/ThemeRegistry";
import { useSearchParams } from "next/navigation";
import PhotoUpload from "@/components/PhotoUpload";

function EditorContent() {
  const searchParams = useSearchParams();
  const initialTheme = searchParams?.get("theme") || "amara_01";

  const [formData, setFormData] = useState<InvitationData>({
    theme_id: initialTheme,
    category: "Pernikahan",
    bride_data: {
      groom: "",
      bride: "",
      parents_groom: "",
      parents_bride: "",
    },
    event_data: {
      date: "",
      akad_time: "",
      akad_location: "",
      resepsi_time: "",
      resepsi_location: "",
    },
    hero_image: "",
    bg_middle: "",
    bg_bottom: "",
    groom_photo: "",
    bride_photo: "",
    gallery: [] as string[],
    love_story: [] as { year: string; title: string; desc: string }[],
    gifts: [] as { bank: string; acc: string; name: string }[],
    video: "",
    music_url: "",
    quote: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleBrideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bride_data: {
        ...prev.bride_data,
        [name]: value
      }
    }));
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      event_data: {
        ...prev.event_data,
        [name]: value
      }
    }));
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // 1. Generate slug
      const groomSlug = formData.bride_data.groom.toLowerCase().replace(/[^a-z0-9]/g, '');
      const brideSlug = formData.bride_data.bride.toLowerCase().replace(/[^a-z0-9]/g, '');
      const slug = `${groomSlug}-${brideSlug}-${Math.floor(Math.random() * 1000)}`;

      // 2. Generate edit_token
      const edit_token = crypto.randomUUID();

      // 3. Simpan data ke Firestore (mock if db fails, but we use the real code)
      const dataToSave = {
        ...formData,
        slug,
        is_paid: false,
        edit_token,
        createdAt: new Date().toISOString()
      };

      try {
        const isDummy = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "dummy-api-key";
        
        if (isDummy) {
          // Firebase not configured, use local file database
          await saveInvitationLocal(dataToSave);
        } else {
          // Try Firebase with a 5-second timeout
          await Promise.race([
            addDoc(collection(db, "invitations"), dataToSave),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase Timeout")), 5000))
          ]);
        }
      } catch (err) {
        console.warn("Firebase save failed. Proceeding with local file fallback...", err);
        await saveInvitationLocal(dataToSave);
      }

      // 4. Simpan edit_token di LocalStorage
      localStorage.setItem(`galatamu_token_${slug}`, edit_token);

      // 5. Kirim pesan WA ke Admin
      const THEMES_MAP: Record<string, string> = {
        'amara_01': 'Amara Premium',
        'rustic_01': 'Rustic Botanical',
        'modern_01': 'Modern Editorial',
        'royal_01': 'Royal Baroque',
        'islamic_01': "Islamic Syar'i Barakah",
        'emerald_01': 'Emerald Green Glow',
        'vintage_01': 'Vintage Elegance',
        'minimalist_white_01': 'Minimalist White',
        'lilac_01': 'Lilac Dream',
        'terracotta_01': 'Terracotta Warmth',
        'navy_01': 'Navy Elegance',
        'romantic_rose_01': 'Romantic Rose',
        'marble_luxury_01': 'Marble Luxury',
        'midnight_01': 'Midnight Dark',
        'gold_white_01': 'Golden White',
        'jawa_01': 'Jawa Traditional',
        'minang_01': 'Minang Traditional',
        'sunda_01': 'Sunda Traditional',
        'batak_01': 'Batak Traditional',
        'bali_01': 'Bali Traditional',
        'bugis_01': 'Bugis Traditional',
      };
      const themeName = THEMES_MAP[formData.theme_id || ''] || formData.theme_id;
      const waMessage = encodeURIComponent(
        `Assalamu'alaikum, Kak Admin Galatamu 👋\n\n` +
        `Saya ingin melanjutkan proses pembuatan undangan digital saya. Berikut detail pesanannya:\n\n` +
        `👰🤵 *Nama Mempelai:*\n` +
        `${formData.bride_data.groom} & ${formData.bride_data.bride}\n\n` +
        `🎨 *Tema yang Dipilih:*\n` +
        `${themeName}\n\n` +
        `📂 *Kategori:*\n` +
        `${formData.category || "Pernikahan"}\n\n` +
        `🔗 *Link Undangan:*\n` +
        `${window.location.origin}/${slug}\n\n` +
        `Saya sudah siap melakukan pembayaran. Mohon informasi nomor rekening dan langkah selanjutnya ya Kak. 🙏\n\n` +
        `Terima kasih!`
      );
      window.open(`https://wa.me/6289687934761?text=${waMessage}`, "_blank");

      alert(`Pesanan berhasil dibuat! Silakan lanjutkan konfirmasi via WhatsApp.`);

    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-[#1a1a1a]">
      {/* Kiri: Form Editor */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto p-8 border-r border-gray-200 bg-white">
        <h1 className="text-3xl font-serif font-bold mb-2">Editor Undangan</h1>
        <p className="text-gray-500 mb-8 font-light">Lengkapi data untuk melihat preview secara real-time.</p>

        <div className="space-y-8">
          {/* Section Kategori */}
          <section>
            <h2 className="text-xl font-medium mb-4 pb-2 border-b border-gray-100">Kategori Undangan</h2>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Pilih Kategori</label>
              <select 
                value={formData.category || "Pernikahan"} 
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none bg-white"
              >
                <option value="Pernikahan">Pernikahan & Pertunangan</option>
              </select>
            </div>
          </section>

          {/* Section Mempelai */}
          <section>
            <h2 className="text-xl font-medium mb-4 pb-2 border-b border-gray-100">Data Pemilik Acara (Mempelai/Yang Merayakan)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama Pria</label>
                <input type="text" name="groom" value={formData.bride_data.groom} onChange={handleBrideChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="Contoh: Andi" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama Wanita</label>
                <input type="text" name="bride" value={formData.bride_data.bride} onChange={handleBrideChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="Contoh: Rina" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Nama Orang Tua Pria</label>
                <input type="text" name="parents_groom" value={formData.bride_data.parents_groom} onChange={handleBrideChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="Bapak X & Ibu Y" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Nama Orang Tua Wanita</label>
                <input type="text" name="parents_bride" value={formData.bride_data.parents_bride} onChange={handleBrideChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="Bapak A & Ibu B" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Instagram Pria</label>
                <input type="text" name="groom_ig" value={formData.bride_data.groom_ig || ''} onChange={handleBrideChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="username_ig" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Instagram Wanita</label>
                <input type="text" name="bride_ig" value={formData.bride_data.bride_ig || ''} onChange={handleBrideChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="username_ig" />
              </div>
            </div>
          </section>

          {/* Section Acara */}
          <section>
            <h2 className="text-xl font-medium mb-4 pb-2 border-b border-gray-100">Detail Acara</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tanggal Acara</label>
                <input type="date" name="date" value={formData.event_data.date} onChange={handleEventChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Waktu Akad</label>
                  <input type="text" name="akad_time" value={formData.event_data.akad_time} onChange={handleEventChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="08:00 - Selesai" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Waktu Resepsi</label>
                  <input type="text" name="resepsi_time" value={formData.event_data.resepsi_time} onChange={handleEventChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="11:00 - 14:00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Lokasi Akad</label>
                  <input type="text" name="akad_location" value={formData.event_data.akad_location} onChange={handleEventChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="Nama Tempat" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Lokasi Resepsi</label>
                  <input type="text" name="resepsi_location" value={formData.event_data.resepsi_location} onChange={handleEventChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="Nama Tempat" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Link Maps Akad</label>
                  <input type="text" name="akad_map" value={formData.event_data.akad_map || ''} onChange={handleEventChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="https://maps.app.goo.gl/..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Link Maps Resepsi</label>
                  <input type="text" name="resepsi_map" value={formData.event_data.resepsi_map || ''} onChange={handleEventChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="https://maps.app.goo.gl/..." />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Link Live Streaming (Opsional)</label>
                <input type="text" name="live_stream" value={formData.event_data.live_stream || ''} onChange={handleEventChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="https://youtube.com/live/..." />
              </div>
            </div>
          </section>

          {/* Section Tambahan: Video, Musik & Quotes */}
          <section>
            <h2 className="text-xl font-medium mb-4 pb-2 border-b border-gray-100">Konten Tambahan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Link Video YouTube (Opsional)</label>
                <input type="text" value={formData.video || ''} onChange={(e) => setFormData(prev => ({ ...prev, video: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Link Musik (URL MP3)</label>
                <input type="text" value={formData.music_url || ''} onChange={(e) => setFormData(prev => ({ ...prev, music_url: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="https://domain.com/musik.mp3" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quote / Ayat Suci</label>
                <textarea value={formData.quote || ''} onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" rows={3} placeholder="Tuliskan kata mutiara atau ayat suci..."></textarea>
              </div>
            </div>
          </section>

          {/* Section Media */}
          <section>
            <h2 className="text-xl font-medium mb-4 pb-2 border-b border-gray-100">Media & Foto</h2>
            <div className="space-y-6">
              <PhotoUpload 
                label="Background Utama (Hero/Cover)" 
                value={formData.hero_image} 
                onChange={(base64) => setFormData(prev => ({ ...prev, hero_image: base64 }))}
                onClear={() => setFormData(prev => ({ ...prev, hero_image: "" }))}
              />
              <div className="grid grid-cols-2 gap-6">
                <PhotoUpload 
                  label="Background Tengah (Mempelai/Acara)" 
                  value={formData.bg_middle} 
                  onChange={(base64) => setFormData(prev => ({ ...prev, bg_middle: base64 }))}
                  onClear={() => setFormData(prev => ({ ...prev, bg_middle: "" }))}
                />
                <PhotoUpload 
                  label="Background Bawah (RSVP/Footer)" 
                  value={formData.bg_bottom} 
                  onChange={(base64) => setFormData(prev => ({ ...prev, bg_bottom: base64 }))}
                  onClear={() => setFormData(prev => ({ ...prev, bg_bottom: "" }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <PhotoUpload 
                  label="Foto Mempelai Pria" 
                  value={formData.groom_photo} 
                  onChange={(base64) => setFormData(prev => ({ ...prev, groom_photo: base64 }))}
                  onClear={() => setFormData(prev => ({ ...prev, groom_photo: "" }))}
                />
                <PhotoUpload 
                  label="Foto Mempelai Wanita" 
                  value={formData.bride_photo} 
                  onChange={(base64) => setFormData(prev => ({ ...prev, bride_photo: base64 }))}
                  onClear={() => setFormData(prev => ({ ...prev, bride_photo: "" }))}
                />
              </div>

              {/* Gallery Section */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Galeri Foto (Maksimal 6 Foto)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <PhotoUpload 
                      key={index}
                      label={`Foto ${index + 1}`} 
                      value={formData.gallery?.[index]} 
                      onChange={(base64) => {
                        const newGallery = [...(formData.gallery || [])];
                        newGallery[index] = base64;
                        setFormData(prev => ({ ...prev, gallery: newGallery }));
                      }}
                      onClear={() => {
                        const newGallery = [...(formData.gallery || [])];
                        newGallery[index] = "";
                        setFormData(prev => ({ ...prev, gallery: newGallery }));
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-[10px] text-gray-400 italic text-center">*Foto akan disimpan secara otomatis di database undangan Anda.</p>
            </div>
          </section>

          {/* Section Love Story */}
          <section>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-medium">Love Story</h2>
              <button onClick={() => setFormData(prev => ({ ...prev, love_story: [...(prev.love_story || []), { year: "", title: "", desc: "" }] }))} className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200">+ Tambah Cerita</button>
            </div>
            <div className="space-y-4">
              {formData.love_story?.map((story, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-xl relative">
                  <button onClick={() => setFormData(prev => ({ ...prev, love_story: prev.love_story?.filter((_, i) => i !== idx) }))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">×</button>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input type="text" value={story.year} onChange={(e) => {
                      const newStory = [...(formData.love_story || [])];
                      newStory[idx].year = e.target.value;
                      setFormData(prev => ({ ...prev, love_story: newStory }));
                    }} placeholder="Tahun" className="col-span-1 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                    <input type="text" value={story.title} onChange={(e) => {
                      const newStory = [...(formData.love_story || [])];
                      newStory[idx].title = e.target.value;
                      setFormData(prev => ({ ...prev, love_story: newStory }));
                    }} placeholder="Judul Momen" className="col-span-2 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                  </div>
                  <textarea value={story.desc} onChange={(e) => {
                    const newStory = [...(formData.love_story || [])];
                    newStory[idx].desc = e.target.value;
                    setFormData(prev => ({ ...prev, love_story: newStory }));
                  }} placeholder="Cerita singkat..." className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none text-sm" rows={2}></textarea>
                </div>
              ))}
            </div>
          </section>

          {/* Section Digital Gift */}
          <section>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-medium">Amplop Digital</h2>
              <button onClick={() => setFormData(prev => ({ ...prev, gifts: [...(prev.gifts || []), { bank: "", acc: "", name: "" }] }))} className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200">+ Tambah Rekening</button>
            </div>
            <div className="space-y-4">
              {formData.gifts?.map((gift, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-xl relative">
                  <button onClick={() => setFormData(prev => ({ ...prev, gifts: prev.gifts?.filter((_, i) => i !== idx) }))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">×</button>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={gift.bank} onChange={(e) => {
                      const newGifts = [...(formData.gifts || [])];
                      newGifts[idx].bank = e.target.value;
                      setFormData(prev => ({ ...prev, gifts: newGifts }));
                    }} placeholder="Nama Bank/E-Wallet" className="px-3 py-1 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                    <input type="text" value={gift.acc} onChange={(e) => {
                      const newGifts = [...(formData.gifts || [])];
                      newGifts[idx].acc = e.target.value;
                      setFormData(prev => ({ ...prev, gifts: newGifts }));
                    }} placeholder="Nomor Rekening" className="px-3 py-1 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                    <input type="text" value={gift.name} onChange={(e) => {
                      const newGifts = [...(formData.gifts || [])];
                      newGifts[idx].name = e.target.value;
                      setFormData(prev => ({ ...prev, gifts: newGifts }));
                    }} placeholder="Atas Nama" className="col-span-2 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Checkout Action */}
          <div className="pt-6 border-t border-gray-100">
            <button 
              onClick={handleCheckout}
              disabled={isLoading || !formData.bride_data.groom || !formData.bride_data.bride}
              className="w-full py-4 bg-[#1a1a1a] text-white rounded-xl font-medium tracking-wide hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {isLoading ? "Memproses..." : "Pesan & Aktifkan"}
            </button>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Setelah pesan, Anda akan diarahkan ke WhatsApp untuk aktivasi.
            </p>
          </div>
        </div>
      </div>

      {/* Kanan: Live Preview */}
      <div className="hidden lg:block w-1/2 h-full bg-[#f4f2e9] relative">
        <div className="absolute inset-0 overflow-y-auto">
          {/* We wrap ThemeRegistry inside a container to simulate mobile view */}
          <div className="max-w-[400px] mx-auto my-8 min-h-[800px] bg-white shadow-2xl rounded-3xl overflow-hidden border-8 border-white ring-1 ring-gray-200">
            <ThemeRegistry themeId={formData.theme_id || "amara_01"} data={formData} previewMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat Editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}
