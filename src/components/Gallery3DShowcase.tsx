"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import { handleGoogleDriveImageError, formatGoogleDriveUrl } from "@/lib/driveUtils";
import {
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Camera,
  Pause,
  Play,
  Layers,
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
    "Peringatan momen hari besar Islam dan kajian keilmuan bersama seluruh pelajar SMA Negeri 4 Purwokerto guna mempertebal keimanan.",
  "Ibadah Rutin":
    "Pembiasaan ibadah harian seperti sholat dhuha, tadarus Al-Qur'an, dan sholat dzuhur berjamaah di Musholla Al-Ikhlas SMAPA.",
  "Mentoring Pelajar":
    "Lingkaran ukhuwah dan mentoring pekanan sahabat taat untuk pembinaan akhlak mulia dan saling mendukung dalam kebaikan.",
  default:
    "Dokumentasi potret kebersamaan dan kegiatan syiar dakwah pelajar SMA Negeri 4 Purwokerto.",
};

export default function Gallery3DShowcase({
  items = [],
  tag = "Dokumentasi Kegiatan",
  title = "Galeri Syiar & Ukhuwah SMAPA",
  lead = "Potret nyata aktivitas pembiasaan ibadah di Musholla Al-Ikhlas, kajian keputrian, dan kegiatan kepemimpinan SMA Negeri 4 Purwokerto.",
}: Gallery3DShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [progressKey, setProgressKey] = useState(0);

  // Real-time Drag / Swipe Physics state (rAF-throttled for 60/120fps mobile)
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number | null>(null);
  const dragDeltaRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isDragActiveRef = useRef(false);
  const hasMovedRef = useRef(false);

  const autoPlayDuration = 4000; // 4 seconds auto-slide

  const safeItems = items.length > 0 ? items : [
    {
      id: "gal-1",
      title: "Kajian Akbar & Peringatan Isra Mi'raj Pelajar",
      category: "Kajian Akbar",
      date: "28 September 2026",
      image: "/images/dokumentasi-muskerta.jpg",
      description: "Peringatan hari besar Islam bersama seluruh pelajar muslim SMA Negeri 4 Purwokerto.",
    },
    {
      id: "gal-2",
      title: "Tadarus Pagi & Pembiasaan Sholat Dhuha Berjamaah",
      category: "Ibadah Rutin",
      date: "05 Oktober 2026",
      image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000&auto=format&fit=crop",
      description: "Pembiasaan sholat dhuha dan tadarus bersama sebelum jam belajar dimulai.",
    },
    {
      id: "gal-3",
      title: "Mentoring Pekanan & Lingkaran Ukhuwah Sahabat Taat",
      category: "Mentoring Pelajar",
      date: "15 Oktober 2026",
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1000&auto=format&fit=crop",
      description: "Forum pembinaan karakter dan tadabbur dalam kelompok kecil sahabat taat.",
    },
  ];

  const total = safeItems.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgressKey((prev) => prev + 1);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgressKey((prev) => prev + 1);
  }, [total]);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setCurrentIndex(idx);
    setProgressKey((prev) => prev + 1);
  };

  // Real-time Drag Handlers (rAF-throttled)
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
    if (Math.abs(rawDelta) > 5) {
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
    const threshold = 32;
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

  // Auto-Slide Timer: 4 Seconds with Smooth Pause on Hover or Drag
  useEffect(() => {
    if (isPaused || isHovered || isDragging || total <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayDuration);

    return () => clearInterval(timer);
  }, [isPaused, isHovered, isDragging, nextSlide, total, autoPlayDuration]);

  // Enhanced 3D Mouse Parallax & Dynamic Light Reflection Physics
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Stronger, dramatic tilt angles (up to ±24 degrees Y and ±20 degrees X)
    const rotateY = Number((x * 24).toFixed(2));
    const rotateX = Number((-y * 20).toFixed(2));

    setCardTilt({ x: rotateY, y: rotateX });
    setGlarePos({
      x: Number(((x + 0.5) * 100).toFixed(1)),
      y: Number(((y + 0.5) * 100).toFixed(1)),
      opacity: 0.45,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCardTilt({ x: 0, y: 0 });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <section id="galeri" className="scroll-mt-20 py-20 lg:py-28 bg-gradient-to-b from-[#fafaf7] via-emerald-50/40 to-[#fafaf7] border-t border-emerald-900/5 relative overflow-hidden">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-emerald-400/12 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-[400px] h-[400px] bg-amber-400/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 lg:mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/90 border border-emerald-300/40 px-3.5 py-1.5 rounded-full mb-3 shadow-sm">
              <Sparkles size={14} className="text-emerald-700 animate-pulse" />
              <span>{tag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 tracking-tight">
              {title}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
              {lead}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/galeri"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 bg-white/90 hover:bg-emerald-50 px-4 py-2.5 rounded-full border border-emerald-900/10 shadow-sm transition-all duration-300 group"
            >
              <Camera size={16} className="text-emerald-700" />
              <span>Buka Galeri Lengkap</span>
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* 3D FLOATING SHOWCASE STAGE WITH REAL-TIME DRAG PHYSICS */}
        <div
          className={`relative max-w-6xl mx-auto select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            perspective: "1100px",
            perspectiveOrigin: "50% 50%",
            touchAction: "pan-y",
          }}
          onMouseDown={(e) => {
            if (e.button !== 0) return;
            handleDragStart(e.clientX);
          }}
          onMouseMove={(e) => {
            if (isDragActiveRef.current) {
              handleDragMove(e.clientX);
            }
          }}
          onMouseUp={handleDragEnd}
          onMouseLeave={() => {
            handleMouseLeave();
            if (isDragActiveRef.current) {
              handleDragEnd();
            }
          }}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
          onTouchCancel={handleDragEnd}
        >
          {/* Main 3D Stage Container */}
          <div
            className="relative w-full h-[380px] sm:h-[490px] lg:h-[540px] flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Left Floating Arrow Navigation Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Foto Sebelumnya"
              style={{ transform: "translateZ(150px)" }}
              className="absolute left-1.5 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/80 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center border border-white/25 shadow-xl transition-transform duration-200 cursor-pointer group"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Right Floating Arrow Navigation Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Foto Berikutnya"
              style={{ transform: "translateZ(150px)" }}
              className="absolute right-1.5 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/80 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center border border-white/25 shadow-xl transition-transform duration-200 cursor-pointer group"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 3D CARDS: Center, Left Angled, and Right Angled in Physical Space */}
            {safeItems.map((item, idx) => {
              // Calculate spatial distance from active center card
              let dist = (idx - currentIndex + total) % total;
              if (dist > total / 2) dist -= total;

              const isCenter = dist === 0;
              const isLeft = dist === -1;
              const isRight = dist === 1;
              const isVisible = isCenter || isLeft || isRight;

              // Real-time Drag offsets & angles
              const currentDrag = isDragging ? dragOffset : 0;
              const dragAngle = Number(((currentDrag / 300) * 10).toFixed(2));

              // Pure GPU-composited 3D Geometry (transform + opacity only)
              let transform = "";
              let zIndex = 1;
              let opacity = 0;
              let pointerEvents: "auto" | "none" = "none";

              if (isCenter) {
                const tiltX = cardTilt.x;
                const tiltY = cardTilt.y;
                transform = `translate3d(${currentDrag}px, 0, ${
                  isHovered ? "65px" : "45px"
                }) rotateY(${tiltX + dragAngle}deg) rotateX(${tiltY}deg) scale(1)`;
                zIndex = 35;
                opacity = 1;
                pointerEvents = "auto";
              } else if (isLeft) {
                transform = `translate3d(calc(-54% + ${currentDrag * 0.65}px), 0, -85px) rotateY(${
                  24 + dragAngle
                }deg) scale(0.88)`;
                zIndex = 15;
                opacity = 0.6;
                pointerEvents = "auto";
              } else if (isRight) {
                transform = `translate3d(calc(54% + ${currentDrag * 0.65}px), 0, -85px) rotateY(${
                  -24 + dragAngle
                }deg) scale(0.88)`;
                zIndex = 15;
                opacity = 0.6;
                pointerEvents = "auto";
              } else if (dist < -1) {
                transform = "translate3d(-110%, 0, -200px) rotateY(36deg) scale(0.72)";
                zIndex = 1;
                opacity = 0;
              } else {
                transform = "translate3d(110%, 0, -200px) rotateY(-36deg) scale(0.72)";
                zIndex = 1;
                opacity = 0;
              }

              const rawItemImg =
                item.image || item.coverImage || item.imageUrl || "/images/dokumentasi-muskerta.jpg";
              const itemImage = formatGoogleDriveUrl(rawItemImg);
              const itemDesc =
                item.description ||
                item.caption ||
                DEFAULT_DESCRIPTIONS[item.category] ||
                DEFAULT_DESCRIPTIONS.default;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (hasMovedRef.current) return;
                    if (isLeft) prevSlide();
                    if (isRight) nextSlide();
                  }}
                  onMouseMove={isCenter && !isDragging ? handleMouseMove : undefined}
                  onMouseEnter={isCenter ? handleMouseEnter : undefined}
                  onMouseLeave={isCenter ? handleMouseLeave : undefined}
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
                      : isCenter && isHovered
                      ? "transform 160ms ease-out, opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)"
                      : "transform 440ms cubic-bezier(0.22, 1, 0.36, 1), opacity 440ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  className={`absolute w-[82vw] min-w-[260px] max-w-[345px] sm:w-[490px] sm:max-w-none lg:w-[620px] h-[350px] sm:h-[460px] lg:h-[500px] rounded-[26px] sm:rounded-[32px] overflow-hidden bg-emerald-950 will-change-transform border border-white/30 select-none ${
                    isCenter
                      ? "shadow-2xl ring-1 ring-white/25"
                      : "shadow-xl cursor-pointer hover:opacity-80"
                  }`}
                >
                  {/* Layer 0: Background Photo */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img
                      draggable={false}
                      decoding="async"
                      src={parseImageCrop(itemImage).src}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleGoogleDriveImageError(e, itemImage)}
                      style={getImageCropStyle(itemImage)}
                      className="w-full h-full select-none"
                    />

                    {/* Multi-Stop Cinematic Overlay Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#041a13] via-[#041a13]/65 to-transparent opacity-95 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Lightweight Directional Shading for angled side cards */}
                  {isLeft && (
                    <div className="absolute inset-0 bg-black/35 pointer-events-none z-20" />
                  )}
                  {isRight && (
                    <div className="absolute inset-0 bg-black/35 pointer-events-none z-20" />
                  )}

                  {/* Layer 1: 3D Glare Lighting Sheen (Active on Center Card) */}
                  {isCenter && !isDragging && isHovered && (
                    <div
                      style={{
                        background: `radial-gradient(circle 400px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}) 0%, transparent 80%)`,
                      }}
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    />
                  )}

                  {/* Layer 2: Top Floating Info Badges */}
                  <div className="absolute top-5 sm:top-6 left-5 sm:left-7 right-5 sm:right-7 flex items-center justify-between gap-3 pointer-events-none z-20">
                    {/* Category Pill Tag */}
                    <div className="flex items-center gap-2">
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-600 text-white border border-white/25 shadow-md">
                        {item.category}
                      </span>
                      {item.emoji && (
                        <span className="w-7 h-7 rounded-full bg-white text-xs flex items-center justify-center shadow-md">
                          {item.emoji}
                        </span>
                      )}
                    </div>

                    {/* Auto-Slide Status & Counter */}
                    {isCenter && (
                      <div className="flex items-center gap-2 pointer-events-auto">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPaused(!isPaused);
                          }}
                          title={
                            isPaused
                              ? "Lanjutkan putar otomatis"
                              : "Jeda putar otomatis"
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-black/75 hover:bg-black/90 text-emerald-300 border border-white/15 transition-colors shadow-md cursor-pointer"
                        >
                          {isPaused || isHovered || isDragging ? (
                            <>
                              <Pause size={11} className="text-amber-400" />
                              <span className="text-amber-300">
                                {isDragging
                                  ? "Digeser"
                                  : isHovered
                                  ? "Dijeda (Hover)"
                                  : "Dijeda"}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              <span>Otomatis (4s)</span>
                            </>
                          )}
                        </button>

                        <div className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white/90 bg-black/75 border border-white/15 shadow-md">
                          {currentIndex + 1} / {total}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Layer 3: Main Foreground Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 z-20 pointer-events-auto">
                    <div>
                      {/* Date Badge */}
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-full mb-2.5 shadow">
                        <Calendar size={13} className="text-amber-300" />
                        <span>{item.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white leading-snug tracking-tight mb-2">
                        {item.title}
                      </h3>

                      {/* Description (visible on center) */}
                      {isCenter && (
                        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-3 mb-4">
                          {itemDesc}
                        </p>
                      )}

                      {/* Action Links */}
                      {isCenter && (
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <Link
                            href="/galeri"
                            onClick={(e) => {
                              if (hasMovedRef.current) e.preventDefault();
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 text-xs sm:text-sm font-black tracking-wide shadow-lg transition-transform duration-200 group"
                          >
                            <span>Lihat Dokumentasi Lengkap</span>
                            <ArrowRight
                              size={15}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </Link>

                          <span className="text-xs text-emerald-200/80 hidden sm:inline-flex items-center gap-1.5">
                            <Sparkles size={13} className="text-amber-300" />
                            <span>Geser kartu ke kanan/kiri untuk melihat</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Layer 4: 4-Second Animated Progress Bar on Center Card */}
                  {isCenter && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden">
                      <div
                        key={progressKey}
                        style={{
                          animationDuration: `${autoPlayDuration}ms`,
                          animationPlayState:
                            isPaused || isHovered || isDragging
                              ? "paused"
                              : "running",
                        }}
                        className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 animate-[progressSweep_linear_forwards]"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Realistic Ambient Dynamic Ground Shadow beneath the 3D stage */}
          <div
            className={`w-[75%] h-8 bg-emerald-950/25 blur-2xl mx-auto rounded-full mt-2 transition-all duration-700 ${
              !isHovered && !isDragging
                ? "animate-float-shadow"
                : "scale-95 opacity-55"
            }`}
          />

          {/* Bottom Thumbnail Selector & Indicator Strip */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {/* Interactive Thumbnail Previews */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 max-w-full px-2">
              {safeItems.map((item, idx) => {
                const isActive = idx === currentIndex;
                const rawThumbImg =
                  item.image || item.coverImage || item.imageUrl || "/images/dokumentasi-muskerta.jpg";
                const thumbImage = formatGoogleDriveUrl(rawThumbImg);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`group relative flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl transition-all duration-500 text-left cursor-pointer border ${
                      isActive
                        ? "bg-white border-emerald-500 shadow-xl scale-105 ring-2 ring-emerald-500/25 -translate-y-1"
                        : "bg-white/60 hover:bg-white border-gray-200/80 hover:border-emerald-300 opacity-70 hover:opacity-100 hover:scale-102"
                    }`}
                  >
                    <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-emerald-950 shrink-0">
                      <img
                        draggable={false}
                        src={parseImageCrop(thumbImage).src}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleGoogleDriveImageError(e, thumbImage)}
                        style={getImageCropStyle(thumbImage)}
                        className="w-full h-full transition-transform duration-300 select-none"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-emerald-600/25 border-2 border-emerald-400 rounded-xl" />
                      )}
                    </div>

                    <div className="max-w-[130px] sm:max-w-[180px]">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        <span>{item.category}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-gray-500 block">
                        {item.date}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dot Indicators */}
            <div className="flex items-center gap-2 mt-1">
              {safeItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Ke slide ${idx + 1}`}
                  className={`transition-all duration-500 rounded-full cursor-pointer ${
                    idx === currentIndex
                      ? "w-8 h-2.5 bg-emerald-600 shadow-sm"
                      : "w-2.5 h-2.5 bg-gray-300 hover:bg-emerald-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
