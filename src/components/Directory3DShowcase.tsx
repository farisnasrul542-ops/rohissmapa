"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Layers,
  Calendar,
  Camera,
  MessageSquareHeart,
  Send,
  Building,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export interface DirectoryItem {
  id: string;
  tag: string;
  tagColor: {
    bg: string;
    text: string;
    border: string;
  };
  iconBg: string;
  iconColor: string;
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}

const DIRECTORY_ITEMS: DirectoryItem[] = [
  {
    id: "profil",
    tag: "PROFIL & VISI",
    tagColor: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    iconBg: "bg-emerald-100/80",
    iconColor: "text-emerald-700",
    icon: BookOpen,
    title: "Profil & Sejarah Rohis",
    description:
      "Mengenal visi, misi, rekam jejak perjalanan, dan pembiasaan nilai-nilai Islam rahmatan lil 'alamin di SMA Negeri 4 Purwokerto.",
    link: "/tentang",
  },
  {
    id: "kepengurusan",
    tag: "STRUKTUR ORGANISASI",
    tagColor: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    iconBg: "bg-purple-100/80",
    iconColor: "text-purple-700",
    icon: Users,
    title: "Kepengurusan BPH",
    description:
      "Susunan badan pengurus harian (BPH), dewan pembina guru agama, serta regenerasi kader penerus roda dakwah sekolah.",
    link: "/tentang#kepengurusan",
  },
  {
    id: "divisi",
    tag: "DIVISI & PROKER",
    tagColor: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    iconBg: "bg-blue-100/80",
    iconColor: "text-blue-700",
    icon: Layers,
    title: "6 Divisi & Program Kerja",
    description:
      "Eksplorasi ragam program kerja divisi BPH, Pendidikan, Kaderisasi, Humas, Perpusmed, dan Sarpras Rohis SMAPA.",
    link: "/program",
  },
  {
    id: "agenda",
    tag: "JADWAL & EVENT",
    tagColor: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    iconBg: "bg-amber-100/80",
    iconColor: "text-amber-700",
    icon: Calendar,
    title: "Agenda Mendatang",
    description:
      "Ikuti beragam kajian akbar, latihan dasar kepemimpinan (LDKR), keputrian Jumat, dan temu ukhuwah sahabat taat.",
    link: "/agenda",
  },
  {
    id: "galeri",
    tag: "DOKUMENTASI VISUAL",
    tagColor: {
      bg: "bg-teal-50",
      text: "text-teal-700",
      border: "border-teal-200",
    },
    iconBg: "bg-teal-100/80",
    iconColor: "text-teal-700",
    icon: Camera,
    title: "Galeri Syiar & Ukhuwah",
    description:
      "Arsip dokumentasi visual potret kebersamaan ibadah di Musholla Al-Ikhlas, bakti sosial, dan momen ukhuwah santri pelajar.",
    link: "/galeri",
  },
  {
    id: "aspirasi",
    tag: "SUARA SISWA",
    tagColor: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    },
    iconBg: "bg-rose-100/80",
    iconColor: "text-rose-700",
    icon: MessageSquareHeart,
    title: "Kotak Aspirasi Siswa",
    description:
      "Sampaikan saran, masukan perbaikan musholla, usulan program dakwah, atau pertanyaan keagamaan secara terbuka maupun rahasia.",
    link: "/aspirasi",
  },
  {
    id: "kontak",
    tag: "SEKRETARIAT & MEDSOS",
    tagColor: {
      bg: "bg-emerald-950",
      text: "text-amber-300",
      border: "border-emerald-700/60",
    },
    iconBg: "bg-gradient-to-br from-emerald-900 to-emerald-950 shadow-sm",
    iconColor: "text-amber-300",
    icon: Building,
    title: "Kontak & Musholla Al-Ikhlas",
    description:
      "Informasi pusat kegiatan Musholla Al-Ikhlas SMAN 4 Purwokerto, kanal media sosial resmi, dan layanan informasi dakwah sekolah.",
    link: "/kontak",
  },
];

export default function Directory3DShowcase() {
  const [activeIndex, setActiveIndex] = useState(3); // Start centered on Agenda
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

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

  const goToItem = (idx: number) => {
    setActiveIndex(idx);
  };

  // Auto-Slide Timer: 4.5 Seconds with pause on hover or drag
  useEffect(() => {
    if (isPaused || isDragging) return;

    const timer = setInterval(() => {
      nextItem();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, isDragging, nextItem]);

  // Real-time Drag Handlers (rAF-throttled for 60/120fps mobile)
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

  // Subtle Mouse Tilt for Active Center Card
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setCardTilt({
      x: Number((x * 12).toFixed(2)),
      y: Number((-y * 10).toFixed(2)),
    });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  return (
    <section className="py-20 lg:py-24 bg-[#fafaf7] relative overflow-hidden border-t border-emerald-900/5">
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/8 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 text-xs font-semibold mb-3 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>JELAJAHI FITUR</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 tracking-tight mb-3">
          Layanan & Direktori Dakwah
        </h2>

        {/* Lead Subtitle */}
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed mb-6">
          Berbagai fasilitas terpadu untuk mendukung syiar dan komunikasi antar
          warga sekolah.
        </p>

        {/* Hint Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50/80 border border-amber-200/80 text-amber-800 text-xs font-medium mb-12 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Geser atau klik kartu samping / panah untuk melihat menu lain ›</span>
        </div>

        {/* 3D CAROUSEL STAGE */}
        <div
          className={`relative -mx-4 sm:mx-auto w-[100vw] sm:w-full max-w-5xl h-[350px] sm:h-[400px] flex items-center justify-center select-none overflow-visible ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            perspective: "1100px",
            perspectiveOrigin: "50% 50%",
            transformStyle: "preserve-3d",
            touchAction: "pan-y",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            handleCardMouseLeave();
            if (isDragActiveRef.current) {
              handleDragEnd();
            }
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
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
          onTouchCancel={handleDragEnd}
        >
          {/* Left Floating Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevItem();
            }}
            aria-label="Menu Sebelumnya"
            style={{ transform: "translateZ(150px)" }}
            className="absolute left-2.5 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-emerald-50 active:scale-95 text-gray-700 hover:text-emerald-900 border border-gray-200/80 shadow-lg flex items-center justify-center transition-transform duration-200 cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Right Floating Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextItem();
            }}
            aria-label="Menu Berikutnya"
            style={{ transform: "translateZ(150px)" }}
            className="absolute right-2.5 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-emerald-50 active:scale-95 text-gray-700 hover:text-emerald-900 border border-gray-200/80 shadow-lg flex items-center justify-center transition-transform duration-200 cursor-pointer group"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Cards Loop with 3D Positioning & Real-time Drag */}
          {DIRECTORY_ITEMS.map((item, idx) => {
            let dist = (idx - activeIndex + total) % total;
            if (dist > total / 2) dist -= total;

            const isCenter = dist === 0;
            const isLeft = dist === -1;
            const isRight = dist === 1;
            const isVisible = isCenter || isLeft || isRight;

            const currentDrag = isDragging ? dragOffset : 0;
            const dragAngle = Number(((currentDrag / 280) * 10).toFixed(2));

            let transform = "";
            let zIndex = 1;
            let opacity = 0;
            let pointerEvents: "auto" | "none" = "none";

            if (isCenter) {
              transform = `translate3d(${currentDrag}px, 0, 45px) rotateY(${
                cardTilt.x + dragAngle
              }deg) rotateX(${cardTilt.y}deg) scale(1)`;
              zIndex = 35;
              opacity = 1;
              pointerEvents = "auto";
            } else if (isLeft) {
              transform = `translate3d(calc(-62% + ${
                currentDrag * 0.65
              }px), 0, -75px) rotateY(${26 + dragAngle}deg) scale(0.86)`;
              zIndex = 15;
              opacity = 0.65;
              pointerEvents = "auto";
            } else if (isRight) {
              transform = `translate3d(calc(62% + ${
                currentDrag * 0.65
              }px), 0, -75px) rotateY(${-26 + dragAngle}deg) scale(0.86)`;
              zIndex = 15;
              opacity = 0.65;
              pointerEvents = "auto";
            } else if (dist < -1) {
              transform =
                "translate3d(-115%, 0, -180px) rotateY(38deg) scale(0.72)";
              zIndex = 1;
              opacity = 0;
            } else {
              transform =
                "translate3d(115%, 0, -180px) rotateY(-38deg) scale(0.72)";
              zIndex = 1;
              opacity = 0;
            }

            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (hasMovedRef.current) return;
                  if (isLeft) prevItem();
                  if (isRight) nextItem();
                }}
                onMouseMove={isCenter && !isDragging ? handleCardMouseMove : undefined}
                onMouseLeave={isCenter ? handleCardMouseLeave : undefined}
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
                    : "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                className={`absolute w-[68vw] min-w-[210px] max-w-[300px] sm:w-[370px] sm:max-w-none lg:w-[410px] h-[290px] sm:h-[330px] rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 bg-white border border-gray-200/80 will-change-transform flex flex-col justify-between text-left ${
                  isCenter
                    ? "shadow-xl ring-2 ring-emerald-500/35 cursor-default"
                    : "shadow-md cursor-pointer hover:opacity-85"
                }`}
              >
                {/* Top Row: Icon on Left & Category Tag on Right */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shadow-xs shrink-0`}
                  >
                    <IconComponent size={20} />
                  </div>

                  <span
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider truncate ${item.tagColor.bg} ${item.tagColor.text} border ${item.tagColor.border}`}
                  >
                    {item.tag}
                  </span>
                </div>

                {/* Middle: Title & Description */}
                <div className="my-1.5 sm:my-2">
                  <h3 className="text-[15px] sm:text-xl font-black text-emerald-950 mb-1.5 sm:mb-2 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-[13px] text-gray-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom: Action Link */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={item.link}
                    onClick={(e) => {
                      if (hasMovedRef.current) e.preventDefault();
                    }}
                    className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-black transition-colors group/link ${
                      isCenter
                        ? "text-emerald-700 hover:text-emerald-950"
                        : "text-gray-500 hover:text-emerald-800"
                    }`}
                  >
                    <span>Buka Halaman</span>
                    <ArrowRight
                      size={14}
                      className="group-hover/link:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM PAGINATION CONTROLS: Mini Arrows & Indicators */}
        <div className="mt-8 flex items-center justify-center gap-3">
          {/* Mini Left Arrow */}
          <button
            type="button"
            onClick={prevItem}
            aria-label="Sebelumnya"
            className="w-8 h-8 rounded-full bg-white hover:bg-emerald-50 active:scale-95 text-gray-600 hover:text-emerald-900 border border-gray-200 shadow-xs flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>

          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5 px-2">
            {DIRECTORY_ITEMS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToItem(idx)}
                aria-label={`Ke menu ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === activeIndex
                    ? "w-7 h-2 bg-emerald-600 shadow-xs"
                    : "w-2 h-2 bg-gray-300 hover:bg-emerald-400"
                }`}
              />
            ))}
          </div>

          {/* Mini Right Arrow */}
          <button
            type="button"
            onClick={nextItem}
            aria-label="Berikutnya"
            className="w-8 h-8 rounded-full bg-white hover:bg-emerald-50 active:scale-95 text-gray-600 hover:text-emerald-900 border border-gray-200 shadow-xs flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
