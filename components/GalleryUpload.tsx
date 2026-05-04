"use client";

import React, { useState } from "react";
import { Upload, X, Loader2, Images, Lock } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { GALLERY_LIMITS, THEMES } from "@/lib/themes";

interface GalleryUploadProps {
  themeId: string;
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function GalleryUpload({ themeId, value, onChange }: GalleryUploadProps) {
  const [uploading, setUploading] = useState<number | null>(null);

  const theme = THEMES.find((t) => t.id === themeId);
  const tier = theme?.tier ?? "basic";
  const maxPhotos = GALLERY_LIMITS[tier as keyof typeof GALLERY_LIMITS] ?? 3;

  const tierMeta = {
    basic:     { label: "Basic",     color: "text-gray-500",   bg: "bg-gray-100",    border: "border-gray-200" },
    premium:   { label: "Premium",   color: "text-amber-600",  bg: "bg-amber-50",    border: "border-amber-200" },
    exclusive: { label: "Exclusive", color: "text-purple-700", bg: "bg-purple-50",   border: "border-purple-200" },
  }[tier] ?? { label: "Basic", color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-200" };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    setUploading(index);

    const isDummy =
      !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "dummy-api-key";

    try {
      let url = "";
      if (isDummy) {
        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            url = reader.result as string;
            resolve();
          };
          reader.readAsDataURL(file);
        });
      } else {
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const storageRef = ref(storage, `gallery/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        url = await getDownloadURL(snapshot.ref);
      }

      const updated = [...value];
      updated[index] = url;
      onChange(updated);
    } catch {
      alert("Gagal mengunggah foto. Coba lagi.");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Images size={16} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Foto Galeri
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${tierMeta.bg} ${tierMeta.color} border ${tierMeta.border}`}
        >
          {value.length}/{maxPhotos} foto · {tierMeta.label}
        </span>
      </div>

      {/* Slot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: maxPhotos }).map((_, i) => {
          const imgUrl = value[i];
          const isLocked = i >= maxPhotos;
          const isUploading = uploading === i;

          if (isLocked) {
            return (
              <div
                key={i}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center gap-1 opacity-40 cursor-not-allowed"
              >
                <Lock size={16} className="text-gray-400" />
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Terkunci</p>
              </div>
            );
          }

          if (imgUrl) {
            return (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                <img src={imgUrl} alt={`Galeri ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleRemove(i)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                    title="Hapus foto"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  {i + 1}
                </div>
              </div>
            );
          }

          return (
            <label
              key={i}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-[#1a1a1a] transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group"
            >
              {isUploading ? (
                <Loader2 size={20} className="text-gray-400 animate-spin" />
              ) : (
                <Upload size={20} className="text-gray-400 group-hover:text-[#1a1a1a] transition-colors" />
              )}
              <p className="text-[10px] text-gray-400 font-medium">Foto {i + 1}</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(e, i)}
                disabled={isUploading}
              />
            </label>
          );
        })}
      </div>

      {/* Info bar */}
      <p className="text-[10px] text-gray-400 text-center">
        Paket <strong>{tierMeta.label}</strong> — maks. <strong>{maxPhotos} foto</strong> galeri · PNG, JPG (Maks. 5MB/foto)
      </p>
    </div>
  );
}
