import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Copy, Check, QrCode, MapPin } from "lucide-react";
import { GiftData } from "./themes/types";

interface DigitalEnvelopeProps {
  gifts?: GiftData[];
  gift_address?: string;
  primaryColor: string;
  bgColor: string;
  textColor: string;
  accentColor?: string;
  envelopeStyle: "light" | "dark";
  titleClassName?: string;
  subtitleClassName?: string;
}

export default function DigitalEnvelope({
  gifts,
  gift_address,
  primaryColor,
  bgColor,
  textColor,
  accentColor,
  envelopeStyle,
  titleClassName = "font-serif text-4xl italic",
  subtitleClassName = "font-sans text-sm tracking-widest uppercase",
}: DigitalEnvelopeProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  if ((!gifts || gifts.length === 0) && !gift_address) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const isDark = envelopeStyle === "dark";
  const cardBg = isDark ? "bg-white/5" : "bg-black/5";
  const cardBorder = isDark ? "border-white/10" : "border-black/10";
  const mutedText = isDark ? "text-white/60" : "text-black/60";

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <div className="text-center mb-12">
        <Gift className="w-12 h-12 mx-auto mb-6 opacity-50" style={{ color: primaryColor }} />
        <h2 className={titleClassName} style={{ color: textColor }}>
          Digital Envelope
        </h2>
        <p className={`${subtitleClassName} mt-4 opacity-60`} style={{ color: textColor }}>
          Tanda Kasih
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full justify-center">
        {gifts?.map((gift, index) => (
          <div
            key={index}
            className={`relative w-full h-64 perspective-1000 cursor-pointer mx-auto max-w-sm`}
            onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
          >
            <motion.div
              className="w-full h-full relative preserve-3d"
              initial={false}
              animate={{ rotateY: flippedIndex === index ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* Front of the Envelope */}
              <div
                className={`absolute w-full h-full backface-hidden rounded-2xl border flex flex-col items-center justify-center p-6 shadow-lg ${cardBg} ${cardBorder}`}
                style={{ backgroundColor: bgColor }}
              >
                <div className="absolute top-4 right-4 opacity-20">
                  <Gift size={24} style={{ color: primaryColor }} />
                </div>
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border ${cardBorder}`}
                  style={{ backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)" }}
                >
                  <Gift size={32} style={{ color: primaryColor }} />
                </div>
                <h3 className="font-sans text-xl font-bold tracking-widest uppercase mb-2" style={{ color: primaryColor }}>
                  {gift.bank}
                </h3>
                <p className={`font-sans text-xs uppercase tracking-widest ${mutedText}`}>
                  Ketuk untuk membuka
                </p>
              </div>

              {/* Back of the Envelope (Details) */}
              <div
                className={`absolute w-full h-full backface-hidden rounded-2xl border flex flex-col items-center justify-center p-6 shadow-xl overflow-hidden ${cardBg} ${cardBorder}`}
                style={{
                  backgroundColor: bgColor,
                  transform: "rotateY(180deg)",
                }}
              >
                {/* Background Decor */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${primaryColor} 2px, transparent 2px)`,
                    backgroundSize: "20px 20px",
                  }}
                />

                <div className="relative z-10 w-full flex flex-col items-center h-full justify-between py-2">
                  <div className="text-center w-full">
                    <p className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold mb-2" style={{ color: primaryColor }}>
                      {gift.bank}
                    </p>
                    {gift.qr_image && (
                      <div className="flex justify-center mb-4">
                         <img src={gift.qr_image} alt="QR Code" className="w-24 h-24 object-contain rounded-lg shadow-sm bg-white p-1" />
                      </div>
                    )}
                    <p className="font-sans text-2xl font-light tracking-widest mb-1" style={{ color: textColor }}>
                      {gift.acc}
                    </p>
                    <p className={`font-sans text-[10px] font-bold uppercase tracking-widest ${mutedText}`}>
                      A.N. {gift.name}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(gift.acc, index);
                    }}
                    className="mt-auto px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
                    style={{
                      backgroundColor: copiedIndex === index ? "#22c55e" : primaryColor,
                      color: isDark ? "#000" : "#fff",
                    }}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check size={14} /> Tersalin
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Salin Nomor
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {gift_address && (
        <div
          className={`mt-12 w-full max-w-lg p-8 rounded-2xl border text-center ${cardBg} ${cardBorder}`}
          style={{ backgroundColor: bgColor }}
        >
          <MapPin className="w-8 h-8 mx-auto mb-4 opacity-50" style={{ color: primaryColor }} />
          <h3 className="font-sans text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: primaryColor }}>
            Alamat Pengiriman Kado
          </h3>
          <p className={`font-sans text-sm leading-relaxed italic ${mutedText}`}>
            {gift_address}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(gift_address);
              setCopiedIndex(999);
              setTimeout(() => setCopiedIndex(null), 2000);
            }}
            className="mt-6 px-6 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all inline-flex items-center gap-2"
            style={{
              borderColor: copiedIndex === 999 ? "#22c55e" : primaryColor,
              color: copiedIndex === 999 ? "#22c55e" : primaryColor,
            }}
          >
            {copiedIndex === 999 ? (
              <>
                <Check size={14} /> Tersalin
              </>
            ) : (
              <>
                <Copy size={14} /> Salin Alamat
              </>
            )}
          </button>
        </div>
      )}
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
