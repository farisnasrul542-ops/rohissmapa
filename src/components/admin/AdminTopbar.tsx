"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  ExternalLink,
  ChevronDown,
  Home,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { logoutAdmin, getStoredAdminUsername } from "@/lib/adminAuth";

interface AdminTopbarProps {
  onMenuToggle: () => void;
  onOpenAccountModal: () => void;
}

export default function AdminTopbar({
  onMenuToggle,
  onOpenAccountModal,
}: AdminTopbarProps) {
  const pathname = usePathname();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState("admin");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAdminUsername(getStoredAdminUsername());

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBreadcrumb = () => {
    switch (pathname) {
      case "/admin":
        return { parent: null, current: "Dashboard" };
      case "/admin/content/home":
        return { parent: "Panel Admin", current: "Editor Beranda" };
      case "/admin/agenda":
        return { parent: "Panel Admin", current: "Manajemen Agenda" };
      case "/admin/galeri":
        return { parent: "Panel Admin", current: "Dokumentasi & Galeri" };
      case "/admin/pengumuman":
        return { parent: "Panel Admin", current: "07 • Pengumuman & Pembina" };
      default:
        return { parent: "Panel Admin", current: "Admin SMAPA" };
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden cursor-pointer"
          aria-label="Buka Menu"
        >
          <Menu size={20} />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 hover:text-slate-800 transition-colors"
          >
            <Home size={15} className="text-slate-500" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          {breadcrumb.parent && (
            <>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600 hidden sm:inline">{breadcrumb.parent}</span>
            </>
          )}

          {breadcrumb.current !== "Dashboard" && (
            <>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-800">
                {breadcrumb.current}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Right: Lihat Web Publik & User Profile */}
      <div className="flex items-center gap-3">
        <a
          href="https://rohis-sman4pwt.web.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
        >
          <ExternalLink size={13} className="text-slate-500" />
          <span className="hidden sm:inline">Lihat Web Publik</span>
          <span className="sm:hidden">Web</span>
        </a>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200/60"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-100 border border-slate-200 shrink-0 relative">
              <Image
                src="/images/pembina-2.png"
                alt="Foto Profil"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="text-left hidden md:block">
              <span className="block text-xs font-semibold text-slate-800 leading-tight">
                Saifur Ro&apos;yi, S.Pd.
              </span>
              <span className="block text-[10.5px] text-slate-400 font-medium">
                {adminUsername === "admin" ? "Administrator" : adminUsername}
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-lg border border-slate-200/90 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">
                  Saifur Ro&apos;yi, S.Pd.
                </p>
                <p className="text-[11px] text-slate-400">
                  Pembina &bull; @{adminUsername}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onOpenAccountModal();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <Settings size={14} className="text-slate-400" />
                <span>Pengaturan Akun</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logoutAdmin();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
              >
                <LogOut size={14} className="text-rose-400" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
