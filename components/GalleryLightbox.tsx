"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import FadeIn from "./FadeIn";

interface GalleryLightboxProps {
  images: string[];
  /** Batas maksimal foto yang ditampilkan (dari tier tema). Jika tidak diisi, tampilkan semua. */
  maxImages?: number;
  /** Optional CSS classes for the outer grid wrapper */
  gridClassName?: string;
  /** Optional CSS classes for each thumbnail item */
  itemClassName?: string;
  /** Optional CSS classes for each thumbnail <img> */
  imgClassName?: string;
  /** Title shown above gallery. Defaults to "Gallery Foto" */
  title?: string;
  /** CSS class for title text */
  titleClassName?: string;
  /** Outer section className */
  sectionClassName?: string;
}

export default function GalleryLightbox({
  images,
  maxImages,
  gridClassName = "grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto",
  itemClassName = "aspect-square rounded-2xl overflow-hidden bg-gray-200 group cursor-pointer relative",
  imgClassName = "w-full h-full object-cover group-hover:scale-110 transition duration-700",
  title = "Gallery Foto",
  titleClassName = "font-serif text-4xl mb-12 text-center",
  sectionClassName = "py-24 px-6 bg-[#faf9f6]",
}: GalleryLightboxProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allFiltered = images.filter((img) => img && img.trim() !== "");
  const filtered = maxImages !== undefined ? allFiltered.slice(0, maxImages) : allFiltered;

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  const close = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prev, next, close]);

  if (filtered.length === 0) return null;

  return (
    <>
      <section className={sectionClassName}>
        <FadeIn>
          <h3 className={titleClassName}>{title}</h3>
        </FadeIn>
        <div className={gridClassName}>
          {filtered.map((img, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div
                className={itemClassName}
                onClick={() => setLightboxIndex(i)}
                role="button"
                aria-label={`Lihat foto ${i + 1}`}
              >
                <img src={img} alt={`Gallery foto ${i + 1}`} className={imgClassName} />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center rounded-2xl">
                  <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 w-8 h-8 drop-shadow-lg" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={close}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            onClick={close}
            aria-label="Tutup"
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest uppercase font-light">
            {lightboxIndex + 1} / {filtered.length}
          </div>

          {/* Prev */}
          {filtered.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] mx-auto px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filtered[lightboxIndex]}
              alt={`Gallery foto ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl select-none"
            />
          </div>

          {/* Next */}
          {filtered.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Foto berikutnya"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Thumbnails */}
          {filtered.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {filtered.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === lightboxIndex ? "bg-white scale-125" : "bg-white/30 hover:bg-white/60"}`}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
