"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowLeft } from "lucide-react";
import { InvitationData } from "@/components/themes/types";
import ThemeRegistry from "@/components/ThemeRegistry";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvitationData;
  themeId: string;
  backButtonText?: string;
}

export default function PreviewModal({ isOpen, onClose, data, themeId, backButtonText }: PreviewModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99999,
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Bar */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      }}>
        <button
          onClick={onClose}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            fontSize: "14px", fontWeight: 600, color: "#1a1a1a",
            background: "none", border: "none", cursor: "pointer",
            padding: "7px 14px", borderRadius: "999px",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <ArrowLeft size={18} />
          {backButtonText || "Kembali ke Editor"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "#9ca3af",
            backgroundColor: "#f9fafb", padding: "4px 12px", borderRadius: "999px",
          }}>
            Pratinjau Undangan
          </span>
          <button
            onClick={onClose}
            aria-label="Tutup"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#9ca3af", padding: "6px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget.style.backgroundColor = "#f3f4f6"); (e.currentTarget.style.color = "#1a1a1a"); }}
            onMouseLeave={e => { (e.currentTarget.style.backgroundColor = "transparent"); (e.currentTarget.style.color = "#9ca3af"); }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable Theme Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <ThemeRegistry
          themeId={themeId || "amara_01"}
          data={data}
          previewMode={true}
        />
      </div>
    </div>,
    document.body
  );
}
