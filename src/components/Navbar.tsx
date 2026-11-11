"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/constants";
import {
  Menu,
  X,
  Home,
  Users,
  Layers,
  Calendar,
  Camera,
  ArrowRight,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Beranda", shortLabel: "Beranda", icon: Home },
  { href: "/tentang", label: "Profil Rohis", shortLabel: "Profil Rohis", icon: Users },
  { href: "/program", label: "Divisi & Proker", shortLabel: "Divisi & Proker", icon: Layers },
  { href: "/agenda", label: "Agenda & Kegiatan", shortLabel: "Agenda", icon: Calendar },
  { href: "/galeri", label: "Galeri Foto", shortLabel: "Galeri Foto", icon: Camera },
];

export default function Navbar() {
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || "/";
  const mobileOpen = openPathname === pathname;
  const setMobileOpen = (next: boolean | ((prev: boolean) => boolean)) => {
    const resolved = typeof next === "function" ? next(mobileOpen) : next;
    setOpenPathname(resolved ? pathname : null);
  };
  const prefersReducedMotion = useReducedMotion();
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll & handle Escape key + Focus Trap when mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, setMobileOpen]);

  const isLinkActive = (href: string) => {
    if (!pathname) return href === "/";
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const activeItem =
    NAV_LINKS.find((item) => isLinkActive(item.href)) || NAV_LINKS[0];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pointer-events-none">
        <nav
          aria-label="Navigasi Utama"
          className={`max-w-[1240px] mx-auto pointer-events-auto clay-navbar rounded-full px-3 sm:px-5 lg:px-6 transition-all duration-200 ${
            scrolled ? "py-2 sm:py-2.5 shadow-[0_14px_32px_-8px_rgba(15,62,46,0.14)]" : "py-2.5 sm:py-3"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            {/* Brand Identity */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-[#087A53]"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full clay-pill-white p-1 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/images/logo-transparent.png"
                  alt={SITE.logoAlt}
                  fill
                  sizes="40px"
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div className="leading-tight">
                <span className="font-heading font-extrabold text-[13px] sm:text-[15px] tracking-tight block text-[#153E32]">
                  ROHIS SMAN 4
                </span>
                <span className="text-[11px] sm:text-xs font-medium text-[#4A6B5F] block">
                  Purwokerto
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative px-4 xl:px-5 py-2.5 rounded-full text-[13.5px] font-semibold transition-all duration-200 whitespace-nowrap select-none ${
                      isActive
                        ? "clay-btn-emerald font-bold text-white"
                        : "text-[#153E32] hover:text-[#087A53] hover:bg-[#E6F7EF]/80 active:scale-[0.98]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Right Controls: Active Page Pill + Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <span
                className="clay-btn-emerald px-3 py-1.5 rounded-full text-[11.5px] font-bold tracking-tight truncate max-w-[132px] min-[390px]:max-w-[160px] shadow-xs pointer-events-none"
                aria-hidden="true"
              >
                {activeItem.shortLabel}
              </span>

              <button
                ref={toggleBtnRef}
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-clay-drawer"
                aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                className="w-11 h-11 rounded-full clay-btn-white flex items-center justify-center text-[#153E32] cursor-pointer shrink-0"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer & Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.05 : 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-[#0D2B22]/30 backdrop-blur-[3px]"
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <motion.div
              id="mobile-clay-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu Navigasi Mobile"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -12 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0 }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -10 }
              }
              transition={{
                duration: prefersReducedMotion ? 0.08 : 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed top-[72px] sm:top-[80px] left-3 right-3 sm:left-6 sm:right-6 clay-card p-4 sm:p-5 z-50 max-h-[calc(100vh-96px)] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-[#D8E8E1]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A6B5F]">
                  Menu Halaman Rohis SMAPA
                </span>
                <span className="text-[11px] font-semibold text-[#087A53] clay-pill-mint px-2.5 py-0.5 rounded-full">
                  Periode {SITE.period}
                </span>
              </div>

              <div className="space-y-1.5">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  const isActive = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all min-h-[48px] ${
                        isActive
                          ? "clay-btn-emerald font-bold text-white"
                          : "clay-inner text-[#153E32] hover:bg-[#E4F8EE]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={isActive ? "text-white" : "text-[#087A53]"}
                        />
                        <span>{link.label}</span>
                      </div>
                      <ArrowRight
                        size={16}
                        className={isActive ? "text-white" : "text-[#5E7D72]"}
                      />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#D8E8E1] flex items-center justify-between gap-2 px-1 text-xs text-[#4A6B5F]">
                <span className="truncate">{SITE.mosqueName}</span>
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#087A53] hover:underline shrink-0"
                >
                  {SITE.instagram}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
