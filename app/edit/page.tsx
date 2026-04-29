"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

interface LocalToken {
  slug: string;
  token: string;
}

export default function EditIndexPage() {
  const [invitations, setInvitations] = useState<LocalToken[]>([]);

  useEffect(() => {
    // Cari semua token di localStorage
    const found: LocalToken[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("galatamu_token_")) {
        const slug = key.replace("galatamu_token_", "");
        const token = localStorage.getItem(key);
        if (token) {
          found.push({ slug, token });
        }
      }
    }
     
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInvitations(found);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-[#1a1a1a] p-8">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-bold mb-4">Daftar Undangan Anda</h1>
            <p className="text-gray-600">Pilih undangan yang ingin Anda edit berdasarkan riwayat browser ini.</p>
          </div>
        </FadeIn>

        {invitations.length === 0 ? (
          <FadeIn delay={0.2}>
            <div className="bg-white p-10 rounded-3xl text-center border border-gray-200 shadow-sm">
              <p className="text-gray-500 mb-6">Belum ada undangan yang dibuat di browser ini.</p>
              <Link href="/editor" className="inline-block px-6 py-3 bg-[#1a1a1a] text-white rounded-full font-medium hover:bg-gray-800 transition">
                Buat Undangan Baru
              </Link>
            </div>
          </FadeIn>
        ) : (
          <div className="space-y-4">
            {invitations.map((inv, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between group hover:shadow-md transition">
                  <div>
                    <h3 className="font-bold text-lg mb-1">/{inv.slug}</h3>
                    <p className="text-xs text-gray-400 font-mono">Token: {inv.token.substring(0, 8)}...</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/${inv.slug}`} target="_blank" className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      Lihat Undangan
                    </Link>
                    <Link href={`/edit/${inv.slug}?token=${inv.token}`} className="px-4 py-2 text-sm bg-[#1a1a1a] text-white rounded-lg hover:bg-gray-800 transition">
                      Edit Data
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
