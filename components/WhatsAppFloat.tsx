"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function WhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="relative bg-white shadow-2xl rounded-2xl p-4 border border-gray-100 max-w-[200px]"
          >
            <button 
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 bg-gray-100 text-gray-500 rounded-full p-1 hover:bg-gray-200 transition"
            >
              <X size={10} />
            </button>
            <p className="text-[10px] text-gray-500 font-medium leading-relaxed uppercase tracking-wider">
              Butuh bantuan? Tanya Admin Galatamu yuk! 👋
            </p>
            <div className="absolute bottom-0 right-6 translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/6289687934761?text=Halo%20Admin%20Galatamu!%20Saya%20ingin%20tanya-tanya%20tentang%20undangan%20digital%20premium.%20Boleh%20bantu?%20😊"
        target="_blank"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-shadow hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)]"
      >
        <MessageCircle size={32} />
      </motion.a>
    </div>
  );
}
