import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Galatamu - Undangan Digital Premium",
  description: "Sempurnakan Hari Bahagia Anda dengan undangan digital elegan, minimalis, dan mewah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${playfair.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf9f6] text-[#1a1a1a]" suppressHydrationWarning>{children}</body>
    </html>
  );
}
