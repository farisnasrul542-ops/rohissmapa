"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileEdit,
  CalendarDays,
  ImageIcon,
  Megaphone,
  ExternalLink,
  User,
  LogOut,
  X,
} from "lucide-react";
import { logoutAdmin } from "@/lib/adminAuth";
import { useAdminOverlay } from "@/hooks/useAdminOverlay";
import { usePublicSiteUrl } from "@/hooks/usePublicSiteUrl";

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenAccountModal?: () => void;
}

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
  onOpenAccountModal,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const publicSiteUrl = usePublicSiteUrl();
  const drawerRef = useRef<HTMLDivElement>(null);
  useAdminOverlay(mobileOpen, drawerRef, () => setMobileOpen(false));
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [setMobileOpen]);

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Editor Beranda",
      href: "/admin/content/home",
      icon: FileEdit,
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
    <div className="admin-sidebar-shell flex flex-col h-full bg-white text-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <Link
          href="/admin"
          className="flex items-center gap-3 group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="admin-icon w-12 h-12 rounded-2xl flex items-center justify-center p-1.5 shrink-0">
            <Image
              src="/images/logo-transparent.png"
              alt="Logo Rohis SMAPA"
              width={40}
              height={40}
              className="w-full h-auto object-contain"
            />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 block">
              ROHIS SMAPA
            </span>
            <span className="inline-block mt-0.5 text-[10.5px] font-semibold text-[#006d44] bg-[#d7f0e3] px-2.5 py-0.5 rounded-full">
              Panel Admin
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Tutup Menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Navigation */}
      <nav aria-label="Navigasi admin" className="flex-1 overflow-y-auto px-4 py-5 custom-scrollbar" data-lenis-prevent>
        <p className="admin-sidebar-label">KELOLA WEBSITE</p>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
              className={`admin-nav-item flex items-center gap-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                active
                  ? "bg-[#007a4d] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon
                size={17}
                className={active ? "text-white" : "text-slate-500"}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: Lihat Web Publik, Akun, Keluar */}
      <div className="admin-sidebar-footer p-4 border-t border-slate-100 space-y-1">
        <a
          href={publicSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-[#007a4d] hover:bg-[#edf4f0]/60 transition-colors"
        >
          <ExternalLink size={16} className="text-slate-400" />
          <span>Lihat Web Publik</span>
        </a>

        <button
          type="button"
          onClick={() => {
            setMobileOpen(false);
            if (onOpenAccountModal) onOpenAccountModal();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-[#007a4d] hover:bg-[#edf4f0]/60 transition-colors text-left cursor-pointer"
        >
          <User size={16} className="text-slate-400" />
          <span>Akun</span>
        </button>

        <button
          type="button"
          onClick={() => logoutAdmin()}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50/70 transition-colors text-left cursor-pointer"
        >
          <LogOut size={16} className="text-rose-400" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-[272px] h-screen fixed left-0 top-0 z-40">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="admin-drawer-backdrop fixed inset-0 bg-[#153e32]/35 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div ref={drawerRef} role="dialog" aria-modal="true" aria-label="Menu admin" tabIndex={-1} className="admin-drawer fixed inset-y-0 left-0 w-72 max-w-[88vw] z-10">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
