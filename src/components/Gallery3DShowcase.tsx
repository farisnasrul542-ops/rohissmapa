"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import { handleGoogleDriveImageError, formatGoogleDriveUrl } from "@/lib/driveUtils";
import {
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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
    "Pembiasaan ibadah harian seperti sholat dhuha, tadarus Al-Qur'an, dan sholat dzuhur berjamaah di Musholla Al-Ikhlas.",
  default:
    "Dokumentasi kegiatan dan kebersamaan keluarga besar Rohis SMA Negeri 4 Purwokerto.",
};

export default function Gallery3DShowcase({
  items = [],
  title = "Galeri Syiar & Ukhuwah",
  lead = "Dokumentasi kegiatan dan kebersamaan keluarga besar Rohis SMAPA.",
}: Gallery3DShowcaseProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);

  // Real-time Drag / Swipe state
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number | null>(null);
  const dragDeltaRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isDragActiveRef = useRef(false);
  const hasMovedRef = useRef(false);

  const safeItems =
    items.length > 0
      ? items
      : [
          {
            id: "GAL-001",
            title: "Musyawarah Kerja Anggota (MUSKERTA) 2026",
            category: "Muskerta & Raker",
            date: "12 Oktober 2026",
            image: "/images/dokumentasi-muskerta.jpg",
            description:
              "Dokumentasi Musyawarah Kerja Anggota (MUSKERTA) Rohis SMA Negeri 4 Purwokerto bersama pembina.",
          },
          {
            id: "GAL-002",
            title: "SMAN 4 MENOLONG",
            category: "Sosial",
            date: "28 Mei 2026",
            image: "/images/galeri-sman4-menolong.jpg",
            description:
              "Penyaluran bantuan kemanusiaan keluarga besar SMAN 4 Purwokerto bagi masyarakat terdampak bencana.",
          },
          {
            id: "GAL-003",
            title: "Tadarus & Sholat Dhuha Berjamaah",
            category: "Ibadah",
            date: "05 Oktober 2026",
            image: "https://iili.io/nP8LnYF.jpg#crop=53,50,0.75,cover",
            description:
              "Pembiasaan ibadah pagi dan tilawah Al-Qur'an bersama sebelum kegiatan belajar mengajar dimulai.",
          },
        ];

  const total = safeItems.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
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

  // Autoplay: disabled on reduced-motion, hover, focus, drag, or hidden tab
  useEffect(() => {
    if (
      prefersReducedMotion ||
      isPaused ||
      isHovered ||
      isFocused ||
      isDragging ||
      isTabHidden ||
      total <= 1
    ) {
      return;
    }

    const timer = setInterval(() => {
      nextSlide();
    }, 4800);

    return () => clearInterval(timer);
  }, [
    prefersReducedMotion,
    isPaused,
    isHovered,
    isFocused,
    isDragging,
    isTabHidden,
    nextSlide,
    total,
  ]);

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

  return (
    <section
      id="galeri"
      aria-label="Galeri Syiar dan Ukhuwah"
      className="scroll-mt-24 py-12 sm:py-16 lg:py-20 relative overflow-hidden"
    >
      <div className="clay-stage-podium max-w-[1176px] mx-4 sm:mx-6 lg:mx-auto px-1 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#153E32] tracking-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-[#3B5E52] mt-2 leading-relaxed">
            {lead}
          </p>
        </div>

        {/* 3D Coverflow Stage */}
        <div
          className={`relative max-w-5xl mx-auto select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            perspective: prefersReducedMotion ? "none" : "1200px",
            perspectiveOrigin: "50% 50%",
            touchAction: "pan-y",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            if (isDragActiveRef.current) handleDragEnd();
          }}
          onFocusCapture={() => setIsFocused(true)}
          onBlurCapture={() => setIsFocused(false)}
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
            className="relative w-full h-[445px] sm:h-[470px] lg:h-[480px] flex items-center justify-center"
            style={{
              transformStyle: prefersReducedMotion ? "flat" : "preserve-3d",
            }}
          >
            {/* Left Circular Clay Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Dokumentasi Sebelumnya"
              style={{
                transform: prefersReducedMotion ? undefined : "translateZ(120px)",
              }}
              className="absolute left-0 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full clay-btn-white flex items-center justify-center text-[#153E32] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Circular Clay Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Dokumentasi Berikutnya"
              style={{
                transform: prefersReducedMotion ? undefined : "translateZ(120px)",
              }}
              className="absolute right-0 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full clay-btn-white flex items-center justify-center text-[#153E32] cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Coverflow Cards */}
            {safeItems.map((item, idx) => {
              let dist = (idx - currentIndex + total) % total;
              if (dist > total / 2) dist -= total;

              const isCenter = dist === 0;
              const isLeft = dist === -1;
              const isRight = dist === 1;
              const isVisible = isCenter || isLeft || isRight;

              const currentDrag = isDragging ? dragOffset : 0;
              const dragAngle = prefersReducedMotion
                ? 0
                : Number(((currentDrag / 300) * 8).toFixed(2));

              let transform = "";
              let zIndex = 1;
              let opacity = 0;
              let pointerEvents: "auto" | "none" = "none";

              if (prefersReducedMotion) {
                transform = isCenter
                  ? "translate3d(0, 0, 0) scale(1)"
                  : isLeft
                  ? "translate3d(-52%, 0, 0) scale(0.9)"
                  : isRight
                  ? "translate3d(52%, 0, 0) scale(0.9)"
                  : "scale(0.85)";
                zIndex = isCenter ? 30 : isVisible ? 15 : 1;
                opacity = isCenter ? 1 : isVisible ? 0.55 : 0;
                pointerEvents = isVisible ? "auto" : "none";
              } else if (isCenter) {
                transform = `translate3d(${currentDrag}px, -4px, 64px) rotateY(${dragAngle}deg) scale(1)`;
                zIndex = 35;
                opacity = 1;
                pointerEvents = "auto";
              } else if (isLeft) {
                transform = `translate3d(calc(-56% + ${
                  currentDrag * 0.55
                }px), 8px, -90px) rotateY(${23 + dragAngle}deg) scale(0.88)`;
                zIndex = 15;
                opacity = 0.96;
                pointerEvents = "auto";
              } else if (isRight) {
                transform = `translate3d(calc(56% + ${
                  currentDrag * 0.55
                }px), 8px, -90px) rotateY(${-23 + dragAngle}deg) scale(0.88)`;
                zIndex = 15;
                opacity = 0.96;
                pointerEvents = "auto";
              } else if (dist < -1) {
                transform =
                  "translate3d(-105%, 12px, -160px) rotateY(24deg) scale(0.78)";
                zIndex = 1;
                opacity = 0;
              } else {
                transform =
                  "translate3d(105%, 12px, -160px) rotateY(-24deg) scale(0.78)";
                zIndex = 1;
                opacity = 0;
              }

              const rawItemImg =
                item.image ||
                item.coverImage ||
                item.imageUrl ||
                "/images/dokumentasi-muskerta.jpg";
              const itemImage = formatGoogleDriveUrl(rawItemImg);
              const itemDesc =
                item.description ||
                item.caption ||
                DEFAULT_DESCRIPTIONS[item.category] ||
                DEFAULT_DESCRIPTIONS.default;

              return (
                <article
                  key={item.id}
                  data-active={isCenter}
                  onClick={() => {
                    if (hasMovedRef.current) return;
                    if (isLeft) prevSlide();
                    else if (isRight) nextSlide();
                    else if (isCenter) router.push("/galeri");
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
                  className={`clay-coverflow-card absolute w-[68vw] min-w-[220px] max-w-[305px] sm:w-[350px] sm:max-w-none lg:w-[400px] clay-card p-3 sm:p-4 flex flex-col justify-between text-left select-none cursor-pointer ${
                    isCenter
                      ? "shadow-[0_20px_42px_-12px_rgba(15,62,46,0.18)]"
                      : "hover:opacity-90"
                  }`}
                >
                  {/* Top Photo */}
                  <div>
                    <div className="relative h-[175px] sm:h-[205px] lg:h-[220px] w-full rounded-[16px] overflow-hidden bg-[#E5F2EC] mb-3.5">
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

                    {/* Title & Description */}
                    <div className="px-1.5">
                      <div className="flex items-center gap-2 text-[11.5px] font-semibold text-[#4A6B5F] mb-1">
                        <Calendar size={12} className="text-[#087A53] shrink-0" />
                        <span>{item.date}</span>
                        <span>•</span>
                        <span className="text-[#087A53] font-bold">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="font-heading text-base sm:text-lg font-extrabold text-[#153E32] leading-snug line-clamp-1 mb-1">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-[13px] text-[#3B5E52] line-clamp-2 leading-relaxed">
                        {itemDesc}
                      </p>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="px-1.5 pt-3 mt-2 flex items-center justify-between">
                    {isCenter ? (
                      <Link
                        href="/galeri"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hasMovedRef.current) e.preventDefault();
                        }}
                        className="clay-btn-emerald px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold inline-flex items-center gap-1.5"
                      >
                        <span>Lihat galeri</span>
                        <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <span className="text-xs font-bold text-[#087A53] inline-flex items-center gap-1">
                        <span>Pilih foto</span>
                        <ArrowRight size={12} />
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination Dots & Pause Button */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              {safeItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Pilih dokumentasi ${idx + 1}`}
                  className={`transition-all duration-200 rounded-full cursor-pointer h-2.5 ${
                    idx === currentIndex
                      ? "w-7 bg-[#087A53]"
                      : "w-2.5 bg-[#C5DDD2] hover:bg-[#8FC2AC]"
                  }`}
                />
              ))}
            </div>

            {!prefersReducedMotion && total > 1 && (
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={
                  isPaused ? "Putar otomatis galeri" : "Jeda otomatis galeri"
                }
                className="clay-pill-white px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#3B5E52] hover:text-[#153E32] inline-flex items-center gap-1 cursor-pointer"
              >
                {isPaused ? <Play size={11} /> : <Pause size={11} />}
                <span>{isPaused ? "Putar" : "Jeda"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
