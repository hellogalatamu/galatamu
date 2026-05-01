"use client";

import { ReactNode } from "react";

interface PhoneMockupProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

export default function PhoneMockup({ children, className = "", innerClassName = "" }: PhoneMockupProps) {
  return (
    <div className={`relative mx-auto border-[8px] border-[#1a1a1a] rounded-[2.5rem] bg-[#1a1a1a] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-700 ${className}`} 
         style={{ width: '100%', height: '100%' }}>
      {/* Notch / Speaker */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-[120] flex items-center justify-center">
        <div className="w-10 h-1 bg-white/10 rounded-full" />
      </div>
      
      {/* Screen Content */}
      <div className={`w-full h-full bg-white rounded-[1.8rem] overflow-hidden relative z-10 ${innerClassName}`}>
        {children}
      </div>

      {/* Gloss Effect */}
      <div className="absolute inset-0 pointer-events-none z-[130] bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
    </div>
  );
}
