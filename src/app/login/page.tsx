"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ShieldCheck, ArrowRight, UserCheck, CheckCircle2 } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function LoginPage() {
  const [role, setRole] = useState<"member" | "admin">("member");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] p-4 text-white">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-950 flex items-center justify-center text-white shadow-lg border border-emerald-500/30 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-amber-300 text-xs tracking-wider">SMAPA</span>
            </div>
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Portal Masuk Rohis SMAPA
          </h1>
          <p className="text-xs text-emerald-200/70 mt-1">
            SMA Negeri 4 Purwokerto • Presensi & Sistem Keanggotaan
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white text-gray-900 rounded-3xl p-8 shadow-2xl border border-emerald-900/10">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-1.5 bg-gray-100 p-1.5 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setRole("member")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === "member"
                  ? "bg-white text-emerald-950 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Siswa / Anggota
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === "admin"
                  ? "bg-white text-emerald-950 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Pengurus / BPH
            </button>
          </div>

          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-lg font-black text-emerald-950 mb-1">
                Autentikasi Berhasil
              </h3>
              <p className="text-xs text-gray-600 mb-6">
                Selamat datang kembali di sistem {role === "admin" ? "Pengurus" : "Siswa"}.
              </p>
              <Link
                href="/"
                className="w-full py-3 rounded-xl bg-emerald-800 text-white font-bold text-xs inline-block text-center shadow-md hover:bg-emerald-900 transition-colors"
              >
                Menuju Beranda Rohis SMAPA
              </Link>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {role === "admin" ? "Username / Email Pengurus" : "NISN / Nomor WhatsApp / Email"}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder={role === "admin" ? "pengurus@sman4purwokerto.sch.id" : "08xxxxxxxxxx / NISN"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded text-emerald-800 focus:ring-emerald-700" />
                  <span>Ingat Saya</span>
                </label>
                <a href="#" className="font-semibold text-emerald-800 hover:underline">
                  Lupa Sandi?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white font-bold text-xs tracking-wide shadow-md hover:from-emerald-700 hover:to-emerald-900 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <span>Memverifikasi...</span>
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            <span>Belum terdaftar sebagai anggota? </span>
            <Link href="/pendaftaran" className="font-bold text-emerald-800 hover:underline">
              Daftar Sekarang
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-emerald-300/60">
          <Link href="/" className="hover:text-amber-300 transition-colors">
            ← Kembali ke Beranda ROHIS SMAPA
          </Link>
        </div>
      </div>
    </div>
  );
}
