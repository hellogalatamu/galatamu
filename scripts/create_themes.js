/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const amaraContent = fs.readFileSync(path.join(__dirname, '../components/themes/AmaraTheme.tsx'), 'utf-8');

const themes = [
  {
    id: "aqiqah_01",
    filename: "AqiqahTheme.tsx",
    bg: "bg-[#f5f9ff]",
    text: "text-[#2b4c7e]",
    title: "Tasyakuran Aqiqah",
    mempelai: "Yang Berbahagia",
    akad: "Acara Inti",
    resepsi: "Ramah Tamah",
    loveStory: "Perjalanan Kami"
  },
  {
    id: "syukuran_01",
    filename: "SyukuranTheme.tsx",
    bg: "bg-[#fff8f0]",
    text: "text-[#5c4033]",
    title: "Tasyakuran",
    mempelai: "Yang Berbahagia",
    akad: "Acara Inti",
    resepsi: "Ramah Tamah",
    loveStory: "Perjalanan Kami"
  },
  {
    id: "corporate_01",
    filename: "CorporateTheme.tsx",
    bg: "bg-white",
    text: "text-slate-900",
    title: "Corporate Event",
    mempelai: "Detail Penyelenggara",
    akad: "Opening",
    resepsi: "Networking",
    loveStory: "Milestones"
  },
  {
    id: "education_01",
    filename: "EducationTheme.tsx",
    bg: "bg-slate-900",
    text: "text-yellow-400",
    title: "Graduation",
    mempelai: "Wisudawan",
    akad: "Prosesi Kelulusan",
    resepsi: "Perayaan",
    loveStory: "Perjalanan Pendidikan"
  },
  {
    id: "adult_bd_01",
    filename: "AdultBdTheme.tsx",
    bg: "bg-zinc-900",
    text: "text-rose-400",
    title: "Birthday Celebration",
    mempelai: "Yang Berbahagia",
    akad: "Acara Utama",
    resepsi: "Dinner Party",
    loveStory: "Perjalanan Hidup"
  },
  {
    id: "kids_01",
    filename: "KidsTheme.tsx",
    bg: "bg-[#fdfbf7]",
    text: "text-orange-500",
    title: "Kids Party",
    mempelai: "Yang Berbahagia",
    akad: "Acara Utama",
    resepsi: "Pesta Anak",
    loveStory: "Perjalanan Pertumbuhan"
  },
  {
    id: "sweet17_01",
    filename: "Sweet17Theme.tsx",
    bg: "bg-black",
    text: "text-pink-500",
    title: "Sweet Seventeen",
    mempelai: "Yang Berbahagia",
    akad: "Acara Utama",
    resepsi: "Party",
    loveStory: "Perjalanan Hidup"
  }
];

themes.forEach(theme => {
  let content = amaraContent;
  
  // Replace component name
  content = content.replace(/AmaraTheme/g, theme.filename.replace('.tsx', ''));
  
  // Replace styles (approximate replacements for bg and text colors)
  content = content.replace(/bg-\[#faf9f6\]/g, theme.bg);
  content = content.replace(/text-\[#1a1a1a\]/g, theme.text);
  
  // If it's a dark theme (bg-zinc-900, bg-slate-900, bg-black), invert some hardcoded white/black colors
  if (theme.bg.includes('900') || theme.bg === 'bg-black') {
    content = content.replace(/bg-white/g, 'bg-zinc-800');
    content = content.replace(/bg-gray-50/g, 'bg-zinc-800');
    content = content.replace(/bg-gray-100/g, 'bg-zinc-700');
    content = content.replace(/text-gray-500/g, 'text-zinc-400');
    content = content.replace(/text-gray-600/g, 'text-zinc-300');
    content = content.replace(/border-gray-200/g, 'border-zinc-700');
    content = content.replace(/border-gray-100/g, 'border-zinc-800');
  }

  // Replace text
  content = content.replace(/The Wedding Of/g, theme.title);
  content = content.replace(/We Are Getting Married/g, theme.title);
  content = content.replace(/<h3 className="font-serif text-4xl mb-6">Mempelai<\/h3>/g, `<h3 className="font-serif text-4xl mb-6">${theme.mempelai}</h3>`);
  content = content.replace(/<h4 className="font-serif text-3xl mb-4">Akad Nikah<\/h4>/g, `<h4 className="font-serif text-3xl mb-4">${theme.akad}</h4>`);
  content = content.replace(/<h4 className="font-serif text-3xl mb-4">Resepsi<\/h4>/g, `<h4 className="font-serif text-3xl mb-4">${theme.resepsi}</h4>`);
  content = content.replace(/<h3 className="font-serif text-4xl mb-16 text-center">Love Story<\/h3>/g, `<h3 className="font-serif text-4xl mb-16 text-center">${theme.loveStory}</h3>`);

  fs.writeFileSync(path.join(__dirname, '../components/themes/', theme.filename), content);
});

console.log("Themes generated successfully!");
