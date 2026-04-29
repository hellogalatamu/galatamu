import { Metadata } from "next";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ThemeRegistry from "@/components/ThemeRegistry";
import DraftOverlay from "@/components/DraftOverlay";
import { InvitationData } from "@/components/themes/AmaraTheme";
import { getInvitationLocal } from "@/app/actions";

async function getInvitationData(slug: string): Promise<InvitationData | null> {
  const isDummy = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "dummy-api-key";

  if (isDummy) {
    return await getInvitationLocal(slug);
  }

  try {
    const q = query(collection(db, "invitations"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as InvitationData;
    }
    return await getInvitationLocal(slug);
  } catch (error) {
    console.error("Error fetching invitation from Firebase:", error);
    return await getInvitationLocal(slug);
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getInvitationData(slug);

  if (!data) {
    return {
      title: "Undangan Tidak Ditemukan - Galatamu",
    };
  }

  const bride = data.bride_data?.bride || "";
  const groom = data.bride_data?.groom || "";
  const couple = bride && groom ? `${groom} & ${bride}` : "Undangan Digital";
  
  const title = `The Wedding of ${couple} - Galatamu`;
  const description = `Mohon doa restu dan kehadiran Bapak/Ibu/Saudara/i di acara bahagia kami. Simak detail lengkapnya di sini.`;
  
  // Try to use gallery image as OG image if available
  const ogImage = data.gallery?.[0] || "/og-image.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function DynamicThemeRenderer({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}) {
  const { slug } = await params;
  const { to } = await searchParams;
  
  const data = await getInvitationData(slug);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f6] text-[#1a1a1a]">
        <h1 className="text-6xl font-serif font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl font-medium">Undangan Tidak Ditemukan</p>
        <p className="text-gray-500 font-light">Mungkin URL salah atau undangan belum dibuat.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {!data.is_paid && <DraftOverlay />}
      <ThemeRegistry themeId={data.theme_id || "amara_01"} data={data} guestName={to || "Tamu Undangan"} />
    </div>
  );
}
