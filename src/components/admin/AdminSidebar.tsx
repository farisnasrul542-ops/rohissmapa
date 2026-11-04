"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquareHeart,
  ImageIcon,
  Megaphone,
  Globe,
  LogOut,
  ChevronRight,
  X,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";
import { logoutAdmin } from "@/lib/adminAuth";

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard Eksekutif",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Editor Konten Beranda",
      href: "/admin/content/home",
      icon: Sparkles,
    },
    {
      label: "Manajemen Agenda",
      href: "/admin/agenda",
      icon: CalendarDays,
    },
    {
      label: "Dokumentasi & Galeri",
      href: "/admin/galeri",
      icon: ImageIcon,
    },
    {
      label: "Kotak Aspirasi Siswa",
      href: "/admin/aspirasi",
      icon: MessageSquareHeart,
    },
    {
      label: "Pengumuman & Pembina",
      href: "/admin/pengumuman",
      icon: Megaphone,
    },
  ];

  const isActive = (itemHref: string, exact?: boolean) => {
    if (exact) {
      return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#041811] via-[#062319] to-[#03110c] text-white border-r border-emerald-900/40 select-none shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-emerald-800/30 bg-[#04160f]/60">
        <div className="flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-3 group"
            onClick={() => setMobileOpen(false)}
          >
            <div className="relative w-11 h-11 rounded-2xl bg-white flex items-center justify-center p-1.5 shadow-[0_8px_18px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,1)] border border-white/25 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <Image
                src="/images/logo-transparent.png"
                alt="Logo Rohis SMAPA"
                width={44}
                height={44}
                className="w-full h-auto max-h-9 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                  ROHIS SMAPA
                </span>
              </div>
              <p className="text-[11px] font-medium text-emerald-300/70">
                Panel Eksekutif BPH
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800/40 lg:hidden cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Pill */}
        <div className="mt-4 flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800/40 shadow-inner text-[11px] text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="font-semibold">Periode Aktif</span>
          </div>
          <span className="font-mono font-bold text-[10px] text-amber-300/90">
            2026/2027
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div
        data-lenis-prevent="true"
        className="flex-1 overflow-y-auto px-3.5 py-5 space-y-1.5 custom-scrollbar overscroll-contain"
      >
        <div className="px-2.5 pb-1.5 text-[10px] font-black tracking-widest uppercase text-emerald-400/50">
          Manajemen Utama
        </div>

        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 group ${
                active
                  ? "bg-gradient-to-b from-emerald-700 to-emerald-800 text-white font-extrabold border border-emerald-500/40 border-b-[2.5px] border-b-emerald-950 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]"
                  : "text-emerald-100/75 font-semibold hover:text-white hover:bg-white/[0.06] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    active
                      ? "bg-black/25 text-amber-300 shadow-inner"
                      : "bg-white/[0.04] text-emerald-300/75 group-hover:text-amber-300 group-hover:bg-white/[0.08]"
                  }`}
                >
                  <Icon size={15} />
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              {active && (
                <ChevronRight size={14} className="text-emerald-200/70 shrink-0" />
              )}
            </Link>
          );
        })}

        {/* Public Website Gateway */}
        <div className="pt-5 px-2.5 pb-1.5 text-[10px] font-black tracking-widest uppercase text-emerald-400/50">
          Pintasan Website Umum
        </div>

        <a
          href="https://rohis-sman4pwt.web.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-200/80 hover:text-white hover:bg-white/[0.06] transition-all border border-emerald-800/30 group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-amber-300/80 group-hover:text-amber-300 shrink-0">
              <Globe size={15} />
            </div>
            <div className="min-w-0">
              <span className="block truncate">Web Umum (Publik)</span>
              <span className="block text-[9.5px] text-emerald-400/70 font-mono truncate">
                rohis-sman4pwt.web.id
              </span>
            </div>
          </div>
          <ExternalLink size={13} className="text-emerald-400/60 shrink-0" />
        </a>

        <a
          href="https://rohis-sman4pwt.web.id/program"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-200/80 hover:text-white hover:bg-white/[0.06] transition-all border border-emerald-800/30 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-emerald-300/80 group-hover:text-emerald-200">
              <Layers size={15} />
            </div>
            <span>6 Divisi & Proker</span>
          </div>
          <ExternalLink size={13} className="text-emerald-400/60" />
        </a>
      </div>

      {/* Admin User Profile & Sign Out */}
      <div className="p-3.5 border-t border-emerald-800/35 bg-[#020e09]/80">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-950/70 border border-emerald-800/40 shadow-inner">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-emerald-700 to-emerald-900 border border-emerald-500/30 text-amber-300 font-black flex items-center justify-center text-xs shadow-sm shrink-0">
              TR
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-white truncate">
                Tifatul Reyhan Z.
              </p>
              <p className="text-[10px] text-emerald-300/70 truncate font-medium">
                Ketua Umum • BPH
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logoutAdmin()}
            className="p-2 rounded-xl text-emerald-300/80 hover:text-rose-300 hover:bg-rose-500/15 transition-colors shrink-0 cursor-pointer"
            title="Kunci & Keluar dari Panel Admin"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
