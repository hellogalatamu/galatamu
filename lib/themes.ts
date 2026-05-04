export const THEMES = [
  // ─── BASIC ───────────────────────────────────────────────────────────────
  {
    id: "minimalist_white_01",
    name: "Minimalist White",
    category: "Pernikahan",
    tier: "basic" as const,
    duration: "3 Bulan",
    tagline: "Clean, Pure & Sophisticated",
    bg: "bg-white",
    border: "border-gray-100",
    textColor: "text-gray-900",
    tagColor: "text-gray-400",
    previewBg: "from-white to-gray-50",
    previewText: "text-gray-900",
    btnBorder: "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
    thumbnail: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80",
    thumbnail2: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80"
  },
  {
    id: "vintage_01",
    name: "Vintage Kraft",
    category: "Pernikahan",
    tier: "basic" as const,
    duration: "3 Bulan",
    tagline: "Retro, Classic & Nostalgic",
    bg: "bg-[#e5d3b3]",
    border: "border-[#8b5e3c]/20",
    textColor: "text-[#5d4037]",
    tagColor: "text-[#8b5e3c]",
    previewBg: "from-[#8b5e3c] to-[#e5d3b3]",
    previewText: "text-[#5d4037]",
    btnBorder: "border-[#8b5e3c] text-[#8b5e3c] hover:bg-[#8b5e3c] hover:text-white",
    thumbnail: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80",
    thumbnail2: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80"
  },
  {
    id: "romantic_rose_01",
    name: "Romantic Rose",
    category: "Pernikahan",
    tier: "basic" as const,
    duration: "3 Bulan",
    tagline: "Pink Rose, Bunga & Romantis",
    bg: "bg-[#fff1f2]",
    border: "border-[#fb7185]/20",
    textColor: "text-[#9f1239]",
    tagColor: "text-[#fb7185]",
    previewBg: "from-[#ffe4e6] to-[#fff1f2]",
    previewText: "text-[#9f1239]",
    btnBorder: "border-[#fb7185] text-[#fb7185] hover:bg-[#fb7185] hover:text-white",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
    thumbnail2: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80"
  },

  // ─── PREMIUM ─────────────────────────────────────────────────────────────
  {
    id: "terracotta_01",
    name: "Terracotta Warmth",
    category: "Pernikahan",
    tier: "premium" as const,
    duration: "6 Bulan",
    tagline: "Earthy, Boho & Warm Tones",
    bg: "bg-[#fff7ed]",
    border: "border-[#fed7aa]/20",
    textColor: "text-[#7c2d12]",
    tagColor: "text-[#ea580c]",
    previewBg: "from-[#fed7aa] to-[#fff7ed]",
    previewText: "text-[#7c2d12]",
    btnBorder: "border-[#ea580c] text-[#ea580c] hover:bg-[#ea580c] hover:text-white",
    thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80",
    thumbnail2: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80"
  },
  {
    id: "modern_01",
    name: "Modern Editorial",
    category: "Pernikahan",
    tier: "premium" as const,
    duration: "6 Bulan",
    tagline: "Bold, Asymmetric & Magazine-Style",
    bg: "bg-[#0a0a0a]",
    border: "border-[#ff6b6b]/30",
    textColor: "text-white",
    tagColor: "text-[#ff6b6b]",
    previewBg: "from-[#0a0a0a] to-[#1a1a1a]",
    previewText: "text-white",
    btnBorder: "border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-[#0a0a0a]",
    thumbnail: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80",
    thumbnail2: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80"
  },
  {
    id: "islamic_01",
    name: "Islamic Syar'i Barakah",
    category: "Pernikahan",
    tier: "premium" as const,
    duration: "6 Bulan",
    tagline: "Kaligrafi, Arch & Ornamen Islami",
    bg: "bg-[#0d2b1a]",
    border: "border-[#c8973e]/30",
    textColor: "text-[#fdfcf0]",
    tagColor: "text-[#c8973e]",
    previewBg: "from-[#0d2b1a] to-[#1a4d2e]",
    previewText: "text-[#fdfcf0]",
    btnBorder: "border-[#c8973e] text-[#c8973e] hover:bg-[#c8973e] hover:text-[#0d2b1a]",
    thumbnail: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80",
    thumbnail2: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80"
  },

  // ─── EXCLUSIVE ───────────────────────────────────────────────────────────
  {
    id: "amara_01",
    name: "Amara Premium",
    category: "Pernikahan",
    tier: "exclusive" as const,
    duration: "1 Tahun",
    tagline: "Elegan, Mewah & Minimalis",
    bg: "bg-[#faf9f6]",
    border: "border-gray-100",
    textColor: "text-[#1a1a1a]",
    tagColor: "text-gray-500",
    previewBg: "from-gray-300 to-gray-100",
    previewText: "text-gray-600",
    btnBorder: "border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white",
    waText: `Assalamu'alaikum, Kak Admin Galatamu 👋\n\nSaya tertarik dengan *Tema Amara Premium* dan ingin memesan undangan digital untuk pernikahan saya.\n\nBoleh saya tahu detailnya? 🙏`,
    thumbnail: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80",
    thumbnail2: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80"
  },
  {
    id: "royal_01",
    name: "Royal Baroque",
    category: "Pernikahan",
    tier: "exclusive" as const,
    duration: "1 Tahun",
    tagline: "Grand, Split-Screen & Cinematic",
    bg: "bg-[#06060f]",
    border: "border-[#c8973e]/40",
    textColor: "text-[#e8d5a3]",
    tagColor: "text-[#c8973e]",
    previewBg: "from-[#06060f] to-[#12102a]",
    previewText: "text-[#e8d5a3]",
    btnBorder: "border-[#c8973e] text-[#c8973e] hover:bg-[#c8973e] hover:text-[#06060f]",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
    thumbnail2: "https://images.unsplash.com/photo-1510076857177-74700760be49?auto=format&fit=crop&q=80"
  },
  {
    id: "midnight_01",
    name: "Midnight Stars",
    category: "Pernikahan",
    tier: "exclusive" as const,
    duration: "1 Tahun",
    tagline: "Gelap, Bintang & Glamour",
    bg: "bg-[#020617]",
    border: "border-blue-500/20",
    textColor: "text-white",
    tagColor: "text-blue-400",
    previewBg: "from-[#020617] to-[#0f172a]",
    previewText: "text-white",
    btnBorder: "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
    thumbnail2: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80"
  },
];

export const THEMES_MAP: Record<string, string> = THEMES.reduce((acc, theme) => {
  acc[theme.id] = theme.name;
  return acc;
}, {} as Record<string, string>);

// Batas upload foto galeri per tier
export const GALLERY_LIMITS: Record<"basic" | "premium" | "exclusive", number> = {
  basic: 3,
  premium: 10,
  exclusive: 20,
};

export function getGalleryLimit(themeId: string): number {
  const theme = THEMES.find((t) => t.id === themeId);
  const tier = theme?.tier ?? "basic";
  return GALLERY_LIMITS[tier];
}
