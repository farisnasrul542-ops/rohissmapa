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
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { DIVISIONS } from "@/lib/constants";

export default function AdminDashboardPage() {
  const { events, gallery, announcement } = useAdmin();

  const activeEventsCount = events.filter((e) => e.status !== "completed").length;
  const totalMembers = DIVISIONS.reduce(
    (sum, div) => sum + (div.members?.length || 0),
    0
  );

  const modules = [
    {
      title: "Editor Beranda",
      description: "Kelola banner hero, sambutan pembina, statistik, dan seksi beranda.",
      icon: FileEdit,
      href: "/admin/content/home",
      stat: "7 Seksi Beranda",
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
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
              href="https://rohis-sman4pwt.web.id/"
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
        <div className="relative w-full lg:w-96 h-48 sm:h-52 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm shrink-0">
          <Image
            src="/images/rohis-akhdir-38.jpg"
            alt="Kegiatan ROHIS SMAN 4 Purwokerto"
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-3">
            <span className="text-[11px] font-semibold text-white/90 drop-shadow-sm">
              Rohis SMA Negeri 4 Purwokerto
            </span>
          </div>
        </div>
      </div>

      {/* ── MODULE CARDS (MOCKUP 02) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="group bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#007a4d]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#d7f0e3] text-[#006d44] flex items-center justify-center mb-3.5 group-hover:bg-[#007a4d] group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <h2 className="text-sm font-bold text-slate-900 group-hover:text-[#007a4d] transition-colors">
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
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
