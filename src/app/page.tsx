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
  ShieldCheck,
  Building,
  Send,
  CheckCircle2,
  Quote,
  ImageIcon,
  BookOpen,
  Award,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activePembinaIndex, setActivePembinaIndex] = useState(0);
  const [agendaIndex, setAgendaIndex] = useState(0);
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
            setEventsList(parsed);
          }
        }
      } catch {}
    };

    loadCms();
    loadEvents();

    // Tarik data terbaru dari Cloud Sync (menghubungkan workers.dev -> rohis-sman4pwt.web.id)
    pullCloudSync().then((synced) => {
      if (!synced) return;
      if (synced.rohis_home_cms) {
        setCms(normalizeHomeCms(synced.rohis_home_cms));
      }
      if (Array.isArray(synced.rohis_admin_events) && synced.rohis_admin_events.length > 0) {
        setEventsList(synced.rohis_admin_events);
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
              {/* Live Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold mb-6 backdrop-blur-md shadow-lg shadow-emerald-950/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{cms.hero.tag || SITE.heroTag}</span>
              </div>

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

              {/* Architectural 3-Column Info Cards (Boxy / Non-Lonjong, All-DPI Responsive & Admin-Synced) */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-emerald-800/40 grid grid-cols-3 gap-2 sm:gap-3">
                <div className="relative p-2.5 sm:p-3.5 rounded-lg bg-[#07261c]/85 border border-emerald-700/45 border-l-2 border-l-amber-400/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-left transition-colors hover:border-emerald-500/50">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md bg-emerald-950/90 border border-amber-400/25 flex items-center justify-center text-amber-400 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[8.5px] sm:text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/75 leading-tight truncate">
                      {cms.hero?.infoLabel1 || "STATUS ORGANISASI"}
                    </span>
                    <span className="block text-[11px] sm:text-xs lg:text-[13px] font-black text-white leading-snug mt-0.5 line-clamp-2 sm:truncate">
                      {cms.hero?.infoValue1 || "Ekstrakurikuler Resmi"}
                    </span>
                  </div>
                </div>

                <div className="relative p-2.5 sm:p-3.5 rounded-lg bg-[#07261c]/85 border border-emerald-700/45 border-l-2 border-l-amber-400/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-left transition-colors hover:border-emerald-500/50">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md bg-emerald-950/90 border border-amber-400/25 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[8.5px] sm:text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/75 leading-tight truncate">
                      {cms.hero?.infoLabel2 || "PUSAT KEGIATAN"}
                    </span>
                    <span className="block text-[11px] sm:text-xs lg:text-[13px] font-black text-white leading-snug mt-0.5 line-clamp-2 sm:truncate">
                      {cms.hero?.infoValue2 || "Musholla Al-Ikhlas"}
                    </span>
                  </div>
                </div>

                <div className="relative p-2.5 sm:p-3.5 rounded-lg bg-[#07261c]/85 border border-emerald-700/45 border-l-2 border-l-amber-400/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-left transition-colors hover:border-emerald-500/50">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md bg-emerald-950/90 border border-amber-400/25 flex items-center justify-center text-amber-400 shrink-0">
                    <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[8.5px] sm:text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/75 leading-tight truncate">
                      {cms.hero?.infoLabel3 || "NAUNGAN SEKOLAH"}
                    </span>
                    <span className="block text-[11px] sm:text-xs lg:text-[13px] font-black text-white leading-snug mt-0.5 line-clamp-2 sm:truncate">
                      {cms.hero?.infoValue3 || "SMAN 4 Purwokerto"}
                    </span>
                  </div>
                </div>
              </div>
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

                  {/* Gradient Overlay at bottom for clear text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 via-45% to-transparent pointer-events-none" />

                  {/* Top-Right Badge (Matching Gambar 1) */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#1b3d30]/90 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[11px] font-black tracking-wider uppercase shadow-lg">
                      RBC X PECETIKAH
                    </span>
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 text-left">
                    {/* Location Badge */}
                    <div className="flex items-center gap-1.5 text-xs font-black tracking-wider text-amber-400 mb-1.5 uppercase drop-shadow">
                      <span>📍</span>
                      <span>SMAN 4 PURWOKERTO</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-1.5 uppercase drop-shadow-md">
                      ROHIS AKHDIR 38
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-[13px] text-emerald-100/90 leading-relaxed font-medium line-clamp-2 drop-shadow">
                      Pertemuan akbar dan kaderisasi generasi ke-38 Rohis SMA Negeri 4 Purwokerto dalam merajut ukhuwah dan agenda keumatan.
                    </p>
                  </div>
                </div>

                {/* Bottom Meta Information (Matching Gambar 1) */}
                <div className="mt-4 flex items-center justify-between text-[11px] sm:text-xs font-extrabold text-emerald-300/75 tracking-wider uppercase px-2 w-full">
                  <span>RESMI • LOMBA TINGKAT KAB</span>
                  <span>2026 • PURWOKERTO</span>
                  <span>15+ SMA / SMK / MA</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* ── 2. LIVE METRICS & STATS WITH SMOOTH COUNTERS & STAGGER ── */}
      {cms.sections.showStats && (
        <section className="relative z-20 -mt-10 sm:-mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 border border-emerald-900/10">
            <CinematicStagger className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {(cms.stats || ORG_STATS).map((stat: any, idx: number) => (
                <CinematicStaggerItem
                  key={stat.label || idx}
                  className={`flex flex-col justify-center ${
                    idx !== 0 ? "lg:border-l lg:border-gray-100 lg:pl-6" : ""
                  }`}
                >
                  <div className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
                    <AnimatedCounter
                      value={typeof stat.value === "number" ? stat.value : parseInt(stat.value, 10) || 0}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-700 mt-1">{stat.label}</div>
                </CinematicStaggerItem>
              ))}
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
        <section className="py-24 sm:py-28 lg:py-32 bg-gradient-to-b from-[#051c14] via-[#07261c] to-[#04120c] text-white relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Header with Smooth Viewport Deceleration */}
            <CinematicReveal direction="up" delay={0.1} className="max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide mb-4 backdrop-blur-md">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{cms.agenda?.tag || "AGENDA KEGIATAN"}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {cms.agenda?.title || "Agenda & Kajian Rohis SMAPA"}
              </h2>

              <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 mx-auto rounded-full mt-3 mb-4" />

              <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto leading-relaxed mb-4">
                {cms.agenda?.lead ||
                  "Informasi jadwal kegiatan, pembinaan syiar, dan kajian dakwah pelajar di lingkungan SMA Negeri 4 Purwokerto."}
              </p>

              {/* Hint as in reference image */}
              <p className="text-xs sm:text-sm font-semibold text-amber-300/90 inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>{cms.agenda?.hintText || "Klik kartu samping atau gunakan tombol panah untuk agenda lain ›"}</span>
              </p>
            </CinematicReveal>

          {/* 3D Coverflow Stage with Hardware-Accelerated 60/120fps Touch Physics */}
          <div
            className={`relative -mx-4 sm:mx-auto w-[100vw] sm:w-full max-w-6xl h-[495px] sm:h-[600px] flex items-center justify-center select-none overflow-visible ${
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
            onTouchStart={(e) => handleAgendaDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleAgendaDragMove(e.touches[0].clientX)}
            onTouchEnd={handleAgendaDragEnd}
            onTouchCancel={handleAgendaDragEnd}
          >
            {/* Left Floating Arrow Button (Elevated in 3D Z-space so it never hides behind cards) */}
            <button
              type="button"
              onClick={prevAgenda}
              aria-label="Agenda Sebelumnya"
              style={{ transform: "translateZ(150px)" }}
              className="absolute left-2.5 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/80 border border-white/25 text-white flex items-center justify-center hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-transform duration-200 shadow-xl cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Floating Arrow Button (Elevated in 3D Z-space so it never hides behind cards) */}
            <button
              type="button"
              onClick={nextAgenda}
              aria-label="Agenda Berikutnya"
              style={{ transform: "translateZ(150px)" }}
              className="absolute right-2.5 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/80 border border-white/25 text-white flex items-center justify-center hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-transform duration-200 shadow-xl cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Cards Slider with Lightweight GPU-Composited 3D Transforms */}
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

              // Pure GPU-composited 3D Geometry (transform + opacity only, no CSS filter blur)
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
                transform = `translate3d(calc(-62% + ${currentDrag * 0.65}px), 0, -75px) rotateY(${26 + dragAngle}deg) scale(0.86)`;
                zIndex = 15;
                opacity = 0.62;
                pointerEvents = "auto";
              } else if (isRight) {
                transform = `translate3d(calc(62% + ${currentDrag * 0.65}px), 0, -75px) rotateY(${-26 + dragAngle}deg) scale(0.86)`;
                zIndex = 15;
                opacity = 0.62;
                pointerEvents = "auto";
              } else if (dist < -1) {
                transform = "translate3d(-115%, 0, -180px) rotateY(38deg) scale(0.72)";
                zIndex = 1;
                opacity = 0;
              } else {
                transform = "translate3d(115%, 0, -180px) rotateY(-38deg) scale(0.72)";
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
                  className={`absolute w-[68vw] min-w-[210px] max-w-[300px] sm:w-[390px] sm:max-w-none lg:w-[435px] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-white text-gray-900 border-[2px] border-white/30 will-change-transform ${
                    isCenter
                      ? "shadow-2xl ring-2 ring-white/15 cursor-default"
                      : "shadow-xl cursor-pointer hover:opacity-85"
                  }`}
                >
                  {/* Photo Header with Category Badge */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-emerald-950">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Category Pill Tag */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-black/80 border border-white/25 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md">
                      {event.type}
                    </div>
                  </div>

                  {/* Lightweight Directional Shading on angled side cards */}
                  {isLeft && (
                    <div className="absolute inset-0 bg-black/30 pointer-events-none z-20" />
                  )}
                  {isRight && (
                    <div className="absolute inset-0 bg-black/30 pointer-events-none z-20" />
                  )}

                  {/* Card Content */}
                  <div className="p-4 sm:p-6 lg:p-7 flex flex-col justify-between text-left">
                    <div>
                      {/* Date Row */}
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-amber-700 mb-1.5 sm:mb-2">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                        <span>{event.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-[14px] sm:text-lg font-black text-emerald-950 mb-1.5 sm:mb-2.5 leading-snug line-clamp-2">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[11px] sm:text-[13px] text-gray-600 line-clamp-2 leading-relaxed mb-3 sm:mb-4">
                        {event.description}
                      </p>

                      {/* Time & Location */}
                      <div className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-gray-500 mb-3.5 sm:mb-5">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Divider & Action Button */}
                    <div className="pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (agendaHasMovedRef.current) return;
                          e.stopPropagation();
                          setSelectedEvent(event as unknown as EventItem);
                        }}
                        className="text-[11px] sm:text-sm font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1 sm:gap-1.5 group/btn cursor-pointer whitespace-nowrap"
                      >
                        <span>Lihat Rincian Acara</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 group-hover/btn:translate-x-1.5 transition-transform shrink-0" />
                      </button>
                      <span className="text-[8.5px] sm:text-[10px] uppercase font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap shrink-0">
                        Agenda SMAPA
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation & Indicator Dots */}
          <div className="flex items-center justify-center gap-4 mt-8 mb-8">
            <button
              type="button"
              onClick={prevAgenda}
              aria-label="Sebelumnya"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110 cursor-pointer"
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
                      ? "w-8 h-2.5 rounded-full bg-amber-400 shadow-sm"
                      : "w-2.5 h-2.5 rounded-full bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextAgenda}
              aria-label="Berikutnya"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Button (Exact match to Gambar 1: "Lihat Semua Agenda") */}
          <div>
            <Link
              href="/agenda"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black shadow-xl shadow-emerald-950/40 hover:scale-105 hover:shadow-2xl transition-all duration-300"
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
            items={
              cms.gallery?.items && cms.gallery.items.length > 0
                ? cms.gallery.items
                : GALLERY_DATA
            }
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
