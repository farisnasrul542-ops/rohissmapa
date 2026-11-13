"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileEdit,
  CalendarDays,
  ImageIcon,
  Megaphone,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import ClayTilt from "@/components/ClayTilt";
import { usePublicSiteUrl } from "@/hooks/usePublicSiteUrl";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import { handleGoogleDriveImageError } from "@/lib/driveUtils";

export default function AdminDashboardPage() {
  const { events, gallery, announcement, homeCms } = useAdmin();
  const publicSiteUrl = usePublicSiteUrl();

  const activeEventsCount = events.filter((e) => e.status !== "completed").length;
  const enabledSections = Object.values(homeCms.sections).filter(Boolean).length;
  const heroImage = homeCms.hero.showcaseImageUrl || "/images/rohis-akhdir-38.jpg";

  const modules = [
    {
      title: "Editor Beranda",
      description: "Kelola banner hero, sambutan pembina, statistik, dan seksi beranda.",
      icon: FileEdit,
      href: "/admin/content/home",
      stat: `${enabledSections} Bagian Aktif`,
    },
    {
      title: "Manajemen Agenda",
      description: "Kelola jadwal kajian, peringatan hari besar, dan kegiatan organisasi.",
      icon: CalendarDays,
      href: "/admin/agenda",
      stat: `${activeEventsCount} Agenda Terdaftar`,
    },
    {
      title: "Dokumentasi & Galeri",
      description: "Kelola foto album syiar dakwah dan dokumentasi aktivitas siswa.",
      icon: ImageIcon,
      href: "/admin/galeri",
      stat: `${gallery.length} Foto Dokumentasi`,
    },
    {
      title: "Pengumuman & Pembina",
      description: "Atur running announcement publik dan informasi dewan guru pembina.",
      icon: Megaphone,
      href: "/admin/pengumuman",
      stat: announcement.isActive ? "Siaran Aktif" : "Siaran Nonaktif",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── TOP BANNER: SELAMAT DATANG (MOCKUP 02) ── */}
      <div className="admin-hero admin-surface">
        <div className="max-w-xl">
          <div className="inline-block bg-[#d7f0e3] text-[#006d44] font-semibold text-xs px-3 py-1 rounded-full mb-3">
            Selamat Datang di Panel Admin
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            ROHIS SMA Negeri 4 Purwokerto
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            Kelola konten website Rohis SMAPA dengan mudah, tertata, dan sesuai kebutuhan kegiatan organisasi.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/admin/agenda"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#007a4d] hover:bg-[#006841] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <CalendarDays size={15} />
              <span>Kelola Agenda</span>
            </Link>
            <a
              href={publicSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            >
              <span>Lihat Web Publik</span>
              <ExternalLink size={13} className="text-slate-400" />
            </a>
          </div>
        </div>

        {/* School Banner Image */}
        <ClayTilt className="admin-hero-photo">
          <div>
            <Image
              src={parseImageCrop(heroImage).src}
              alt={homeCms.hero.showcaseTitle || "Kegiatan ROHIS SMAN 4 Purwokerto"}
              fill
              sizes="(max-width: 1280px) 100vw, 420px"
              className="object-cover"
              style={getImageCropStyle(heroImage)}
              onError={handleGoogleDriveImageError}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] font-semibold text-white/90 drop-shadow-sm">
                {homeCms.hero.showcaseTitle || "Rohis SMA Negeri 4 Purwokerto"}
              </span>
            </div>
          </div>
        </ClayTilt>
      </div>

      {/* ── MODULE CARDS (MOCKUP 02) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="admin-module group admin-surface flex flex-col justify-between"
            >
              <div>
                <div className="admin-icon w-12 h-12 rounded-2xl flex items-center justify-center mb-5">
                  <Icon size={20} />
                </div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-[#007a4d] transition-colors">
                  {m.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">{m.stat}</span>
                <span className="text-[#007a4d] font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Buka <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── BROADCAST STATUS BANNER ── */}
      {announcement.isActive && (
        <div className="admin-notice rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#d7f0e3] text-[#006d44] flex items-center justify-center shrink-0">
              <Megaphone size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#006d44] bg-[#d7f0e3] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Siaran Berjalan
                </span>
                <span className="text-xs font-bold text-slate-800 truncate">
                  {announcement.title || "Pengumuman Publik"}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {announcement.content}
              </p>
            </div>
          </div>

          <Link
            href="/admin/pengumuman"
            className="text-xs font-semibold text-[#007a4d] hover:underline shrink-0"
          >
            Ubah Siaran &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
