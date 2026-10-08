"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Send,
  ArrowRight,
  MessageSquareHeart,
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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Profil", href: "/tentang" },
    { name: "Kepengurusan", href: "/anggota" },
    { name: "Divisi & Proker", href: "/program" },
    { name: "Agenda", href: "/agenda" },
    { name: "Galeri", href: "/galeri" },
    { name: "Kontak", href: "/kontak" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-nav glass-nav-scrolled py-3"
          : "bg-white/95 backdrop-blur-md py-3.5 border-b border-emerald-900/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform duration-200 border border-emerald-600/30">
              <span className="font-black text-xs tracking-wider text-amber-300">SMAPA</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-emerald-950 group-hover:text-emerald-700 transition-colors">
                  ROHIS SMAN 4
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  SMAPA
                </span>
              </div>
              <p className="text-[11px] font-medium text-emerald-800/70 leading-none">
                SMA Negeri 4 Purwokerto
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  pathname === item.href
                    ? "text-emerald-800 bg-emerald-50"
                    : "text-gray-700 hover:text-emerald-800 hover:bg-emerald-50/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              href="/aspirasi"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-900/10"
            >
              <MessageSquareHeart size={14} className="text-emerald-700" />
              <span>Aspirasi</span>
            </Link>
            <Link
              href="/pendaftaran"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              <Send size={13} />
              <span>Daftar Anggota</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl focus:outline-none"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-white/95 backdrop-blur-xl border-t border-emerald-900/10 p-5 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-between py-2.5 text-sm font-bold text-emerald-950 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{item.name}</span>
                <ArrowRight size={14} className="text-gray-400" />
              </Link>
            ))}

            <div className="pt-4 flex flex-col gap-3">
              <Link
                href="/pendaftaran"
                className="w-full py-3 text-center text-xs font-bold text-white bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-xl shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pendaftaran Anggota Rohis SMAPA
              </Link>
              <Link
                href="/aspirasi"
                className="w-full py-2.5 text-center text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-900/10 rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kotak Aspirasi & Suara Siswa
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
