"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KepengurusanSection from "@/components/KepengurusanSection";
import {
  ScrollProgressBar,
  CinematicReveal,
  CinematicStagger,
  CinematicStaggerItem,
} from "@/components/ScrollAnimations";
import { ABOUT_CONTENT, PEMBINA_WELCOME, SITE } from "@/lib/constants";
import {
  BookOpen,
  Users,
  HeartHandshake,
  ArrowRight,
  MapPin,
  Sparkles,
} from "lucide-react";

const SUB_NAV_ITEMS = [
  { id: "tentang-kami", label: "Tentang Kami", href: "#tentang-kami" },
  { id: "visi-misi", label: "Visi & Misi", href: "#visi-misi" },
  { id: "pembina", label: "Pembina", href: "#pembina" },
  { id: "kepengurusan", label: "Kepengurusan", href: "#kepengurusan" },
];

const MISI_ITEMS = [
  {
    icon: BookOpen,
    text: "Membiasakan ibadah dan tadarus Al-Qur'an di lingkungan sekolah.",
  },
  {
    icon: Sparkles,
    text: "Menyelenggarakan kajian, mentoring, dan pembinaan akhlak secara rutin.",
  },
  {
    icon: Users,
    text: "Mengembangkan kepemimpinan dan kerja sama lewat kepengurusan divisi.",
  },
  {
    icon: HeartHandshake,
    text: "Menumbuhkan kepedulian sosial dan ukhuwah di kalangan siswa.",
  },
];

export default function TentangPage() {
  const prefersReducedMotion = useReducedMotion();
  const [activeSubNav, setActiveSubNav] = useState("tentang-kami");
  const [activePembinaIdx, setActivePembinaIdx] = useState(0);

  const pembinaList = PEMBINA_WELCOME.pembinaList;
  const activePembina = pembinaList[activePembinaIdx] || pembinaList[0];

  return (
    <div className="min-h-screen flex flex-col clay-canvas text-[#153E32]">
      <ScrollProgressBar />
      <Navbar />

      {/* ── 1. PAGE HEADER & 4-TAB CLAY JUMP BAR (Matches 03_profil_visi_misi.png) ── */}
      <section className="pt-24 pb-6 sm:pt-28 sm:pb-8 lg:pt-32 lg:pb-10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CinematicReveal direction="up" delay={0.04}>
            {/* Breadcrumb Pill */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full clay-pill-mint text-xs font-bold mb-4">
              <Link href="/" className="hover:underline text-[#4A6B5F]">
                Beranda
              </Link>
              <span className="text-[#4A6B5F]">/</span>
              <span className="text-[#087A53]">Profil Rohis</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#153E32] tracking-tight mb-3">
              Profil & Kepengurusan Rohis SMAPA
            </h1>

            <p className="text-sm sm:text-base text-[#3B5E52] max-w-2xl mx-auto leading-relaxed">
              Mengenal visi, misi, pembina, dan pengurus Rohis SMA Negeri 4
              Purwokerto.
            </p>

            {/* 4-Tab Clay Sub-Navigation Bar */}
            <div className="mt-6 sm:mt-8 inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-full clay-card max-w-full">
              {SUB_NAV_ITEMS.map((tab) => {
                const isActive = activeSubNav === tab.id;
                return (
                  <a
                    key={tab.id}
                    href={tab.href}
                    onClick={() => setActiveSubNav(tab.id)}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-[13.5px] font-bold transition-all duration-200 whitespace-nowrap min-h-[38px] flex items-center ${
                      isActive
                        ? "clay-btn-emerald text-white"
                        : "text-[#153E32] hover:bg-[#E5F8EF]"
                    }`}
                  >
                    {tab.label}
                  </a>
                );
              })}
            </div>
          </CinematicReveal>
        </div>
      </section>

      {/* ── 2. VISI, PHOTO & MISI UTAMA + TENTANG ROHIS SMAPA (Matches 03_profil_visi_misi.png) ── */}
      <section
        id="visi-misi"
        className="py-4 sm:py-6 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch mb-6 sm:mb-7">
          {/* Left Column: Visi Organisasi Card + Documentary Photo Card */}
          <CinematicReveal
            direction="up"
            delay={0.06}
            className="lg:col-span-5 flex flex-col gap-6 sm:gap-7"
          >
            {/* Visi Organisasi */}
            <div className="clay-card p-6 sm:p-7">
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#153E32] mb-3">
                Visi Organisasi
              </h2>
              <p className="text-sm sm:text-[15.5px] font-medium text-[#2A4E42] leading-relaxed">
                Mewujudkan generasi muslim SMA Negeri 4 Purwokerto yang beriman,
                berilmu, berakhlak mulia, dan bermanfaat bagi lingkungan
                sekolah.
              </p>
            </div>

            {/* Group Photo Clay Frame */}
            <div className="clay-photo-frame p-2.5 flex-1 flex flex-col">
              <div className="relative aspect-[16/10] w-full flex-1 rounded-[18px] overflow-hidden bg-[#E5F2EC] min-h-[210px]">
                <Image
                  src="/images/dokumentasi-smapa.jpg"
                  alt="Keluarga Besar Rohis SMA Negeri 4 Purwokerto"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </CinematicReveal>

          {/* Right Column: Misi Utama Card with 4 Inner Clay Rows */}
          <CinematicReveal
            direction="up"
            delay={0.1}
            className="lg:col-span-7 flex"
          >
            <div className="clay-card p-6 sm:p-8 w-full flex flex-col justify-between">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#153E32] mb-4 sm:mb-5">
                  Misi Utama
                </h2>

                <CinematicStagger className="space-y-3 sm:space-y-3.5">
                  {MISI_ITEMS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <CinematicStaggerItem key={idx}>
                        <div className="clay-inner p-3.5 sm:p-4 flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl clay-icon-sq flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-[#087A53]" />
                          </div>
                          <p className="text-xs sm:text-[14.5px] font-medium text-[#153E32] leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      </CinematicStaggerItem>
                    );
                  })}
                </CinematicStagger>
              </div>
            </div>
          </CinematicReveal>
        </div>

        {/* Full-Width "Tentang Rohis SMAPA" Card (Matches bottom of 03_profil_visi_misi.png) */}
        <CinematicReveal direction="up" delay={0.12}>
          <div
            id="tentang-kami"
            className="clay-card p-6 sm:p-8 scroll-mt-24"
          >
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#153E32] mb-2.5">
              Tentang Rohis SMAPA
            </h2>
            <p className="text-sm sm:text-[15.5px] text-[#3B5E52] leading-relaxed mb-3">
              Rohis SMA Negeri 4 Purwokerto adalah wadah pembinaan keislaman
              siswa yang berpusat di Musholla Al-Ikhlas. Kegiatan dirancang agar
              siswa dapat belajar agama dengan nyaman, bertumbuh dalam
              kebersamaan, dan memberi manfaat nyata.
            </p>
            <p className="text-xs sm:text-sm text-[#4A6B5F] leading-relaxed mb-5">
              {ABOUT_CONTENT.paragraph1}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#DCEAE3]">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full clay-pill-mint text-xs sm:text-[13px] font-bold self-start sm:self-auto">
                <MapPin size={15} className="text-[#087A53] shrink-0" />
                <span>Berpusat di Musholla Al-Ikhlas</span>
              </div>

              <a
                href="#kepengurusan"
                onClick={() => setActiveSubNav("kepengurusan")}
                className="clay-btn-emerald px-5 py-2.5 rounded-full text-xs sm:text-[13.5px] font-bold inline-flex items-center justify-center gap-2 self-start sm:self-auto min-h-[42px]"
              >
                <span>Lihat kepengurusan</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </CinematicReveal>
      </section>

      {/* ── 3. DEWAN PEMBINA SECTION (Matches 04_profil_pengurus.png + Retains Both Pembina) ── */}
      <section
        id="pembina"
        aria-label="Dewan Pembina Rohis"
        className="py-8 sm:py-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24"
      >
        <CinematicReveal direction="up" delay={0.08}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#153E32] tracking-tight">
                Dewan Pembina
              </h2>
              <p className="text-xs sm:text-sm text-[#4A6B5F] mt-1">
                Guru Pembina Kerohanian Islam (ROHIS) SMA Negeri 4 Purwokerto
              </p>
            </div>

            {/* Interactive Switcher for Pembina 1 & Pembina 2 */}
            <div
              role="tablist"
              aria-label="Pilih Pembina"
              className="inline-flex items-center gap-1.5 p-1.5 rounded-full clay-card self-start sm:self-auto"
            >
              {pembinaList.map((p, idx) => {
                const isActive = activePembinaIdx === idx;
                return (
                  <button
                    key={p.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => setActivePembinaIdx(idx)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[38px] ${
                      isActive
                        ? "clay-btn-emerald text-white"
                        : "text-[#3B5E52] hover:text-[#153E32]"
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Pembina Clay Card (Exact Composition of 04_profil_pengurus.png) */}
          <div className="clay-card p-5 sm:p-7 lg:p-8">
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
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
              >
                {/* Left: Portrait Photo + Name & Role Pill */}
                <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-36 h-40 sm:w-40 sm:h-44 rounded-[20px] overflow-hidden clay-photo-frame p-1.5 shrink-0">
                    <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#E5F2EC]">
                      <Image
                        src={activePembina.image}
                        alt={activePembina.name}
                        fill
                        sizes="160px"
                        className="object-cover object-top"
                      />
                    </div>
                  </div>

                  <div className="text-center sm:text-left">
                    <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#153E32] leading-snug mb-2">
                      {activePembina.name}
                    </h3>
                    <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold clay-pill-mint mb-2">
                      Pembina ROHIS SMAN 4 Purwokerto
                    </span>
                    <p className="text-xs font-medium text-[#4A6B5F]">
                      {activePembina.role} • Masa Bakti {SITE.period}
                    </p>
                  </div>
                </div>

                {/* Right: Sambutan Pembina Inner Clay Card */}
                <div className="lg:col-span-7">
                  <div className="clay-inner p-5 sm:p-6">
                    <h4 className="font-heading text-base sm:text-lg font-extrabold text-[#153E32] mb-2">
                      Sambutan Pembina
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold text-[#087A53] mb-2">
                      {activePembina.salamPembuka}
                    </p>
                    <div className="space-y-2.5 text-xs sm:text-[14px] text-[#3B5E52] leading-relaxed">
                      {activePembina.paragraphs.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#153E32] mt-3">
                      {activePembina.salamPenutup}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Quick Dual Pembina Cards Strip Below so both Pembina are always visible at a glance */}
            <div className="mt-6 pt-5 border-t border-[#DCEAE3] grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {pembinaList.map((pembina, idx) => {
                const isSelected = activePembinaIdx === idx;
                return (
                  <button
                    key={pembina.id}
                    type="button"
                    onClick={() => setActivePembinaIdx(idx)}
                    className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "clay-card-mint ring-2 ring-[#087A53]/30"
                        : "clay-inner hover:bg-[#EAF8F1]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#E5F2EC] shrink-0">
                        <Image
                          src={pembina.image}
                          alt={pembina.name}
                          fill
                          sizes="48px"
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading text-xs sm:text-sm font-extrabold text-[#153E32] truncate">
                          {pembina.name}
                        </p>
                        <p className="text-[11px] font-semibold text-[#087A53]">
                          {pembina.role} ROHIS SMAN 4 Purwokerto
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#087A53] shrink-0">
                      {isSelected ? "Aktif" : "Baca sambutan →"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </CinematicReveal>
      </section>

      {/* ── 4. KENALI PENGURUS KAMI (Matches 04_profil_pengurus.png) ── */}
      <KepengurusanSection />

      <Footer />
    </div>
  );
}
