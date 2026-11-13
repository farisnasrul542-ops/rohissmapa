"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Users,
  Layers,
  Calendar,
  Camera,
  Building,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface DirectoryItem {
  id: string;
  tag: string;
  icon: React.ElementType;
  title: string;
  shortSubtitle: string;
  description: string;
  link: string;
}

const QUICK_EXPLORE_CARDS = [
  {
    id: "exp-profil",
    title: "Profil Rohis",
    subtitle: "Visi, misi & kepengurusan",
    href: "/tentang",
    icon: Users,
  },
  {
    id: "exp-divisi",
    title: "Divisi & Proker",
    subtitle: "6 divisi & program kerja",
    href: "/program",
    icon: Layers,
  },
  {
    id: "exp-agenda",
    title: "Agenda & Kegiatan",
    subtitle: "Kajian & acara terdekat",
    href: "/agenda",
    icon: Calendar,
  },
];

const DIRECTORY_ITEMS: DirectoryItem[] = [
  {
    id: "profil",
    tag: "PROFIL & VISI",
    icon: BookOpen,
    title: "Profil & Sejarah Rohis",
    shortSubtitle: "Visi, misi & filosofi",
    description:
      "Mengenal visi, misi, rekam jejak perjalanan, dan pembiasaan nilai-nilai Islam rahmatan lil 'alamin di SMA Negeri 4 Purwokerto.",
    link: "/tentang",
  },
  {
    id: "kepengurusan",
    tag: "STRUKTUR ORGANISASI",
    icon: Users,
    title: "Dewan Pembina & Pengurus",
    shortSubtitle: "2 pembina & 44 pengurus",
    description:
      "Susunan dewan pembina guru PAI serta 44 pengurus harian (BPH) dan divisi masa bakti 2026/2027.",
    link: "/tentang#kepengurusan",
  },
  {
    id: "divisi",
    tag: "DIVISI & PROKER",
    icon: Layers,
    title: "6 Divisi & Program Kerja",
    shortSubtitle: "BPH, Pendidikan, Kaderisasi, Humas, Perpusmed, Sarpras",
    description:
      "Eksplorasi program kerja unggulan divisi BPH, Pendidikan, Kaderisasi, Humas, Perpusmed, dan Sarpras Rohis SMAPA.",
    link: "/program",
  },
  {
    id: "agenda",
    tag: "JADWAL & KEGIATAN",
    icon: Calendar,
    title: "Agenda & Kegiatan",
    shortSubtitle: "Kajian & LDKR SMAPA",
    description:
      "Jadwal kajian akbar, latihan dasar kepemimpinan (LDKR), keputrian Jumat, dan musyawarah kerja kader.",
    link: "/agenda",
  },
  {
    id: "galeri",
    tag: "DOKUMENTASI VISUAL",
    icon: Camera,
    title: "Galeri Syiar & Ukhuwah",
    shortSubtitle: "Dokumentasi kegiatan resmi",
    description:
      "Arsip dokumentasi visual potret kebersamaan ibadah di Musholla Al-Ikhlas, bakti sosial, dan momen ukhuwah pelajar.",
    link: "/galeri",
  },
  {
    id: "musholla",
    tag: "PUSAT KEGIATAN",
    icon: Building,
    title: "Musholla Al-Ikhlas SMAPA",
    shortSubtitle: "Pusat syiar & pembinaan",
    description:
      "Pusat kegiatan ibadah harian, kajian rutin, tahsin Al-Qur'an, dan sekretariat Rohis SMA Negeri 4 Purwokerto.",
    link: "/tentang#tentang-kami",
  },
];

export default function Directory3DShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartXRef = useRef<number | null>(null);
  const dragDeltaRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isDragActiveRef = useRef(false);
  const hasMovedRef = useRef(false);

  const total = DIRECTORY_ITEMS.length;

  const nextItem = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevItem = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || isDragging) return;
    const timer = setInterval(() => {
      nextItem();
    }, 5000);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, isPaused, isDragging, nextItem]);

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
      nextItem();
    } else if (finalDelta > threshold) {
      prevItem();
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
      aria-label="Jelajahi Rohis"
      className="py-10 sm:py-14 relative overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. Primary 3-Card "Jelajahi Rohis" Strip (Matching 02_beranda_agenda.png) */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#153E32] tracking-tight">
            Jelajahi Rohis
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-5 mb-12 sm:mb-16">
          {QUICK_EXPLORE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.href}
                className="clay-card clay-card-hover p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-2.5 sm:gap-4 group text-center sm:text-left"
              >
                <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl clay-icon-sq flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#087A53]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-xs sm:text-base font-extrabold text-[#153E32] group-hover:text-[#087A53] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="hidden sm:block text-xs text-[#4A6B5F] mt-0.5 truncate">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
                <span className="hidden sm:flex w-8 h-8 rounded-full clay-pill-mint items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight size={16} className="text-[#087A53]" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* 2. 3D Coverflow Directory Showcase */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#153E32]">
            Direktori Layanan & Informasi
          </h3>
          <p className="text-xs sm:text-sm text-[#4A6B5F] mt-1">
            Geser atau pilih kartu untuk membuka halaman informasi Rohis SMAPA.
          </p>
        </div>

        <div
          className={`relative max-w-5xl mx-auto h-[250px] sm:h-[270px] flex items-center justify-center select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            perspective: prefersReducedMotion ? "none" : "1100px",
            perspectiveOrigin: "50% 50%",
            transformStyle: prefersReducedMotion ? "flat" : "preserve-3d",
            touchAction: "pan-y",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            if (isDragActiveRef.current) handleDragEnd();
          }}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              prevItem();
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              nextItem();
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
          {/* Left Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevItem();
            }}
            aria-label="Direktori Sebelumnya"
            style={{
              transform: prefersReducedMotion ? undefined : "translateZ(120px)",
            }}
            className="absolute left-0 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full clay-btn-white flex items-center justify-center text-[#153E32] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextItem();
            }}
            aria-label="Direktori Berikutnya"
            style={{
              transform: prefersReducedMotion ? undefined : "translateZ(120px)",
            }}
            className="absolute right-0 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full clay-btn-white flex items-center justify-center text-[#153E32] cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {DIRECTORY_ITEMS.map((item, idx) => {
            let dist = (idx - activeIndex + total) % total;
            if (dist > total / 2) dist -= total;

            const isCenter = dist === 0;
            const isLeft = dist === -1;
            const isRight = dist === 1;
            const isVisible = isCenter || isLeft || isRight;

            const currentDrag = isDragging ? dragOffset : 0;
            const dragAngle = prefersReducedMotion
              ? 0
              : Number(((currentDrag / 280) * 8).toFixed(2));

            let transform = "";
            let zIndex = 1;
            let opacity = 0;
            let pointerEvents: "auto" | "none" = "none";

            if (prefersReducedMotion) {
              transform = isCenter
                ? "translate3d(0, 0, 0) scale(1)"
                : isLeft
                ? "translate3d(-50%, 0, 0) scale(0.9)"
                : isRight
                ? "translate3d(50%, 0, 0) scale(0.9)"
                : "scale(0.85)";
              zIndex = isCenter ? 30 : isVisible ? 15 : 1;
              opacity = isCenter ? 1 : isVisible ? 0.55 : 0;
              pointerEvents = isVisible ? "auto" : "none";
            } else if (isCenter) {
              transform = `translate3d(${currentDrag}px, -4px, 54px) rotateY(${dragAngle}deg) scale(1)`;
              zIndex = 35;
              opacity = 1;
              pointerEvents = "auto";
            } else if (isLeft) {
              transform = `translate3d(calc(-54% + ${
                currentDrag * 0.55
              }px), 8px, -85px) rotateY(${23 + dragAngle}deg) scale(0.88)`;
              zIndex = 15;
              opacity = 0.96;
              pointerEvents = "auto";
            } else if (isRight) {
              transform = `translate3d(calc(54% + ${
                currentDrag * 0.55
              }px), 8px, -85px) rotateY(${-23 + dragAngle}deg) scale(0.88)`;
              zIndex = 15;
              opacity = 0.96;
              pointerEvents = "auto";
            } else if (dist < -1) {
              transform =
                "translate3d(-105%, 8px, -150px) rotateY(24deg) scale(0.78)";
              zIndex = 1;
              opacity = 0;
            } else {
              transform =
                "translate3d(105%, 8px, -150px) rotateY(-24deg) scale(0.78)";
              zIndex = 1;
              opacity = 0;
            }

            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                data-active={isCenter}
                onClick={() => {
                  if (hasMovedRef.current) return;
                  if (isLeft) prevItem();
                  if (isRight) nextItem();
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
                className={`clay-coverflow-card absolute w-[68vw] min-w-[220px] max-w-[305px] sm:w-[350px] sm:max-w-none lg:w-[390px] h-[225px] sm:h-[240px] clay-card p-5 sm:p-6 flex flex-col justify-between text-left ${
                  isCenter
                    ? "shadow-[0_18px_38px_-10px_rgba(15,62,46,0.16)] cursor-default"
                    : "cursor-pointer hover:opacity-90"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl clay-icon-sq flex items-center justify-center shrink-0">
                    <IconComponent size={19} className="text-[#087A53]" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider clay-pill-mint">
                    {item.tag}
                  </span>
                </div>

                <div className="my-1">
                  <h4 className="font-heading text-base sm:text-lg font-extrabold text-[#153E32] mb-1 leading-snug line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-[13px] text-[#3B5E52] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#DCEAE3] flex items-center justify-between">
                  <Link
                    href={item.link}
                    onClick={(e) => {
                      if (hasMovedRef.current) e.preventDefault();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#087A53] hover:text-[#153E32] transition-colors group/link"
                  >
                    <span>Buka Halaman</span>
                    <ArrowRight
                      size={14}
                      className="group-hover/link:translate-x-0.5 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {DIRECTORY_ITEMS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Pilih direktori ${idx + 1}`}
              className={`transition-all duration-200 rounded-full cursor-pointer h-2 ${
                idx === activeIndex
                  ? "w-7 bg-[#087A53]"
                  : "w-2 bg-[#C5DDD2] hover:bg-[#8FC2AC]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
