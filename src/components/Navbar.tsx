"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Layers,
  Calendar,
  Camera,
  Phone,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { SITE } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll and listen for Escape key when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Beranda", href: "/", icon: Home, desc: "Halaman utama website resmi" },
    { name: "Profil Rohis", href: "/tentang", icon: BookOpen, desc: "Sejarah, visi misi & BPH" },
    { name: "Divisi & Proker", href: "/program", icon: Layers, desc: "6 divisi dakwah sekolah" },
    { name: "Agenda & Kegiatan", href: "/agenda", icon: Calendar, desc: "Jadwal kajian & LDKR" },
    { name: "Galeri Foto", href: "/galeri", icon: Camera, desc: "Dokumentasi syiar SMAPA" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg py-2.5 sm:py-3 border-b border-emerald-900/10 shadow-sm shadow-emerald-950/5"
            : "bg-white/85 backdrop-blur-md py-4 sm:py-4.5 border-b border-white/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Brand with proportional scaling */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div
                className={`relative rounded-xl bg-white flex items-center justify-center p-1 shadow-md shadow-emerald-950/10 border border-emerald-900/10 group-hover:scale-105 group-hover:border-emerald-500/40 transition-all duration-300 overflow-hidden ${
                  scrolled ? "w-9 h-9 sm:w-10 sm:h-10" : "w-11 h-11"
                }`}
              >
                <Image
                  src="/images/logo-transparent.png"
                  alt={SITE.logoAlt || "Logo Rohis SMAPA"}
                  width={44}
                  height={44}
                  className="w-full h-auto max-h-9 object-contain"
                  priority
                />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-emerald-950 group-hover:text-emerald-700 transition-colors">
                  ROHIS SMAN 4
                </span>
                <p className="text-[11px] font-medium text-emerald-800/70 leading-none">
                  SMA Negeri 4 Purwokerto
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "text-emerald-900 bg-emerald-50 ring-1 ring-emerald-300/60 shadow-xs font-extrabold"
                        : "text-gray-700 hover:text-emerald-800 hover:bg-emerald-50/60"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-2 text-gray-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl focus:outline-none transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={24} className="text-emerald-900" /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE FULLSCREEN / OVERLAY MENU (OUTSIDE HEADER TO AVOID BACKDROP-FILTER CLIPPING) ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[9999] flex flex-col justify-start">
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-emerald-950/70 backdrop-blur-sm cursor-pointer"
              aria-hidden="true"
            />

            {/* Slide-down Drawer Panel */}
            <motion.div
              initial={{ y: "-100%", opacity: 0.95 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0.95 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative w-full max-h-[92vh] bg-white text-emerald-950 rounded-b-3xl shadow-2xl border-b border-emerald-900/15 flex flex-col overflow-hidden z-10"
            >
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-900/10 bg-emerald-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white p-1 border border-emerald-900/10 shadow-xs flex items-center justify-center">
                    <Image
                      src="/images/logo-transparent.png"
                      alt={SITE.logoAlt || "Logo Rohis SMAPA"}
                      width={34}
                      height={34}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-black text-sm text-emerald-950 leading-tight">
                      ROHIS SMAN 4 PURWOKERTO
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold">
                      Menu Navigasi Mobile
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-emerald-950 hover:bg-white rounded-xl transition-colors cursor-pointer border border-transparent hover:border-emerald-900/10"
                  aria-label="Tutup menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Scrollable Navigation List */}
              <div
                data-lenis-prevent="true"
                className="p-5 overflow-y-auto space-y-2 overscroll-contain custom-scrollbar"
              >
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800/70 px-1 mb-1">
                  Menu Utama
                </div>

                {navLinks.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? "bg-emerald-50 border border-emerald-300 text-emerald-950 shadow-xs font-black"
                          : "text-gray-800 hover:bg-emerald-50/50 hover:text-emerald-950 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isActive
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-gray-100 text-emerald-800"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold leading-tight">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className={isActive ? "text-emerald-700" : "text-gray-400"}
                      />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
