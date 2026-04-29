import MasterTheme from "@/components/themes/MasterTheme";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-800">Mode Pratinjau (Preview)</h2>
        <p className="text-sm text-slate-500">Tampilan disimulasikan seperti layar ponsel</p>
      </div>
      
      {/* Wrapper pembatas lebar maksimal untuk mensimulasikan perangkat mobile */}
      <div className="w-full max-w-[400px] h-[800px] bg-white shadow-2xl relative overflow-hidden rounded-[2rem] border-[8px] border-slate-900">
        <div className="w-full h-full overflow-y-auto no-scrollbar">
          <MasterTheme 
            data={{
              bride_data: { groom: "Riyan", bride: "Lara", parents_groom: "Bpk. Fulan & Ibu Fulanah", parents_bride: "Bpk. Fulan & Ibu Fulanah" },
              event_data: { date: "2026-12-31T00:00:00", akad_time: "08:00 - 10:00 WIB", akad_location: "Jakarta Selatan", resepsi_time: "11:00 - Selesai", resepsi_location: "Jakarta Selatan" },
              theme_id: "master"
            }} 
            previewMode={true}
          />
        </div>
      </div>
      
      <div className="mt-8">
        <a href="/" className="px-6 py-2 bg-slate-200 text-slate-800 rounded-full font-medium hover:bg-slate-300 transition">
          Kembali ke Landing Page
        </a>
      </div>
    </main>
  );
}
