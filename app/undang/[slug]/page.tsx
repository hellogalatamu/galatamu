import MasterTheme from '@/components/themes/MasterTheme';
import dummyData from '@/lib/dummyData.json';

export default async function DynamicInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Dalam Next.js 15, params adalah sebuah Promise yang harus di-await
  const { slug } = await params;
  
  // Mencocokkan slug dengan key di dalam dummyData.json
  const data = (dummyData as Record<string, any>)[slug];

  // Render halaman 'Not Found' jika slug tidak ada di database kita
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-light text-slate-400">404</h1>
          <p className="text-xl font-medium">Undangan Tidak Ditemukan</p>
          <p className="text-slate-500">Mungkin URL yang Anda masukkan salah atau undangan telah dihapus.</p>
        </div>
      </div>
    );
  }

  // Jika ditemukan, render Tema dan pass data tersebut sebagai props
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {/* Wrapper mensimulasikan layar mobile layaknya demo */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden">
        <MasterTheme data={data} />
      </div>
    </main>
  );
}
