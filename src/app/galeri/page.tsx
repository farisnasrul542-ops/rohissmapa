"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GALLERY_DATA } from "@/lib/constants";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import {
  handleGoogleDriveImageError,
  formatGoogleDriveUrl,
} from "@/lib/driveUtils";
import { pullCloudSync, ensureCleanStorageVersion } from "@/lib/cloudSync";
import {
  ScrollProgressBar,
  CinematicReveal,
} from "@/components/ScrollAnimations";
import { Calendar, ArrowRight, X, Camera } from "lucide-react";

interface GalleryRecord {
  id: string | number;
  title: string;
  category?: string;
  date: string;
  description?: string;
  caption?: string;
  image?: string;
  coverImage?: string;
  imageUrl?: string;
}

const SUPPLEMENTAL_GALLERY_ITEMS: GalleryRecord[] = [
  {
    id: "gal-extra-1",
    title: "ROHIS AKHDIR 38 SMA Negeri 4 Purwokerto",
    category: "Kaderisasi",
    date: "18 Oktober 2026",
    description:
      "Kebersamaan kader Rohis generasi ke-38 SMA Negeri 4 Purwokerto dalam mempererat ukhuwah dan syiar sekolah.",
    image: "/images/rohis-akhdir-38.jpg",
  },
  {
    id: "gal-extra-2",
    title: "Sinergi Pengurus & Pembina Rohis SMAPA",
    category: "Ukhuwah",
    date: "20 Oktober 2026",
    description:
      "Dokumentasi keluarga besar pengurus Rohis SMAN 4 Purwokerto bersama guru pembina di lingkungan sekolah.",
    image: "/images/dokumentasi-smapa.jpg",
  },
  {
    id: "gal-extra-3",
    title: "Kegiatan Syiar & Pembinaan Musholla Al-Ikhlas",
    category: "Syiar Sekolah",
    date: "08 November 2026",
    description:
      "Pelaksanaan musyawarah dan pembinaan rutin kader pelajar di Musholla Al-Ikhlas SMAN 4 Purwokerto.",
    image: "/images/event-3.jpg",
  },
];

export default function GaleriPage() {
  const prefersReducedMotion = useReducedMotion();
  const [galleryList, setGalleryList] = useState<GalleryRecord[]>([
    ...GALLERY_DATA,
  ]);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryRecord | null>(
    null
  );
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        ensureCleanStorageVersion();
        const saved = localStorage.getItem("rohis_admin_gallery");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGalleryList(parsed);
          }
        }
      } catch {}
    });

    pullCloudSync().then((synced) => {
      if (
        Array.isArray(synced?.rohis_admin_gallery) &&
        synced.rohis_admin_gallery.length > 0
      ) {
        setGalleryList(synced.rohis_admin_gallery);
      }
    });
  }, []);

  // Combine actual CMS/GALLERY_DATA items with supplemental real public/images photos so 6 cards are shown when default
  const displayGallery = useMemo(() => {
    if (galleryList.length >= 6) return galleryList;
    const existingTitles = new Set(
      galleryList.map((item) => (item.title || "").toLowerCase())
    );
    const extras = SUPPLEMENTAL_GALLERY_ITEMS.filter(
      (item) => !existingTitles.has(item.title.toLowerCase())
    );
    return [...galleryList, ...extras];
  }, [galleryList]);

  const categories = useMemo(() => {
    const list = ["Semua"];
    displayGallery.forEach((item) => {
      if (item.category && !list.includes(item.category)) {
        list.push(item.category);
      }
    });
    return list;
  }, [displayGallery]);

  const filteredGallery = useMemo(() => {
    if (activeCategory === "Semua") return displayGallery;
    return displayGallery.filter((item) => item.category === activeCategory);
  }, [displayGallery, activeCategory]);

  // Featured horizontal highlight cards (Matches 10_galeri_penutup.png)
  const featuredHighlights = useMemo(() => {
    const menolong =
      displayGallery.find((i) =>
        (i.title || "").toLowerCase().includes("menolong")
      ) || displayGallery[1] || displayGallery[0];
    const ukhuwah =
      displayGallery.find((i) =>
        (i.title || "").toLowerCase().includes("sinergi")
      ) ||
      displayGallery.find((i) =>
        (i.title || "").toLowerCase().includes("muskerta")
      ) ||
      displayGallery[0];
    return [menolong, ukhuwah].filter(Boolean);
  }, [displayGallery]);

  useEffect(() => {
    if (!selectedPhoto) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 30);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSelectedPhoto(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [selectedPhoto]);

  const getRawImg = (item: GalleryRecord | null) =>
    formatGoogleDriveUrl(
      item?.imageUrl ||
        item?.coverImage ||
        item?.image ||
        "/images/dokumentasi-muskerta.jpg"
    );

  return (
    <div className="min-h-screen flex flex-col clay-canvas text-[#153E32]">
      <ScrollProgressBar />
      <Navbar />

      {/* ── 1. HEADER BANNER (Matches 09_galeri_dokumentasi.png) ── */}
      <section className="pt-24 pb-6 sm:pt-28 sm:pb-8 lg:pt-32 lg:pb-9">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CinematicReveal direction="up" delay={0.04}>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#153E32] tracking-tight mb-3">
              Galeri Dokumentasi Rohis SMAPA
            </h1>
            <p className="text-sm sm:text-base text-[#3B5E52] max-w-2xl mx-auto leading-relaxed">
              Dokumentasi kegiatan ibadah, kajian, LDKR, dan kebersamaan
              keluarga besar Rohis SMA Negeri 4 Purwokerto.
            </p>

            {/* Category Filter Pills */}
            {categories.length > 1 && (
              <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full clay-card max-w-full">
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
                          : "text-[#153E32] hover:bg-[#E5F8EF]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </CinematicReveal>
        </div>
      </section>

      {/* ── 2. 3-COLUMN CLAY PHOTO CARDS GRID (Matches 09_galeri_dokumentasi.png) ── */}
      <section
        aria-label="Koleksi Dokumentasi Kegiatan"
        className="py-4 sm:py-6 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {filteredGallery.map((item: GalleryRecord, idx: number) => {
              const rawImg = getRawImg(item);
              return (
                <article
                  key={item.id || idx}
                  onClick={() => setSelectedPhoto(item)}
                  className="clay-card clay-card-hover p-3.5 sm:p-4 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="relative h-48 sm:h-52 w-full rounded-[16px] overflow-hidden bg-[#E5F2EC] mb-3.5">
                      <img
                        src={parseImageCrop(rawImg).src}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleGoogleDriveImageError(e, rawImg)}
                        style={getImageCropStyle(rawImg)}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                    </div>

                    <div className="px-1">
                      <h2 className="font-heading text-base sm:text-lg font-extrabold text-[#153E32] group-hover:text-[#087A53] transition-colors leading-snug mb-1.5 line-clamp-2">
                        {item.title}
                      </h2>

                      <div className="flex items-center gap-2 text-xs font-semibold text-[#4A6B5F] mb-2">
                        <Calendar
                          size={13}
                          className="text-[#087A53] shrink-0"
                        />
                        <span>{item.date}</span>
                        {item.category && (
                          <>
                            <span>•</span>
                            <span className="text-[#087A53] font-bold">
                              {item.category}
                            </span>
                          </>
                        )}
                      </div>

                      <p className="text-xs sm:text-[13px] text-[#3B5E52] leading-relaxed line-clamp-2 mb-4">
                        {item.description || item.caption}
                      </p>
                    </div>
                  </div>

                  <div className="px-1 pt-2 border-t border-[#DCEAE3] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto(item);
                      }}
                      className="clay-btn-emerald px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer min-h-[38px]"
                    >
                      <span>Lihat foto</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── 3. WIDE HORIZONTAL FEATURED DOCUMENTATION CARDS (Matches 10_galeri_penutup.png) ── */}
      {featuredHighlights.length > 0 && (
        <section
          aria-label="Sorotan Dokumentasi Utama"
          className="py-8 sm:py-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6"
        >
          {featuredHighlights.map((highlight: GalleryRecord, idx: number) => {
            const rawImg = getRawImg(highlight);
            return (
              <CinematicReveal
                key={`highlight-${highlight.id || idx}`}
                direction="up"
                delay={0.08}
              >
                <article
                  onClick={() => setSelectedPhoto(highlight)}
                  className="clay-card clay-card-hover p-4 sm:p-6 lg:p-7 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-center cursor-pointer group"
                >
                  {/* Left Large Rounded Image */}
                  <div className="lg:col-span-6">
                    <div className="relative aspect-[16/10] w-full rounded-[18px] overflow-hidden bg-[#E5F2EC]">
                      <img
                        src={parseImageCrop(rawImg).src}
                        alt={highlight.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleGoogleDriveImageError(e, rawImg)}
                        style={getImageCropStyle(rawImg)}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                      />
                    </div>
                  </div>

                  {/* Right Details */}
                  <div className="lg:col-span-6 flex flex-col justify-center text-left px-1">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#4A6B5F] mb-2">
                      <Calendar size={15} className="text-[#087A53] shrink-0" />
                      <span>{highlight.date}</span>
                      {highlight.category && (
                        <>
                          <span>•</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold clay-pill-mint">
                            {highlight.category}
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#153E32] group-hover:text-[#087A53] transition-colors leading-snug mb-3">
                      {highlight.title}
                    </h2>

                    <p className="text-xs sm:text-[15px] text-[#3B5E52] leading-relaxed mb-5">
                      {highlight.description || highlight.caption}
                    </p>

                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhoto(highlight);
                        }}
                        className="clay-btn-emerald px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer min-h-[42px]"
                      >
                        <span>Lihat foto</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              </CinematicReveal>
            );
          })}
        </section>
      )}

      {/* ── 4. CLAY PHOTO DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overscroll-contain"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.05 : 0.2 }}
              className="fixed inset-0 bg-[#0D2B22]/40 backdrop-blur-[4px]"
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="galeri-modal-title"
              data-lenis-prevent="true"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.98 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 10, scale: 0.98 }
              }
              transition={{
                duration: prefersReducedMotion ? 0.08 : 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-[640px] clay-card p-3 sm:p-4 max-h-[92vh] flex flex-col overflow-hidden overscroll-contain shadow-[0_24px_60px_-15px_rgba(15,62,46,0.28)]"
            >
              <div className="relative aspect-[16/10] w-full rounded-[18px] overflow-hidden bg-[#E5F2EC] shrink-0">
                {(() => {
                  const rawImg = getRawImg(selectedPhoto);
                  return (
                    <img
                      src={parseImageCrop(rawImg).src}
                      alt={selectedPhoto.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleGoogleDriveImageError(e, rawImg)}
                      style={getImageCropStyle(rawImg)}
                      className="w-full h-full object-cover"
                    />
                  );
                })()}

                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  aria-label="Tutup foto dokumentasi"
                  className="absolute top-3 right-3 w-10 h-10 rounded-full clay-btn-white flex items-center justify-center text-[#153E32] z-10 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-2 sm:px-3 pt-4 pb-2 space-y-3 overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#4A6B5F]">
                  <span className="px-3 py-1 rounded-full clay-pill-mint font-bold text-[#087A53]">
                    {selectedPhoto.category || "Dokumentasi"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#087A53]" />
                    <span>{selectedPhoto.date}</span>
                  </span>
                </div>

                <h3
                  id="galeri-modal-title"
                  className="font-heading text-xl sm:text-2xl font-extrabold text-[#153E32] leading-snug"
                >
                  {selectedPhoto.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#3B5E52] leading-relaxed">
                  {selectedPhoto.description || selectedPhoto.caption}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#DCEAE3]">
                  <div className="clay-inner-mint px-3.5 py-2 rounded-full inline-flex items-center gap-2 text-xs font-semibold text-[#153E32]">
                    <Camera size={15} className="text-[#087A53] shrink-0" />
                    <span>Arsip Dokumentasi Resmi Rohis SMAPA</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    className="clay-btn-emerald px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold cursor-pointer shrink-0 text-center"
                  >
                    Tutup foto
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
