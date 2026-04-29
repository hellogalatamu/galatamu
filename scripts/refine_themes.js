/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function updateTheme(filename, replacements) {
  const filepath = path.join(__dirname, '../components/themes/', filename);
  let content = fs.readFileSync(filepath, 'utf-8');
  
  replacements.forEach(({target, replacement}) => {
    content = content.replace(target, replacement);
  });
  
  fs.writeFileSync(filepath, content);
}

// 1. AqiqahTheme.tsx
updateTheme('AqiqahTheme.tsx', [
  {
    target: /{data\.bride_data\.groom \|\| "Groom"} & {data\.bride_data\.bride \|\| "Bride"}/g,
    replacement: '{data.bride_data.groom || "Nama Anak"}'
  },
  {
    target: /<p className="tracking-widest uppercase text-xs mb-2 text-gray-300">Tasyakuran Aqiqah<\/p>/g,
    replacement: '<p className="tracking-widest uppercase text-xs mb-2 text-gray-300">Tasyakuran Aqiqah</p>'
  },
  {
    target: /<p className="text-gray-600 mb-16 font-light max-w-2xl mx-auto">Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri resepsi pernikahan kami\.<\/p>/g,
    replacement: '<p className="text-gray-600 mb-16 font-light max-w-2xl mx-auto italic">"Ya Allah, jadikanlah ia anak yang shalehah, berbakti kepada orang tua, dan berguna bagi agama."<br/><br/>Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu untuk hadir dalam acara Tasyakuran Aqiqah anak kami.</p>'
  },
  {
    target: /Putra dari {data\.bride_data\.parents_groom \|\| "Nama Orang Tua"}/g,
    replacement: 'Buah Hati Tercinta dari {data.bride_data.parents_groom || "Bapak & Ibu"}'
  },
  {
    target: /<div className="grid md:grid-cols-2 gap-16">/g,
    replacement: '<div className="flex justify-center">' // Make it single column
  },
  {
    target: /<FadeIn delay=\{0\.4\}>[\s\S]*?<\/FadeIn>/,
    replacement: '' // Remove the second "Bride" block
  },
  {
    target: /<h4 className="font-serif text-3xl mb-4">Acara Inti<\/h4>/g,
    replacement: '<h4 className="font-serif text-3xl mb-4">Tasyakuran & Doa Bersama</h4>'
  }
]);

// 2. SyukuranTheme.tsx
updateTheme('SyukuranTheme.tsx', [
  {
    target: /{data\.bride_data\.groom \|\| "Groom"} & {data\.bride_data\.bride \|\| "Bride"}/g,
    replacement: 'Keluarga {data.bride_data.groom || "Bapak/Ibu"}'
  },
  {
    target: /Tasyakuran/g,
    replacement: 'Syukuran Menempati Rumah Baru'
  },
  {
    target: /<p className="text-gray-600 mb-16 font-light max-w-2xl mx-auto">Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri resepsi pernikahan kami\.<\/p>/g,
    replacement: '<p className="text-gray-600 mb-16 font-light max-w-2xl mx-auto">Kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara syukuran dan doa bersama di kediaman baru kami.</p>'
  },
  {
    target: /<h4 className="font-serif text-3xl mb-4">Acara Inti<\/h4>/g,
    replacement: '<h4 className="font-serif text-3xl mb-4">Pembacaan Doa & Yasin</h4>'
  },
  {
    target: /<h4 className="font-serif text-3xl mb-4">Ramah Tamah<\/h4>/g,
    replacement: '<h4 className="font-serif text-3xl mb-4">Ramah Tamah & Makan Malam</h4>'
  },
  {
    target: /<div className="grid md:grid-cols-2 gap-16">/g,
    replacement: '<div className="flex justify-center">' // Single column
  },
  {
    target: /<FadeIn delay=\{0\.4\}>[\s\S]*?<\/FadeIn>/,
    replacement: '' // Remove second profile
  }
]);

// 3. CorporateTheme.tsx
updateTheme('CorporateTheme.tsx', [
  {
    target: /{data\.bride_data\.groom \|\| "Groom"} & {data\.bride_data\.bride \|\| "Bride"}/g,
    replacement: '{data.bride_data.groom || "Nama Perusahaan"}'
  },
  {
    target: /<p className="tracking-widest uppercase text-xs mb-2 text-zinc-400">Corporate Event<\/p>/g,
    replacement: '<p className="tracking-widest uppercase text-xs mb-2 text-zinc-400">You&apos;re Invited!</p>'
  },
  {
    target: /<h3 className="font-serif text-4xl mb-6">Detail Penyelenggara<\/h3>/g,
    replacement: '<h3 className="font-serif text-4xl mb-6">Grand Opening Announcement</h3>'
  },
  {
    target: /<p className="text-zinc-300 mb-16 font-light max-w-2xl mx-auto">Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri resepsi pernikahan kami\.<\/p>/g,
    replacement: '<p className="text-zinc-300 mb-16 font-light max-w-2xl mx-auto">Merupakan suatu kehormatan bagi kami jika Bapak/Ibu dapat hadir untuk berbagi kebahagiaan dalam memulai babak baru perjalanan bisnis kami.</p>'
  },
  {
    target: /<h4 className="font-serif text-3xl mb-4">Opening<\/h4>/g,
    replacement: '<h4 className="font-serif text-3xl mb-4">Pemotongan Pita & Peresmian</h4>'
  },
  {
    target: /<div className="grid md:grid-cols-2 gap-16">/g,
    replacement: '<div className="flex justify-center">' // Single column
  },
  {
    target: /<FadeIn delay=\{0\.4\}>[\s\S]*?<\/FadeIn>/,
    replacement: '' // Remove second profile
  }
]);

// 4. EducationTheme.tsx
updateTheme('EducationTheme.tsx', [
  {
    target: /{data\.bride_data\.groom \|\| "Groom"} & {data\.bride_data\.bride \|\| "Bride"}/g,
    replacement: 'Farewell & Prom Night'
  },
  {
    target: /<p className="tracking-widest uppercase text-xs mb-2 text-zinc-400">Graduation<\/p>/g,
    replacement: '<p className="tracking-widest uppercase text-xs mb-2 text-zinc-400">A Night to Remember</p>'
  },
  {
    target: /<h3 className="font-serif text-4xl mb-6">Wisudawan<\/h3>/g,
    replacement: '<h3 className="font-serif text-4xl mb-6">{data.bride_data.groom || "Nama Sekolah"}</h3>'
  },
  {
    target: /<p className="text-zinc-300 mb-16 font-light max-w-2xl mx-auto">Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri resepsi pernikahan kami\.<\/p>/g,
    replacement: '<p className="text-zinc-300 mb-16 font-light max-w-2xl mx-auto">Theme: "Midnight in Paris"<br/>Mari rayakan malam terakhir masa putih abu-abu kita dengan penuh kenangan dan tawa.</p>'
  },
  {
    target: /<h4 className="font-serif text-3xl mb-4">Prosesi Kelulusan<\/h4>/g,
    replacement: '<h4 className="font-serif text-3xl mb-4">Main Event & Awards</h4>'
  },
  {
    target: /<div className="grid md:grid-cols-2 gap-16">/g,
    replacement: '<div className="flex justify-center">' // Single column
  },
  {
    target: /<FadeIn delay=\{0\.4\}>[\s\S]*?<\/FadeIn>/,
    replacement: '' // Remove second profile
  }
]);

// 5. Sweet17Theme.tsx
updateTheme('Sweet17Theme.tsx', [
  {
    target: /{data\.bride_data\.groom \|\| "Groom"} & {data\.bride_data\.bride \|\| "Bride"}/g,
    replacement: '{data.bride_data.groom || "Name"}&apos;s Sweet Seventeen'
  },
  {
    target: /<p className="tracking-widest uppercase text-xs mb-2 text-zinc-400">Sweet Seventeen<\/p>/g,
    replacement: '<p className="tracking-widest uppercase text-xs mb-2 text-zinc-400">Please join us for a sparkling celebration</p>'
  },
  {
    target: /<p className="text-zinc-300 mb-16 font-light max-w-2xl mx-auto">Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri resepsi pernikahan kami\.<\/p>/g,
    replacement: '<p className="text-zinc-300 mb-16 font-light max-w-2xl mx-auto">Are you coming to the party? Let me know and let&apos;s make this night unforgettable!</p>'
  },
  {
    target: /<h4 className="font-serif text-3xl mb-4">Acara Utama<\/h4>/g,
    replacement: '<h4 className="font-serif text-3xl mb-4">Main Party</h4>'
  },
  {
    target: /<div className="grid md:grid-cols-2 gap-16">/g,
    replacement: '<div className="flex justify-center">' // Single column
  },
  {
    target: /<FadeIn delay=\{0\.4\}>[\s\S]*?<\/FadeIn>/,
    replacement: '' // Remove second profile
  }
]);

console.log("Designs customized successfully!");
