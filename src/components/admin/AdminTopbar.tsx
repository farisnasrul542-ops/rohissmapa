"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ExternalLink,
  ChevronDown,
  Home,
  LogOut,
  Settings,
} from "lucide-react";
import { logoutAdmin, getStoredAdminUsername } from "@/lib/adminAuth";
import { usePublicSiteUrl } from "@/hooks/usePublicSiteUrl";

interface AdminTopbarProps {
  onMenuToggle: () => void;
  onOpenAccountModal: () => void;
}

export default function AdminTopbar({
  onMenuToggle,
  onOpenAccountModal,
}: AdminTopbarProps) {
  const pathname = usePathname();
  const publicSiteUrl = usePublicSiteUrl();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState("admin");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncUsername = () => setAdminUsername(getStoredAdminUsername());
    queueMicrotask(syncUsername);
    window.addEventListener("storage", syncUsername);
    window.addEventListener("rohis_admin_auth_changed", syncUsername);

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", syncUsername);
      window.removeEventListener("rohis_admin_auth_changed", syncUsername);
    };
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
        return { parent: "Panel Admin", current: "Pengumuman & Pembina" };
      default:
        return { parent: "Panel Admin", current: "Admin SMAPA" };
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="admin-topbar sticky z-30 backdrop-blur-md flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="admin-button p-2 text-slate-600 rounded-xl lg:hidden cursor-pointer"
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
          href={publicSiteUrl}
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
            aria-expanded={profileDropdownOpen}
            aria-controls="admin-profile-dropdown"
            aria-label={`Menu akun ${adminUsername}`}
            onKeyDown={(event) => {
              if (event.key === "Escape") setProfileDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200/60"
          >
            <div aria-hidden="true" className="admin-avatar w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm text-[#087a53]">
              {adminUsername.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden md:block">
              <span className="block text-xs font-semibold text-slate-800 leading-tight">
                {adminUsername}
              </span>
              <span className="block text-[10.5px] text-slate-400 font-medium">
                Administrator
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div id="admin-profile-dropdown" onKeyDown={(event) => {
              if (event.key === "Escape") {
                setProfileDropdownOpen(false);
                dropdownRef.current?.querySelector("button")?.focus();
              }
            }} className="admin-dropdown absolute right-0 mt-3 w-52 rounded-2xl bg-white py-1.5 z-40">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">
                  {adminUsername}
                </p>
                <p className="text-[11px] text-slate-400">
                  Administrator &bull; ROHIS SMAPA
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
