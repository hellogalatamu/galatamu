import React from "react";

export default function DraftOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
      <div className="bg-white p-8 rounded-3xl text-center max-w-sm shadow-2xl pointer-events-auto border border-gray-100 mx-4">
        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-2">Mode Draf</h2>
        <p className="text-gray-600 font-light mb-6">Undangan ini masih dalam mode draf dan belum diaktifkan. Silakan selesaikan pembayaran untuk mempublikasikannya.</p>
        <a 
          href="https://wa.me/6289687934761" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block w-full py-3 bg-[#1a1a1a] text-white rounded-full font-medium tracking-wide hover:bg-gray-800 transition-colors"
        >
          Hubungi Admin
        </a>
      </div>
    </div>
  );
}
