"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { getCoverflowState } from "@/lib/coverflow";
import Footer from "@/components/Footer";
import EventRegisterModal from "@/components/EventRegisterModal";
import {
  ScrollProgressBar,
  CinematicReveal,
} from "@/components/ScrollAnimations";
import { EVENTS_DATA } from "@/lib/constants";
import { EventItem } from "@/lib/types";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import { handleGoogleDriveImageError } from "@/lib/driveUtils";
import { pullCloudSync, ensureCleanStorageVersion } from "@/lib/cloudSync";
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface AgendaRecord {
  id: string | number;
  title: string;
  date: string;
  time: string;
  location: string;
  speaker?: string | null;
  type?: string;
  category?: string;
  status?: string;
  image?: string;
  description: string;
}

export default function AgendaPage() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [eventList, setEventList] = useState<AgendaRecord[]>(EVENTS_DATA);

  // 3D Coverflow state
  const [coverflowIndex, setCoverflowIndex] = useState<number>(1);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartXRef = useRef<number | null>(null);
  const dragDeltaRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const isDragActiveRef = useRef<boolean>(false);
  const hasMovedRef = useRef<boolean>(false);

  useEffect(() => {
    const rafId = rafRef.current;
    queueMicrotask(() => {
      try {
        ensureCleanStorageVersion();
        const saved = localStorage.getItem("rohis_admin_events");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setEventList(
              parsed.map((e: AgendaRecord) => ({
                ...e,
                image:
                  e.image &&
                  typeof e.image === "string" &&
                  e.image.startsWith("data:image/")
                    ? "https://iili.io/nP1Ssvp.jpg"
                    : e.image,
                type: e.category || e.type || "Kajian",
              }))
            );
          }
        }
      } catch {}
    });

    pullCloudSync().then((synced) => {
      if (
        Array.isArray(synced?.rohis_admin_events) &&
        synced.rohis_admin_events.length > 0
      ) {
        setEventList(
          synced.rohis_admin_events.map((e: AgendaRecord) => ({
            ...e,
            type: e.category || e.type || "Kajian",
          }))
        );
      }
    });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const categories = useMemo(() => {
    const base = ["Semua", "Kajian", "Pelatihan", "Sosial", "Organisasi"];
    eventList.forEach((e) => {
      const cat = e.type || e.category;
      if (cat && !base.some((b) => b.toLowerCase() === cat.toLowerCase())) {
        base.push(cat);
      }
    });
    return base;
  }, [eventList]);

  const filteredEvents = useMemo(() => {
    return eventList.filter((e: AgendaRecord) => {
      const matchCat =
        activeCategory === "Semua" ||
        (e.type && e.type.toLowerCase() === activeCategory.toLowerCase()) ||
        (e.category &&
          e.category.toLowerCase() === activeCategory.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q)) ||
        (e.speaker && e.speaker.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [eventList, activeCategory, searchQuery]);

  const formatDate = (raw?: string) => {
    if (!raw) return "";
    if (raw.includes("-") && raw.length === 10) {
      try {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }
      } catch {}
    }
    return raw;
  };

  const openEventDetail = (event: AgendaRecord) => {
    setSelectedEvent({
      id: `evt-${event.id}`,
      slug: `event-${event.id}`,
      title: event.title,
      category: event.type || event.category || "Kegiatan Rohis",
      date: event.date,
      time: event.time,
      location: event.location,
      speaker: event.speaker || undefined,
      quota: 150,
      registered: 75,
      status: "open",
      image: event.image || "/images/dokumentasi-smapa.jpg",
      description: event.description,
    });
  };

  const totalShowcase = eventList.length;
  const safeCoverflowIdx =
    totalShowcase > 0 ? coverflowIndex % totalShowcase : 0;

  const nextSlide = () => {
    if (totalShowcase <= 1) return;
    setCoverflowIndex((prev) => (prev + 1) % totalShowcase);
  };

  const prevSlide = () => {
    if (totalShowcase <= 1) return;
    setCoverflowIndex((prev) => (prev - 1 + totalShowcase) % totalShowcase);
  };

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
    <div className="min-h-screen flex flex-col clay-canvas text-[#153E32]">
      <ScrollProgressBar />
      <Navbar />

      {/* ── 1. HEADER BANNER (Matches 07_agenda_daftar.png) ── */}
      <section className="pt-24 pb-6 sm:pt-28 sm:pb-8 lg:pt-32 lg:pb-9">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CinematicReveal direction="up" delay={0.04}>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#153E32] tracking-tight mb-3">
              Agenda & Kegiatan Rohis SMAPA
            </h1>
            <p className="text-sm sm:text-base text-[#3B5E52] max-w-2xl mx-auto leading-relaxed">
              Jadwal kajian rutin, latihan kepemimpinan, dan kegiatan Rohis SMA
              Negeri 4 Purwokerto. Terbuka untuk seluruh siswa.
            </p>
          </CinematicReveal>
        </div>
      </section>

      {/* ── 2. UNIFIED CLAY FILTER & SEARCH BAR (Matches 07_agenda_daftar.png) ── */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full mb-8">
        <CinematicReveal direction="up" delay={0.08}>
          <div className="clay-card p-3 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div
              data-lenis-prevent="true"
              onWheel={(e) => {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 overscroll-contain"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all duration-200 whitespace-nowrap cursor-pointer min-h-[38px] ${
                      isActive
                        ? "clay-btn-emerald text-white"
                        : "clay-btn-mint text-[#153E32]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Clay Search Input */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A6B5F] pointer-events-none"
              />
              <input
                type="text"
                placeholder="Cari agenda, lokasi, pemateri."
                aria-label="Cari agenda, lokasi, atau pemateri"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 rounded-full clay-input text-xs sm:text-sm text-[#153E32] placeholder-[#6A8A7F] min-h-[40px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A6B5F] hover:text-[#153E32] cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </CinematicReveal>
      </section>

      {/* ── 3. 3D COVERFLOW AGENDA SHOWCASE (Matches top of 07_agenda_daftar.png) ── */}
      {eventList.length > 0 && (
        <section
          aria-label="Showcase Agenda Pilihan"
          className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full mb-10 sm:mb-12"
        >
          <CinematicReveal direction="up" delay={0.1} className="showcase-panel clay-card">
            <div
              className={`showcase-stage showcase-agenda relative mx-auto select-none ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                perspective: prefersReducedMotion ? "none" : "1200px",
                perspectiveOrigin: "50% 50%",
                touchAction: "pan-y pinch-zoom",
              }}
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
              onMouseLeave={() => {
                if (isDragActiveRef.current) handleDragEnd();
              }}
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
                {/* Left Arrow */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  aria-label="Agenda Sebelumnya"
                  style={{
                    transform: prefersReducedMotion
                      ? undefined
                      : "translateZ(100px)",
                  }}
                  className="showcase-arrow showcase-arrow-side hidden sm:flex absolute left-0 sm:left-2 lg:left-4 top-1/2 z-40 w-11 h-11 rounded-full clay-btn-white items-center justify-center text-[#153E32] cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right Arrow */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  aria-label="Agenda Berikutnya"
                  style={{
                    transform: prefersReducedMotion
                      ? undefined
                      : "translateZ(100px)",
                  }}
                  className="showcase-arrow showcase-arrow-side hidden sm:flex absolute right-0 sm:right-2 lg:right-4 top-1/2 z-40 w-11 h-11 rounded-full clay-btn-white items-center justify-center text-[#153E32] cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {eventList.map((event, idx) => {
                  const { isCenter, isLeft, isRight, isVisible, position, transform } = getCoverflowState(
                    idx, safeCoverflowIdx, totalShowcase,
                    isDragging ? dragOffset : 0, Boolean(prefersReducedMotion),
                  );
                  const zIndex = isCenter ? 35 : isVisible ? 15 : 1;
                  const opacity = isVisible ? 1 : 0;
                  const pointerEvents = isVisible ? "auto" : "none";

                  return (
                    <article
                      key={event.id}
                      data-active={isCenter}
                      data-position={position}
                      aria-hidden={!isCenter}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${idx + 1} dari ${totalShowcase}: ${event.title}`}
                      onClick={() => {
                        if (hasMovedRef.current) return;
                        if (isLeft) prevSlide();
                        else if (isRight) nextSlide();
                        else if (isCenter) openEventDetail(event);
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
                      <div>
                        <div className="showcase-photo relative w-full overflow-hidden bg-[#E5F2EC]">
                          <img
                            draggable={false}
                            decoding="async"
                            src={parseImageCrop(event.image).src}
                            alt={event.title}
                            referrerPolicy="no-referrer"
                            onError={(e) =>
                              handleGoogleDriveImageError(e, event.image)
                            }
                            style={getImageCropStyle(event.image)}
                            className="w-full h-full object-cover select-none"
                          />
                        </div>

                        <div className="px-1.5">
                          <h3 className="font-heading text-base sm:text-lg font-extrabold text-[#153E32] mb-2 leading-snug line-clamp-2">
                            {event.title}
                          </h3>

                          <div className="space-y-1 text-xs text-[#3B5E52]">
                            <div className="flex items-center gap-2">
                              <Calendar
                                size={13}
                                className="text-[#087A53] shrink-0"
                              />
                              <span className="font-semibold">
                                {formatDate(event.date)}
                              </span>
                              {event.time && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">{event.time}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin
                                size={13}
                                className="text-[#087A53] shrink-0"
                              />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-1.5 pt-3 mt-2 flex items-center justify-between">
                        {isCenter ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (hasMovedRef.current) return;
                              openEventDetail(event);
                            }}
                            className="showcase-cta w-full justify-center clay-btn-emerald px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Lihat rincian</span>
                            <ArrowRight size={14} />
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-[#087A53] inline-flex items-center gap-1">
                            <span>Pilih agenda</span>
                            <ArrowRight size={12} />
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="showcase-controls flex items-center justify-center">
                <button type="button" onClick={prevSlide} disabled={totalShowcase <= 1} aria-label="Agenda sebelumnya"
                  className="showcase-arrow sm:hidden clay-btn-white flex items-center justify-center text-[#153E32]">
                  <ChevronLeft size={20} />
                </button>
                <div className="showcase-pagination">
                  {eventList.map((_, i) => (
                    <button key={i} type="button" onClick={() => setCoverflowIndex(i)}
                      aria-label={`Pilih agenda ${i + 1}`} aria-pressed={i === safeCoverflowIdx}
                      className="showcase-dot cursor-pointer" />
                  ))}
                </div>
                <button type="button" onClick={nextSlide} disabled={totalShowcase <= 1} aria-label="Agenda berikutnya"
                  className="showcase-arrow sm:hidden clay-btn-white flex items-center justify-center text-[#153E32]">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </CinematicReveal>
        </section>
      )}

      {/* ── 4. 2-COLUMN HORIZONTAL CLAY EVENT CARDS GRID (Matches 07_agenda_daftar.png) ── */}
      <section
        aria-label="Daftar Seluruh Agenda"
        className="pb-12 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1"
      >
        <AnimatePresence mode="wait">
          {filteredEvents.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${searchQuery}`}
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -4 }
              }
              transition={{
                duration: prefersReducedMotion ? 0.05 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6"
            >
              {filteredEvents.map((event: AgendaRecord) => (
                <article
                  key={event.id}
                  onClick={() => openEventDetail(event)}
                  className="clay-card clay-card-hover p-3.5 sm:p-4 flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch cursor-pointer group"
                >
                  {/* Left Rounded Image */}
                  <div className="relative w-full sm:w-48 md:w-52 h-44 sm:h-auto min-h-[165px] rounded-[16px] overflow-hidden bg-[#E5F2EC] shrink-0">
                    {event.image && (
                      <img
                        src={parseImageCrop(event.image).src}
                        alt={event.title}
                        referrerPolicy="no-referrer"
                        onError={(e) =>
                          handleGoogleDriveImageError(e, event.image)
                        }
                        style={getImageCropStyle(event.image)}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                    )}
                  </div>

                  {/* Right Details */}
                  <div className="flex flex-col justify-between flex-1 py-0.5 text-left">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold clay-pill-mint">
                          {event.type || event.category || "Kegiatan"}
                        </span>
                      </div>

                      <h2 className="font-heading text-base sm:text-lg font-extrabold text-[#153E32] group-hover:text-[#087A53] transition-colors leading-snug mb-2">
                        {event.title}
                      </h2>

                      <div className="space-y-1 text-xs text-[#3B5E52] mb-2.5">
                        <div className="flex items-center gap-2">
                          <Calendar
                            size={13}
                            className="text-[#087A53] shrink-0"
                          />
                          <span className="font-semibold">
                            {formatDate(event.date)}
                          </span>
                          {event.time && (
                            <>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock
                                  size={12}
                                  className="text-[#087A53] shrink-0"
                                />
                                {event.time}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin
                            size={13}
                            className="text-[#087A53] shrink-0"
                          />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#4A6B5F] line-clamp-2 leading-relaxed mb-3.5">
                        {event.description}
                      </p>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEventDetail(event);
                        }}
                        className="clay-btn-emerald px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer min-h-[38px]"
                      >
                        <span>Lihat rincian</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty-agenda"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="clay-card p-10 text-center max-w-lg mx-auto"
            >
              <Calendar size={36} className="mx-auto text-[#087A53] mb-3" />
              <h3 className="font-heading text-base font-extrabold text-[#153E32] mb-1">
                Agenda tidak ditemukan
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6B5F] mb-4">
                Belum ada kegiatan yang sesuai dengan filter atau pencarian
                Anda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("Semua");
                  setSearchQuery("");
                }}
                className="clay-btn-emerald px-5 py-2 rounded-full text-xs font-bold cursor-pointer"
              >
                Tampilkan Semua Agenda
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <EventRegisterModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <Footer />
    </div>
  );
}
