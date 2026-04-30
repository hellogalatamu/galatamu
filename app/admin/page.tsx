"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Edit, X, ExternalLink, Send, Eye, RefreshCw, MessageCircle, LayoutDashboard, Home, LogOut, Loader2, Menu } from "lucide-react";
import Link from "next/link";
import { getAllInvitationsLocal, togglePaymentStatusLocal, createInvitationAdminLocal, deleteInvitationLocal, updateInvitationFullLocal } from "@/app/actions";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { musicLibrary } from "@/lib/musicLibrary";
import { Music, Play, Pause } from "lucide-react";

export default function AdminDashboard() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDummy, setIsDummy] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  
  // New invitation form state
  const [newSlug, setNewSlug] = useState("");
  const [newTheme, setNewTheme] = useState("amara_01");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Edit state
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");

  // Guest Tool state
  const [guestToolSlug, setGuestToolSlug] = useState<string | null>(null);
  const [guestNames, setGuestNames] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioPreview) audioPreview.pause();
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

  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch = 
      inv.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.bride_data?.groom?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (inv.bride_data?.bride?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      filterCategory === "Semua" || 
      (inv.category === filterCategory);
    
    return matchesSearch && matchesCategory;
  });

  const fetchData = async () => {
    setIsLoading(true);
    const dummyCheck = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "dummy-api-key";
    setIsDummy(dummyCheck);

    if (dummyCheck) {
      // Load from local fallback
      const localData = await getAllInvitationsLocal();
      setInvitations(localData);
    } else {
      // Load from Firebase
      try {
        const querySnapshot = await getDocs(collection(db, "invitations"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInvitations(data);
      } catch (err) {
        console.error("Failed to fetch from Firebase", err);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthorized(true);
        fetchData();
      } else {
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };



  const handleCreateInvitation = async () => {
    if (!newSlug) return alert("Slug harus diisi!");
    setIsCreating(true);
    
    // Convert slug to URL friendly
    const slug = newSlug.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    if (isDummy) {
      const res = await createInvitationAdminLocal(slug, newTheme);
      if (res.success) {
        const link = `${window.location.origin}/edit/${slug}?token=${res.token}`;
        setGeneratedLink(link);
        fetchData(); // Refresh list
        setNewSlug("");
      } else {
        alert(res.message);
      }
    } else {
      try {
        // Check if slug exists
        const q = query(collection(db, "invitations"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setIsCreating(false);
          return alert("Slug sudah digunakan!");
        }

        const edit_token = crypto.randomUUID();
        const newData = {
          slug,
          theme_id: newTheme,
          is_paid: true,
          edit_token,
          bride_data: { groom: "", bride: "", parents_groom: "", parents_bride: "" },
          event_data: { date: "", akad_time: "", akad_location: "", resepsi_time: "", resepsi_location: "" },
          createdAt: new Date().toISOString()
        };
        
        await addDoc(collection(db, "invitations"), newData);
        const link = `${window.location.origin}/edit/${slug}?token=${edit_token}`;
        setGeneratedLink(link);
        fetchData(); // Refresh list
        setNewSlug("");
      } catch (err) {
        console.error("Failed to create in Firebase", err);
        alert("Gagal membuat pesanan.");
      }
    }
    setIsCreating(false);
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus undangan ini?")) return;
    
    if (isDummy) {
      const result = await deleteInvitationLocal(slug);
      if (result === true) {
        setInvitations(prev => prev.filter(inv => inv.slug !== slug));
        alert("Undangan berhasil dihapus.");
      } else {
        alert("Gagal menghapus undangan lokal: " + result);
      }
    } else {
      try {
        const invToDelete = invitations.find(inv => inv.slug === slug);
        if (invToDelete && invToDelete.id) {
          await deleteDoc(doc(db, "invitations", invToDelete.id));
          setInvitations(prev => prev.filter(inv => inv.slug !== slug));
          alert("Undangan berhasil dihapus.");
        } else {
          alert("Data tidak ditemukan di Firebase.");
        }
      } catch (err) {
        console.error("Failed to delete from Firebase", err);
        alert("Gagal menghapus undangan.");
      }
    }
  };

  const handleUpdateFull = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    
    if (isDummy) {
      const success = await updateInvitationFullLocal(editingItem.slug, editingItem);
      if (success) {
        setInvitations(prev => prev.map(inv => inv.slug === editingItem.slug ? editingItem : inv));
        setEditingItem(null);
        alert("Perubahan berhasil disimpan!");
      }
    } else {
      try {
        if (editingItem.id) {
          const { id, ...dataToUpdate } = editingItem;
          await updateDoc(doc(db, "invitations", id), dataToUpdate);
          setInvitations(prev => prev.map(inv => inv.slug === editingItem.slug ? editingItem : inv));
          setEditingItem(null);
          alert("Perubahan berhasil disimpan!");
        } else {
          alert("Data tidak ditemukan.");
        }
      } catch (err) {
        console.error("Failed to update Firebase", err);
        alert("Gagal menyimpan perubahan.");
      }
    }
    setIsSaving(false);
  };

  const toggleStatus = async (item: any) => {
    const newStatus = !item.is_paid;
    
    if (isDummy) {
      const success = await togglePaymentStatusLocal(item.slug, newStatus);
      if (success) {
        setInvitations(prev => prev.map(inv => inv.slug === item.slug ? { ...inv, is_paid: newStatus } : inv));
      }
    } else {
      try {
        await updateDoc(doc(db, "invitations", item.id), {
          is_paid: newStatus
        });
        setInvitations(prev => prev.map(inv => inv.id === item.id ? { ...inv, is_paid: newStatus } : inv));
      } catch (err) {
        console.error("Failed to update Firebase", err);
      }
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isLoading && invitations.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex text-[#1a1a1a] font-sans">
      
      {/* Mobile Header Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a1a1a] text-white flex items-center justify-between px-6 z-20 shadow-md">
        <h1 className="font-serif text-2xl font-bold italic tracking-wide">Galatamu.</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Premium Sidebar */}
      <aside className={`w-64 bg-[#1a1a1a] text-white fixed h-full flex flex-col shadow-2xl z-30 border-r border-[#333] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 hidden lg:block">
          <h1 className="font-serif text-3xl font-bold italic tracking-wide">Galatamu.</h1>
          <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-medium">Admin Panel</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-20 lg:mt-8">
          <Link href="/admin" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-sm font-medium transition text-white border border-white/5">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-sm transition">
            <Home size={18} /> Landing Page
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-sm transition mt-4"
          >
            <LogOut size={18} /> Keluar (Logout)
          </button>
        </nav>
        
        <div className="p-8">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Status Sistem</p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> {isDummy ? "Local DB" : "Firebase"} Aktif
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-6 text-center uppercase tracking-widest">&copy; {new Date().getFullYear()} Galatamu</p>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-6 md:p-12 min-h-screen overflow-y-auto mt-16 lg:mt-0">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold text-[#1a1a1a]">Dashboard</h2>
              <p className="text-gray-500 mt-2 font-light text-lg">Kelola pesanan dan link undangan klien Anda.</p>
            </div>
            <button 
              onClick={fetchData} 
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition shadow-sm hover:shadow-md"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Refresh Data
            </button>
          </div>

        {/* Create New Invitation Form */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gray-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 z-0"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-serif font-bold mb-6 text-[#1a1a1a]">Buat Pesanan Baru</h2>
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Slug (Link URL)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">galatamu.com/</span>
                  <input 
                    type="text" 
                    value={newSlug} 
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                    placeholder="nama-mempelai" 
                    className="w-full pl-36 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:bg-white focus:outline-none transition-all font-mono text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Pilih Tema Premium</label>
                <select 
                  value={newTheme} 
                  onChange={(e) => setNewTheme(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:bg-white focus:outline-none transition-all text-sm"
                >
                  <option value="amara_01">Amara Premium (Elegan & Minimalis)</option>
                  <option value="rustic_01">Rustic Botanical (Klasik & Natural)</option>
                  <option value="modern_01">Modern Editorial</option>
                  <option value="royal_01">Royal Baroque</option>
                  <option value="islamic_01">Islamic Syar&apos;i Barakah</option>
                  <option value="emerald_01">Emerald Green Glow</option>
                  <option value="vintage_01">Vintage Elegance</option>
                  <option value="minimalist_white_01">Minimalist White</option>
                  <option value="lilac_01">Lilac Dream</option>
                  <option value="terracotta_01">Terracotta Warmth</option>
                  <option value="navy_01">Navy Elegance</option>
                  <option value="romantic_rose_01">Romantic Rose</option>
                  <option value="marble_luxury_01">Marble Luxury</option>
                  <option value="midnight_01">Midnight Dark</option>
                  <option value="gold_white_01">Golden White</option>
                  <option value="jawa_01">Jawa Traditional</option>
                  <option value="minang_01">Minang Traditional</option>
                  <option value="sunda_01">Sunda Traditional</option>
                  <option value="batak_01">Batak Traditional</option>
                  <option value="bali_01">Bali Traditional</option>
                  <option value="bugis_01">Bugis Traditional</option>
                  <option value="aqiqah_01">Baby Pastel Breeze (Aqiqah)</option>
                  <option value="syukuran_01">Warm Minimalist (Syukuran)</option>
                  <option value="corporate_01">Corporate Nexus</option>
                  <option value="education_01">Golden Graduation</option>
                  <option value="adult_bd_01">Luxury Minimalist (Ulang Tahun)</option>
                  <option value="kids_01">Ceria Playground (Anak)</option>
                  <option value="sweet17_01">Midnight Glamour (Sweet 17)</option>
                </select>
              </div>
              <button 
                onClick={handleCreateInvitation}
                disabled={isCreating || !newSlug}
                className="w-full md:w-auto px-8 py-3 bg-[#1a1a1a] text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium whitespace-nowrap shadow-md hover:shadow-lg"
              >
                {isCreating ? "Memproses..." : "Buat & Generate Link"}
              </button>
            </div>
          </div>

          {generatedLink && (
            <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl space-y-4">
              <div>
                <p className="text-sm text-green-800 font-semibold mb-1">Link Form Pengisian Berhasil Dibuat</p>
                <p className="text-xs text-green-600">Kirimkan link berikut ke pembeli agar mereka bisa mengisi data undangan.</p>
              </div>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={generatedLink}
                  className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    alert("Link berhasil disalin!");
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  Salin
                </button>
              </div>
              <button
                onClick={() => {
                  const themeName = newTheme === "rustic_01" ? "Rustic Botanical" : "Amara Premium";
                  const msg = encodeURIComponent(
                    `Halo Kak! 😊\n\n` +
                    `Terima kasih sudah memesan *Undangan Digital Galatamu*. Pesanan Anda sudah kami proses dan pembayaran telah kami konfirmasi. 💝\n\n` +
                    `Berikut adalah *Link Khusus* untuk mengisi data undangan Anda:\n\n` +
                    `🔗 ${generatedLink}\n\n` +
                    `*Cara Pengisian:*\n` +
                    `1️⃣ Klik link di atas\n` +
                    `2️⃣ Isi nama mempelai, tanggal & lokasi acara\n` +
                    `3️⃣ Klik "Simpan Perubahan"\n` +
                    `4️⃣ Undangan langsung aktif dan bisa disebarkan!\n\n` +
                    `🎨 Tema: *${themeName}*\n\n` +
                    `Jika ada kendala atau pertanyaan, silakan hubungi kami kembali ya Kak. Semoga hari spesial Anda menjadi momen yang tak terlupakan! 🌸\n\n` +
                    `Salam hangat,\n` +
                    `*Tim Galatamu* ✨`
                  );
                  window.open(`https://wa.me/?text=${msg}`, "_blank");
                }}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#1ebe5d] transition text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Kirim Link ke Pembeli via WhatsApp
              </button>
            </div>
          )}
        </div>


        {/* Invitation Cards Grid */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold">Daftar Undangan Pembeli</h2>
              <span className="text-sm text-gray-400">{filteredInvitations.length} dari {invitations.length} undangan</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
              <input 
                type="text"
                placeholder="Cari slug atau nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a1a1a] outline-none"
              />
                <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a1a1a] outline-none"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Pernikahan">Pernikahan</option>
              </select>
            </div>
          </div>

          {filteredInvitations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="text-5xl mb-4">{searchQuery ? "🔍" : "📭"}</div>
              <p className="text-gray-500 font-light">
                {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Belum ada pesanan undangan masuk."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredInvitations.map((inv, idx) => {
                const THEMES_MAP: Record<string, string> = {
                  'amara_01': 'Amara Premium',
                  'rustic_01': 'Rustic Botanical',
                  'modern_01': 'Modern Editorial',
                  'royal_01': 'Royal Baroque',
                  'islamic_01': "Islamic Syar'i Barakah",
                  'emerald_01': 'Emerald Green Glow',
                  'vintage_01': 'Vintage Elegance',
                  'jawa_01': 'Jawa Traditional',
                  'minang_01': 'Minang Traditional',
                  'sunda_01': 'Sunda Traditional',
                  'batak_01': 'Batak Traditional',
                  'bali_01': 'Bali Traditional',
                  'bugis_01': 'Bugis Traditional',
                  'minimalist_white_01': 'Minimalist White',
                  'lilac_01': 'Lilac Dream',
                  'terracotta_01': 'Terracotta Warmth',
                  'navy_01': 'Navy Elegance',
                  'romantic_rose_01': 'Romantic Rose',
                  'marble_luxury_01': 'Marble Luxury',
                  'midnight_01': 'Midnight Dark',
                  'gold_white_01': 'Golden White',
                  'aqiqah_01': 'Baby Pastel Breeze (Aqiqah)',
                  'syukuran_01': 'Warm Minimalist (Syukuran)',
                  'corporate_01': 'Corporate Nexus',
                  'education_01': 'Golden Graduation',
                  'adult_bd_01': 'Luxury Minimalist (Ulang Tahun)',
                  'kids_01': 'Ceria Playground (Anak)',
                  'sweet17_01': 'Midnight Glamour (Sweet 17)',
                };
                const themeName = THEMES_MAP[inv.theme_id] || inv.theme_id;
                const invUrl = `${window.location.origin}/${inv.slug}`;
                const editUrl = inv.edit_token 
                  ? `${window.location.origin}/edit/${inv.slug}?token=${inv.edit_token}` 
                  : null;

                const resendWaMsg = encodeURIComponent(
                  `Halo Kak! 😊\n\n` +
                  `Kami mengirimkan kembali *Link Undangan* Anda dari Galatamu.\n\n` +
                  `🔗 *Link Undangan (Untuk Disebarkan):*\n${invUrl}\n\n` +
                  (editUrl ? `✏️ *Link Edit Data (Khusus Anda):*\n${editUrl}\n\n` : '') +
                  `Simpan baik-baik link di atas ya Kak. Jika ada pertanyaan, kami siap membantu! 🌸\n\n` +
                  `Salam,\n*Tim Galatamu* ✨`
                );

                return (
                  <div key={inv.slug || idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      
                      {/* Left: Color Bar + Theme */}
                      <div className={`sm:w-2 w-full h-2 sm:h-auto flex-shrink-0 ${inv.theme_id === 'rustic_01' ? 'bg-[#8c7a6b]' : 'bg-[#1a1a1a]'}`}></div>

                      {/* Main Content */}
                      <div className="flex-1 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          
                          {/* Info Utama */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-serif text-xl font-bold text-[#1a1a1a] truncate">
                                {inv.bride_data?.groom && inv.bride_data?.bride 
                                  ? `${inv.bride_data.groom} & ${inv.bride_data.bride}` 
                                  : <span className="text-gray-400 italic font-normal text-base">Belum diisi pembeli</span>}
                              </h3>
                              <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                inv.is_paid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {inv.is_paid ? '● Aktif' : '○ Draf'}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                              <span>🎨 {themeName}</span>
                              <span>🔗 /{inv.slug}</span>
                              {inv.event_data?.date && (
                                <span>📅 {new Date(inv.event_data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                              )}
                              {inv.event_data?.resepsi_location && (
                                <span className="truncate max-w-[200px]">📍 {inv.event_data.resepsi_location}</span>
                              )}
                              <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                                🛒 Tanggal Pembelian: {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Tidak tercatat (Data lama)"}
                              </span>
                            </div>
                          </div>

                          {/* Actions - Top Right */}
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => toggleStatus(inv)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                inv.is_paid 
                                  ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' 
                                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                              }`}
                            >
                              {inv.is_paid ? 'Suspend' : 'Aktifkan'}
                            </button>
                            <button
                              onClick={() => setEditingItem({ ...inv })}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Data"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(inv.slug)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Hapus Undangan"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Link Row */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                          
                          {/* Lihat Undangan */}
                          <a
                            href={invUrl}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition"
                          >
                            <Eye size={13} /> Lihat Undangan
                          </a>

                          {/* Salin Link Undangan */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(invUrl);
                              alert('Link undangan disalin!');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition"
                          >
                            <ExternalLink size={13} /> Salin Link Undangan
                          </button>

                          {/* Kirim Ulang Link Edit */}
                          {editUrl && (
                            <a
                              href={`https://wa.me/?text=${resendWaMsg}`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#25D366]/10 text-[#128C7E] rounded-lg text-xs font-medium hover:bg-[#25D366]/20 transition"
                              title="Kirim ulang link ke pembeli jika mereka lupa"
                            >
                              <MessageCircle size={13} /> Kirim Ulang Link ke Pembeli
                            </a>
                          )}

                          {/* Salin Link Edit */}
                          {editUrl && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(editUrl);
                                alert('Link edit disalin!');
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
                              title="Salin link edit pembeli"
                            >
                              <Send size={13} /> Salin Link Edit
                            </button>
                          )}

                          {/* Guest Name Tool */}
                          <button
                            onClick={() => setGuestToolSlug(inv.slug)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium hover:bg-purple-100 transition"
                            title="Generate link personal untuk tamu"
                          >
                            <MessageCircle size={13} /> Guest Tool (Link Nama)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold">Edit Undangan: /{editingItem.slug}</h2>
              <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Data Mempelai */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Data Mempelai</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 uppercase">Pria</label>
                    <input 
                      type="text" 
                      value={editingItem.bride_data?.groom || ""} 
                      onChange={(e) => setEditingItem({ ...editingItem, bride_data: { ...editingItem.bride_data, groom: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 uppercase">Wanita</label>
                    <input 
                      type="text" 
                      value={editingItem.bride_data?.bride || ""} 
                      onChange={(e) => setEditingItem({ ...editingItem, bride_data: { ...editingItem.bride_data, bride: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Data Acara */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Data Acara</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 uppercase">Tanggal</label>
                    <input 
                      type="date" 
                      value={editingItem.event_data?.date || ""} 
                      onChange={(e) => setEditingItem({ ...editingItem, event_data: { ...editingItem.event_data, date: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 uppercase">Lokasi Akad</label>
                      <input 
                        type="text" 
                        value={editingItem.event_data?.akad_location || ""} 
                        onChange={(e) => setEditingItem({ ...editingItem, event_data: { ...editingItem.event_data, akad_location: e.target.value } })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 uppercase">Lokasi Resepsi</label>
                      <input 
                        type="text" 
                        value={editingItem.event_data?.resepsi_location || ""} 
                        onChange={(e) => setEditingItem({ ...editingItem, event_data: { ...editingItem.event_data, resepsi_location: e.target.value } })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Tema */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Pengaturan Tema</h3>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 uppercase">Tema Aktif</label>
                  <select 
                    value={editingItem.theme_id} 
                    onChange={(e) => setEditingItem({ ...editingItem, theme_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none"
                  >
                    <optgroup label="— Pernikahan">
                      <option value="amara_01">Amara Premium</option>
                      <option value="rustic_01">Rustic Botanical</option>
                      <option value="modern_01">Modern Editorial</option>
                      <option value="royal_01">Royal Baroque</option>
                      <option value="islamic_01">Islamic Syar&apos;i Barakah</option>
                      <option value="emerald_01">Emerald Green Glow</option>
                      <option value="vintage_01">Vintage Elegance</option>
                      <option value="minimalist_white_01">Minimalist White</option>
                      <option value="lilac_01">Lilac Dream</option>
                      <option value="terracotta_01">Terracotta Warmth</option>
                      <option value="navy_01">Navy Elegance</option>
                      <option value="romantic_rose_01">Romantic Rose</option>
                      <option value="marble_luxury_01">Marble Luxury</option>
                      <option value="midnight_01">Midnight Dark</option>
                      <option value="gold_white_01">Golden White</option>
                    </optgroup>
                    <optgroup label="— Lainnya">
                      <option value="jawa_01">Jawa Traditional (Adat)</option>
                      <option value="minang_01">Minang Traditional (Adat)</option>
                      <option value="sunda_01">Sunda Traditional (Adat)</option>
                      <option value="batak_01">Batak Traditional (Adat)</option>
                      <option value="bali_01">Bali Traditional (Adat)</option>
                      <option value="bugis_01">Bugis Traditional (Adat)</option>
                      <option value="aqiqah_01">Baby Pastel Breeze (Aqiqah)</option>
                      <option value="syukuran_01">Warm Minimalist (Syukuran)</option>
                      <option value="corporate_01">Corporate Nexus</option>
                      <option value="education_01">Golden Graduation</option>
                      <option value="adult_bd_01">Luxury Minimalist (Ulang Tahun)</option>
                      <option value="kids_01">Ceria Playground (Anak)</option>
                      <option value="sweet17_01">Sweet 17 Midnight</option>
                    </optgroup>
                  </select>
                </div>
              </section>

              {/* Musik */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Pengaturan Musik</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 uppercase">Pilih dari Library</label>
                    <select 
                      onChange={(e) => {
                        const track = musicLibrary.find(t => t.id === e.target.value);
                        if (track) {
                          setEditingItem({ ...editingItem, music_url: track.url });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none bg-white text-sm"
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
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 uppercase">URL Musik Kustom</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editingItem.music_url || ""} 
                        onChange={(e) => setEditingItem({ ...editingItem, music_url: e.target.value })}
                        placeholder="https://domain.com/musik.mp3"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none text-sm"
                      />
                      {editingItem.music_url && (
                        <button 
                          onClick={() => togglePreview(editingItem.music_url!, "admin-preview")}
                          className={`p-2 rounded-xl transition ${playingId === "admin-preview" ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                          {playingId === "admin-preview" ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => setEditingItem(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button 
                onClick={handleUpdateFull}
                disabled={isSaving}
                className="flex-1 py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Guest Name Tool Modal */}
      {guestToolSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif font-bold">Guest Name Tool</h2>
                <p className="text-sm text-gray-500">Generate personal links for /{guestToolSlug}</p>
              </div>
              <button onClick={() => setGuestToolSlug(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Daftar Nama Tamu (Satu nama per baris)</label>
                <textarea 
                  rows={8}
                  value={guestNames}
                  onChange={(e) => setGuestNames(e.target.value)}
                  placeholder="Contoh:&#10;Budi & Istri&#10;Keluarga Bpk. Ahmad&#10;Santi"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a1a] focus:bg-white focus:outline-none transition-all text-sm"
                ></textarea>
              </div>

              {guestNames.trim() && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Link Generated</h3>
                  <div className="space-y-3">
                    {guestNames.split('\n').filter(name => name.trim()).map((name, idx) => {
                      const encodedName = encodeURIComponent(name.trim());
                      const personalUrl = `${window.location.origin}/${guestToolSlug}?to=${encodedName}`;
                      const waMsg = encodeURIComponent(
                        `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${name.trim()}* untuk hadir di acara pernikahan kami.\n\n` +
                        `Berikut link undangan digital kami:\n${personalUrl}\n\n` +
                        `Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\n` +
                        `Terima kasih.`
                      );
                      
                      return (
                        <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{name.trim()}</p>
                            <p className="text-xs text-gray-400 truncate">{personalUrl}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(personalUrl);
                                alert(`Link untuk ${name.trim()} disalin!`);
                              }}
                              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                              title="Salin Link"
                            >
                              <ExternalLink size={14} />
                            </button>
                            <a 
                              href={`https://wa.me/?text=${waMsg}`}
                              target="_blank"
                              className="p-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1ebe5d] transition"
                              title="Kirim WA"
                            >
                              <MessageCircle size={14} />
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
                onClick={() => setGuestToolSlug(null)}
                className="w-full py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-gray-800 transition"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
