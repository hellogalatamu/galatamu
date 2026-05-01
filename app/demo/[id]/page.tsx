"use client";

import { useParams } from "next/navigation";
import ThemeRegistry from "@/components/ThemeRegistry";
import { use } from "react";

// Demo Data for Live Preview
const DEMO_DATA = {
  bride_data: {
    groom: "Groom Name",
    bride: "Bride Name",
    parents_groom: "Bpk. Fulan & Ibu Fulanah",
    parents_bride: "Bpk. Fulan & Ibu Fulanah",
  },
  event_data: {
    date: new Date().toISOString(),
    akad_time: "08:00 - 10:00 WIB",
    akad_location: "Masjid Raya Kebayoran",
    akad_map: "https://maps.google.com",
    resepsi_time: "11:00 - Selesai",
    resepsi_location: "Grand Ballroom Hotel Luxury",
    resepsi_map: "https://maps.google.com",
  },
  gallery: [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80",
  ],
  love_story: [
    { year: "2020", title: "First Meeting", desc: "We met at a small coffee shop in the city." },
    { year: "2022", title: "Engagement", desc: "He proposed at the top of the mountain." },
  ],
  gifts: [
    { bank: "BCA", acc: "123456789", name: "Groom Name" },
    { bank: "Mandiri", acc: "987654321", name: "Bride Name" },
  ]
};

export default function DemoDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <main className="min-h-screen">
      <ThemeRegistry themeId={id} data={{ ...DEMO_DATA, theme_id: id, slug: "demo" }} previewMode={true} />
    </main>
  );
}
