"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Globe,
} from "lucide-react";
import { AdminProvider } from "@/context/AdminContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminToast from "@/components/admin/AdminToast";
import {
  isAdminAuthenticated,
  verifyAdminPassword,
  loginAdminSession,
} from "@/lib/adminAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // Login Gate Form State
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Jika dibuka dari domain publik (rohis-sman4pwt.web.id), blokir akses /admin dan kembalikan ke beranda umum
    if (
      typeof window !== "undefined" &&
      window.location.hostname.toLowerCase().includes("rohis-sman4pwt.web.id")
    ) {
      window.location.replace("https://rohis-sman4pwt.web.id/");
      return;
    }

    setMounted(true);
    setAuthenticated(isAdminAuthenticated());

    const syncAuth = () => {
      setAuthenticated(isAdminAuthenticated());
    };

    window.addEventListener("rohis_admin_auth_changed", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("rohis_admin_auth_changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsVerifying(true);

    setTimeout(() => {
      const isValid = verifyAdminPassword(password, username);
      if (isValid) {
        loginAdminSession(rememberMe);
        setAuthenticated(true);
        setPassword("");
      } else {
        setErrorMsg(
          "Kata sandi (Password) atau Username salah! Silakan periksa kembali."
        );
      }
      setIsVerifying(false);
    }, 300);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#041811] flex items-center justify-center text-emerald-200 text-xs font-bold">
        Memeriksa otorisasi keamanan Panel Admin...
      </div>
    );
  }

  // ── PASSWORD PROTECTION GATE FOR ALL /admin/* LINKS ──
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#041811] via-[#07261b] to-[#03110c] p-4 text-white relative overflow-hidden select-none">
        {/* Ambient Subtle Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[520px] h-[320px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white p-2 shadow-[0_14px_30px_rgba(0,0,0,0.45)] border border-white/25 mb-3">
              <Image
                src="/images/logo-transparent.png"
                alt="Logo Rohis SMA Negeri 4 Purwokerto"
                width={60}
                height={60}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <span className="px-3 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-[10px] font-black tracking-widest uppercase text-amber-300 inline-flex items-center gap-1">
                <ShieldCheck size={12} />
                <span>AKSES TERPROTEKSI PASSWORD</span>
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Portal Eksekutif Admin BPH
            </h1>
            <p className="text-xs text-emerald-200/75 mt-1">
              Masukkan kata sandi resmi pengurus untuk membuka sistem manajemen.
            </p>
          </div>

          {/* 3D Tactile Password Card */}
          <div className="bg-white text-slate-900 rounded-[28px] overflow-hidden shadow-[0_28px_70px_-15px_rgba(0,0,0,0.65)] border border-slate-200/90 border-b-[5px] border-b-slate-300">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#062017] via-emerald-700 to-[#062017]" />

            <div className="p-7 sm:p-8">
              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleUnlockSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Username Pengurus
                  </label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/70 focus:bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Password Admin *
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoFocus
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password admin..."
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/70 focus:bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      aria-label="Tampilkan sandi"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-800"
                    />
                    <span>Simpan sesi login di perangkat ini</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white font-extrabold text-xs tracking-wide border border-emerald-700/40 border-b-[3px] border-b-black shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <Lock size={14} className="text-amber-300" />
                  <span>
                    {isVerifying
                      ? "Memverifikasi Password..."
                      : "Buka Kunci Panel Admin"}
                  </span>
                  <ArrowRight size={14} className="text-amber-300" />
                </button>
              </form>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://rohis-sman4pwt.web.id/"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-200/75 hover:text-amber-300 font-semibold transition-colors"
            >
              <Globe size={13} />
              <span>Buka Website Umum (rohis-sman4pwt.web.id)</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#f6f8f6] text-gray-900 font-sans antialiased flex flex-col">
        {/* Isolated Sidebar */}
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Content Area (offset by sidebar width on desktop) */}
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <AdminTopbar
            onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Admin Dedicated Mini Footer */}
          <footer className="py-4 px-6 border-t border-emerald-950/5 text-center text-[11px] text-gray-400">
            <span>
              ROHIS SMA Negeri 4 Purwokerto • Sistem Informasi Manajemen Pengurus BPH © 2026
            </span>
          </footer>
        </div>

        {/* Toast notifications */}
        <AdminToast />
      </div>
    </AdminProvider>
  );
}
