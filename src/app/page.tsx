"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventRegisterModal from "@/components/EventRegisterModal";
import Gallery3DShowcase from "@/components/Gallery3DShowcase";
import Directory3DShowcase from "@/components/Directory3DShowcase";
import {
  ScrollProgressBar,
  AnimatedCounter,
  CinematicReveal,
  CinematicStagger,
  CinematicStaggerItem,
  CinematicTextLine,
  ParallaxImageContainer,
} from "@/components/ScrollAnimations";
import {
  SITE,
  ORG_STATS,
  ABOUT_CONTENT,
  PEMBINA_WELCOME,
  EVENTS_DATA,
  GALLERY_DATA,
} from "@/lib/constants";
import { DEFAULT_HOME_CMS, HomeCmsData, normalizeHomeCms } from "@/lib/homeCmsData";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import { handleGoogleDriveImageError } from "@/lib/driveUtils";
import { pullCloudSync } from "@/lib/cloudSync";
import { EventItem } from "@/lib/types";
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Camera,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Quote,
  ImageIcon,
  BookOpen,
  Award,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Users,
  Layers,
  CalendarCheck2,
  History,
  Pause,
  Play,
} from "lucide-react";

const STAT_METADATA = [
  {
    icon: Users,
    badge: "Kader Solid",
    iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    badgeBg: "bg-emerald-100/90 text-emerald-800 border-emerald-200/70",
    glow: "group-hover:border-emerald-400/50",
  },
  {
    icon: Layers,
    badge: "Struktural",
    iconBg: "bg-blue-50 text-blue-700 border-blue-200/80",
    badgeBg: "bg-blue-100/90 text-blue-800 border-blue-200/70",
    glow: "group-hover:border-blue-400/50",
  },
  {
    icon: CalendarCheck2,
    badge: "Agenda Syiar",
    iconBg: "bg-amber-50 text-amber-700 border-amber-200/80",
    badgeBg: "bg-amber-100/90 text-amber-800 border-amber-200/70",
    glow: "group-hover:border-amber-400/50",
  },
  {
    icon: History,
    badge: "Sejarah SMAPA",
    iconBg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    badgeBg: "bg-emerald-100/90 text-emerald-900 border-emerald-200/70",
    glow: "group-hover:border-emerald-400/50",
  },
];

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activePembinaIndex, setActivePembinaIndex] = useState(0);
  const [agendaIndex, setAgendaIndex] = useState(1);
  const [isAgendaPaused, setIsAgendaPaused] = useState(false);
  const [agendaDragOffset, setAgendaDragOffset] = useState(0);
  const [isAgendaDragging, setIsAgendaDragging] = useState(false);
  const agendaDragStartXRef = useRef<number | null>(null);
  const agendaDragDeltaRef = useRef(0);
  const agendaRafRef = useRef<number | null>(null);
  const isAgendaDragActiveRef = useRef(false);
  const agendaHasMovedRef = useRef(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [cms, setCms] = useState<HomeCmsData>(DEFAULT_HOME_CMS);
  const [eventsList, setEventsList] = useState<any[]>([...EVENTS_DATA]);
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  // Cinematic Hero Parallax Depth Setup
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroBgY = useTransform(heroProgress, [0, 1], ["0%", "24%"]);
  const heroTextY = useTransform(heroProgress, [0, 1], ["0%", "14%"]);
  const heroTextOpacity = useTransform(heroProgress, [0, 0.75], [1, 0.05]);
  const heroCardY = useTransform(heroProgress, [0, 1], ["0%", "-8%"]);
  const heroCardScale = useTransform(heroProgress, [0, 1], [1, 0.96]);
  const heroGlowScale = useTransform(heroProgress, [0, 1], [1, 1.25]);

  useEffect(() => {
    // Jika diakses menggunakan link khusus Admin (rohissmapa.farisnasrul542.workers.dev), langsung arahkan ke /admin
    if (
      typeof window !== "undefined" &&
      window.location.hostname.toLowerCase().includes("workers.dev")
    ) {
      window.location.replace("/admin");
      return;
    }

    setMounted(true);
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
            const cleaned = parsed.map((e: any) => {
              if (e.image && typeof e.image === "string" && e.image.startsWith("data:image/")) {
                return { ...e, image: "/images/event-3.jpg" };
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

    loadCms();
    loadEvents();
    loadGallery();

    // Tarik data terbaru dari Cloud Sync (menghubungkan workers.dev -> rohis-sman4pwt.web.id)
    pullCloudSync().then((synced) => {
      if (!synced) return;
      if (synced.rohis_home_cms) {
        setCms(normalizeHomeCms(synced.rohis_home_cms));
      }
      if (Array.isArray(synced.rohis_admin_events) && synced.rohis_admin_events.length > 0) {
        setEventsList(synced.rohis_admin_events);
      }
      if (Array.isArray(synced.rohis_admin_gallery) && synced.rohis_admin_gallery.length > 0) {
        setGalleryList(synced.rohis_admin_gallery);
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

    const handleCmsUpdated = (e: any) => {
      if (e.detail) {
        setCms(normalizeHomeCms(e.detail));
      } else {
        loadCms();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("rohis_cms_updated" as any, handleCmsUpdated);

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
      window.removeEventListener("rohis_cms_updated" as any, handleCmsUpdated);
      if (bc) bc.close();
    };
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({
      x: Number((x * 14).toFixed(2)),
      y: Number((-y * 14).toFixed(2)),
    });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

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
    setIsAgendaPaused(true);
  };

  const handleAgendaDragMove = (clientX: number) => {
    if (!isAgendaDragActiveRef.current || agendaDragStartXRef.current === null) return;
    // Reduksi resistensi geser agar terasa ringan di jari
    const rawDelta = clientX - agendaDragStartXRef.current;
    const delta = Math.max(-180, Math.min(180, rawDelta));
    agendaDragDeltaRef.current = delta;
    if (Math.abs(rawDelta) > 5) {
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
    setIsAgendaPaused(false);

    const finalDelta = agendaDragDeltaRef.current;
    const threshold = 32;
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
    if (isAgendaPaused || eventsList.length <= 1) return;
    const interval = setInterval(() => {
      setAgendaIndex((prev) => (prev >= eventsList.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isAgendaPaused, eventsList.length]);

  // Dynamic pembina list reflecting CMS updates
  const pembinaList = [
    {
      id: "pembina-1",
      role: cms?.sambutan?.pembina1?.role || "Pembina 1",
      name: cms?.sambutan?.pembina1?.name || PEMBINA_WELCOME.pembinaList[0].name,
      image: cms?.sambutan?.pembina1?.image || PEMBINA_WELCOME.pembinaList[0].image,
      salamPembuka: cms?.sambutan?.pembina1?.salamPembuka || PEMBINA_WELCOME.pembinaList[0].salamPembuka,
      paragraphs: cms?.sambutan?.pembina1?.paragraphs || PEMBINA_WELCOME.pembinaList[0].paragraphs,
      salamPenutup: cms?.sambutan?.pembina1?.salamPenutup || PEMBINA_WELCOME.pembinaList[0].salamPenutup,
    },
    {
      id: "pembina-2",
      role: cms?.sambutan?.pembina2?.role || "Pembina 2",
      name: cms?.sambutan?.pembina2?.name || PEMBINA_WELCOME.pembinaList[1].name,
      image: cms?.sambutan?.pembina2?.image || PEMBINA_WELCOME.pembinaList[1].image,
      salamPembuka: cms?.sambutan?.pembina2?.salamPembuka || PEMBINA_WELCOME.pembinaList[1].salamPembuka,
      paragraphs: cms?.sambutan?.pembina2?.paragraphs || PEMBINA_WELCOME.pembinaList[1].paragraphs,
      salamPenutup: cms?.sambutan?.pembina2?.salamPenutup || PEMBINA_WELCOME.pembinaList[1].salamPenutup,
    },
  ];

  const activePembina = pembinaList[activePembinaIndex] || pembinaList[0];

  if (mounted && typeof window !== "undefined" && window.location.hostname.toLowerCase().includes("workers.dev")) {
    return (
      <div className="min-h-screen bg-[#041811] flex items-center justify-center text-white text-xs font-bold">
        Mengarahkan ke Panel Admin Rohis SMAPA...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7] text-gray-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* ── Global Cinematic Glowing Scroll Timeline Bar ── */}
      <ScrollProgressBar />
      <Navbar />

      {/* ── 1. HERO SECTION WITH CINEMATIC PARALLAX DEPTH ── */}
      {cms.sections.showHero && (
        <section
          ref={heroRef}
          className="relative pt-36 pb-28 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-36 bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white overflow-hidden"
        >
        {/* Subtle Background Glows & Pattern with Parallax Movement */}
        <motion.div
          style={{ y: heroBgY }}
          className="absolute inset-0 bg-islamic-dark-pattern opacity-35 pointer-events-none will-change-transform"
        />
        <motion.div
          style={{ scale: heroGlowScale }}
          className="absolute top-1/4 left-1/3 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none"
        />
        <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & Action with Cinematic Lag & Fade */}
            <motion.div
              style={{ y: heroTextY, opacity: heroTextOpacity }}
              className="lg:col-span-7 text-left will-change-transform"
            >
              {/* Title with Sequential Line-by-Line Reveal */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-left">
                <CinematicTextLine delay={0.1}>
                  <span>{cms.hero.titleLine1 || "ROHIS"} SMAN 4</span>
                </CinematicTextLine>
                <CinematicTextLine delay={0.25}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-sm">
                    {cms.hero.titleLine2 || "PURWOKERTO"}
                  </span>
                </CinematicTextLine>
              </h1>

              <CinematicTextLine delay={0.4}>
                <div className="text-lg sm:text-2xl font-bold text-amber-300/90 mb-4 text-left">
                  {cms.hero.leadPhrase || SITE.heroLead}
                </div>
              </CinematicTextLine>

              {/* Narrative with Sequential Reveal */}
              <CinematicTextLine delay={0.55}>
                <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed mb-8 text-left max-w-2xl">
                  {cms.hero.narrative || SITE.narrative}
                </p>
              </CinematicTextLine>

              {/* CTA Buttons with Smooth Upward Entrance */}
              <CinematicReveal delay={0.7} direction="up" distance={20}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4">
                  <Link
                    href={cms.hero.btnSecondaryLink || "/galeri"}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <Camera size={16} className="text-emerald-950" />
                    <span>{cms.hero.btnSecondaryText || "Lihat Galeri Rohis"}</span>
                  </Link>

                  <Link
                    href={cms.hero.btnPrimaryLink || "/tentang"}
                    className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} className="text-emerald-300" />
                    <span>{cms.hero.btnPrimaryText || "Profil Rohis SMAPA"}</span>
                  </Link>
                </div>
              </CinematicReveal>
            </motion.div>

            {/* Right Column: Hero Showcase Card with Differential Parallax (Opposing Rate) */}
            <motion.div
              style={{ y: heroCardY, scale: heroCardScale }}
              className="lg:col-span-5 flex flex-col items-center lg:items-end w-full will-change-transform"
            >
              <div className="w-full max-w-lg">
                {/* Photo Card Container */}
                <div
                  suppressHydrationWarning
                  className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-emerald-500/25 shadow-2xl shadow-emerald-950/80 group bg-[#062017]"
                >
                  {/* Real Photo: ROHIS AKHDIR 38 */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={parseImageCrop(cms.hero?.showcaseImageUrl || "/images/rohis-akhdir-38.jpg").src}
                      alt="ROHIS AKHDIR 38 - SMA Negeri 4 Purwokerto"
                      referrerPolicy="no-referrer"
                      onError={(e) =>
                        handleGoogleDriveImageError(
                          e,
                          cms.hero?.showcaseImageUrl || "/images/rohis-akhdir-38.jpg"
                        )
                      }
                      style={getImageCropStyle(cms.hero?.showcaseImageUrl || "/images/rohis-akhdir-38.jpg")}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out"
                    />
                  </div>

                  {/* Top-Right Badge (Boleh dikosongkan) */}
                  {Boolean(cms.hero?.showcaseBadge?.trim()) && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3.5 py-1.5 rounded-full bg-[#1b3d30]/90 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[11px] font-black tracking-wider uppercase shadow-lg">
                        {cms.hero.showcaseBadge}
                      </span>
                    </div>
                  )}

                  {/* Bottom Text Overlay (Boleh dikosongkan semua atau sebagian) */}
                  {Boolean(
                    cms.hero?.showcaseLocation?.trim() ||
                    cms.hero?.showcaseTitle?.trim() ||
                    cms.hero?.showcaseDescription?.trim()
                  ) && (
                    <>
                      {/* Gradient Overlay at bottom for clear text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 via-45% to-transparent pointer-events-none" />

                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 text-left">
                        {/* Location Badge */}
                        {Boolean(cms.hero?.showcaseLocation?.trim()) && (
                          <div className="flex items-center gap-1.5 text-xs font-black tracking-wider text-amber-400 mb-1.5 uppercase drop-shadow">
                            <span>📍</span>
                            <span>{cms.hero.showcaseLocation}</span>
                          </div>
                        )}

                        {/* Title */}
                        {Boolean(cms.hero?.showcaseTitle?.trim()) && (
                          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-1.5 uppercase drop-shadow-md">
                            {cms.hero.showcaseTitle}
                          </h3>
                        )}

                        {/* Description */}
                        {Boolean(cms.hero?.showcaseDescription?.trim()) && (
                          <p className="text-xs sm:text-[13px] text-emerald-100/90 leading-relaxed font-medium line-clamp-2 drop-shadow">
                            {cms.hero.showcaseDescription}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Bottom Meta Information (Boleh dikosongkan) */}
                {Boolean(
                  cms.hero?.showcaseMeta1?.trim() ||
                  cms.hero?.showcaseMeta2?.trim() ||
                  cms.hero?.showcaseMeta3?.trim()
                ) && (
                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-[10.5px] sm:text-xs font-black text-emerald-300/85 tracking-wider uppercase px-2 w-full">
                    {Boolean(cms.hero?.showcaseMeta1?.trim()) && (
                      <span className="truncate">{cms.hero.showcaseMeta1}</span>
                    )}
                    {Boolean(cms.hero?.showcaseMeta2?.trim()) && (
                      <span className="truncate">{cms.hero.showcaseMeta2}</span>
                    )}
                    {Boolean(cms.hero?.showcaseMeta3?.trim()) && (
                      <span className="truncate">{cms.hero.showcaseMeta3}</span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* ── 2. LIVE METRICS & STATS WITH ARCHITECTURAL CARDS (ALL-DPI MOBILE & DESKTOP) ── */}
      {cms.sections.showStats && (
        <section className="relative z-20 -mt-10 sm:-mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-white/95 backdrop-blur-xl rounded-[28px] sm:rounded-3xl p-3 sm:p-5 lg:p-6 shadow-xl shadow-emerald-950/8 border border-emerald-900/10 relative overflow-hidden">
            {/* Subtle Top Glow Accent */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-emerald-500/0 via-amber-400/70 to-emerald-500/0 pointer-events-none" />

            <CinematicStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
              {(cms.stats || ORG_STATS).map((stat: any, idx: number) => {
                const meta = STAT_METADATA[idx % STAT_METADATA.length];
                const IconComponent = meta.icon;
                const rawVal =
                  typeof stat.value === "number"
                    ? stat.value
                    : parseInt(stat.value, 10) || 0;
                const isYear = rawVal >= 1900 && rawVal <= 2100;

                return (
                  <CinematicStaggerItem key={stat.label || idx} className="h-full">
                    {/* Responsive Card: Horizontal Tile on Mobile, Vertical Card on Tablet & Desktop */}
                    <div
                      className={`h-full flex flex-row sm:flex-col items-center sm:items-start justify-between p-3.5 sm:p-5 lg:p-6 rounded-2xl bg-[#faf9f5]/85 hover:bg-white border border-emerald-900/10 ${meta.glow} hover:shadow-md transition-all duration-300 group`}
                    >
                      {/* Top / Left: Icon & Badge */}
                      <div className="flex items-center gap-3 sm:w-full sm:justify-between mb-0 sm:mb-3">
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border ${meta.iconBg} group-hover:scale-105 transition-transform duration-300 shadow-2xs`}
                        >
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <span
                          className={`hidden sm:inline-block text-[10.5px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${meta.badgeBg}`}
                        >
                          {meta.badge}
                        </span>
                      </div>

                      {/* Middle & Bottom Info */}
                      <div className="flex-1 sm:flex-initial min-w-0 px-3 sm:px-0 sm:w-full">
                        <div className="flex items-baseline justify-between sm:justify-start gap-2">
                          <div className="text-2xl min-[380px]:text-3xl lg:text-4xl font-black text-emerald-950 tracking-tight leading-none">
                            <AnimatedCounter
                              value={rawVal}
                              suffix={stat.suffix}
                              noSeparator={Boolean(stat.noSeparator || isYear)}
                            />
                          </div>
                          <span
                            className={`sm:hidden text-[9.5px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${meta.badgeBg}`}
                          >
                            {meta.badge}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-gray-700 mt-1 sm:mt-2 leading-snug line-clamp-2">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </CinematicStaggerItem>
                );
              })}
            </CinematicStagger>
          </div>
        </section>
      )}

      {/* ── 3. TENTANG KAMI (ABOUT SECTION WITH CINEMATIC REVEAL) ── */}
      {cms.sections.showAbout && (
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Editorial & Values */}
            <CinematicReveal direction="up" delay={0.1} className="lg:col-span-7">
              {/* Section Tag Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide mb-4">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>{cms.about?.tag || ABOUT_CONTENT.tag}</span>
              </div>

              {/* Main Headline */}
              <CinematicTextLine delay={0.1}>
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-emerald-950 tracking-tight leading-[1.18] mb-5">
                  {cms.about?.title || ABOUT_CONTENT.title}
                </h2>
              </CinematicTextLine>

              {/* Lead Narrative */}
              <CinematicTextLine delay={0.25}>
                <p className="text-base sm:text-lg font-bold text-emerald-900/90 leading-relaxed mb-4">
                  {cms.about?.lead || ABOUT_CONTENT.lead}
                </p>
              </CinematicTextLine>

              {/* Body Paragraphs */}
              <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed mb-4">
                {cms.about?.paragraph1 || ABOUT_CONTENT.paragraph1}
              </p>
              <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed mb-8">
                {cms.about?.paragraph2 || ABOUT_CONTENT.paragraph2}
              </p>

              {/* 2 Feature Cards (Image 2 Style with Stagger Reveal) */}
              <CinematicStagger className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CinematicStaggerItem>
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-900/10 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group h-full">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-emerald-950 mb-1.5">
                        {cms.about?.point1Title || ABOUT_CONTENT.highlights[0].title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {cms.about?.point1Desc || ABOUT_CONTENT.highlights[0].desc}
                      </p>
                    </div>
                  </div>
                </CinematicStaggerItem>

                <CinematicStaggerItem>
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-900/10 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col justify-between group h-full">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Award className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-emerald-950 mb-1.5">
                        {cms.about?.point2Title || ABOUT_CONTENT.highlights[1].title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {cms.about?.point2Desc || ABOUT_CONTENT.highlights[1].desc}
                      </p>
                    </div>
                  </div>
                </CinematicStaggerItem>
              </CinematicStagger>
            </CinematicReveal>

            {/* Right Column: Photo & Quote Card (Image 2 Style with Smooth Entrance) */}
            <CinematicReveal direction="left" delay={0.2} className="lg:col-span-5 flex flex-col gap-6">
              {/* 1. Real Documentary Photo Card with Parallax Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-emerald-950/10 border border-emerald-900/10 group bg-emerald-950/5">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <ParallaxImageContainer offset={22} className="absolute inset-0">
                    {(() => {
                      const rawAboutUrl =
                        cms.about?.photoUrl && !cms.about.photoUrl.includes("muskerta")
                          ? cms.about.photoUrl
                          : "/images/dokumentasi-smapa.jpg";
                      return (
                        <img
                          src={parseImageCrop(rawAboutUrl).src}
                          alt="Dokumentasi Kader Rohis SMA Negeri 4 Purwokerto"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleGoogleDriveImageError(e, rawAboutUrl)}
                          style={getImageCropStyle(rawAboutUrl)}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out"
                        />
                      );
                    })()}
                  </ParallaxImageContainer>
                  {cms.about?.photoBadge && !cms.about.photoBadge.toUpperCase().includes("MUSKERTA") && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 right-4 sm:left-5 sm:right-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-[11px] font-bold tracking-widest text-white uppercase border border-white/15 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span>{cms.about.photoBadge}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 2. Warm Quote Card */}
              <div className="rounded-3xl p-6 sm:p-7 bg-[#FAF7F2] border border-amber-900/10 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <Quote className="w-7 h-7 text-amber-500 fill-amber-500/20 mb-3" />
                  <p className="text-sm sm:text-base italic text-emerald-950/90 font-medium leading-relaxed mb-4">
                    &ldquo;{cms.about?.quoteText || ABOUT_CONTENT.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900/75 pt-3 border-t border-amber-900/10">
                    <span className="text-amber-600 font-bold">—</span>
                    <span>{cms.about?.quoteAuthor || ABOUT_CONTENT.quoteAuthor}</span>
                  </div>
                </div>
              </div>
            </CinematicReveal>
          </div>
        </section>
      )}

      {/* ── 3.5. SAMBUTAN PEMBINA (ADVISORS GREETING SECTION WITH CINEMATIC REVEAL) ── */}
      {cms.sections.showSambutan && (
        <section className="py-14 sm:py-20 lg:py-28 bg-[#f5f2eb]/70 border-y border-emerald-950/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* Left Column: Greeting Message with Interactive Switching */}
              <CinematicReveal direction="up" delay={0.1} className="lg:col-span-7">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide mb-4">
                  <Quote className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{cms.sambutan?.tag || PEMBINA_WELCOME.tag}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl min-[380px]:text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 tracking-tight leading-[1.2] mb-5">
                  Sambutan{" "}
                  <span className="text-emerald-800 inline-block">
                    {activePembina.role} ROHIS
                  </span>
                </h2>

                {/* Interactive Tabs/Buttons to Switch Speeches: Responsive for All Mobile DPIs */}
                <div className="grid grid-cols-2 p-1 sm:p-1.5 bg-white/95 rounded-2xl w-full max-w-[340px] sm:max-w-none sm:w-auto sm:inline-flex sm:items-center sm:gap-2 border border-emerald-900/10 shadow-sm mb-6">
                  {pembinaList.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActivePembinaIndex(idx)}
                      className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                        activePembinaIndex === idx
                          ? "bg-emerald-900 text-white shadow-md shadow-emerald-950/20"
                          : "text-gray-600 hover:text-emerald-950 hover:bg-emerald-50/70"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          activePembinaIndex === idx
                            ? "bg-amber-400 animate-pulse"
                            : "bg-gray-300"
                        }`}
                      />
                      <span className="truncate">Sambutan {p.role}</span>
                    </button>
                  ))}
                </div>

                {/* Speech Body */}
                <div
                  key={activePembina.id}
                  className="transition-all duration-300"
                >
                  {/* Greeting */}
                  <p className="text-base sm:text-lg font-bold text-emerald-950 mb-3 sm:mb-4">
                    {activePembina.salamPembuka}
                  </p>

                  {/* Paragraphs */}
                  {activePembina.paragraphs.map(
                    (para, i) => (
                      <p
                        key={i}
                        className={`text-[13.5px] sm:text-[15px] text-gray-700 leading-relaxed ${
                          i === activePembina.paragraphs.length - 1
                            ? "mb-5 sm:mb-6"
                            : "mb-3.5 sm:mb-4"
                        }`}
                      >
                        {para}
                      </p>
                    )
                  )}

                  {/* Closing Greeting */}
                  <p className="text-base font-bold text-emerald-950 mb-6 sm:mb-7">
                    {activePembina.salamPenutup}
                  </p>
                </div>

                {/* Action Buttons: Switcher Button + Profile Link */}
                <div className="flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setActivePembinaIndex(activePembinaIndex === 0 ? 1 : 0)
                    }
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-emerald-900 text-white shadow-md shadow-emerald-950/15 hover:bg-emerald-950 hover:shadow-lg text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer group"
                  >
                    <span>
                      {activePembinaIndex === 0
                        ? "Lihat Sambutan Pembina 2"
                        : "Lihat Sambutan Pembina 1"}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  <Link
                    href="/tentang"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-full bg-white text-emerald-950 border border-emerald-900/15 shadow-sm hover:bg-emerald-50 text-xs sm:text-sm font-semibold transition-all duration-300 text-center"
                  >
                    <span>Profil Lengkap</span>
                  </Link>
                </div>
              </CinematicReveal>

              {/* Right Column: 2 Pembina Card (Clickable & Clean without Period) */}
              <CinematicReveal direction="right" delay={0.2} className="lg:col-span-5">
                <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-xl shadow-emerald-950/5 border border-emerald-900/10 relative">
                  {/* 2 Pembina Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    {pembinaList.map((pembina, idx) => (
                      <button
                        key={pembina.id}
                        type="button"
                        onClick={() => setActivePembinaIndex(idx)}
                        className={`flex flex-col items-center text-center p-2.5 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer group ${
                          activePembinaIndex === idx
                            ? "bg-emerald-50/70 border-2 border-emerald-500/40 shadow-sm ring-2 ring-emerald-500/10 scale-[1.02]"
                            : "border-2 border-transparent hover:bg-gray-50/80 opacity-80 hover:opacity-100"
                        }`}
                      >
                        {/* Avatar Circle with Ring */}
                        <div
                          className={`relative w-16 h-16 min-[380px]:w-20 min-[380px]:h-20 sm:w-24 sm:h-24 rounded-full p-1 mb-2.5 sm:mb-3.5 transition-transform duration-300 group-hover:scale-105 shadow-md ${
                            activePembinaIndex === idx
                              ? "ring-4 ring-emerald-600 bg-emerald-950 scale-105"
                              : "ring-2 ring-gray-200 bg-emerald-950"
                          }`}
                        >
                          <div className="w-full h-full rounded-full overflow-hidden relative">
                            <img
                              src={parseImageCrop(pembina.image).src}
                              alt={pembina.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => handleGoogleDriveImageError(e, pembina.image)}
                              style={getImageCropStyle(pembina.image)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Name */}
                        <h3 className="font-black text-xs sm:text-sm text-emerald-950 leading-snug min-h-[2.2rem] sm:min-h-[2.5rem] flex items-center justify-center">
                          {pembina.name}
                        </h3>

                        {/* Role Badge: Strictly only 'Pembina 1' / 'Pembina 2' */}
                        <div
                          className={`inline-block mt-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-colors ${
                            activePembinaIndex === idx
                              ? "bg-emerald-800 text-white shadow-sm"
                              : "bg-gray-100 text-gray-700 group-hover:bg-gray-200"
                          }`}
                        >
                          {pembina.role}
                        </div>

                        {/* Active Indicator Cue */}
                        {activePembinaIndex === idx && (
                          <span className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block" />
                            <span>Sedang Dibaca</span>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CinematicReveal>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. AGENDA & EVENT TERBARU (3D COVERFLOW SLIDER) ── */}
      {cms.sections.showAgenda && (
        <section className="py-20 sm:py-26 lg:py-30 bg-gradient-to-b from-[#051c14] via-[#07261c] to-[#04120c] text-white relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Header with Smooth Viewport Deceleration */}
            <CinematicReveal direction="up" delay={0.1} className="max-w-3xl mx-auto mb-5 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide mb-3.5 backdrop-blur-md">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{cms.agenda?.tag || "AGENDA KEGIATAN"}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {cms.agenda?.title || "Agenda & Kajian Rohis SMAPA"}
              </h2>

              <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 mx-auto rounded-full mt-3 mb-3.5" />

              <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto leading-relaxed mb-3.5">
                {cms.agenda?.lead ||
                  "Informasi jadwal kegiatan, pembinaan syiar, dan kajian dakwah pelajar di lingkungan SMA Negeri 4 Purwokerto."}
              </p>

              {/* Hint */}
              <p className="text-xs sm:text-sm font-semibold text-amber-300/90 inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
                <span>{cms.agenda?.hintText || "Klik kartu samping atau gunakan tombol panah untuk agenda lain ›"}</span>
              </p>
            </CinematicReveal>

          {/* 3D Coverflow Stage with Smooth Balanced Curves (Like Reference) */}
          <div
            className={`relative -mx-4 sm:mx-auto w-[100vw] sm:w-full max-w-6xl h-[425px] sm:h-[495px] lg:h-[525px] flex items-center justify-center select-none overflow-visible ${
              isAgendaDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              perspective: "1100px",
              perspectiveOrigin: "50% 50%",
              transformStyle: "preserve-3d",
              touchAction: "pan-y",
            }}
            onMouseEnter={() => setIsAgendaPaused(true)}
            onMouseLeave={() => {
              setIsAgendaPaused(false);
              handleCardMouseLeave();
              if (isAgendaDragActiveRef.current) {
                handleAgendaDragEnd();
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
            onTouchStart={(e) => {
              setIsAgendaPaused(true);
              handleAgendaDragStart(e.touches[0].clientX);
            }}
            onTouchMove={(e) => handleAgendaDragMove(e.touches[0].clientX)}
            onTouchEnd={handleAgendaDragEnd}
            onTouchCancel={handleAgendaDragEnd}
          >
            {/* Left Floating Arrow Button */}
            <button
              type="button"
              onClick={prevAgenda}
              aria-label="Agenda Sebelumnya"
              style={{ transform: "translateZ(150px)" }}
              className="absolute left-1.5 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/80 border border-white/25 text-white flex items-center justify-center hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-transform duration-200 shadow-xl cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>

            {/* Right Floating Arrow Button */}
            <button
              type="button"
              onClick={nextAgenda}
              aria-label="Agenda Berikutnya"
              style={{ transform: "translateZ(150px)" }}
              className="absolute right-1.5 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/80 border border-white/25 text-white flex items-center justify-center hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-transform duration-200 shadow-xl cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>

            {/* Cards Slider with Reference Smooth Curves */}
            {eventsList.map((event, idx) => {
              const total = eventsList.length;
              let dist = (idx - agendaIndex + total) % total;
              if (dist > total / 2) dist -= total;

              const isCenter = dist === 0;
              const isLeft = dist === -1;
              const isRight = dist === 1;
              const isVisible = isCenter || isLeft || isRight;

              const currentDrag = isAgendaDragging ? agendaDragOffset : 0;
              const dragAngle = Number(((currentDrag / 300) * 10).toFixed(2));

              // Pure GPU-composited 3D Geometry
              let transform = "";
              let zIndex = 1;
              let opacity = 0;
              let pointerEvents: "auto" | "none" = "none";

              if (isCenter) {
                transform = `translate3d(${currentDrag}px, 0, 45px) rotateY(${cardTilt.x + dragAngle}deg) rotateX(${cardTilt.y}deg) scale(1)`;
                zIndex = 35;
                opacity = 1;
                pointerEvents = "auto";
              } else if (isLeft) {
                transform = `translate3d(calc(-54% + ${currentDrag * 0.65}px), 0, -80px) rotateY(${24 + dragAngle}deg) scale(0.88)`;
                zIndex = 15;
                opacity = 0.62;
                pointerEvents = "auto";
              } else if (isRight) {
                transform = `translate3d(calc(54% + ${currentDrag * 0.65}px), 0, -80px) rotateY(${-24 + dragAngle}deg) scale(0.88)`;
                zIndex = 15;
                opacity = 0.62;
                pointerEvents = "auto";
              } else if (dist < -1) {
                transform = "translate3d(-110%, 0, -180px) rotateY(36deg) scale(0.74)";
                zIndex = 1;
                opacity = 0;
              } else {
                transform = "translate3d(110%, 0, -180px) rotateY(-36deg) scale(0.74)";
                zIndex = 1;
                opacity = 0;
              }

              return (
                <div
                  key={event.id}
                  onClick={() => {
                    if (agendaHasMovedRef.current) return;
                    if (isLeft) prevAgenda();
                    if (isRight) nextAgenda();
                  }}
                  onMouseMove={isCenter && !isAgendaDragging ? handleCardMouseMove : undefined}
                  onMouseLeave={isCenter ? handleCardMouseLeave : undefined}
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
                      : "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  className={`absolute w-[84vw] min-w-[270px] max-w-[340px] sm:w-[410px] sm:max-w-none lg:w-[450px] rounded-[26px] sm:rounded-[32px] overflow-hidden bg-white text-gray-900 border border-white/40 will-change-transform ${
                    isCenter
                      ? "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/30 cursor-default"
                      : "shadow-xl cursor-pointer hover:opacity-85"
                  }`}
                >
                  {/* Photo Header with Category Pill Badge */}
                  <div className="relative h-[160px] sm:h-[195px] lg:h-[215px] w-full overflow-hidden bg-emerald-950">
                    <img
                      draggable={false}
                      decoding="async"
                      src={parseImageCrop(event.image).src}
                      alt={event.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleGoogleDriveImageError(e, event.image)}
                      style={getImageCropStyle(event.image)}
                      className="w-full h-full object-cover select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                    {/* Category Pill Tag (Exact Reference Shape & Color) */}
                    <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 px-3.5 py-1 rounded-full bg-emerald-800/95 backdrop-blur-md border border-white/25 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-md">
                      {event.type || "KAJIAN"}
                    </div>

                    {/* Interactive Autoplay & Slide Counter Pill (Clear across Mobile & PC) */}
                    {isCenter && (
                      <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-30 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsAgendaPaused((prev) => !prev);
                          }}
                          title={isAgendaPaused ? "Lanjutkan putar otomatis" : "Jeda putar otomatis"}
                          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide bg-black/75 hover:bg-black/90 text-emerald-300 border border-white/20 transition-colors shadow-md cursor-pointer"
                        >
                          {isAgendaPaused ? (
                            <>
                              <Pause size={10} className="text-amber-400" />
                              <span className="text-amber-300">Dijeda</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              <span>Otomatis (6s)</span>
                            </>
                          )}
                        </button>
                        <div className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-white/90 bg-black/75 border border-white/20 shadow-md">
                          {idx + 1} / {total}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lightweight Directional Shading on angled side cards */}
                  {isLeft && (
                    <div className="absolute inset-0 bg-black/30 pointer-events-none z-20" />
                  )}
                  {isRight && (
                    <div className="absolute inset-0 bg-black/30 pointer-events-none z-20" />
                  )}

                  {/* Card Content (Clean & Smooth Layout matching Reference) */}
                  <div className="p-4 sm:p-5 lg:p-6 flex flex-col justify-between text-left">
                    <div>
                      {/* Date with Calendar Icon (Clean Line below Image, Exactly like Reference) */}
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-semibold mb-2">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
                        <span className="truncate">
                          {event.date && event.date.includes("-") && event.date.length === 10
                            ? (() => {
                                try {
                                  const d = new Date(event.date);
                                  return !isNaN(d.getTime())
                                    ? d.toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })
                                    : event.date;
                                } catch {
                                  return event.date;
                                }
                              })()
                            : event.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-black text-emerald-950 mb-1.5 leading-snug line-clamp-2">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[11.5px] sm:text-[13px] text-gray-600 line-clamp-2 leading-relaxed mb-3">
                        {event.description}
                      </p>

                      {/* Time & Location in Smooth Rounded Box */}
                      <div className="grid grid-cols-1 gap-1 p-2 sm:p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-900/10 text-[11px] sm:text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="font-semibold text-emerald-950 truncate">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Divider & Action Row */}
                    <div className="pt-2 sm:pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (agendaHasMovedRef.current) return;
                          e.stopPropagation();
                          setSelectedEvent(event as unknown as EventItem);
                        }}
                        className="text-xs sm:text-sm font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 group/btn cursor-pointer whitespace-nowrap"
                      >
                        <span>Lihat Rincian Acara</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 group-hover/btn:translate-x-1 transition-transform shrink-0" />
                      </button>
                      <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-200/80 whitespace-nowrap shrink-0">
                        AGENDA SMAPA
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation & Indicator Dots */}
          <div className="flex items-center justify-center gap-4 mt-5 sm:mt-7 mb-6 sm:mb-7">
            <button
              type="button"
              onClick={prevAgenda}
              aria-label="Sebelumnya"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {eventsList.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAgendaIndex(i)}
                  aria-label={`Pilih Agenda ${i + 1}`}
                  className={`cursor-pointer transition-all duration-300 ${
                    i === agendaIndex
                      ? "w-7 h-2 rounded-full bg-amber-400 shadow-sm"
                      : "w-2 h-2 rounded-full bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextAgenda}
              aria-label="Berikutnya"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Button */}
          <div>
            <Link
              href="/agenda"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black shadow-xl shadow-emerald-950/40 hover:scale-105 transition-all duration-300"
            >
              <span>Lihat Semua Agenda</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ── 6. DOKUMENTASI KEGIATAN PILIHAN SMAPA (3D PARALLAX SHOWCASE) ── */}
      {cms.sections.showGallery && (
        <CinematicReveal direction="up" delay={0.15}>
          <Gallery3DShowcase
            items={(() => {
              const isCmsDefault =
                JSON.stringify(cms.gallery?.items) ===
                JSON.stringify(DEFAULT_HOME_CMS.gallery.items);
              if (!isCmsDefault && cms.gallery?.items && cms.gallery.items.length > 0) {
                return cms.gallery.items;
              }
              if (galleryList.length > 0) {
                return galleryList;
              }
              return cms.gallery?.items && cms.gallery.items.length > 0
                ? cms.gallery.items
                : GALLERY_DATA;
            })()}
            tag={cms.gallery?.tag || "Dokumentasi Kegiatan"}
            title={cms.gallery?.title || "Galeri Syiar & Ukhuwah SMAPA"}
            lead={
              cms.gallery?.lead ||
              "Potret nyata aktivitas pembiasaan ibadah di Musholla Al-Ikhlas, kajian keputrian, dan kegiatan kepemimpinan SMA Negeri 4 Purwokerto."
            }
          />
        </CinematicReveal>
      )}

      {/* ── 6.5. LAYANAN & DIREKTORI DAKWAH (3D COVERFLOW DIRECTORY) ── */}
      <CinematicReveal direction="up" delay={0.15}>
        <Directory3DShowcase />
      </CinematicReveal>

      {/* Event Register Modal */}
      {selectedEvent && (
        <EventRegisterModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <Footer />
    </div>
  );
}
