import React from "react";
import AmaraTheme, { InvitationData } from "./themes/AmaraTheme";
import RusticTheme from "./themes/RusticTheme";
import AqiqahTheme from "./themes/AqiqahTheme";
import SyukuranTheme from "./themes/SyukuranTheme";
import CorporateTheme from "./themes/CorporateTheme";
import EducationTheme from "./themes/EducationTheme";
import AdultBdTheme from "./themes/AdultBdTheme";
import KidsTheme from "./themes/KidsTheme";
import Sweet17Theme from "./themes/Sweet17Theme";
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
  switch (themeId) {
    case "amara_01":
      return <AmaraTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "rustic_01":
      return <RusticTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "aqiqah_01":
      return <AqiqahTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "syukuran_01":
      return <SyukuranTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "corporate_01":
      return <CorporateTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "education_01":
      return <EducationTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "adult_bd_01":
      return <AdultBdTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "kids_01":
      return <KidsTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "sweet17_01":
      return <Sweet17Theme data={data} guestName={guestName} previewMode={previewMode} />;
    case "modern_01":
      return <ModernTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "vintage_01":
      return <VintageTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "royal_01":
      return <RoyalTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "jawa_01":
      return <JawaTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "jawa_02":
      return <JawaJogjaTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "jawa_03":
      return <JawaSoloTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "jawa_04":
      return <JawaModernTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "minang_01":
      return <MinangTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "islamic_01":
      return <IslamicTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "sunda_01":
      return <SundaTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "batak_01":
      return <BatakTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "bali_01":
      return <BaliTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "bugis_01":
      return <BugisTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "minimalist_white_01":
      return <MinimalistWhiteTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "emerald_01":
      return <EmeraldTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "lilac_01":
      return <LilacTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "terracotta_01":
      return <TerracottaTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "navy_01":
      return <NavyTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "romantic_rose_01":
      return <RomanticRoseTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "marble_luxury_01":
      return <MarbleLuxuryTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "midnight_01":
      return <MidnightTheme data={data} guestName={guestName} previewMode={previewMode} />;
    case "gold_white_01":
      return <GoldenWhiteTheme data={data} guestName={guestName} previewMode={previewMode} />;
    default:
      return <AmaraTheme data={data} guestName={guestName} previewMode={previewMode} />;
  }
}
