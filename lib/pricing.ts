import { THEMES } from "./themes";

export const TIER_PRICING: Record<"basic" | "premium" | "exclusive", number> = {
  basic: 99000,
  premium: 149000,
  exclusive: 249000,
};

export function getThemePrice(themeId: string): number {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return 0;
  return TIER_PRICING[theme.tier as "basic" | "premium" | "exclusive"] || 0;
}
