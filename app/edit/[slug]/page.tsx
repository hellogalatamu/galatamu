"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ExternalLink, Share2, Copy } from "lucide-react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InvitationData } from "@/components/themes/AmaraTheme";
import PhotoUpload from "@/components/PhotoUpload";
import { musicLibrary } from "@/lib/musicLibrary";
import { Music, Play, Pause } from "lucide-react";

import { getInvitationLocal, updateInvitationLocal } from "@/app/actions";

function EditForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const slug = params?.slug as string;
  const token = searchParams?.get("token");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [formData, setFormData] = useState<InvitationData | null>(null);
  const [isLocalDb, setIsLocalDb] = useState(false);
  const [copied, setCopied] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<HTMLAudioElement | null>(null);
  
  // Guest Tool state
  const [isGuestToolOpen, setIsGuestToolOpen] = useState(false);
  const [guestNames, setGuestNames] = useState("");

  useEffect(() => {
    return () => {
      if (audioPreview) {
        audioPreview.pause();
      }
    };
  }, [audioPreview]);

  const togglePreview = (url: string, id: string) => {
    if (playingId === id) {
      audioPreview?.pause();
      setPlayingId(null);
    } else {
      if (audioPreview) audioPreview.pause();
      const newAudio = new Audio(url);
      newAudio.play();
      setAudioPreview(newAudio);
      setPlayingId(id);
      newAudio.onended = () => setPlayingId(null);
    }
  };

  useEffect(() => {
    async function validateAndFetch() {
      if (!slug || !token) {
        setError("Error 401: Unauthorized (Token or Slug missing)");
        setIsLoading(false);
        return;
      }

      try {
        const isDummy = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "dummy-api-key";
        let dataToUse: any = null;

        if (!isDummy) {
          const q = query(collection(db, "invitations"), where("slug", "==", slug));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const document = querySnapshot.docs[0];
            dataToUse = document.data();
            setDocId(document.id);
          }
        }

        if (!dataToUse) {
          dataToUse = await getInvitationLocal(slug);
          if (dataToUse) setIsLocalDb(true);
        }

        if (!dataToUse) {
          setError("Undangan tidak ditemukan.");
          setIsLoading(false);
          return;
        }

        if (dataToUse.edit_token !== token) {
          setError("Error 401: Unauthorized (Invalid Token)");
          setIsLoading(false);
          return;
        }

        setFormData(dataToUse as InvitationData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal memuat data. Periksa koneksi.");
      } finally {
        setIsLoading(false);
      }
    }

    validateAndFetch();
  }, [slug, token]);

  const handleBrideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData(prev => prev ? ({
      ...prev,
      bride_data: {
        ...prev.bride_data,
        [name]: value
      }
    }) : prev);
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData(prev => prev ? ({
      ...prev,
      event_data: {
        ...prev.event_data,
        [name]: value
      }
    }) : prev);
  };

  const handleUpdate = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      if (isLocalDb) {
        await updateInvitationLocal(slug, {
          bride_data: formData.bride_data,
          event_data: formData.event_data,
          category: formData.category || "Pernikahan",
          hero_image: formData.hero_image || "",
          bg_middle: formData.bg_middle || "",
          bg_bottom: formData.bg_bottom || "",
          groom_photo: formData.groom_photo || "",
          bride_photo: formData.bride_photo || "",
          gallery: formData.gallery || [],
          love_story: formData.love_story || [],
          gifts: formData.gifts || [],
          video: formData.video || "",
          music_url: formData.music_url || "",
          quote: formData.quote || "",
        });
      } else if (docId) {
        const docRef = doc(db, "invitations", docId);
        await updateDoc(docRef, {
          bride_data: formData.bride_data,
          event_data: formData.event_data,
          category: formData.category || "Pernikahan",
          hero_image: formData.hero_image || "",
          bg_middle: formData.bg_middle || "",
          bg_bottom: formData.bg_bottom || "",
          groom_photo: formData.groom_photo || "",
          bride_photo: formData.bride_photo || "",
          gallery: formData.gallery || [],
          love_story: formData.love_story || [],
          gifts: formData.gifts || [],
          video: formData.video || "",
          music_url: formData.music_url || "",
          quote: formData.quote || "",
        });
      }
      setSaveSuccess(true); // Show success screen
    } catch (err) {
      console.error("Update error:", err);
      alert("Gagal memperbarui data. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const invitationUrl = typeof window !== 'undefined' ? `${window.location.origin}/${slug}` : `/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-light">Memvalidasi akses...</p>
        </div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f6] px-6 text-center">
        <div className="text-8xl mb-6">🔒</div>
        <h1 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-3">Akses Ditolak</h1>
        <p className="text-gray-500 font-light max-w-sm">{error || "Link tidak valid atau sudah kadaluarsa."}</p>
      </div>
    );
  }

  // SUCCESS SCREEN after save
  if (saveSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-3">Data Berhasil Disimpan!</h1>
          <p className="text-gray-500 font-light mb-8">
            Undangan atas nama <strong className="text-[#1a1a1a]">{formData.bride_data.groom} & {formData.bride_data.bride}</strong> sudah diperbarui dan siap disebarkan.
          </p>

          {/* Link Box */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Link Undangan Anda</p>
            <div className="flex gap-2 items-center">
              <input
                readOnly
                value={invitationUrl}
                className="flex-1 text-sm text-[#1a1a1a] bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 font-mono"
              />
              <button
                onClick={handleCopy}
                className="p-2 bg-[#1a1a1a] text-white rounded-xl hover:bg-gray-800 transition"
                title="Salin link"
              >
                <Copy size={16} />
              </button>
            </div>
            {copied && <p className="text-xs text-green-500 mt-2">✓ Link berhasil disalin!</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={invitationUrl}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-gray-800 transition"
            >
              <ExternalLink size={18} /> Lihat Undangan
            </a>
            <button
              onClick={() => setIsGuestToolOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition shadow-md"
            >
              <Share2 size={18} /> Kirim ke Tamu (Nama Custom)
            </button>
          </div>

          {/* Guest Tool Section */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Ingin mengirim ke tamu tertentu?</h3>
            <p className="text-sm text-gray-500 mb-4 font-light">Gunakan alat di bawah ini untuk membuat link khusus dengan nama tamu.</p>
            <button 
              onClick={() => setIsGuestToolOpen(true)}
              className="w-full py-4 border-2 border-dashed border-purple-200 text-purple-600 rounded-2xl font-medium hover:bg-purple-50 hover:border-purple-300 transition"
            >
              Buka Guest Name Tool
            </button>
          </div>

          <button
            onClick={() => setSaveSuccess(false)}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition underline"
          >
            Edit ulang data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 text-[#1a1a1a]">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2">Edit Undangan</h1>
        <p className="text-gray-500 mb-8 font-light">Perbarui data undangan Anda (Slug: {slug})</p>

        <div className="space-y-8">
          {/* Section Kategori */}
          <section>
            <h2 className="text-xl font-medium mb-4 pb-2 border-b border-gray-100">Kategori Undangan</h2>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Kategori</label>
              <select 
                value={formData.category || "Pernikahan"} 
                onChange={(e) => setFormData(prev => prev ? ({ ...prev, category: e.target.value }) : prev)}
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
                <input type="text" name="groom" value={formData.bride_data.groom} onChange={handleBrideChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama Wanita</label>
                <input type="text" name="bride" value={formData.bride_data.bride} onChange={handleBrideChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Nama Orang Tua Pria</label>
                <input type="text" name="parents_groom" value={formData.bride_data.parents_groom} onChange={handleBrideChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Nama Orang Tua Wanita</label>
                <input type="text" name="parents_bride" value={formData.bride_data.parents_bride} onChange={handleBrideChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" />
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
                  <input type="text" name="akad_time" value={formData.event_data.akad_time} onChange={handleEventChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Waktu Resepsi</label>
                  <input type="text" name="resepsi_time" value={formData.event_data.resepsi_time} onChange={handleEventChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Lokasi Akad</label>
                  <input type="text" name="akad_location" value={formData.event_data.akad_location} onChange={handleEventChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Lokasi Resepsi</label>
                  <input type="text" name="resepsi_location" value={formData.event_data.resepsi_location} onChange={handleEventChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" />
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
                <input type="text" value={formData.video || ''} onChange={(e) => setFormData(prev => prev ? ({ ...prev, video: e.target.value }) : prev)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Pilih dari Galatamu Music Library</label>
                <div className="grid grid-cols-1 gap-2 mb-4">
                  <select 
                    onChange={(e) => {
                      const track = musicLibrary.find(t => t.id === e.target.value);
                      if (track) {
                        setFormData(prev => prev ? ({ ...prev, music_url: track.url }) : prev);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none bg-white text-sm"
                  >
                    <option value="">-- Pilih Lagu --</option>
                    {["Pernikahan", "Tradisional", "Islami", "Modern", "Lainnya"].map(cat => (
                      <optgroup key={cat} label={cat}>
                        {musicLibrary.filter(t => t.category === cat).map(track => (
                          <option key={track.id} value={track.id}>{track.title} - {track.artist}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                
                <label className="block text-sm text-gray-600 mb-1">Link Musik (URL MP3 Kustom)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.music_url || ''} 
                    onChange={(e) => setFormData(prev => prev ? ({ ...prev, music_url: e.target.value }) : prev)} 
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none text-sm" 
                    placeholder="https://domain.com/musik.mp3" 
                  />
                  {formData.music_url && (
                    <button 
                      onClick={() => togglePreview(formData.music_url!, "custom")}
                      className={`p-2 rounded-lg transition ${playingId === "custom" ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      {playingId === "custom" ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1 italic">*Anda bisa memilih dari library atau memasukkan link MP3 kustom.</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quote / Ayat Suci</label>
                <textarea value={formData.quote || ''} onChange={(e) => setFormData(prev => prev ? ({ ...prev, quote: e.target.value }) : prev)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none" rows={3} placeholder="Tuliskan kata mutiara atau ayat suci..."></textarea>
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
                onChange={(base64) => setFormData(prev => prev ? ({ ...prev, hero_image: base64 }) : prev)}
                onClear={() => setFormData(prev => prev ? ({ ...prev, hero_image: "" }) : prev)}
              />
              <div className="grid grid-cols-2 gap-6">
                <PhotoUpload 
                  label="Background Tengah (Mempelai/Acara)" 
                  value={formData.bg_middle} 
                  onChange={(base64) => setFormData(prev => prev ? ({ ...prev, bg_middle: base64 }) : prev)}
                  onClear={() => setFormData(prev => prev ? ({ ...prev, bg_middle: "" }) : prev)}
                />
                <PhotoUpload 
                  label="Background Bawah (RSVP/Footer)" 
                  value={formData.bg_bottom} 
                  onChange={(base64) => setFormData(prev => prev ? ({ ...prev, bg_bottom: base64 }) : prev)}
                  onClear={() => setFormData(prev => prev ? ({ ...prev, bg_bottom: "" }) : prev)}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <PhotoUpload 
                  label="Foto Mempelai Pria" 
                  value={formData.groom_photo} 
                  onChange={(base64) => setFormData(prev => prev ? ({ ...prev, groom_photo: base64 }) : prev)}
                  onClear={() => setFormData(prev => prev ? ({ ...prev, groom_photo: "" }) : prev)}
                />
                <PhotoUpload 
                  label="Foto Mempelai Wanita" 
                  value={formData.bride_photo} 
                  onChange={(base64) => setFormData(prev => prev ? ({ ...prev, bride_photo: base64 }) : prev)}
                  onClear={() => setFormData(prev => prev ? ({ ...prev, bride_photo: "" }) : prev)}
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
                        if (!formData) return;
                        const newGallery = [...(formData.gallery || [])];
                        newGallery[index] = base64;
                        setFormData(prev => prev ? ({ ...prev, gallery: newGallery }) : prev);
                      }}
                      onClear={() => {
                        if (!formData) return;
                        const newGallery = [...(formData.gallery || [])];
                        newGallery[index] = "";
                        setFormData(prev => prev ? ({ ...prev, gallery: newGallery }) : prev);
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
              <button onClick={() => setFormData(prev => prev ? ({ ...prev, love_story: [...(prev.love_story || []), { year: "", title: "", desc: "" }] }) : prev)} className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200">+ Tambah Cerita</button>
            </div>
            <div className="space-y-4">
              {formData.love_story?.map((story, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-xl relative">
                  <button onClick={() => setFormData(prev => prev ? ({ ...prev, love_story: prev.love_story?.filter((_, i) => i !== idx) }) : prev)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">×</button>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input type="text" value={story.year} onChange={(e) => {
                      if (!formData) return;
                      const newStory = [...(formData.love_story || [])];
                      newStory[idx].year = e.target.value;
                      setFormData(prev => prev ? ({ ...prev, love_story: newStory }) : prev);
                    }} placeholder="Tahun" className="col-span-1 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                    <input type="text" value={story.title} onChange={(e) => {
                      if (!formData) return;
                      const newStory = [...(formData.love_story || [])];
                      newStory[idx].title = e.target.value;
                      setFormData(prev => prev ? ({ ...prev, love_story: newStory }) : prev);
                    }} placeholder="Judul Momen" className="col-span-2 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                  </div>
                  <textarea value={story.desc} onChange={(e) => {
                    if (!formData) return;
                    const newStory = [...(formData.love_story || [])];
                    newStory[idx].desc = e.target.value;
                    setFormData(prev => prev ? ({ ...prev, love_story: newStory }) : prev);
                  }} placeholder="Cerita singkat..." className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none text-sm" rows={2}></textarea>
                </div>
              ))}
            </div>
          </section>

          {/* Section Digital Gift */}
          <section>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-medium">Amplop Digital</h2>
              <button onClick={() => setFormData(prev => prev ? ({ ...prev, gifts: [...(prev.gifts || []), { bank: "", acc: "", name: "" }] }) : prev)} className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200">+ Tambah Rekening</button>
            </div>
            <div className="space-y-4">
              {formData.gifts?.map((gift, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-xl relative">
                  <button onClick={() => setFormData(prev => prev ? ({ ...prev, gifts: prev.gifts?.filter((_, i) => i !== idx) }) : prev)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">×</button>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={gift.bank} onChange={(e) => {
                      if (!formData) return;
                      const newGifts = [...(formData.gifts || [])];
                      newGifts[idx].bank = e.target.value;
                      setFormData(prev => prev ? ({ ...prev, gifts: newGifts }) : prev);
                    }} placeholder="Nama Bank/E-Wallet" className="px-3 py-1 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                    <input type="text" value={gift.acc} onChange={(e) => {
                      if (!formData) return;
                      const newGifts = [...(formData.gifts || [])];
                      newGifts[idx].acc = e.target.value;
                      setFormData(prev => prev ? ({ ...prev, gifts: newGifts }) : prev);
                    }} placeholder="Nomor Rekening" className="px-3 py-1 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                    <input type="text" value={gift.name} onChange={(e) => {
                      if (!formData) return;
                      const newGifts = [...(formData.gifts || [])];
                      newGifts[idx].name = e.target.value;
                      setFormData(prev => prev ? ({ ...prev, gifts: newGifts }) : prev);
                    }} placeholder="Atas Nama" className="col-span-2 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button 
            onClick={handleUpdate}
            disabled={isSaving}
            className="w-full py-4 mt-4 bg-[#1a1a1a] text-white rounded-xl font-medium tracking-wide hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
      {/* Guest Name Tool Modal */}
      {isGuestToolOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif font-bold italic">Guest Tool</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Buat Link Khusus Nama Tamu</p>
              </div>
              <button onClick={() => setIsGuestToolOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
                <p className="text-xs text-purple-700 leading-relaxed font-medium">
                  <strong>Tips:</strong> Masukkan nama tamu di kotak bawah (satu nama per baris). Kami akan membuatkan link otomatis untuk setiap tamu tersebut.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Daftar Nama Tamu</label>
                <textarea 
                  rows={5}
                  value={guestNames}
                  onChange={(e) => setGuestNames(e.target.value)}
                  placeholder="Contoh:&#10;Bapak Budi & Ibu&#10;Keluarga Besar Ahmad&#10;Santi & Partner"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:bg-white focus:outline-none transition-all text-sm font-medium"
                ></textarea>
              </div>

              {guestNames.trim() && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Link Personal Berhasil Dibuat</h3>
                  <div className="space-y-3">
                    {guestNames.split('\n').filter(name => name.trim()).map((name, idx) => {
                      const encodedName = encodeURIComponent(name.trim());
                      const personalUrl = `${window.location.origin}/${slug}?to=${encodedName}`;
                      const waMsg = encodeURIComponent(
                        `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${name.trim()}* untuk hadir di acara pernikahan kami.\n\n` +
                        `Berikut link undangan digital kami:\n${personalUrl}\n\n` +
                        `Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\n` +
                        `Terima kasih.`
                      );
                      
                      return (
                        <div key={idx} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#1a1a1a] truncate">{name.trim()}</p>
                            <p className="text-[10px] text-gray-400 truncate">{personalUrl}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(personalUrl);
                                alert(`Link untuk ${name.trim()} disalin!`);
                              }}
                              className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                              title="Salin Link"
                            >
                              <Copy size={14} />
                            </button>
                            <a 
                              href={`https://wa.me/?text=${waMsg}`}
                              target="_blank"
                              className="p-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1ebe5d] transition"
                              title="Kirim ke WhatsApp"
                            >
                              <Share2 size={14} />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100">
              <button 
                onClick={() => setIsGuestToolOpen(false)}
                className="w-full py-4 bg-[#1a1a1a] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition shadow-lg"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MagicLinkEditor() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <EditForm />
    </Suspense>
  );
}
