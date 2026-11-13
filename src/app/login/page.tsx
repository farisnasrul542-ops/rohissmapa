"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { usePublicSiteUrl } from "@/hooks/usePublicSiteUrl";
import {
  verifyAdminPassword,
  loginAdminSession,
  isAdminAuthenticated,
} from "@/lib/adminAuth";

export default function LoginPage() {
  const router = useRouter();
  const publicSiteUrl = usePublicSiteUrl();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname.toLowerCase().includes("rohis-sman4pwt.web.id")
    ) {
      window.location.replace("https://rohis-sman4pwt.web.id/");
      return;
    }
    if (isAdminAuthenticated()) {
      router.replace("/admin");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const valid = verifyAdminPassword(password, username);
      if (valid) {
        loginAdminSession(rememberMe);
        router.push("/admin");
      } else {
        setErrorMsg("Username atau Password yang Anda masukkan salah!");
        setIsLoading(false);
      }
    }, 250);
  };

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
        <form onSubmit={handleLogin} className="mt-5 space-y-4">
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
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#007a4d] hover:bg-[#006841] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer disabled:opacity-60"
          >
            {isLoading ? "Memeriksa..." : "Masuk ke Dashboard"}
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
