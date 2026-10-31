"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  PlusCircle,
  ExternalLink,
  Calendar,
  CheckCircle2,
  MessageSquare,
  X,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface AdminTopbarProps {
  onMenuToggle: () => void;
  onOpenCreateAgenda?: () => void;
}

export default function AdminTopbar({
  onMenuToggle,
}: AdminTopbarProps) {
  const pathname = usePathname();
  const { aspirasiList, searchQuery, setSearchQuery } = useAdmin();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getBreadcrumb = () => {
    switch (pathname) {
      case "/admin":
        return { section: "Dashboard", title: "Ringkasan Eksekutif BPH" };
      case "/admin/content/home":
        return { section: "Content Management", title: "Editor Konten Beranda (Live CMS)" };
      case "/admin/agenda":
        return { section: "Agenda & Kajian", title: "Manajemen Jadwal Kegiatan" };
      case "/admin/aspirasi":
        return { section: "Layanan Pelajar", title: "Kotak Aspirasi & Konseling" };
      case "/admin/galeri":
        return { section: "Publikasi Media", title: "Dokumentasi & Galeri Foto" };
      case "/admin/pengumuman":
        return { section: "Informasi", title: "Broadcast Pengumuman & Pembina" };
      default:
        return { section: "Admin", title: "Panel Pengurus BPH SMAPA" };
    }
  };

  const breadcrumb = getBreadcrumb();
  const pendingAspirasi = aspirasiList.filter((a) => a.status === "pending");
  const totalNotifications = pendingAspirasi.length;

  const formattedDate = mounted
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date())
    : "Periode 2026/2027";

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(6,32,23,0.03)] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 text-slate-700 hover:text-emerald-950 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-none cursor-pointer"
          aria-label="Buka navigasi admin"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
            <span>ROHIS SMAPA</span>
            <span>/</span>
            <span className="text-emerald-800">{breadcrumb.section}</span>
          </div>
          <h2 className="text-sm font-black text-slate-900 leading-tight">
            {breadcrumb.title}
          </h2>
        </div>
      </div>

      {/* Center: Global Search Input */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Cari cepat agenda, foto dokumentasi, atau aspirasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200/90 bg-slate-50/80 text-xs text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              aria-label="Bersihkan pencarian"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Right: Date Badge, Quick Add, Notification, View Public */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Date Stamp */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 text-slate-700 text-[11px]">
          <Calendar size={13} className="text-emerald-800" />
          <span className="font-extrabold text-slate-900">{formattedDate}</span>
        </div>

        {/* Action button: Go to Agenda */}
        <Link
          href="/admin/agenda"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white text-xs font-extrabold border border-emerald-700/40 border-b-[2.5px] border-b-black shadow-sm transition-all hover:-translate-y-0.5"
        >
          <PlusCircle size={14} className="text-amber-300" />
          <span className="hidden sm:inline">Agenda Baru</span>
          <span className="sm:hidden">+ Agenda</span>
        </Link>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 relative border border-slate-200/90 border-b-[2px] border-b-slate-300 transition-all cursor-pointer"
            aria-label="Pemberitahuan"
          >
            <Bell size={17} />
            {mounted && totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9.5px] font-black flex items-center justify-center shadow-xs border border-white">
                {totalNotifications}
              </span>
            )}
          </button>

          {/* Notification Popover */}
          {notificationOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setNotificationOpen(false)}
              />
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl bg-white shadow-[0_20px_50px_-12px_rgba(6,32,23,0.25)] border border-slate-200/90 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 py-3.5 bg-slate-50/90 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-slate-900">
                      Notifikasi Pengurus
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-950 text-amber-300">
                      {totalNotifications} Aktif
                    </span>
                  </div>
                  <button
                    onClick={() => setNotificationOpen(false)}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>

                <div className="p-3 space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                  {pendingAspirasi.length > 0 && (
                    <Link
                      href="/admin/aspirasi"
                      onClick={() => setNotificationOpen(false)}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#062017] text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                        <MessageSquare size={15} />
                      </div>
                      <div className="text-xs">
                        <p className="font-extrabold text-slate-900">
                          {pendingAspirasi.length} Aspirasi Siswa Menunggu Balasan
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Tinjau dan berikan tanggapan resmi BPH Rohis SMAPA.
                        </p>
                      </div>
                    </Link>
                  )}

                  {totalNotifications === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      <CheckCircle2
                        size={28}
                        className="mx-auto mb-2 text-emerald-700"
                      />
                      Semua aspirasi siswa telah ditindaklanjuti!
                    </div>
                  )}
                </div>

                <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-200/80 text-center">
                  <Link
                    href="/admin"
                    onClick={() => setNotificationOpen(false)}
                    className="text-[11px] font-extrabold text-emerald-900 hover:underline"
                  >
                    Lihat Ringkasan Dashboard →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Public Website Preview Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 border-b-[2px] border-b-slate-300 text-xs font-extrabold text-slate-800 transition-all"
          title="Buka Website Publik Rohis SMAPA"
        >
          <span>Web Publik</span>
          <ExternalLink size={12} className="text-emerald-800" />
        </Link>
      </div>
    </header>
  );
}
