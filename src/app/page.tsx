"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventRegisterModal from "@/components/EventRegisterModal";
import Gallery3DShowcase, {
  GalleryShowcaseItem,
} from "@/components/Gallery3DShowcase";
import Directory3DShowcase from "@/components/Directory3DShowcase";
import {
  ScrollProgressBar,
  CinematicReveal,
  CinematicStagger,
  CinematicStaggerItem,
  CinematicTextLine,
} from "@/components/ScrollAnimations";
import {
  ABOUT_CONTENT,
  PEMBINA_WELCOME,
  EVENTS_DATA,
  GALLERY_DATA,
} from "@/lib/constants";
import {
  DEFAULT_HOME_CMS,
  HomeCmsData,
  normalizeHomeCms,
} from "@/lib/homeCmsData";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import { handleGoogleDriveImageError } from "@/lib/driveUtils";
import { pullCloudSync, ensureCleanStorageVersion } from "@/lib/cloudSync";
import { EventItem } from "@/lib/types";
import {
  ArrowRight,
  Calendar,
  Camera,
  MapPin,
  BookOpen,
  Users,
  Layers,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Pause,
  Play,
} from "lucide-react";

interface HomeEventRecord {
  id: string | number;
  title: string;
  date: string;
  time: string;
  location: string;
  speaker?: string | null;
  type?: string;
  category?: string;
  status?: string;
  image: string;
  description: string;
}

const SHORTCUT_ITEMS = [
  {
    id: "sc-profil",
    label: "Profil Rohis",
    href: "/tentang",
    icon: Users,
  },
  {
    id: "sc-pembina",
    label: "Pembina",
    href: "#sambutan-pembina",
    icon: BookOpen,
  },
  {
    id: "sc-divisi",
    label: "Divisi & Proker",
    href: "/program",
    icon: Layers,
  },
  {
    id: "sc-galeri",
    label: "Galeri",
    href: "/galeri",
    icon: Camera,
  },
];

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activePembinaIndex, setActivePembinaIndex] = useState(0);
  const [agendaIndex, setAgendaIndex] = useState(1);
  const [isAgendaPaused, setIsAgendaPaused] = useState(false);
  const [isAgendaHovered, setIsAgendaHovered] = useState(false);
  const [isAgendaFocused, setIsAgendaFocused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [agendaDragOffset, setAgendaDragOffset] = useState(0);
  const [isAgendaDragging, setIsAgendaDragging] = useState(false);
  const agendaDragStartXRef = useRef<number | null>(null);
  const agendaDragDeltaRef = useRef(0);
  const agendaRafRef = useRef<number | null>(null);
  const isAgendaDragActiveRef = useRef(false);
  const agendaHasMovedRef = useRef(false);

  const [cms, setCms] = useState<HomeCmsData>(DEFAULT_HOME_CMS);
  const [eventsList, setEventsList] = useState<HomeEventRecord[]>([
    ...EVENTS_DATA,
  ]);
  const [galleryList, setGalleryList] = useState<GalleryShowcaseItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname.toLowerCase().includes("workers.dev")
    ) {
      window.location.replace("/admin");
      return;
    }

    const rafId = agendaRafRef.current;

    const loadCms = () => {
      try {
        const saved = localStorage.getItem("rohis_home_cms");
        if (saved) {
          setCms(normalizeHomeCms(JSON.parse(saved)));
        }
      } catch {}
    };

    const loadEvents = () => {
      try {
        const savedEvents = localStorage.getItem("rohis_admin_events");
        if (savedEvents) {
          const parsed = JSON.parse(savedEvents);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cleaned = parsed.map((e: HomeEventRecord) => {
              if (
                e.image &&
                typeof e.image === "string" &&
                e.image.startsWith("data:image/")
              ) {
                return { ...e, image: "https://iili.io/nP1Ssvp.jpg" };
              }
              return e;
            });
            setEventsList(cleaned);
          }
        }
      } catch {}
    };

    const loadGallery = () => {
      try {
        const savedGallery = localStorage.getItem("rohis_admin_gallery");
        if (savedGallery) {
          const parsed = JSON.parse(savedGallery);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGalleryList(parsed);
          }
        }
      } catch {}
    };

    queueMicrotask(() => {
      setMounted(true);
      ensureCleanStorageVersion();
      loadCms();
      loadEvents();
      loadGallery();
    });

    pullCloudSync().then((synced) => {
      if (!synced) return;
      if (synced.rohis_home_cms) {
        setCms(normalizeHomeCms(synced.rohis_home_cms));
      }
      if (
        Array.isArray(synced.rohis_admin_events) &&
        synced.rohis_admin_events.length > 0
      ) {
        setEventsList(synced.rohis_admin_events as HomeEventRecord[]);
      }
      if (
        Array.isArray(synced.rohis_admin_gallery) &&
        synced.rohis_admin_gallery.length > 0
      ) {
        setGalleryList(synced.rohis_admin_gallery as GalleryShowcaseItem[]);
      }
    });

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "rohis_home_cms" && e.newValue) {
        try {
          setCms(normalizeHomeCms(JSON.parse(e.newValue)));
        } catch {}
      }
      if (e.key === "rohis_admin_events" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setEventsList(parsed);
          }
        } catch {}
      }
      if (e.key === "rohis_admin_gallery" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGalleryList(parsed);
          }
        } catch {}
      }
    };

    const handleCmsUpdated = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt.detail) {
        setCms(normalizeHomeCms(customEvt.detail));
      } else {
        loadCms();
      }
    };

    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("rohis_cms_updated", handleCmsUpdated);
    document.addEventListener("visibilitychange", handleVisibility);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bc = new BroadcastChannel("rohis_cms_channel");
      bc.onmessage = (event) => {
        if (event.data) {
          setCms(normalizeHomeCms(event.data));
        }
      };
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("rohis_cms_updated", handleCmsUpdated);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (bc) bc.close();
    };
  }, []);

  const nextAgenda = () => {
    setAgendaIndex((prev) => (prev >= eventsList.length - 1 ? 0 : prev + 1));
  };

  const prevAgenda = () => {
    setAgendaIndex((prev) => (prev <= 0 ? eventsList.length - 1 : prev - 1));
  };

  const handleAgendaDragStart = (clientX: number) => {
    agendaDragStartXRef.current = clientX;
    agendaDragDeltaRef.current = 0;
    isAgendaDragActiveRef.current = true;
    setIsAgendaDragging(true);
    agendaHasMovedRef.current = false;
  };

  const handleAgendaDragMove = (clientX: number) => {
    if (!isAgendaDragActiveRef.current || agendaDragStartXRef.current === null)
      return;
    const rawDelta = clientX - agendaDragStartXRef.current;
    const delta = Math.max(-180, Math.min(180, rawDelta));
    agendaDragDeltaRef.current = delta;
    if (Math.abs(rawDelta) > 6) {
      agendaHasMovedRef.current = true;
    }
    if (agendaRafRef.current === null) {
      agendaRafRef.current = requestAnimationFrame(() => {
        setAgendaDragOffset(agendaDragDeltaRef.current);
        agendaRafRef.current = null;
      });
    }
  };

  const handleAgendaDragEnd = () => {
    if (!isAgendaDragActiveRef.current) return;
    isAgendaDragActiveRef.current = false;
    if (agendaRafRef.current !== null) {
      cancelAnimationFrame(agendaRafRef.current);
      agendaRafRef.current = null;
    }
    setIsAgendaDragging(false);

    const finalDelta = agendaDragDeltaRef.current;
    const threshold = 44;
    if (finalDelta < -threshold) {
      nextAgenda();
    } else if (finalDelta > threshold) {
      prevAgenda();
    }

    agendaDragDeltaRef.current = 0;
    setAgendaDragOffset(0);
    agendaDragStartXRef.current = null;
    setTimeout(() => {
      agendaHasMovedRef.current = false;
    }, 60);
  };

  useEffect(() => {
    if (
      prefersReducedMotion ||
      isAgendaPaused ||
      isAgendaHovered ||
      isAgendaFocused ||
      isAgendaDragging ||
      isTabHidden ||
      Boolean(selectedEvent) ||
      eventsList.length <= 1
    ) {
      return;
    }
    const interval = setInterval(() => {
      setAgendaIndex((prev) => (prev >= eventsList.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [
    prefersReducedMotion,
    isAgendaPaused,
    isAgendaHovered,
    isAgendaFocused,
    isAgendaDragging,
    isTabHidden,
    selectedEvent,
    eventsList.length,
  ]);

  const pembinaList = [
    {
      id: "pembina-1",
      role: cms?.sambutan?.pembina1?.role || "Pembina 1",
      name:
        cms?.sambutan?.pembina1?.name || PEMBINA_WELCOME.pembinaList[0].name,
      image:
        cms?.sambutan?.pembina1?.image || PEMBINA_WELCOME.pembinaList[0].image,
      salamPembuka:
        cms?.sambutan?.pembina1?.salamPembuka ||
        PEMBINA_WELCOME.pembinaList[0].salamPembuka,
      paragraphs:
        cms?.sambutan?.pembina1?.paragraphs ||
        PEMBINA_WELCOME.pembinaList[0].paragraphs,
      salamPenutup:
        cms?.sambutan?.pembina1?.salamPenutup ||
        PEMBINA_WELCOME.pembinaList[0].salamPenutup,
    },
    {
      id: "pembina-2",
      role: cms?.sambutan?.pembina2?.role || "Pembina 2",
      name:
        cms?.sambutan?.pembina2?.name || PEMBINA_WELCOME.pembinaList[1].name,
      image:
        cms?.sambutan?.pembina2?.image || PEMBINA_WELCOME.pembinaList[1].image,
      salamPembuka:
        cms?.sambutan?.pembina2?.salamPembuka ||
        PEMBINA_WELCOME.pembinaList[1].salamPembuka,
      paragraphs:
        cms?.sambutan?.pembina2?.paragraphs ||
        PEMBINA_WELCOME.pembinaList[1].paragraphs,
      salamPenutup:
        cms?.sambutan?.pembina2?.salamPenutup ||
        PEMBINA_WELCOME.pembinaList[1].salamPenutup,
    },
  ];

  const activePembina = pembinaList[activePembinaIndex] || pembinaList[0];

  const formatEventDate = (raw?: string) => {
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

  const isDefaultHeroTitle =
    !cms.hero?.titleLine1 ||
    (cms.hero.titleLine1 === "ROHIS" && cms.hero.titleLine2 === "PURWOKERTO");

  const isDefaultAboutTitle =
    !cms.about?.title || cms.about.title === "Bukan sekadar sebuah organisasi.";

  if (
    mounted &&
    typeof window !== "undefined" &&
    window.location.hostname.toLowerCase().includes("workers.dev")
  ) {
    return (
      <div className="min-h-screen clay-canvas flex items-center justify-center text-[#153E32] text-xs font-bold">
        Mengarahkan ke Panel Admin Rohis SMAPA...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col clay-canvas text-[#153E32]">
      <ScrollProgressBar />
      <Navbar />

      {/* ── 1. WHITE–MINT CLAY HERO SECTION (Matches 01_beranda_hero.png) ── */}
      {cms.sections.showHero && (
        <section
          aria-label="Beranda Rohis SMAN 4 Purwokerto"
          className="pt-24 pb-8 sm:pt-28 sm:pb-10 lg:pt-32 lg:pb-12 relative overflow-hidden"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Headline, Narrative & Clay Action Pills */}
              <div className="lg:col-span-6 text-left">
                <CinematicTextLine delay={0.04}>
                  <h1 className="font-heading text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#153E32] tracking-tight leading-[1.08] mb-4 sm:mb-5">
                    {isDefaultHeroTitle ? (
                      <>
                        Bertumbuh bersama.
                        <span className="block text-[#087A53] mt-1">
                          Berbuat kebaikan.
                        </span>
                      </>
                    ) : (
                      <>
                        <span>{cms.hero.titleLine1}</span>{" "}
                        <span className="text-[#087A53]">
                          {cms.hero.titleLine2}
                        </span>
                      </>
                    )}
                  </h1>
                </CinematicTextLine>

                <CinematicTextLine delay={0.1}>
                  <p className="text-sm sm:text-base lg:text-[17px] text-[#3B5E52] leading-relaxed mb-6 sm:mb-8 max-w-xl">
                    {cms.hero.narrative ||
                      "Wadah pembinaan keislaman, ukhuwah, dan kepemimpinan siswa SMA Negeri 4 Purwokerto yang berpusat di Musholla Al-Ikhlas."}
                  </p>
                </CinematicTextLine>

                <CinematicReveal delay={0.16} direction="up" distance={16}>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <Link
                      href={cms.hero.btnPrimaryLink || "/tentang"}
                      className="clay-btn-emerald px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 min-h-[44px]"
                    >
                      <span>Kenali Rohis</span>
                      <ArrowRight size={16} />
                    </Link>

                    <Link
                      href="/agenda"
                      className="clay-btn-mint px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 min-h-[44px]"
                    >
                      <span>Lihat kegiatan</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </CinematicReveal>
              </div>

              {/* Right Column: Clay Photo Card with ROHIS AKHDIR 38 Caption Bar */}
              <CinematicReveal
                delay={0.12}
                direction="up"
                distance={18}
                className="lg:col-span-6"
              >
                <div className="clay-photo-frame p-2.5 sm:p-3.5">
                  <div className="relative aspect-[16/10] w-full rounded-[18px] overflow-hidden bg-[#E5F2EC]">
                    <img
                      src={
                        parseImageCrop(
                          cms.hero?.showcaseImageUrl ||
                            "/images/rohis-akhdir-38.jpg"
                        ).src
                      }
                      alt="ROHIS AKHDIR 38 - SMA Negeri 4 Purwokerto"
                      referrerPolicy="no-referrer"
                      onError={(e) =>
                        handleGoogleDriveImageError(
                          e,
                          cms.hero?.showcaseImageUrl ||
                            "/images/rohis-akhdir-38.jpg"
                        )
                      }
                      style={getImageCropStyle(
                        cms.hero?.showcaseImageUrl ||
                          "/images/rohis-akhdir-38.jpg"
                      )}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Mint Clay Caption Bar beneath Hero Photo */}
                  <div className="mt-2.5 clay-inner-mint px-4 py-2.5 rounded-[14px] flex items-center justify-between gap-3">
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-[#153E32] tracking-wide uppercase">
                      {cms.hero?.showcaseTitle || "ROHIS AKHDIR 38"}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#087A53] truncate">
                      {cms.hero?.showcaseLocation ||
                        "Musholla Al-Ikhlas SMAN 4 Purwokerto"}
                    </span>
                  </div>
                </div>
              </CinematicReveal>
            </div>

            {/* ── 2. 4-ITEM CLAY SHORTCUT BAR (Matches 01_beranda_hero.png) ── */}
            <CinematicStagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10">
              {SHORTCUT_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <CinematicStaggerItem key={item.id}>
                    <Link
                      href={item.href}
                      className="clay-card clay-card-hover px-3.5 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-2.5 group min-h-[54px]"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl clay-icon-sq flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                          <Icon size={18} className="text-[#087A53]" />
                        </div>
                        <span className="font-heading font-bold text-xs sm:text-[15px] text-[#153E32] group-hover:text-[#087A53] transition-colors truncate">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-[#5E7D72] group-hover:text-[#087A53] group-hover:translate-x-0.5 transition-all shrink-0"
                      />
                    </Link>
                  </CinematicStaggerItem>
                );
              })}
            </CinematicStagger>
          </div>
        </section>
      )}

      {/* ── 3. TENTANG KAMI SECTION (Matches 01_beranda_hero.png) ── */}
      {cms.sections.showAbout && (
        <section
          id="tentang"
          aria-label="Tentang Rohis SMAN 4 Purwokerto"
          className="py-10 sm:py-14 lg:py-18 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="clay-card p-5 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Documentary Photo Frame */}
              <CinematicReveal
                direction="up"
                delay={0.05}
                className="lg:col-span-5"
              >
                <div className="clay-photo-frame p-2.5">
                  <div className="relative aspect-[4/3] w-full rounded-[18px] overflow-hidden bg-[#E5F2EC]">
                    {(() => {
                      const rawAboutUrl =
                        cms.about?.photoUrl &&
                        !cms.about.photoUrl.includes("muskerta")
                          ? cms.about.photoUrl
                          : "/images/dokumentasi-smapa.jpg";
                      return (
                        <img
                          src={parseImageCrop(rawAboutUrl).src}
                          alt="Dokumentasi Kader Rohis SMA Negeri 4 Purwokerto"
                          referrerPolicy="no-referrer"
                          onError={(e) =>
                            handleGoogleDriveImageError(e, rawAboutUrl)
                          }
                          style={getImageCropStyle(rawAboutUrl)}
                          className="w-full h-full object-cover"
                        />
                      );
                    })()}
                  </div>
                </div>
              </CinematicReveal>

              {/* Right Column: Editorial Copy & 2 Clay Feature Cards */}
              <CinematicReveal
                direction="up"
                delay={0.1}
                className="lg:col-span-7"
              >
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#153E32] tracking-tight leading-[1.16] mb-3.5">
                  {isDefaultAboutTitle
                    ? "Satu ruang untuk tumbuh dalam kebaikan."
                    : cms.about.title}
                </h2>

                <p className="text-sm sm:text-base text-[#3B5E52] leading-relaxed mb-3">
                  {cms.about?.lead ||
                    "Rohis SMAN 4 Purwokerto menjadi tempat belajar agama yang ramah, mempererat persaudaraan, dan melatih kepedulian lewat kegiatan nyata di sekolah."}
                </p>

                <p className="text-xs sm:text-sm text-[#4A6B5F] leading-relaxed mb-6">
                  {cms.about?.paragraph1 || ABOUT_CONTENT.paragraph1}
                </p>

                {/* 2 Clay Feature Cards (Belajar & Berakhlak / Ukhuwah & Kepedulian) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="clay-inner p-4 sm:p-5 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl clay-icon-sq flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen size={18} className="text-[#087A53]" />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm sm:text-base font-extrabold text-[#153E32] mb-1">
                        {cms.about?.point1Title &&
                        cms.about.point1Title !== "Sinergi & Ukhuwah Sekolah"
                          ? cms.about.point1Title
                          : "Belajar & Berakhlak"}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-[#3B5E52] leading-relaxed">
                        {cms.about?.point1Desc ||
                          "Kajian rutin, tadarus, dan pembiasaan adab di lingkungan sekolah."}
                      </p>
                    </div>
                  </div>

                  <div className="clay-inner p-4 sm:p-5 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl clay-icon-sq flex items-center justify-center shrink-0 mt-0.5">
                      <HeartHandshake size={18} className="text-[#087A53]" />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm sm:text-base font-extrabold text-[#153E32] mb-1">
                        {cms.about?.point2Title &&
                        cms.about.point2Title !== "Kaderisasi Berjenjang"
                          ? cms.about.point2Title
                          : "Ukhuwah & Kepedulian"}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-[#3B5E52] leading-relaxed">
                        {cms.about?.point2Desc ||
                          "Kegiatan kebersamaan, kaderisasi, dan aksi sosial antarwarga sekolah."}
                      </p>
                    </div>
                  </div>
                </div>
              </CinematicReveal>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. SAMBUTAN DEWAN PEMBINA (Retains Both Pembina + Interactive Switcher) ── */}
      {cms.sections.showSambutan && (
        <section
          id="sambutan-pembina"
          aria-label="Sambutan Dewan Pembina Rohis"
          className="scroll-mt-24 py-10 sm:py-14 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <CinematicReveal direction="up" delay={0.08}>
            <div className="clay-card p-5 sm:p-8 lg:p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#DCEAE3]">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#153E32] tracking-tight">
                    Dewan Pembina & Sambutan
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4A6B5F] mt-1">
                    Bimbingan guru Pendidikan Agama Islam SMA Negeri 4 Purwokerto
                  </p>
                </div>

                {/* Switcher Pill Tabs for Both Pembina */}
                <div
                  role="tablist"
                  aria-label="Pilih Pembina Rohis"
                  className="inline-flex items-center gap-2 p-1.5 rounded-full clay-inner self-start md:self-auto"
                >
                  {pembinaList.map((p, idx) => {
                    const isActive = activePembinaIndex === idx;
                    return (
                      <button
                        key={p.id}
                        role="tab"
                        aria-selected={isActive}
                        type="button"
                        onClick={() => setActivePembinaIndex(idx)}
                        className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[40px] ${
                          isActive
                            ? "clay-btn-emerald text-white"
                            : "text-[#3B5E52] hover:text-[#153E32]"
                        }`}
                      >
                        {p.name.split(",")[0]} ({p.role})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Left: Both Pembina Selector Cards (Atas-Bawah Layout) */}
                <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-4">
                  {pembinaList.map((pembina, idx) => {
                    const isActive = activePembinaIndex === idx;
                    return (
                      <button
                        key={pembina.id}
                        type="button"
                        onClick={() => setActivePembinaIndex(idx)}
                        className={`w-full text-left p-3.5 sm:p-4.5 rounded-[22px] transition-all duration-200 cursor-pointer flex items-center gap-3.5 sm:gap-4 ${
                          isActive
                            ? "clay-card-mint ring-2 ring-[#087A53]/35 shadow-sm"
                            : "clay-inner hover:bg-[#EBF7F1]"
                        }`}
                      >
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden clay-photo-frame p-1 shrink-0">
                          <img
                            src={parseImageCrop(pembina.image).src}
                            alt={pembina.name}
                            referrerPolicy="no-referrer"
                            onError={(e) =>
                              handleGoogleDriveImageError(e, pembina.image)
                            }
                            style={getImageCropStyle(pembina.image)}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold mb-1.5 ${
                              isActive
                                ? "clay-btn-emerald text-white"
                                : "clay-pill-mint text-[#087A53]"
                            }`}
                          >
                            {pembina.role} ROHIS
                          </span>
                          <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#153E32] leading-snug line-clamp-2">
                            {pembina.name}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-[#4A6B5F] mt-0.5">
                            Guru Pembina PAI SMA Negeri 4 Purwokerto
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Active Pembina Greeting Content with Smooth Crossfade (02_PROMPT_ANIMASI.md: 180-240ms + y 6px) */}
                <div className="lg:col-span-7">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePembina.id}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 6 }
                      }
                      animate={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 1, y: 0 }
                      }
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -4 }
                      }
                      transition={{
                        duration: prefersReducedMotion ? 0.08 : 0.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="clay-inner p-5 sm:p-7"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="clay-pill-mint px-3 py-1 rounded-full text-xs font-bold">
                          Sambutan {activePembina.role} — {activePembina.name}
                        </span>
                      </div>

                      <p className="font-heading text-sm sm:text-base font-bold text-[#153E32] mb-3">
                        {activePembina.salamPembuka}
                      </p>

                      <div className="space-y-3 text-xs sm:text-sm text-[#3B5E52] leading-relaxed">
                        {activePembina.paragraphs.map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>

                      <p className="font-heading text-sm font-bold text-[#153E32] mt-4 mb-5">
                        {activePembina.salamPenutup}
                      </p>

                      <div className="pt-3 border-t border-[#DCEAE3] flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setActivePembinaIndex(
                              activePembinaIndex === 0 ? 1 : 0
                            )
                          }
                          className="clay-btn-mint px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>
                            {activePembinaIndex === 0
                              ? "Baca Sambutan Pembina 2"
                              : "Baca Sambutan Pembina 1"}
                          </span>
                          <ArrowRight size={14} />
                        </button>

                        <Link
                          href="/tentang#pembina"
                          className="text-xs font-bold text-[#087A53] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Lihat Profil & Kepengurusan</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </CinematicReveal>
        </section>
      )}

      {/* ── 5. AGENDA & KEGIATAN 3D COVERFLOW (Matches 02_beranda_agenda.png) ── */}
      {cms.sections.showAgenda && (
        <section
          id="agenda"
          aria-label="Agenda dan Kegiatan Rohis"
          className="py-12 sm:py-16 lg:py-20 relative overflow-hidden"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <CinematicReveal
              direction="up"
              delay={0.06}
              className="text-center max-w-2xl mx-auto mb-8 sm:mb-10"
            >
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#153E32] tracking-tight">
                Agenda & Kegiatan
              </h2>
              <p className="text-sm sm:text-base text-[#3B5E52] mt-2 leading-relaxed">
                {cms.agenda?.lead ||
                  "Jadwal kajian, latihan kepemimpinan, dan kegiatan sosial terdekat."}
              </p>
            </CinematicReveal>

            {/* 3D Coverflow Stage */}
            <div
              className={`relative max-w-5xl mx-auto select-none ${
                isAgendaDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                perspective: prefersReducedMotion ? "none" : "1200px",
                perspectiveOrigin: "50% 50%",
                touchAction: "pan-y",
              }}
              onMouseEnter={() => setIsAgendaHovered(true)}
              onMouseLeave={() => {
                setIsAgendaHovered(false);
                if (isAgendaDragActiveRef.current) {
                  handleAgendaDragEnd();
                }
              }}
              onFocusCapture={() => setIsAgendaFocused(true)}
              onBlurCapture={() => setIsAgendaFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  prevAgenda();
                } else if (e.key === "ArrowRight") {
                  e.preventDefault();
                  nextAgenda();
                }
              }}
              onMouseDown={(e) => {
                if (e.button !== 0) return;
                handleAgendaDragStart(e.clientX);
              }}
              onMouseMove={(e) => {
                if (isAgendaDragActiveRef.current) {
                  handleAgendaDragMove(e.clientX);
                }
              }}
              onMouseUp={handleAgendaDragEnd}
              onTouchStart={(e) => handleAgendaDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleAgendaDragMove(e.touches[0].clientX)}
              onTouchEnd={handleAgendaDragEnd}
              onTouchCancel={handleAgendaDragEnd}
            >
              <div
                className="relative w-full h-[395px] sm:h-[435px] lg:h-[455px] flex items-center justify-center"
                style={{
                  transformStyle: prefersReducedMotion ? "flat" : "preserve-3d",
                }}
              >
                {/* Left Circular Clay Arrow Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevAgenda();
                  }}
                  aria-label="Agenda Sebelumnya"
                  style={{
                    transform: prefersReducedMotion
                      ? undefined
                      : "translateZ(120px)",
                  }}
                  className="absolute left-0 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full clay-btn-white flex items-center justify-center text-[#153E32] cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right Circular Clay Arrow Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextAgenda();
                  }}
                  aria-label="Agenda Berikutnya"
                  style={{
                    transform: prefersReducedMotion
                      ? undefined
                      : "translateZ(120px)",
                  }}
                  className="absolute right-0 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full clay-btn-white flex items-center justify-center text-[#153E32] cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Coverflow Cards */}
                {eventsList.map((event, idx) => {
                  const total = eventsList.length;
                  let dist = (idx - agendaIndex + total) % total;
                  if (dist > total / 2) dist -= total;

                  const isCenter = dist === 0;
                  const isLeft = dist === -1;
                  const isRight = dist === 1;
                  const isVisible = isCenter || isLeft || isRight;

                  const currentDrag = isAgendaDragging ? agendaDragOffset : 0;
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
                    transform = `translate3d(${currentDrag}px, 0, 36px) rotateY(${dragAngle}deg) scale(1)`;
                    zIndex = 35;
                    opacity = 1;
                    pointerEvents = "auto";
                  } else if (isLeft) {
                    transform = `translate3d(calc(-56% + ${
                      currentDrag * 0.55
                    }px), 6px, -65px) rotateY(${15 + dragAngle}deg) scale(0.89)`;
                    zIndex = 15;
                    opacity = 0.78;
                    pointerEvents = "auto";
                  } else if (isRight) {
                    transform = `translate3d(calc(56% + ${
                      currentDrag * 0.55
                    }px), 6px, -65px) rotateY(${-15 + dragAngle}deg) scale(0.89)`;
                    zIndex = 15;
                    opacity = 0.78;
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

                  return (
                    <article
                      key={event.id}
                      onClick={() => {
                        if (agendaHasMovedRef.current) return;
                        if (isLeft) prevAgenda();
                        else if (isRight) nextAgenda();
                        else if (isCenter) {
                          setSelectedEvent({
                            ...(event as unknown as EventItem),
                            category: event.category || event.type || "Kegiatan",
                          });
                        }
                      }}
                      style={{
                        transform,
                        zIndex,
                        opacity,
                        pointerEvents,
                        visibility: isVisible ? "visible" : "hidden",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transition: isAgendaDragging
                          ? "none"
                          : prefersReducedMotion
                          ? "opacity 100ms ease"
                          : "transform 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 380ms cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                      className={`absolute w-[78vw] min-w-[255px] max-w-[330px] sm:w-[380px] sm:max-w-none lg:w-[430px] clay-card p-3 sm:p-4 flex flex-col justify-between text-left select-none cursor-pointer ${
                        isCenter
                          ? "shadow-[0_20px_42px_-12px_rgba(15,62,46,0.18)]"
                          : "hover:opacity-90"
                      }`}
                    >
                      {/* Top Rounded Photo */}
                      <div>
                        <div className="relative h-[165px] sm:h-[195px] lg:h-[210px] w-full rounded-[16px] overflow-hidden bg-[#E5F2EC] mb-3.5">
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
                                {formatEventDate(event.date)}
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

                      {/* Bottom CTA Button */}
                      <div className="px-1.5 pt-3 mt-2 flex items-center justify-between">
                        {isCenter ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (agendaHasMovedRef.current) return;
                              setSelectedEvent({
                                ...(event as unknown as EventItem),
                                category:
                                  event.category || event.type || "Kegiatan",
                              });
                            }}
                            className="clay-btn-emerald px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
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

              {/* Dots + Pause Control */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  {eventsList.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAgendaIndex(i)}
                      aria-label={`Pilih Agenda ${i + 1}`}
                      className={`cursor-pointer transition-all duration-200 rounded-full h-2.5 ${
                        i === agendaIndex
                          ? "w-7 bg-[#087A53]"
                          : "w-2.5 bg-[#C5DDD2] hover:bg-[#8FC2AC]"
                      }`}
                    />
                  ))}
                </div>

                {!prefersReducedMotion && eventsList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setIsAgendaPaused((prev) => !prev)}
                    aria-label={
                      isAgendaPaused
                        ? "Putar otomatis agenda"
                        : "Jeda otomatis agenda"
                    }
                    className="clay-pill-white px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#3B5E52] hover:text-[#153E32] inline-flex items-center gap-1 cursor-pointer"
                  >
                    {isAgendaPaused ? <Play size={11} /> : <Pause size={11} />}
                    <span>{isAgendaPaused ? "Putar" : "Jeda"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 6. GALERI SYIAR & UKHUWAH 3D COVERFLOW (Matches 02_beranda_agenda.png) ── */}
      {cms.sections.showGallery && (
        <CinematicReveal direction="up" delay={0.08}>
          <Gallery3DShowcase
            items={(() => {
              if (galleryList.length > 0) {
                return galleryList;
              }
              if (cms.gallery?.items && cms.gallery.items.length > 0) {
                return cms.gallery.items;
              }
              return GALLERY_DATA;
            })()}
            tag={cms.gallery?.tag || "Dokumentasi Kegiatan"}
            title="Galeri Syiar & Ukhuwah"
            lead="Dokumentasi kegiatan dan kebersamaan keluarga besar Rohis SMAPA."
          />
        </CinematicReveal>
      )}

      {/* ── 7. JELAJAHI ROHIS & DIREKTORI (Matches 02_beranda_agenda.png) ── */}
      <CinematicReveal direction="up" delay={0.08}>
        <Directory3DShowcase />
      </CinematicReveal>

      {/* Event Detail Clay Modal */}
      <EventRegisterModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <Footer />
    </div>
  );
}
