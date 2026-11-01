"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  CalendarDays,
  MessageSquareHeart,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  PlusCircle,
  Building,
  ImageIcon,
  Megaphone,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { DIVISIONS } from "@/lib/constants";

export default function AdminDashboardPage() {
  const {
    events,
    aspirasiList,
    gallery,
    announcement,
    toggleEventStatus,
  } = useAdmin();

  const pendingAspirasi = aspirasiList.filter((a) => a.status === "pending");
  const activeEvents = events.filter((e) => e.status !== "completed");
  const totalMembers = DIVISIONS.reduce(
    (sum, div) => sum + (div.members?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* ── WELCOME HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] p-6 sm:p-8 text-white shadow-[0_20px_50px_-12px_rgba(6,32,23,0.25)] border border-emerald-800/40 border-b-[5px] border-b-[#020d09]">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-32 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10.5px] font-black tracking-wider text-amber-300 mb-3">
              <Sparkles size={12} className="text-amber-400" />
              <span>PORTAL EKSEKUTIF PENGURUS • ROHIS SMAPA 2026/2027</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ahlan wa Sahlan, Pengurus BPH SMAPA
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1.5 max-w-2xl leading-relaxed">
              Pusat kendali kegiatan dakwah, pengelolaan kajian Musholla Al-Ikhlas, dokumentasi publikasi, dan monitoring aspirasi pelajar SMA Negeri 4 Purwokerto.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <Link
              href="/admin/agenda"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs border-b-[3px] border-b-amber-700 shadow-md transition-all hover:-translate-y-0.5"
            >
              <PlusCircle size={15} />
              <span>Agenda Baru</span>
            </Link>
            <Link
              href="/admin/aspirasi"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 border-b-[3px] border-b-black/40 transition-all backdrop-blur-xs"
            >
              <MessageSquareHeart size={15} className="text-amber-300" />
              <span>Aspirasi Masuk ({pendingAspirasi.length})</span>
            </Link>
          </div>
        </div>

        {/* Separated Links Info Bar (Public vs Admin) */}
        <div className="mt-6 pt-4 border-t border-emerald-800/50 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-black/25 border border-white/10">
            <div className="min-w-0">
              <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-300">
                🌐 Link Umum (Siswa &amp; Publik)
              </span>
              <a
                href="https://rohis-sman4pwt.web.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-white hover:text-amber-300 underline underline-offset-2 truncate block"
              >
                https://rohis-sman4pwt.web.id/
              </a>
            </div>
            <a
              href="https://rohis-sman4pwt.web.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-[11px] shrink-0 transition-colors"
            >
              Buka Web →
            </a>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-black/25 border border-amber-400/20">
            <div className="min-w-0">
              <span className="block text-[10px] font-black uppercase tracking-wider text-amber-300">
                🔐 Link Khusus Admin (Terproteksi Password)
              </span>
              <a
                href="https://rohissmapa.farisnasrul542.workers.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-white hover:text-amber-300 underline underline-offset-2 truncate block"
              >
                https://rohissmapa.farisnasrul542.workers.dev/
              </a>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 font-extrabold text-[10px] shrink-0">
              PW Aktif
            </span>
          </div>
        </div>

        {/* Running Announcement Notice */}
        {announcement.isActive && (
          <div className="mt-6 pt-4 border-t border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-100/90">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="shrink-0 px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-black text-[10px] uppercase tracking-wider border border-amber-400/30">
                SIARAN AKTIF
              </span>
              <p className="truncate font-semibold">{announcement.content}</p>
            </div>
            <Link
              href="/admin/pengumuman"
              className="shrink-0 text-amber-300 hover:text-amber-200 font-extrabold flex items-center gap-1 hover:underline text-[11px] self-end sm:self-auto"
            >
              <span>Kelola Siaran</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>

      {/* ── 3D TACTILE KPI STATS GRID (UNIFIED MONOCHROME EMERALD & SLATE) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Stat 1: Total Pengurus & Kader */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 border-b-[4px] border-b-slate-300/90 shadow-[0_8px_20px_-6px_rgba(6,32,23,0.06)] hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Pengurus & Kader
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-emerald-100 flex items-center justify-center border border-emerald-700/40 border-b-2 border-b-black shadow-xs">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalMembers}</span>
            <span className="text-xs font-bold text-slate-400">Kader Inti</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
            <TrendingUp size={13} />
            <span>Tersebar di 6 Divisi Resmi</span>
          </div>
        </div>

        {/* Stat 2: Agenda Berjalan */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 border-b-[4px] border-b-slate-300/90 shadow-[0_8px_20px_-6px_rgba(6,32,23,0.06)] hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Agenda Aktif
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-emerald-100 flex items-center justify-center border border-emerald-700/40 border-b-2 border-b-black shadow-xs">
              <CalendarDays size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {activeEvents.length}
            </span>
            <span className="text-xs font-bold text-slate-400">Kegiatan</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <Clock size={13} className="text-emerald-800" />
            <span>Terjadwal di Musholla Al-Ikhlas</span>
          </div>
        </div>

        {/* Stat 3: Dokumentasi & Galeri */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 border-b-[4px] border-b-slate-300/90 shadow-[0_8px_20px_-6px_rgba(6,32,23,0.06)] hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Galeri Syiar
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-emerald-100 flex items-center justify-center border border-emerald-700/40 border-b-2 border-b-black shadow-xs">
              <ImageIcon size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {gallery.length}
            </span>
            <span className="text-xs font-bold text-slate-400">Dokumentasi</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
            <CheckCircle2 size={13} />
            <span>Tersinkron ke Galeri Publik</span>
          </div>
        </div>

        {/* Stat 4: Kotak Aspirasi */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 border-b-[4px] border-b-slate-300/90 shadow-[0_8px_20px_-6px_rgba(6,32,23,0.06)] hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Aspirasi Siswa
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-amber-300 flex items-center justify-center border border-emerald-700/40 border-b-2 border-b-black shadow-xs">
              <MessageSquareHeart size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {pendingAspirasi.length}
            </span>
            <span className="text-xs font-bold text-slate-400">Menunggu</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <span>Total {aspirasiList.length} suara siswa masuk</span>
          </div>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Agenda & Pintasan CMS (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card: Manajemen Agenda Cepat */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 border-b-[4px] border-b-slate-300/90 shadow-[0_10px_28px_-8px_rgba(6,32,23,0.06)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Agenda & Jadwal Kegiatan Mendatang
                </h2>
                <p className="text-xs text-slate-500">
                  Monitoring jadwal kajian dakwah dan kegiatan syiar SMAPA
                </p>
              </div>
              <Link
                href="/admin/agenda"
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#062017] text-slate-800 hover:text-white text-xs font-extrabold transition-colors flex items-center gap-1.5"
              >
                <span>Kelola Semua</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-3.5">
              {events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-2xl border border-slate-200/80 border-b-[2.5px] border-b-slate-300/80 bg-slate-50/50 hover:bg-white hover:border-emerald-800/35 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#062017] shrink-0 border border-slate-200 hidden sm:block">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#062017] text-emerald-100">
                            {event.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              event.status === "completed"
                                ? "bg-slate-100 text-slate-600 border-slate-200"
                                : "bg-emerald-50 text-emerald-900 border-emerald-200/80"
                            }`}
                          >
                            {event.status === "completed"
                              ? "Selesai Dilaksanakan"
                              : "Akan Datang"}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-900 truncate">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-emerald-800" />
                            {event.date} • {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-emerald-800" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 sm:self-center">
                      <Link
                        href="/admin/agenda"
                        className="text-[11px] font-extrabold px-3 py-1.5 rounded-xl border border-slate-200/90 border-b-2 border-b-slate-300 bg-white hover:bg-[#062017] text-slate-800 hover:text-white transition-all"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          toggleEventStatus(
                            event.id,
                            event.status === "completed" ? "open" : "completed"
                          )
                        }
                        className="text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        {event.status === "completed" ? "Aktifkan" : "Selesai"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Pintasan Pengelolaan Konten & Media (3D Monochrome Cards) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 border-b-[4px] border-b-slate-300/90 shadow-[0_10px_28px_-8px_rgba(6,32,23,0.06)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Pusat Pengelolaan Konten & Publikasi
                </h2>
                <p className="text-xs text-slate-500">
                  Pintasan cepat pengelolaan konten beranda, dokumentasi galeri, dan siaran pengumuman
                </p>
              </div>
              <Link
                href="/admin/content/home"
                className="text-xs font-extrabold text-emerald-900 hover:underline flex items-center gap-1"
              >
                <span>Buka Live CMS</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/admin/content/home"
                className="p-4.5 rounded-2xl bg-gradient-to-b from-white to-slate-50/80 border border-slate-200/90 border-b-[3px] border-b-slate-300 hover:border-emerald-800/40 hover:border-b-[#062017] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-amber-300 flex items-center justify-center mb-3 border border-emerald-700/40 border-b-2 border-b-black shadow-xs group-hover:scale-105 transition-transform">
                  <Sparkles size={18} />
                </div>
                <h3 className="font-extrabold text-xs text-slate-900 mb-1">
                  Editor Live CMS Beranda
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Sesuaikan teks hero, statistik, dan sambutan pembina secara langsung.
                </p>
              </Link>

              <Link
                href="/admin/galeri"
                className="p-4.5 rounded-2xl bg-gradient-to-b from-white to-slate-50/80 border border-slate-200/90 border-b-[3px] border-b-slate-300 hover:border-emerald-800/40 hover:border-b-[#062017] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-emerald-100 flex items-center justify-center mb-3 border border-emerald-700/40 border-b-2 border-b-black shadow-xs group-hover:scale-105 transition-transform">
                  <ImageIcon size={18} />
                </div>
                <h3 className="font-extrabold text-xs text-slate-900 mb-1">
                  Galeri Dokumentasi
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Unggah dan perbarui foto kegiatan kajian, LDKR, dan syiar sekolah.
                </p>
              </Link>

              <Link
                href="/admin/pengumuman"
                className="p-4.5 rounded-2xl bg-gradient-to-b from-white to-slate-50/80 border border-slate-200/90 border-b-[3px] border-b-slate-300 hover:border-emerald-800/40 hover:border-b-[#062017] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-emerald-100 flex items-center justify-center mb-3 border border-emerald-700/40 border-b-2 border-b-black shadow-xs group-hover:scale-105 transition-transform">
                  <Megaphone size={18} />
                </div>
                <h3 className="font-extrabold text-xs text-slate-900 mb-1">
                  Siaran Pengumuman
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Atur teks running announcement dan amanat pembina di portal publik.
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Aspirasi & Piket Musholla (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Aspirasi Masuk */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 border-b-[4px] border-b-slate-300/90 shadow-[0_10px_28px_-8px_rgba(6,32,23,0.06)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Aspirasi Siswa Terbaru
                </h2>
                <p className="text-xs text-slate-500">
                  Suara & usulan pelajar SMAPA
                </p>
              </div>
              <Link
                href="/admin/aspirasi"
                className="text-xs font-extrabold text-emerald-900 hover:underline"
              >
                Semua ({aspirasiList.length})
              </Link>
            </div>

            <div className="space-y-3">
              {aspirasiList.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 border-b-2 border-b-slate-300/80 bg-slate-50/60 hover:bg-white transition-all text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md ${
                        item.status === "resolved"
                          ? "bg-emerald-950/[0.08] text-emerald-950"
                          : item.status === "in_review"
                          ? "bg-slate-200 text-slate-800"
                          : "bg-amber-100 text-amber-950"
                      }`}
                    >
                      {item.status === "resolved"
                        ? "✓ Selesai"
                        : item.status === "in_review"
                        ? "◷ Ditinjau"
                        : "● Menunggu"}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {item.createdAt}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold truncate">
                      Oleh: {item.senderName}
                    </span>
                    <Link
                      href="/admin/aspirasi"
                      className="font-extrabold text-emerald-900 hover:underline shrink-0"
                    >
                      Tanggapi →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Jadwal Petugas Musholla Al-Ikhlas Hari Ini */}
          <div className="bg-gradient-to-br from-[#062017] via-[#092b1f] to-[#041610] text-white rounded-3xl p-6 border border-emerald-800/40 border-b-[5px] border-b-[#020d09] shadow-lg">
            <div className="flex items-center gap-2 text-amber-300 text-[11px] font-black uppercase tracking-wider mb-1.5">
              <Building size={14} />
              <span>Jadwal Musholla Al-Ikhlas</span>
            </div>
            <h3 className="text-base font-black text-white mb-4">
              Petugas Sholat & Syiar Harian
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-between gap-2">
                <div>
                  <p className="font-extrabold text-white">Sholat Dzuhur Berjamaah</p>
                  <p className="text-[11px] text-emerald-200/75">
                    Imam: Ustadz Toyyib Yuliadi, Sh. M.Pd
                  </p>
                </div>
                <span className="text-[10px] font-black text-amber-300 bg-amber-400/15 border border-amber-400/25 px-2.5 py-1 rounded-lg shrink-0">
                  11:45 WIB
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-between gap-2">
                <div>
                  <p className="font-extrabold text-white">Koordinasi Piket Ikhwan</p>
                  <p className="text-[11px] text-emerald-200/75">
                    Koordinator: Lutfi Triansyah (Ketua Ikhwan)
                  </p>
                </div>
                <span className="text-[10px] font-black text-emerald-200 bg-white/10 border border-white/15 px-2.5 py-1 rounded-lg shrink-0">
                  Piket
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-between gap-2">
                <div>
                  <p className="font-extrabold text-white">Kultum & Evaluasi BPH</p>
                  <p className="text-[11px] text-emerald-200/75">
                    Pimpinan: Tifatul Reyhan Zahran (Ketua Umum)
                  </p>
                </div>
                <span className="text-[10px] font-black text-amber-300 bg-amber-400/15 border border-amber-400/25 px-2.5 py-1 rounded-lg shrink-0">
                  15:15 WIB
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-800/50 flex items-center justify-between text-[11px] text-emerald-200/70">
              <span>6 Divisi Terintegrasi</span>
              <Link
                href="/program"
                target="_blank"
                className="font-bold text-amber-300 hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Struktur</span>
                <Layers size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
