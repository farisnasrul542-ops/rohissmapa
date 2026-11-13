"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Info,
  CheckCircle2,
} from "lucide-react";
import { AdminProvider } from "@/context/AdminContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminToast from "@/components/admin/AdminToast";
import { useAdminOverlay } from "@/hooks/useAdminOverlay";
import { usePublicSiteUrl } from "@/hooks/usePublicSiteUrl";
import {
  isAdminAuthenticated,
  verifyAdminPassword,
  loginAdminSession,
  getStoredAdminUsername,
  getStoredAdminPassword,
  updateAdminCredentials,
} from "@/lib/adminAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const publicSiteUrl = usePublicSiteUrl();
  const accountDialogRef = useRef<HTMLDivElement>(null);
  useAdminOverlay(accountModalOpen, accountDialogRef, () => setAccountModalOpen(false));

  // Login Gate State
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Pengaturan Akun State
  const [accUsername, setAccUsername] = useState("admin");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [accFeedback, setAccFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    // Jika dibuka dari domain publik (rohis-sman4pwt.web.id), alihkan ke beranda publik
    if (
      typeof window !== "undefined" &&
      window.location.hostname.toLowerCase().includes("rohis-sman4pwt.web.id")
    ) {
      window.location.replace("https://rohis-sman4pwt.web.id/");
      return;
    }

    queueMicrotask(() => {
      setMounted(true);
      setAuthenticated(isAdminAuthenticated());
      setAccUsername(getStoredAdminUsername());
    });

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

  const handleLoginSubmit = (e: React.FormEvent) => {
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
        setErrorMsg("Username atau Password yang Anda masukkan salah!");
      }
      setIsVerifying(false);
    }, 250);
  };

  const openAccountModal = () => {
    setAccUsername(getStoredAdminUsername());
    setCurrentPw("");
    setNewPw("");
    setShowCurrentPw(false);
    setShowNewPw(false);
    setAccFeedback(null);
    setAccountModalOpen(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const actualCurrent = getStoredAdminPassword();

    if (currentPw !== actualCurrent) {
      setAccFeedback({
        type: "error",
        text: "Password saat ini salah!",
      });
      return;
    }

    if (newPw.trim().length > 0 && newPw.trim().length < 4) {
      setAccFeedback({
        type: "error",
        text: "Password baru minimal 4 karakter.",
      });
      return;
    }

    const finalPw = newPw.trim() ? newPw.trim() : actualCurrent;
    const finalUser = accUsername.trim() || "admin";

    updateAdminCredentials(finalPw, finalUser);
    setAccFeedback({
      type: "success",
      text: "Pengaturan akun berhasil disimpan!",
    });
    setTimeout(() => {
      setAccountModalOpen(false);
    }, 900);
  };

  if (!mounted) {
    return (
      <div className="admin-clay3d min-h-screen bg-[#edf4f0] flex items-center justify-center text-slate-500 text-xs font-semibold">
        Memeriksa sesi login admin...
      </div>
    );
  }

  // ── LOGIN PAGE (MOCKUP 01: AKSES ADMIN & AKUN) ──
  if (!authenticated) {
    return (
      <div className="admin-clay3d min-h-screen bg-[#edf4f0] flex items-center justify-center p-4">
        <div className="admin-login-card w-full max-w-md admin-surface bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="admin-login-logo relative w-28 h-24">
              <Image
                src="/images/logo-transparent.png"
                alt="Logo ROHIS SMAPA"
                fill
                sizes="112px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Heading */}
          <div className="flex items-center gap-3 mb-2">
            <div className="admin-icon w-9 h-9 rounded-xl bg-[#d7f0e3] text-[#006d44] flex items-center justify-center shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                Masuk Panel Admin
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola konten dan kegiatan Rohis SMAPA.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-[#f8faf9] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#007a4d] focus:ring-[#007a4d]"
                />
                <span>Ingat saya</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-xl bg-[#007a4d] hover:bg-[#006841] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer disabled:opacity-60"
            >
              {isVerifying ? "Memeriksa..." : "Masuk ke Dashboard"}
            </button>
          </form>

          {/* Back to Public Web */}
          <div className="mt-5 text-center">
            <a
              href={publicSiteUrl}
              className="text-xs font-semibold text-[#007a4d] hover:underline"
            >
              Kembali ke Website Publik
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── AUTHENTICATED ADMIN LAYOUT ──
  return (
    <AdminProvider>
      <div className="admin-clay3d min-h-screen bg-[#edf4f0] text-slate-800">
        {/* Sidebar */}
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
          onOpenAccountModal={openAccountModal}
        />

        {/* Main Content Area */}
        <div className="lg:pl-72 flex flex-col min-h-screen">
          <AdminTopbar
            onMenuToggle={() => setMobileSidebarOpen(true)}
            onOpenAccountModal={openAccountModal}
          />

          <main className="admin-main flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* ── MODAL PENGATURAN AKUN (MOCKUP 01 & 02) ── */}
        {accountModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div ref={accountDialogRef} role="dialog" aria-modal="true" aria-labelledby="admin-account-title" tabIndex={-1} className="admin-dialog admin-surface bg-white rounded-3xl w-full max-w-md border border-slate-200/80 shadow-xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <h3 id="admin-account-title" className="text-lg font-bold text-slate-900">
                    Pengaturan Akun
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ubah informasi akun admin Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAccountModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  aria-label="Tutup"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAccount} className="p-6 space-y-4 overflow-y-auto" data-lenis-prevent>
                {accFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      accFeedback.type === "success"
                        ? "bg-[#d7f0e3] text-[#006d44] border border-[#006d44]/20"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {accFeedback.type === "success" ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      <AlertCircle size={15} />
                    )}
                    <span>{accFeedback.text}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={accUsername}
                    onChange={(e) => setAccUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password saat ini
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? "text" : "password"}
                      required
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      placeholder="Masukkan password saat ini"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      aria-label={showCurrentPw ? "Sembunyikan password saat ini" : "Tampilkan password saat ini"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password baru
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPw ? "text" : "password"}
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder="Kosongkan jika tidak ingin mengubah password"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      aria-label={showNewPw ? "Sembunyikan password baru" : "Tampilkan password baru"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Status Notice Pill */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#d7f0e3]/60 text-[#006d44] border border-[#006d44]/15 text-xs font-medium">
                  <Info size={14} className="shrink-0" />
                  <span>Perubahan belum disimpan.</span>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setAccountModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#007a4d] hover:bg-[#006841] text-white shadow-xs transition-colors cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <AdminToast />
      </div>
    </AdminProvider>
  );
}
