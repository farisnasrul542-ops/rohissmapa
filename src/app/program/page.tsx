"use client";

import React, { useState, useMemo, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScrollProgressBar, CinematicReveal } from "@/components/ScrollAnimations";
import { DIVISIONS } from "@/lib/constants";
import {
  CheckCircle2,
  Users,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  BookOpen,
  Newspaper,
  Building,
  Award,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import Link from "next/link";

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
    pilar: string;
    subtitle: string;
  }
> = {
  bph: {
    pilar: "PILAR 01 • EKSEKUTIF & MANAJEMEN",
    subtitle: "Pimpinan Pusat, Administrasi Kesekretariatan & Kebendaharaan",
  },
  pendidikan: {
    pilar: "PILAR 02 • SYIAR & KEILMUAN",
    subtitle: "Kajian Rutin, Tahsin Al-Qur'an & Pembinaan Ibadah Pelajar",
  },
  kaderisasi: {
    pilar: "PILAR 03 • REGENERASI & SDM",
    subtitle: "LDKR, Masa Ta'aruf Siswa Baru & Halaqah Mentoring",
  },
  humas: {
    pilar: "PILAR 04 • KEMITRAAN & SOSIAL",
    subtitle: "Jejaring Eksternal, Sinergi Sekolah & Aksi Bakti Sosial",
  },
  perpusmed: {
    pilar: "PILAR 05 • LITERASI & MEDIA KREATIF",
    subtitle: "Publikasi Digital, Dokumentasi Visual & Pojok Literasi Islam",
  },
  sarpras: {
    pilar: "PILAR 06 • KEMAKMURAN MUSHOLLA",
    subtitle: "Pemeliharaan Musholla Al-Ikhlas, Inventaris & Logistik Acara",
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

const TAB_OPTIONS = [
  "Semua",
  "BPH",
  "Pendidikan",
  "Kaderisasi",
  "Humas",
  "Perpusmed",
  "Sarpras",
] as const;

function Division3DCard({ prog }: { prog: (typeof DIVISIONS)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 30, isHovered: false });

  const IconComponent = DIVISION_ICONS[prog.icon] || Layers;
  const meta = DIVISION_META[prog.id] || DIVISION_META.bph;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = Number(((x - 0.5) * 4.5).toFixed(2));
    const rotateX = Number(((0.5 - y) * 3.5).toFixed(2));

    setTilt({
      rotateX,
      rotateY,
      glareX: Math.round(x * 100),
      glareY: Math.round(y * 100),
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 30, isHovered: false });
  };

  return (
    <div
      id={prog.id}
      style={{ perspective: "1600px" }}
      className="w-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: tilt.isHovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(4px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transformStyle: "preserve-3d",
          transition: tilt.isHovered
            ? "transform 160ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms ease"
            : "transform 550ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 500ms ease",
        }}
        className="relative bg-white rounded-[32px] border border-slate-200/90 border-b-[5px] border-b-emerald-950/20 shadow-[0_22px_50px_-14px_rgba(6,32,23,0.12),0_4px_14px_-2px_rgba(6,32,23,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_32px_65px_-16px_rgba(6,32,23,0.18),0_8px_20px_-4px_rgba(6,32,23,0.08)] overflow-hidden group will-change-transform"
      >
        {/* Dynamic 3D Specular Light Sheen */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: tilt.isHovered ? 1 : 0,
            background: `radial-gradient(650px circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(16, 185, 129, 0.055), transparent 60%)`,
          }}
        />

        {/* Subtle Architectural Top Trim (Single Monochrome Deep Emerald) */}
        <div className="h-1 w-full bg-gradient-to-r from-[#062017] via-emerald-800 to-[#062017]" />

        {/* ── CARD HEADER ── */}
        <div
          style={{ transform: "translateZ(18px)" }}
          className="p-6 sm:p-8 lg:px-10 lg:pt-8 lg:pb-7 bg-gradient-to-b from-slate-50/90 to-white border-b border-slate-200/70"
        >
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            {/* Left: 3D Pedestal Icon + Pilar Tag + Title */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              {/* 3D Extruded Icon Cube */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-white flex items-center justify-center border border-emerald-700/40 border-b-[3.5px] border-b-[#020d09] shadow-[0_12px_24px_-6px_rgba(6,32,23,0.45),inset_0_1.5px_1px_rgba(255,255,255,0.22)] transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5">
                  <IconComponent size={27} strokeWidth={2} className="text-emerald-100 drop-shadow-xs" />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#062017] text-emerald-100 text-[9.5px] font-black tracking-widest uppercase shadow-md border border-emerald-700/50 whitespace-nowrap">
                  {prog.shortName}
                </span>
              </div>

              <div className="pt-0.5">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/[0.06] border border-emerald-900/15 text-emerald-950 text-[10px] font-black tracking-wider uppercase">
                    {meta.pilar}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    • Periode 2026/2027
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black text-slate-900 tracking-tight leading-tight">
                  {prog.name}
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-1">
                  {meta.subtitle}
                </p>
              </div>
            </div>

            {/* Right: 3D Raised Metadata Modules (Coordinator & Strength) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex items-stretch gap-3 shrink-0">
              {/* Coordinator 3D Box */}
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/90 border-b-[3px] border-b-slate-300/90 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/80 text-emerald-900 flex items-center justify-center shrink-0 shadow-inner">
                  <Award size={17} />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase tracking-wider leading-none mb-1">
                    Koordinator / Pimpinan
                  </span>
                  <span className="font-extrabold text-slate-900 text-xs sm:text-[13px] leading-snug block">
                    {prog.coordinator}
                  </span>
                </div>
              </div>

              {/* Member Strength 3D Box */}
              <div className="flex items-center gap-3 bg-gradient-to-b from-[#0b3324] to-[#051a12] text-white px-4 py-3 rounded-2xl border border-emerald-800/60 border-b-[3px] border-b-[#020d09] shadow-[0_8px_18px_-4px_rgba(6,32,23,0.35),inset_0_1px_0_rgba(255,255,255,0.14)]">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 text-emerald-200 flex items-center justify-center shrink-0">
                  <Users size={16} />
                </div>
                <div>
                  <span className="text-emerald-200/75 block text-[10px] font-extrabold uppercase tracking-wider leading-none mb-1">
                    Kekuatan Divisi
                  </span>
                  <span className="font-black text-white text-xs sm:text-sm leading-none block">
                    {prog.members?.length || 0} Kader Terdaftar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD BODY ── */}
        <div className="p-6 sm:p-8 lg:px-10 lg:py-8 space-y-8 bg-white">
          {/* 3D Recessed Description Callout */}
          <div
            style={{ transform: "translateZ(10px)" }}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 border-l-[4px] border-l-[#062017] shadow-[inset_0_2px_4px_rgba(15,23,42,0.03)]"
          >
            <p className="text-xs sm:text-[14px] text-slate-700 leading-relaxed font-medium">
              {prog.description}
            </p>
          </div>

          {/* 3D Raised Program Kerja Grid */}
          <div style={{ transform: "translateZ(20px)" }}>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#062017] inline-block ring-4 ring-emerald-900/10" />
                <span>Program Kerja & Agenda Prioritas 2026/2027</span>
              </h3>
              <span className="text-[11px] font-extrabold text-emerald-950 bg-slate-100 border border-slate-200/90 px-3 py-0.5 rounded-full">
                {prog.programs?.length || 0} Fokus Utama
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {prog.programs?.map((detail: string, i: number) => (
                <div
                  key={i}
                  className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-b from-white to-slate-50/70 border border-slate-200/90 border-b-[3.5px] border-b-slate-300/90 hover:border-emerald-800/40 hover:border-b-[#062017] shadow-[0_4px_12px_-2px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_14px_26px_-6px_rgba(6,32,23,0.12)] flex items-start gap-3.5 transition-all duration-200 hover:-translate-y-0.5 group/prog"
                >
                  {/* 3D Number Keycap */}
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] border border-emerald-700/40 border-b-2 border-b-black text-white text-xs font-black flex items-center justify-center shrink-0 shadow-[0_4px_8px_rgba(6,32,23,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] mt-0.5 group-hover/prog:scale-105 transition-transform">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover/prog:text-emerald-800 transition-colors mb-0.5">
                      <CheckCircle2 size={12} className="text-emerald-800 shrink-0" />
                      <span>Agenda Prioritas #{i + 1}</span>
                    </div>
                    <p className="text-xs sm:text-[13.5px] font-bold text-slate-900 leading-snug">
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Tactile Member Roster Grid */}
          <div
            style={{ transform: "translateZ(14px)" }}
            className="pt-6 border-t border-slate-200/80"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <h3 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-slate-800">
                  Susunan Pengurus & Kader Divisi
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-extrabold">
                  {prog.members?.length || 0} Siswa
                </span>
              </div>

              <Link
                href="/tentang#kepengurusan"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#062017] text-slate-800 hover:text-white text-xs font-extrabold border border-slate-200/90 border-b-[2.5px] border-b-slate-300 hover:border-[#062017] shadow-2xs transition-all duration-200 self-start sm:self-auto active:translate-y-0.5"
              >
                <span>Lihat Profil di Struktur</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {prog.members?.map((m: any, mIdx: number) => {
                const isLeader =
                  m.role?.toLowerCase().includes("ketua") ||
                  m.role?.toLowerCase().includes("koordinator") ||
                  m.role?.toLowerCase().includes("sekretaris") ||
                  m.role?.toLowerCase().includes("bendahara") ||
                  mIdx === 0;
                const igClean = m.instagram ? m.instagram.replace(/^@/, "") : "";

                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-2.5 hover:-translate-y-0.5 ${
                      isLeader
                        ? "bg-gradient-to-b from-white to-slate-50/90 border-slate-300/90 border-b-[3px] border-b-emerald-900/35 shadow-[0_4px_10px_rgba(6,32,23,0.05)] hover:shadow-[0_8px_18px_rgba(6,32,23,0.1)]"
                        : "bg-white hover:bg-slate-50/60 border-slate-200/85 border-b-[2.5px] border-b-slate-300/80 shadow-[0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300 hover:shadow-[0_6px_14px_rgba(15,23,42,0.06)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* 3D Initials Avatar */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border ${
                          isLeader
                            ? "bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-white border-emerald-700/40 border-b-2 border-b-black shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200/90 border-b-2 border-b-slate-300"
                        }`}
                      >
                        {getInitials(m.name)}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-slate-900 truncate">
                          {m.name}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              isLeader
                                ? "bg-emerald-950/[0.08] text-emerald-950"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {m.role}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            • {m.classGrade}
                          </span>
                        </div>
                      </div>
                    </div>

                    {igClean && (
                      <a
                        href={`https://instagram.com/${igClean}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#062017] text-slate-600 hover:text-white border border-slate-200/90 border-b-2 border-b-slate-300/80 hover:border-[#062017] text-[10px] font-bold flex items-center gap-1 shrink-0 transition-all"
                        title={`Instagram @${igClean}`}
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                        <span className="hidden xl:inline max-w-[68px] truncate">
                          @{igClean}
                        </span>
                        <ArrowUpRight size={10} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgramPage() {
  const [selectedTab, setSelectedTab] = useState<string>("Semua");

  const filteredDivisions = useMemo(() => {
    if (selectedTab === "Semua") return DIVISIONS;
    return DIVISIONS.filter(
      (prog) =>
        prog.shortName.toLowerCase() === selectedTab.toLowerCase() ||
        prog.id.toLowerCase() === selectedTab.toLowerCase()
    );
  }, [selectedTab]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <ScrollProgressBar />
      <Navbar />

      {/* ── HEADER HERO PROGRAM ── */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-24 bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <CinematicReveal direction="up" delay={0.1}>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
              6 Pilar Divisi & Program Kerja Rohis SMAPA
            </h1>
            <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Rancangan program kerja BPH, Pendidikan, Kaderisasi, Humas, Perpusmed, dan Sarpras Rohis SMA Negeri 4 Purwokerto masa bakti 2026/2027 di bawah pimpinan Tifatul Reyhan Zahran & Fanny Sri Masruroh.
            </p>

            {/* Quick Stats Pill */}
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 text-xs text-emerald-100">
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                6 Divisi Resmi
              </span>
              <span className="text-white/30">•</span>
              <span className="font-semibold">44 Pengurus Terdaftar</span>
              <span className="text-white/30">•</span>
              <span className="font-semibold">Musholla Al-Ikhlas SMAPA</span>
            </div>
          </CinematicReveal>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 -mt-10 relative z-20">
        {/* ── FILTER TAB DIVISI INTERAKTIF ── */}
        <CinematicReveal direction="up" delay={0.15}>
          <div className="bg-white p-2.5 rounded-3xl border border-slate-200/90 border-b-[4px] border-b-slate-300/80 shadow-[0_12px_30px_-8px_rgba(6,32,23,0.08)] mb-10">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
              {TAB_OPTIONS.map((tab) => {
                const isActive = selectedTab === tab;
                const memberCount =
                  tab === "Semua"
                    ? DIVISIONS.reduce((acc, d) => acc + (d.members?.length || 0), 0)
                    : DIVISIONS.find(
                        (d) =>
                          d.shortName.toLowerCase() === tab.toLowerCase() ||
                          d.id.toLowerCase() === tab.toLowerCase()
                      )?.members?.length || 0;

                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                      isActive
                        ? "bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-white border border-emerald-700/40 border-b-[3px] border-b-black shadow-md shadow-emerald-950/20 -translate-y-0.5"
                        : "bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60 border-b-[2px] border-b-slate-300/80"
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-white/15 text-emerald-100"
                          : "bg-slate-200/90 text-slate-600"
                      }`}
                    >
                      {memberCount} Kader
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </CinematicReveal>

        {/* ── PROGRAM CARDS GRID ── */}
        <div className="space-y-10">
          {filteredDivisions.map((prog, idx) => (
            <CinematicReveal
              key={prog.id}
              direction="up"
              delay={Math.min(idx * 0.08, 0.25)}
            >
              <Division3DCard prog={prog} />
            </CinematicReveal>
          ))}
        </div>

        {/* ── CTA ASPIRASI & REKOMENDASI PROKER ── */}
        <CinematicReveal direction="up" delay={0.15}>
          <div className="mt-14 bg-gradient-to-r from-[#062017] via-[#0b3324] to-[#041610] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-emerald-800/30 border-b-[5px] border-b-[#020d09]">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[11px] font-bold text-amber-300 mb-2.5">
                <span>SUARA PELAJAR SMAPA</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">
                Punya Usulan Kegiatan untuk Divisi Rohis?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                Sampaikan saran, aspirasi kajian, atau ide inovasi program kerja secara langsung melalui Kotak Aspirasi Resmi Rohis SMAPA.
              </p>
            </div>
            <Link
              href="/aspirasi"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shrink-0 border-b-[3px] border-b-amber-700 shadow-lg shadow-amber-950/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Sampaikan Ide Program
            </Link>
          </div>
        </CinematicReveal>
      </section>

      <Footer />
    </div>
  );
}
