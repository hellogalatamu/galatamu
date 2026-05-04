import React from "react";
import { InvitationData } from "./themes/types";
import { getGalleryLimit } from "@/lib/themes";

// Basic
import MinimalistWhiteTheme from "./themes/MinimalistWhiteTheme";
import VintageTheme from "./themes/VintageTheme";
import RomanticRoseTheme from "./themes/RomanticRoseTheme";

// Premium
import TerracottaTheme from "./themes/TerracottaTheme";
import ModernTheme from "./themes/ModernTheme";
import IslamicTheme from "./themes/IslamicTheme";

// Exclusive
import AmaraTheme from "./themes/AmaraTheme";
import RoyalTheme from "./themes/RoyalTheme";
import MidnightTheme from "./themes/MidnightTheme";

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
    // ─── BASIC ───────────────────────────────────────────────────────────
    case "minimalist_white_01":
      return <MinimalistWhiteTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "vintage_01":
      return <VintageTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "romantic_rose_01":
      return <RomanticRoseTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;

    // ─── PREMIUM ─────────────────────────────────────────────────────────
    case "terracotta_01":
      return <TerracottaTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "modern_01":
      return <ModernTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "islamic_01":
      return <IslamicTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;

    // ─── EXCLUSIVE ───────────────────────────────────────────────────────
    case "amara_01":
      return <AmaraTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "royal_01":
      return <RoyalTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
    case "midnight_01":
      return <MidnightTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;

    default:
      return <AmaraTheme data={limitedData} guestName={guestName} previewMode={previewMode} />;
  }
}
