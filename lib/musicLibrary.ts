export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  category: "Pernikahan" | "Tradisional" | "Islami" | "Modern" | "Lainnya";
  url: string;
}

export const musicLibrary: MusicTrack[] = [
  {
    id: "wedding_01",
    title: "Beautiful Wedding",
    artist: "Pixabay Music",
    category: "Pernikahan",
    url: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_f5eb8dfcb7.mp3?filename=beautiful-wedding-125026.mp3"
  },
  {
    id: "piano_01",
    title: "Piano Wedding",
    artist: "Pixabay Music",
    category: "Pernikahan",
    url: "https://cdn.pixabay.com/download/audio/2022/01/26/audio_0e5458390b.mp3?filename=piano-wedding-8532.mp3"
  },
  {
    id: "luxury_01",
    title: "Luxury Wedding",
    artist: "Pixabay Music",
    category: "Modern",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808d7a4f4.mp3?filename=luxury-wedding-110620.mp3"
  },
  {
    id: "orchestra_01",
    title: "Orchestra Wedding",
    artist: "Pixabay Music",
    category: "Pernikahan",
    url: "https://cdn.pixabay.com/download/audio/2021/11/17/audio_0974b9f5e3.mp3?filename=orchestra-wedding-1153.mp3"
  },
  {
    id: "islamic_01",
    title: "Islamic Background",
    artist: "Pixabay Music",
    category: "Islami",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7aff99ea66.mp3?filename=islamic-background-music-21074.mp3"
  },
  {
    id: "jawa_01",
    title: "Javanese Gamelan",
    artist: "Traditional",
    category: "Tradisional",
    url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2f7b8893d.mp3?filename=javanese-gamelan-soft-1123.mp3"
  },
  {
    id: "sunda_01",
    title: "Sunda Flute",
    artist: "Traditional",
    category: "Tradisional",
    url: "https://cdn.pixabay.com/download/audio/2022/02/22/audio_c2f7b8893d.mp3?filename=sunda-flute-1123.mp3"
  },
  {
    id: "bali_01",
    title: "Balinese Gamelan",
    artist: "Traditional",
    category: "Tradisional",
    url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2f7b8893d.mp3?filename=balinese-gamelan-1123.mp3"
  },
  {
    id: "minang_01",
    title: "Minangkabau Traditional",
    artist: "Traditional",
    category: "Tradisional",
    url: "https://cdn.pixabay.com/download/audio/2021/11/17/audio_0974b9f5e3.mp3?filename=minangkabau-traditional-1123.mp3"
  },
  {
    id: "batak_01",
    title: "Batak Traditional",
    artist: "Traditional",
    category: "Tradisional",
    url: "https://cdn.pixabay.com/download/audio/2021/11/17/audio_0974b9f5e3.mp3?filename=batak-traditional-1123.mp3"
  }
];
