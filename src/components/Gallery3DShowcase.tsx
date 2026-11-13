"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { getCoverflowState } from "@/lib/coverflow";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import { handleGoogleDriveImageError, formatGoogleDriveUrl } from "@/lib/driveUtils";
import {
  Calendar,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  Pause,
  Play,
} from "lucide-react";

export interface GalleryShowcaseItem {
  id: string | number;
  title: string;
  category: string;
  date: string;
  image?: string;
  coverImage?: string;
  imageUrl?: string;
  description?: string;
  caption?: string;
  emoji?: string;
}

interface Gallery3DShowcaseProps {
  items: GalleryShowcaseItem[];
  tag?: string;
  title?: string;
  lead?: string;
}

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  "Kajian Akbar":
    "Peringatan momen hari besar Islam dan kajian keilmuan bersama seluruh pelajar SMA Negeri 4 Purwokerto.",
  "Ibadah Rutin":
    "Pembiasaan ibadah harian seperti sholat dhuha, tadarus Al-Qur'an, dan sholat dzuhur berjamaah.",
  Sosial: "Berbagi kepedulian bersama keluarga SMAPA.",
  default:
    "Dokumentasi kegiatan dan kebersamaan keluarga besar Rohis SMA Negeri 4 Purwokerto.",
};

export default function Gallery3DShowcase({
  items = [],
  tag = "DOKUMENTASI ROHIS",
  title = "Galeri Syiar & Ukhuwah",
  lead = "Cerita kegiatan dan kebersamaan keluarga Rohis SMAPA.",
}: Gallery3DShowcaseProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<GalleryShowcaseItem | null>(
    null
  );

  // Real-time Drag / Swipe state
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number | null>(null);
  const dragDeltaRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isDragActiveRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lightboxOpen = lightboxItem !== null;

  const safeItems = useMemo(
    () =>
      items.length > 0
        ? items
        : [
            {
              id: "GAL-001",
              title: "Musyawarah Kerja Anggota (MUSKERTA) 2026",
              category: "Kegiatan",
              date: "12 Oktober 2026",
              image: "/images/dokumentasi-muskerta.jpg",
              description:
                "Dokumentasi Musyawarah Kerja Anggota (MUSKERTA) Rohis SMA Negeri 4 Purwokerto.",
            },
            {
              id: "GAL-002",
              title: "SMAN 4 MENOLONG",
              category: "Sosial",
              date: "28 Mei 2026",
              image: "/images/galeri-sman4-menolong.jpg",
              description: "Berbagi kepedulian bersama keluarga SMAPA.",
            },
            {
              id: "GAL-003",
              title: "Tadarus & Sholat Dhuha Berjamaah",
              category: "Ibadah",
              date: "05 Oktober 2026",
              image: "https://iili.io/nP8LnYF.jpg#crop=53,50,0.75,cover",
              description:
                "Pembiasaan ibadah pagi dan tilawah Al-Qur'an bersama sebelum kegiatan belajar.",
            },
          ],
    [items]
  );

  const total = safeItems.length;
  const safeIndex = total > 0 ? currentIndex % total : 0;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    if (idx === safeIndex) return;
    setCurrentIndex(idx);
  };

  useEffect(() => {
    const onVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Autoplay: paused on reduced-motion, hover, focus, drag, lightbox, or hidden tab
  useEffect(() => {
    if (
      prefersReducedMotion ||
      isPaused ||
      isHovered ||
      isFocused ||
      isDragging ||
      isTabHidden ||
      lightboxItem !== null ||
      total <= 1
    ) {
      return;
    }

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [
    prefersReducedMotion,
    isPaused,
    isHovered,
    isFocused,
    isDragging,
    isTabHidden,
    lightboxItem,
    nextSlide,
    total,
  ]);

  // Focus and scroll are held once for the entire lightbox session.
  useEffect(() => {
    if (!lightboxOpen) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = prevOverflow;
      const returnTarget = previousFocusRef.current?.isConnected
        ? previousFocusRef.current
        : stageRef.current?.querySelector<HTMLButtonElement>('[data-active="true"] button');
      returnTarget?.focus();
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxItem) return;

    const activeIdxInFiltered = safeItems.findIndex(
      (it) => it.id === lightboxItem.id
    );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && dialogRef.current) {
        const controls = Array.from(dialogRef.current.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setLightboxItem(null);
      } else if (e.key === "ArrowRight" && safeItems.length > 1) {
        e.preventDefault();
        const nextIdx = (Math.max(0, activeIdxInFiltered) + 1) % safeItems.length;
        setLightboxItem(safeItems[nextIdx]);
        setCurrentIndex(nextIdx);
      } else if (e.key === "ArrowLeft" && safeItems.length > 1) {
        e.preventDefault();
        const prevIdx =
          (Math.max(0, activeIdxInFiltered) - 1 + safeItems.length) %
          safeItems.length;
        setLightboxItem(safeItems[prevIdx]);
        setCurrentIndex(prevIdx);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxItem, safeItems]);

  const handleDragStart = (clientX: number) => {
    dragStartXRef.current = clientX;
    dragDeltaRef.current = 0;
    isDragActiveRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragActiveRef.current || dragStartXRef.current === null) return;
    const rawDelta = clientX - dragStartXRef.current;
    const delta = Math.max(-180, Math.min(180, rawDelta));
    dragDeltaRef.current = delta;
    if (Math.abs(rawDelta) > 6) {
      hasMovedRef.current = true;
    }
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setDragOffset(dragDeltaRef.current);
        rafRef.current = null;
      });
    }
  };

  const handleDragEnd = () => {
    if (!isDragActiveRef.current) return;
    isDragActiveRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsDragging(false);

    const finalDelta = dragDeltaRef.current;
    const threshold = 44;
    if (finalDelta < -threshold) {
      nextSlide();
    } else if (finalDelta > threshold) {
      prevSlide();
    }

    dragDeltaRef.current = 0;
    setDragOffset(0);
    dragStartXRef.current = null;
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 60);
  };

  const getItemImage = (item: GalleryShowcaseItem) => {
    const rawImg =
      item.image ||
      item.coverImage ||
      item.imageUrl ||
      "/images/dokumentasi-muskerta.jpg";
    return formatGoogleDriveUrl(rawImg);
  };

  const stepLightbox = (dir: -1 | 1) => {
    if (!lightboxItem || safeItems.length <= 1) return;
    const idx = safeItems.findIndex((it) => it.id === lightboxItem.id);
    const nextIdx =
      (Math.max(0, idx) + dir + safeItems.length) % safeItems.length;
    setLightboxItem(safeItems[nextIdx]);
    setCurrentIndex(nextIdx);
  };

  return (
    <section
      id="galeri"
      aria-label="Galeri Syiar dan Ukhuwah"
      className="showcase-section scroll-mt-24 py-10 sm:py-14 relative"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="showcase-panel clay-card rounded-[32px] p-5 sm:p-8 lg:p-10">
          {/* Header Row (PC: Left aligned + CTA right | HP: Centered + CTA below) */}
          <div className="showcase-heading flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="clay-pill-mint px-3.5 py-1 rounded-full text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#087A53] inline-block mb-2">
                {tag}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#153E32] tracking-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-[#4A6B5F] mt-1 leading-relaxed">
                {lead}
              </p>
            </div>

            <div className="flex justify-center sm:justify-end shrink-0">
              <Link
                href="/galeri"
                className="clay-btn-white px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold text-[#153E32] inline-flex items-center gap-1.5 hover:text-[#087A53]"
              >
                <span>Lihat semua foto</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          {/* 3D Coverflow Stage */}
          <div
            ref={stageRef}
            className={`showcase-stage showcase-gallery relative mx-auto mt-5 sm:mt-6 select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              perspective: prefersReducedMotion ? "none" : "1200px",
              perspectiveOrigin: "50% 50%",
              touchAction: "pan-y pinch-zoom",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              if (isDragActiveRef.current) handleDragEnd();
            }}
            onFocusCapture={() => setIsFocused(true)}
            onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsFocused(false); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                prevSlide();
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                nextSlide();
              }
            }}
            onMouseDown={(e) => {
              if (e.button !== 0) return;
              handleDragStart(e.clientX);
            }}
            onMouseMove={(e) => {
              if (isDragActiveRef.current) handleDragMove(e.clientX);
            }}
            onMouseUp={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
            onTouchCancel={handleDragEnd}
          >
            <div
              className="showcase-deck"
              style={{
                transformStyle: prefersReducedMotion ? "flat" : "preserve-3d",
              }}
            >
              {/* Coverflow Cards */}
              {safeItems.map((item, idx) => {
                const { isCenter, isLeft, isRight, isVisible, position, transform } = getCoverflowState(
                  idx, safeIndex, total, isDragging ? dragOffset : 0, Boolean(prefersReducedMotion),
                );
                const zIndex = isCenter ? 35 : isVisible ? 15 : 1;
                const opacity = isVisible ? 1 : 0;
                const pointerEvents = isVisible ? "auto" : "none";

                const itemImage = getItemImage(item);
                const itemDesc =
                  item.description ||
                  item.caption ||
                  DEFAULT_DESCRIPTIONS[item.category] ||
                  DEFAULT_DESCRIPTIONS.default;

                return (
                  <article
                    key={item.id}
                    data-active={isCenter}
                    data-position={position}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${idx + 1} dari ${total}: ${item.title}`}
                    aria-hidden={!isCenter}
                    onClick={() => {
                      if (hasMovedRef.current) return;
                      if (isLeft) prevSlide();
                      else if (isRight) nextSlide();
                      else if (isCenter) setLightboxItem(item);
                    }}
                    style={{
                      transform,
                      zIndex,
                      opacity,
                      pointerEvents,
                      visibility: isVisible ? "visible" : "hidden",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transition: isDragging
                        ? "none"
                        : prefersReducedMotion
                        ? "opacity 100ms ease"
                        : "transform 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 380ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    className="showcase-card clay-coverflow-card clay-card flex flex-col justify-between text-left select-none cursor-pointer"
                  >
                    {/* Top Photo */}
                    <div>
                      <div className="showcase-photo relative w-full overflow-hidden bg-[#E5F2EC]">
                        <img
                          draggable={false}
                          decoding="async"
                          src={parseImageCrop(itemImage).src}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => handleGoogleDriveImageError(e, itemImage)}
                          style={getImageCropStyle(itemImage)}
                          className="w-full h-full object-cover select-none"
                        />
                      </div>

                      {isCenter ? (
                        <div className="px-1">
                          <div className="showcase-title-row flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-heading text-base sm:text-lg font-extrabold text-[#153E32] leading-snug line-clamp-2">
                              {item.title}
                            </h3>
                            <span className="clay-pill-mint px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#087A53] shrink-0">
                              {item.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-[#4A6B5F] mb-2">
                            <Calendar size={12} className="text-[#087A53] shrink-0" />
                            <span>{item.date}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-[#DCEAE3]/80">
                            <p className="showcase-caption text-xs text-[#3B5E52] line-clamp-2 flex-1 text-center sm:text-left">
                              {itemDesc}
                            </p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (hasMovedRef.current) return;
                                setLightboxItem(item);
                              }}
                              className="showcase-cta clay-btn-white px-3.5 py-1.5 rounded-full text-xs font-bold text-[#087A53] sm:text-[#153E32] hover:text-[#087A53] inline-flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                            >
                              <span>Buka foto</span>
                              <ArrowUpRight size={13} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="px-2 pb-1 text-center">
                          <h3 className="font-heading text-sm sm:text-base font-extrabold text-[#153E32] line-clamp-1">
                            {item.title}
                          </h3>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Bottom Controls: <  dots  > (Matches GALERI PC & HP Reference) */}
            <div className="showcase-controls mt-4 flex items-center justify-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Dokumentasi Sebelumnya"
                disabled={total <= 1}
                className="showcase-arrow w-9 h-9 sm:w-10 sm:h-10 rounded-full clay-btn-white flex items-center justify-center text-[#153E32] cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="showcase-pagination flex items-center gap-2">
                {safeItems.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`Pilih dokumentasi ${idx + 1}`}
                    aria-pressed={idx === safeIndex}
                    className="showcase-dot cursor-pointer"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Dokumentasi Berikutnya"
                disabled={total <= 1}
                className="showcase-arrow w-9 h-9 sm:w-10 sm:h-10 rounded-full clay-btn-white flex items-center justify-center text-[#153E32] cursor-pointer shrink-0"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            {!prefersReducedMotion && total > 1 && (
              <div className="flex justify-center mt-2">
                <button type="button" onClick={() => setIsPaused((value) => !value)}
                  aria-label={isPaused ? "Putar otomatis galeri" : "Jeda otomatis galeri"}
                  aria-pressed={isPaused}
                  className="showcase-pause clay-btn-white inline-flex items-center gap-2 text-xs font-semibold text-[#153E32]">
                  {isPaused ? <Play size={13} /> : <Pause size={13} />}
                  {isPaused ? "Putar" : "Jeda"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal ("Saat foto dibuka") */}
      {typeof document !== "undefined" && createPortal(<AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            onClick={() => setLightboxItem(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxItem.title}
            data-lenis-prevent="true"
            className="fixed inset-0 z-[120] bg-[#0B2219]/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <div
              ref={dialogRef}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full flex flex-col items-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                ref={closeRef}
                aria-label="Tutup foto"
                className="absolute -top-3 -right-1 sm:-top-4 sm:-right-4 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Lightbox Arrow */}
              {safeItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => stepLightbox(-1)}
                  aria-label="Foto sebelumnya"
                  className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Enlarged Image */}
              <div className="w-full max-h-[75vh] rounded-[22px] overflow-hidden bg-[#0F2F23] border border-white/15 shadow-2xl">
                <img
                  src={parseImageCrop(getItemImage(lightboxItem)).src}
                  alt={lightboxItem.title}
                  referrerPolicy="no-referrer"
                  onError={(e) =>
                    handleGoogleDriveImageError(e, getItemImage(lightboxItem))
                  }
                  style={{ objectFit: "contain" }}
                  className="w-full max-h-[75vh] object-contain mx-auto"
                />
              </div>

              {/* Right Lightbox Arrow */}
              {safeItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => stepLightbox(1)}
                  aria-label="Foto berikutnya"
                  className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Caption */}
              <div className="mt-4 text-center text-white max-w-xl px-2">
                <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-[11px] font-bold mb-1.5">
                  {lightboxItem.category} • {lightboxItem.date}
                </span>
                <h3 className="font-heading text-base sm:text-xl font-extrabold">
                  {lightboxItem.title}
                </h3>
                {(lightboxItem.description || lightboxItem.caption) && (
                  <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">
                    {lightboxItem.description || lightboxItem.caption}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </section>
  );
}
