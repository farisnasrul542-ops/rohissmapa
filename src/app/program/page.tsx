"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ScrollProgressBar,
  CinematicReveal,
} from "@/components/ScrollAnimations";
import { DIVISIONS, SITE } from "@/lib/constants";
import {
  CheckCircle2,
  Users,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  BookOpen,
  Newspaper,
  Building,
  Layers,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const DIVISION_ICONS: Record<string, React.ElementType> = {
  ShieldCheck,
  BookOpen,
  Users,
  HeartHandshake,
  Newspaper,
  Building,
};

const DIVISION_META: Record<
  string,
  {
    shortSubtitle: string;
    coverImage: string;
    featuredTitle: string;
    featuredDesc: string;
  }
> = {
  bph: {
    shortSubtitle: "Badan Pengurus Harian",
    coverImage: "/images/dokumentasi-muskerta.jpg",
    featuredTitle: "Musyawarah Kerja Anggota (MUSKERTA) & Pleno Evaluasi",
    featuredDesc:
      "Perumusan grand design dakwah sekolah, koordinasi lintas divisi, tata kelola kesekretariatan, dan transparansi kas organisasi.",
  },
  pendidikan: {
    shortSubtitle: "Pendidikan & Syiar",
    coverImage: "/images/dokumentasi-smapa.jpg",
    featuredTitle: "Kajian Rutin Jumat & Bimbingan Tahsin Al-Qur'an",
    featuredDesc:
      "Kajian keislaman mingguan, gerakan shalat dhuha dan tadarus pagi, serta pembinaan pemahaman ibadah pelajar SMAPA.",
  },
  kaderisasi: {
    shortSubtitle: "Kaderisasi & SDM",
    coverImage: "/images/rohis-akhdir-38.jpg",
    featuredTitle: "Latihan Dasar Kepemimpinan Rohis (LDKR) & Mentoring",
    featuredDesc:
      "Regenerasi kepemimpinan kader, Masa Ta'aruf Anggota Baru (MTA), dan lingkaran halaqah mentoring pekanan.",
  },
  humas: {
    shortSubtitle: "Hubungan Masyarakat",
    coverImage: "/images/galeri-sman4-menolong.jpg",
    featuredTitle: "SMAN 4 Menolong & Jejaring Ukhuwah Antarsekolah",
    featuredDesc:
      "Sinergi kegiatan bersama OSIS-MPK, silaturahmi FKMI se-Banyumas, serta aksi bakti sosial dan santunan kemanusiaan.",
  },
  perpusmed: {
    shortSubtitle: "Perpustakaan & Media",
    coverImage: "/images/galeri-item-3.jpg",
    featuredTitle: "Publikasi Syiar Digital & Pojok Literasi Musholla",
    featuredDesc:
      "Pengelolaan perpustakaan islami Musholla Al-Ikhlas, penerbitan mading dakwah, serta dokumentasi kreatif seluruh kegiatan.",
  },
  sarpras: {
    shortSubtitle: "Sarana & Prasarana",
    coverImage: "/images/event-3.jpg",
    featuredTitle: "Kemakmuran & Inventaris Musholla Al-Ikhlas",
    featuredDesc:
      "Pemeliharaan kebersihan ruang ibadah, peremajaan mushaf Al-Qur'an dan perlengkapan shalat, serta kesiapan logistik acara.",
  },
};

const FILTER_OPTIONS = [
  "Semua",
  "BPH",
  "Pendidikan",
  "Kaderisasi",
  "Humas",
  "Perpusmed",
  "Sarpras",
] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function ProgramPage() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedFilter, setSelectedFilter] = useState<string>("Semua");
  const [activeDetailId, setActiveDetailId] = useState<string>("pendidikan");

  const filteredDivisions = useMemo(() => {
    if (selectedFilter === "Semua") return DIVISIONS;
    return DIVISIONS.filter(
      (prog) =>
        prog.shortName.toLowerCase() === selectedFilter.toLowerCase() ||
        prog.id.toLowerCase() === selectedFilter.toLowerCase()
    );
  }, [selectedFilter]);

  const activeDetailDivision = useMemo(() => {
    if (selectedFilter !== "Semua") {
      const matched = DIVISIONS.find(
        (d) =>
          d.shortName.toLowerCase() === selectedFilter.toLowerCase() ||
          d.id.toLowerCase() === selectedFilter.toLowerCase()
      );
      if (matched) return matched;
    }
    return (
      DIVISIONS.find((d) => d.id === activeDetailId) ||
      DIVISIONS[1] ||
      DIVISIONS[0]
    );
  }, [selectedFilter, activeDetailId]);

  const activeMeta =
    DIVISION_META[activeDetailDivision.id] || DIVISION_META.pendidikan;

  const handleSelectDivisionDetail = (divId: string) => {
    setActiveDetailId(divId);
    const el = document.getElementById("rincian-program");
    if (el) {
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col clay-canvas text-[#153E32]">
      <ScrollProgressBar />
      <Navbar />

      {/* ── 1. HEADER HERO & STATS PILLS (Matches 05_divisi_ringkasan.png) ── */}
      <section className="pt-24 pb-6 sm:pt-28 sm:pb-8 lg:pt-32 lg:pb-10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Title, Subtitle, Description & 3 Clay Stat Pills */}
            <CinematicReveal
              direction="up"
              delay={0.04}
              className="lg:col-span-7"
            >
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#153E32] tracking-tight leading-[1.1] mb-2">
                6 Pilar Divisi & Program Kerja
              </h1>
              <p className="text-xs sm:text-sm font-bold text-[#087A53] mb-3">
                Rohis SMAPA • Masa Bakti {SITE.period}
              </p>
              <p className="text-sm sm:text-base text-[#3B5E52] leading-relaxed max-w-2xl mb-6">
                Rancangan kegiatan dan pembagian peran pengurus untuk mendukung
                syiar, pembinaan, dan pelayanan di sekolah.
              </p>

              {/* 3 Clay Stat Pills */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
                <div className="clay-card px-3.5 py-2.5 sm:px-4 sm:py-3 inline-flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl clay-icon-sq flex items-center justify-center shrink-0">
                    <Layers size={16} className="text-[#087A53]" />
                  </span>
                  <span className="font-heading text-xs sm:text-sm font-extrabold text-[#153E32]">
                    6 Divisi
                  </span>
                </div>

                <div className="clay-card px-3.5 py-2.5 sm:px-4 sm:py-3 inline-flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl clay-icon-sq flex items-center justify-center shrink-0">
                    <Users size={16} className="text-[#087A53]" />
                  </span>
                  <span className="font-heading text-xs sm:text-sm font-extrabold text-[#153E32]">
                    44 Pengurus
                  </span>
                </div>

                <div className="clay-card px-3.5 py-2.5 sm:px-4 sm:py-3 inline-flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl clay-icon-sq flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-[#087A53]" />
                  </span>
                  <span className="font-heading text-xs sm:text-sm font-extrabold text-[#153E32]">
                    Musholla Al-Ikhlas
                  </span>
                </div>
              </div>
            </CinematicReveal>

            {/* Right Column: Documentary Photo Frame */}
            <CinematicReveal
              direction="up"
              delay={0.1}
              className="lg:col-span-5"
            >
              <div className="clay-photo-frame p-2.5">
                <div className="relative aspect-[16/10] w-full rounded-[18px] overflow-hidden bg-[#E5F2EC]">
                  <Image
                    src="/images/dokumentasi-smapa.jpg"
                    alt="Pengurus Divisi Rohis SMA Negeri 4 Purwokerto"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center"
                    priority
                  />
                </div>
              </div>
            </CinematicReveal>
          </div>
        </div>
      </section>

      {/* ── 2. FILTER DIVISI BAR & 6 DIVISION OVERVIEW CARDS (Matches 05_divisi_ringkasan.png) ── */}
      <section
        aria-label="Daftar Divisi Rohis SMAPA"
        className="py-4 sm:py-6 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        {/* Filter Divisi Clay Bar */}
        <CinematicReveal direction="up" delay={0.08}>
          <div className="clay-card p-3 sm:p-4 mb-7 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#153E32] px-2 shrink-0">
              Filter Divisi:
            </span>
            <div
              data-lenis-prevent="true"
              onWheel={(e) => {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 overscroll-contain"
            >
              {FILTER_OPTIONS.map((tab) => {
                const isActive = selectedFilter === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(tab);
                      if (tab !== "Semua") {
                        const found = DIVISIONS.find(
                          (d) =>
                            d.shortName.toLowerCase() === tab.toLowerCase()
                        );
                        if (found) setActiveDetailId(found.id);
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all duration-200 whitespace-nowrap cursor-pointer min-h-[38px] ${
                      isActive
                        ? "clay-btn-emerald text-white"
                        : "clay-btn-mint text-[#153E32]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </CinematicReveal>

        {/* 6 Division Summary Cards Grid (3-col Desktop, 2-col Mobile/Tablet) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFilter}
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {filteredDivisions.map((prog) => {
              const IconComponent = DIVISION_ICONS[prog.icon] || Layers;
              const meta = DIVISION_META[prog.id] || DIVISION_META.bph;

              return (
                <article
                  key={prog.id}
                  className="clay-card clay-card-hover p-3.5 sm:p-4 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Cover Image */}
                    <div className="relative h-40 sm:h-44 w-full rounded-[16px] overflow-hidden bg-[#E5F2EC] mb-3.5">
                      <Image
                        src={meta.coverImage}
                        alt={prog.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-103"
                      />
                    </div>

                    {/* Icon Squircle + Division Name + Subtitle */}
                    <div className="flex items-center gap-3 px-1 mb-2.5">
                      <div className="w-11 h-11 rounded-2xl clay-icon-sq flex items-center justify-center shrink-0">
                        <IconComponent size={20} className="text-[#087A53]" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-[#153E32] leading-tight truncate">
                          {prog.shortName}
                        </h2>
                        <p className="text-xs font-semibold text-[#4A6B5F] truncate">
                          {meta.shortSubtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="px-1 text-xs sm:text-[13.5px] text-[#3B5E52] leading-relaxed line-clamp-3 mb-4">
                      {prog.description}
                    </p>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="px-1 pt-3 border-t border-[#DCEAE3] flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#4A6B5F]">
                      {prog.members.length} Pengurus
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectDivisionDetail(prog.id)}
                      className="clay-btn-emerald px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer min-h-[38px]"
                    >
                      <span>Lihat program</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── 3. RINCIAN PROGRAM DIVISI & TIM PELAKSANA (Matches 06_divisi_program.png) ── */}
      <section
        id="rincian-program"
        aria-label="Rincian Program Divisi"
        className="py-10 sm:py-14 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24"
      >
        <CinematicReveal direction="up" delay={0.08}>
          {/* Division Detail Selector Bar */}
          <div className="clay-card p-3 sm:p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#153E32] px-2 shrink-0">
              Pilih Rincian Divisi:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {DIVISIONS.map((div) => {
                const isSelected = activeDetailDivision.id === div.id;
                return (
                  <button
                    key={div.id}
                    type="button"
                    onClick={() => {
                      setActiveDetailId(div.id);
                      if (selectedFilter !== "Semua") {
                        setSelectedFilter(div.shortName);
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all duration-200 whitespace-nowrap cursor-pointer min-h-[38px] ${
                      isSelected
                        ? "clay-btn-emerald text-white"
                        : "clay-btn-mint text-[#153E32]"
                    }`}
                  >
                    {div.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Active Division Detail Card (Exact Composition of 06_divisi_program.png) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDetailDivision.id}
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -4 }
              }
              transition={{
                duration: prefersReducedMotion ? 0.05 : 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="space-y-6"
            >
              <div className="clay-card p-5 sm:p-7 lg:p-8">
                <div className="mb-5 pb-4 border-b border-[#DCEAE3] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#153E32] tracking-tight">
                      Program Divisi {activeDetailDivision.shortName}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#3B5E52] mt-1">
                      {activeDetailDivision.name} • Koordinator:{" "}
                      <strong className="text-[#153E32]">
                        {activeDetailDivision.coordinator}
                      </strong>
                    </p>
                  </div>
                  <span className="clay-pill-mint px-3.5 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto">
                    Masa Bakti {SITE.period}
                  </span>
                </div>

                {/* 3-Col Layout: Photo Left | Program Unggulan Middle | Tim Pelaksana Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left: Photo */}
                  <div className="lg:col-span-4 flex flex-col">
                    <div className="clay-photo-frame p-2 flex-1 flex flex-col">
                      <div className="relative aspect-[4/3] lg:aspect-auto lg:flex-1 w-full rounded-[16px] overflow-hidden bg-[#E5F2EC] min-h-[200px]">
                        <Image
                          src={activeMeta.coverImage}
                          alt={activeDetailDivision.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Middle: Program Unggulan Checklist */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-base sm:text-lg font-extrabold text-[#153E32] mb-3">
                        Program Unggulan
                      </h3>
                      <div className="space-y-2.5">
                        {activeDetailDivision.programs.map((progText, idx) => (
                          <div
                            key={idx}
                            className="clay-inner p-3.5 flex items-start gap-3"
                          >
                            <span className="w-7 h-7 rounded-full clay-icon-sq flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2
                                size={15}
                                className="text-[#087A53]"
                              />
                            </span>
                            <span className="text-xs sm:text-[13.5px] font-semibold text-[#153E32] leading-snug">
                              {progText}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Tim Pelaksana Card */}
                  <div className="lg:col-span-3 flex">
                    <div className="clay-inner p-5 w-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h3 className="font-heading text-base font-extrabold text-[#153E32]">
                            Tim Pelaksana
                          </h3>
                          <span className="clay-pill-mint px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                            {activeDetailDivision.members.length} Pengurus
                          </span>
                        </div>

                        {/* Avatar Stack */}
                        <div className="flex items-center -space-x-2 overflow-hidden py-2 mb-2">
                          {activeDetailDivision.members
                            .slice(0, 5)
                            .map((member) => (
                              <div
                                key={member.id}
                                title={`${member.name} (${member.role})`}
                                className="w-9 h-9 rounded-full clay-pill-white border-2 border-white flex items-center justify-center text-[11px] font-extrabold text-[#087A53] shrink-0"
                              >
                                {getInitials(member.name)}
                              </div>
                            ))}
                          {activeDetailDivision.members.length > 5 && (
                            <div className="w-9 h-9 rounded-full clay-btn-emerald border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                              +{activeDetailDivision.members.length - 5}
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-[#3B5E52] leading-relaxed mb-4">
                          Tim yang mengoordinasikan dan menjalankan program
                          kerja {activeDetailDivision.shortName} di lingkungan
                          SMAN 4 Purwokerto.
                        </p>
                      </div>

                      <Link
                        href="/tentang#kepengurusan"
                        className="clay-btn-emerald w-full py-2.5 px-4 rounded-full text-xs font-bold inline-flex items-center justify-center gap-1.5 min-h-[40px]"
                      >
                        <span>Lihat pengurus</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Member Roster Pills for the Selected Division */}
                <div className="mt-6 pt-5 border-t border-[#DCEAE3]">
                  <h4 className="font-heading text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#3B5E52] mb-3">
                    Daftar Anggota Divisi {activeDetailDivision.shortName} (
                    {activeDetailDivision.members.length} Pengurus)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {activeDetailDivision.members.map((m) => {
                      const igClean = m.instagram
                        ? m.instagram.replace(/^@/, "")
                        : "";
                      return (
                        <div
                          key={m.id}
                          className="clay-inner p-3 flex items-center justify-between gap-2.5"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl clay-icon-sq flex items-center justify-center text-xs font-extrabold shrink-0">
                              {getInitials(m.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#153E32] truncate">
                                {m.name}
                              </p>
                              <p className="text-[11px] text-[#4A6B5F] truncate">
                                {m.role} • {m.classGrade}
                              </p>
                            </div>
                          </div>

                          {igClean && (
                            <a
                              href={`https://instagram.com/${igClean}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Instagram @${igClean}`}
                              className="px-2.5 py-1 rounded-full clay-pill-mint text-[10px] font-bold inline-flex items-center gap-1 shrink-0 hover:opacity-85"
                            >
                              <span>@{igClean}</span>
                              <ArrowUpRight size={10} />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Featured Program Card Below (Matches 06_divisi_program.png) */}
              <div className="clay-card p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-4">
                    <div className="relative h-44 w-full rounded-[16px] overflow-hidden bg-[#E5F2EC]">
                      <Image
                        src={activeMeta.coverImage}
                        alt={activeMeta.featuredTitle}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold clay-pill-mint mb-2">
                        Fokus Kegiatan {activeDetailDivision.shortName}
                      </span>
                      <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#153E32] mb-1.5">
                        {activeMeta.featuredTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#3B5E52] leading-relaxed max-w-xl">
                        {activeMeta.featuredDesc}
                      </p>
                    </div>
                    <Link
                      href="/agenda"
                      className="clay-btn-emerald px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-bold inline-flex items-center gap-1.5 shrink-0 self-start sm:self-center min-h-[40px]"
                    >
                      <span>Lihat jadwal</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Suggestion CTA Clay Bar (Matches bottom of 06_divisi_program.png) */}
          <div className="mt-6 clay-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-base sm:text-lg font-extrabold text-[#153E32]">
                Punya usulan kegiatan?
              </h3>
              <p className="text-xs sm:text-sm text-[#3B5E52] mt-0.5">
                Sampaikan saran untuk kegiatan Rohis SMAN 4 Purwokerto ke depan.
              </p>
            </div>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn-emerald px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-bold inline-flex items-center gap-2 shrink-0 min-h-[42px]"
            >
              <span>Hubungi Pengurus Rohis</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </CinematicReveal>
      </section>

      <Footer />
    </div>
  );
}
