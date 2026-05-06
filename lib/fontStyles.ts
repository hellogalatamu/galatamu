export interface FontStyle {
  id: string;
  label: string;
  fontFamily: string;
  googleUrl: string;
  preview: string; // text contoh untuk preview
  category: string;
}

export const FONT_STYLES: FontStyle[] = [
  {
    id: "playfair",
    label: "Playfair Display",
    fontFamily: "'Playfair Display', serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap",
    preview: "Playfair Display",
    category: "Elegan & Klasik",
  },
  {
    id: "cormorant",
    label: "Cormorant Garamond",
    fontFamily: "'Cormorant Garamond', serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap",
    preview: "Cormorant Garamond",
    category: "Mewah & Tipis",
  },
  {
    id: "great_vibes",
    label: "Great Vibes",
    fontFamily: "'Great Vibes', cursive",
    googleUrl: "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap",
    preview: "Great Vibes",
    category: "Kaligrafi & Romantis",
  },
  {
    id: "dancing_script",
    label: "Dancing Script",
    fontFamily: "'Dancing Script', cursive",
    googleUrl: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap",
    preview: "Dancing Script",
    category: "Script & Kasual",
  },
  {
    id: "cinzel",
    label: "Cinzel",
    fontFamily: "'Cinzel', serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap",
    preview: "CINZEL",
    category: "Romawi & Megah",
  },
  {
    id: "libre_baskerville",
    label: "Libre Baskerville",
    fontFamily: "'Libre Baskerville', serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap",
    preview: "Libre Baskerville",
    category: "Tradisional & Formal",
  },
  {
    id: "josefin_sans",
    label: "Josefin Sans",
    fontFamily: "'Josefin Sans', sans-serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600&display=swap",
    preview: "JOSEFIN SANS",
    category: "Modern & Minimalis",
  },
  {
    id: "eb_garamond",
    label: "EB Garamond",
    fontFamily: "'EB Garamond', serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap",
    preview: "EB Garamond",
    category: "Klasik & Tradisional",
  },
  {
    id: "lora",
    label: "Lora",
    fontFamily: "'Lora', serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap",
    preview: "Lora",
    category: "Elegan Modern",
  },
];

/** Ambil font object berdasarkan ID, fallback null jika tidak ditemukan */
export function getFontStyle(id?: string): FontStyle | null {
  if (!id) return null;
  return FONT_STYLES.find((f) => f.id === id) || null;
}
