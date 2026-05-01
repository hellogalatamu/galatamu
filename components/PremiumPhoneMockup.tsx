"use client";

import { ReactNode } from "react";

interface PremiumPhoneMockupProps {
  children: ReactNode;
  fixedFooter?: ReactNode;
  className?: string;
  innerClassName?: string;
  showPedestal?: boolean;
}

export default function PremiumPhoneMockup({ children, fixedFooter, className = "", innerClassName = "", showPedestal = true }: PremiumPhoneMockupProps) {
  return (
    <div className={`relative perspective-1000 ${className}`}>
      {/* Marble Pedestal Base */}
      {showPedestal && (
        <div className="absolute left-1/2 bottom-[-40px] -translate-x-1/2 w-[320px] h-[320px] z-0">
          {/* The "Block" of marble */}
          <div className="relative w-full h-full transform-style-3d rotate-x-60 rotate-z-45">
            {/* Top */}
            <div className="absolute inset-0 bg-[#f0eee9] border border-gray-200 shadow-inner">
               <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/marble.png')] mix-blend-multiply"></div>
            </div>
            {/* Front */}
            <div className="absolute top-full left-0 w-full h-12 bg-[#dcdad5] origin-top rotate-x-90 border border-gray-300">
               <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/marble.png')] mix-blend-multiply"></div>
            </div>
            {/* Right */}
            <div className="absolute top-0 left-full w-12 h-full bg-[#cbc9c4] origin-left rotate-y-90 border border-gray-300">
               <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/marble.png')] mix-blend-multiply"></div>
            </div>
          </div>
          {/* Soft shadow under the pedestal */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120%] h-20 bg-black/10 blur-3xl rounded-full -z-10"></div>
        </div>
      )}

      {/* iPhone Frame */}
      <div className="relative mx-auto w-[280px] h-[580px] bg-[#1a1a1a] rounded-[3.5rem] p-[10px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] z-10 border border-white/10">
        {/* Gold Outer Frame */}
        <div className="absolute inset-0 rounded-[3.5rem] border-[8px] border-[#d4af37] shadow-[inset_0_0_10px_rgba(255,255,255,0.5),0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>
        <div className="absolute inset-0 rounded-[3.5rem] border-[1px] border-white/30 pointer-events-none"></div>
        
        {/* Screen Area */}
        <div className={`w-full h-full bg-white rounded-[2.8rem] overflow-hidden relative border-[2px] border-[#0a0a0a]`}>
          {/* Screen Content */}
          <div className={`w-full h-full bg-white relative z-10 overflow-y-auto custom-scrollbar ${innerClassName}`}>
            {children}
          </div>

          {/* Fixed Footer (e.g. Action Buttons) */}
          {fixedFooter && (
            <div className="absolute bottom-0 left-0 w-full z-[60]">
              {fixedFooter}
            </div>
          )}

          {/* Notch / Dynamic Island Look */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-[#0a0a0a] rounded-full z-[70] flex items-center justify-center gap-2">
             <div className="w-8 h-1.5 bg-white/5 rounded-full" />
             <div className="w-2 h-2 bg-blue-500/20 rounded-full blur-[1px]" />
          </div>

          {/* Glossy Overlay */}
          <div className="absolute inset-0 pointer-events-none z-[80] bg-gradient-to-tr from-white/5 via-transparent to-white/10 opacity-50" />
        </div>

        {/* Physical Buttons */}
        <div className="absolute -left-[2px] top-24 w-[3px] h-12 bg-gradient-to-b from-[#d4af37] to-[#b8860b] rounded-l-sm"></div>
        <div className="absolute -left-[2px] top-40 w-[3px] h-12 bg-gradient-to-b from-[#d4af37] to-[#b8860b] rounded-l-sm"></div>
        <div className="absolute -right-[2px] top-32 w-[3px] h-20 bg-gradient-to-b from-[#d4af37] to-[#b8860b] rounded-r-sm"></div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1500px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotate-x-60 {
          transform: rotateX(65deg);
        }
        .rotate-z-45 {
          transform: rotateZ(-5deg);
        }
        .rotate-y-90 {
          transform: rotateY(90deg);
        }
        .rotate-x-90 {
          transform: rotateX(-90deg);
        }
      `}</style>
    </div>
  );
}
