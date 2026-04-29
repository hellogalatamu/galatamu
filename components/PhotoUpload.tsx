"use client";

import React, { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface PhotoUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  onClear: () => void;
  folder?: string;
}

export default function PhotoUpload({ label, value, onChange, onClear, folder = "invitations" }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB for storage)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    setIsUploading(true);

    const isDummy = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "dummy-api-key";

    if (isDummy) {
      // Fallback to Base64 in local/dummy mode
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onChange(base64);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      // Professional Firebase Storage Upload
      try {
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const storageRef = ref(storage, `${folder}/${fileName}`);
        
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        onChange(downloadURL);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Gagal mengunggah foto. Pastikan koneksi internet stabil.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600 font-medium">{label}</label>
      
      {value ? (
        <div className="relative group w-full aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                onClear();
              }}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              title="Hapus Foto"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-[#1a1a1a] transition-all cursor-pointer group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#1a1a1a] transition-colors mb-2" />
            )}
            <p className="text-sm text-gray-500 font-medium">Klik untuk upload foto</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG (Maks. 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
