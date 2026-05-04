import React from "react";
import AmaraTheme from "./themes/AmaraTheme";
import { InvitationData } from "./themes/types";
import { getGalleryLimit } from "@/lib/themes";
import RusticTheme from "./themes/RusticTheme";
import ModernTheme from "./themes/ModernTheme";
import VintageTheme from "./themes/VintageTheme";
import RoyalTheme from "./themes/RoyalTheme";
import JawaTheme from "./themes/JawaTheme";
import JawaJogjaTheme from "./themes/JawaJogjaTheme";
import JawaSoloTheme from "./themes/JawaSoloTheme";
import JawaModernTheme from "./themes/JawaModernTheme";
import MinangTheme from "./themes/MinangTheme";
import IslamicTheme from "./themes/IslamicTheme";
import SundaTheme from "./themes/SundaTheme";
import BatakTheme from "./themes/BatakTheme";
import BaliTheme from "./themes/BaliTheme";
import BugisTheme from "./themes/BugisTheme";
import MinimalistWhiteTheme from "./themes/MinimalistWhiteTheme";
import EmeraldTheme from "./themes/EmeraldTheme";
import LilacTheme from "./themes/LilacTheme";
import TerracottaTheme from "./themes/TerracottaTheme";
import NavyTheme from "./themes/NavyTheme";
import RomanticRoseTheme from "./themes/RomanticRoseTheme";
import MarbleLuxuryTheme from "./themes/MarbleLuxuryTheme";
import MidnightTheme from "./themes/MidnightTheme";
import GoldenWhiteTheme from "./themes/GoldenWhiteTheme";

interface ThemeRegistryProps {
  themeId: string;
  data: InvitationData;
  guestName?: string;
  previewMode?: boolean;
}

export default function ThemeRegistry({ themeId, data, guestName, previewMode }: ThemeRegistryProps) {
  // Slice gallery sesuai batas tier tema
  const galleryLimit = getGalleryLimit(themeId);
  const limitedData: InvitationData = {
    ...data,
    gallery: (data.gallery || []).slice(0, galleryLimit),
  };

  switch (themeId) {
    case "amara_01":
      return <AmaraTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "rustic_01":
      return <RusticTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "modern_01":
      return <ModernTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "vintage_01":
      return <VintageTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "royal_01":
      return <RoyalTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "jawa_01":
      return <JawaTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "jawa_02":
      return <JawaJogjaTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "jawa_03":
      return <JawaSoloTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "jawa_04":
      return <JawaModernTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "minang_01":
      return <MinangTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "islamic_01":
      return <IslamicTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "sunda_01":
      return <SundaTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "batak_01":
      return <BatakTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "bali_01":
      return <BaliTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "bugis_01":
      return <BugisTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "minimalist_white_01":
      return <MinimalistWhiteTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "emerald_01":
      return <EmeraldTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "lilac_01":
      return <LilacTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "terracotta_01":
      return <TerracottaTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "navy_01":
      return <NavyTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "romantic_rose_01":
      return <RomanticRoseTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "marble_luxury_01":
      return <MarbleLuxuryTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "midnight_01":
      return <MidnightTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "gold_white_01":
      return <GoldenWhiteTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    default:
      return <AmaraTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
  }
}
