"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState<"member" | "admin">("admin");
  const [email, setEmail] = useState("admin@sman4purwokerto.sch.id");
  const [password, setPassword] = useState("smapa2026");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRoleChange = (newRole: "member" | "admin") => {
    setRole(newRole);
    if (newRole === "admin") {
      setEmail("admin@sman4purwokerto.sch.id");
      setPassword("smapa2026");
    } else {
      setEmail("");
      setPassword("");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#041811] via-[#07261b] to-[#03110c] p-4 text-white relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center gap-3 group mb-3">
            <div className="relative w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-2 shadow-[0_14px_30px_rgba(0,0,0,0.4)] border border-white/25 group-hover:scale-105 transition-all overflow-hidden">
              <Image
                src="/images/logo-transparent.png"
                alt="Logo Rohis SMA Negeri 4 Purwokerto"
                width={64}
                height={64}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </Link>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-black tracking-widest uppercase text-amber-300">
              PORTAL OTENTIKASI RESMI
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Sistem Informasi Rohis SMAPA
          </h1>
          <p className="text-xs text-emerald-200/70 mt-1">
            SMA Negeri 4 Purwokerto • Panel Eksekutif Pengurus BPH
          </p>
        </div>

        {/* 3D Tactile Card Box */}
        <div className="bg-white text-slate-900 rounded-[28px] overflow-hidden shadow-[0_28px_70px_-15px_rgba(0,0,0,0.55)] border border-slate-200/90 border-b-[5px] border-b-slate-300">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#062017] via-emerald-700 to-[#062017]" />

          <div className="p-7 sm:p-8">
            {/* Role Tabs */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-2xl mb-6 border border-slate-200/80">
              <button
                type="button"
                onClick={() => handleRoleChange("admin")}
                className={`py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  role === "admin"
                    ? "bg-[#062017] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <ShieldCheck size={14} className={role === "admin" ? "text-amber-300" : ""} />
                <span>Pengurus / BPH</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("member")}
                className={`py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  role === "member"
                    ? "bg-[#062017] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Siswa / Anggota
              </button>
            </div>

            {isSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-950 text-amber-300 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <CheckCircle2 size={34} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">
                  Otentikasi Berhasil
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Selamat datang kembali di sistem {role === "admin" ? "Pengurus BPH" : "Anggota Rohis"}.
                </p>
                {role === "admin" ? (
                  <Link
                    href="/admin"
                    className="w-full py-3 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-white font-extrabold text-xs inline-block text-center border border-emerald-700/40 border-b-[3px] border-b-black shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    Buka Dashboard Admin BPH →
                  </Link>
                ) : (
                  <Link
                    href="/"
                    className="w-full py-3 rounded-xl bg-[#062017] text-white font-extrabold text-xs inline-block text-center shadow-md"
                  >
                    Menuju Beranda Rohis SMAPA
                  </Link>
                )}
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    {role === "admin"
                      ? "Username / Email Pengurus"
                      : "NISN / Nomor WhatsApp / Email"}
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder={
                        role === "admin"
                          ? "admin@sman4purwokerto.sch.id"
                          : "08xxxxxxxxxx / NISN"
                      }
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 focus:bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 focus:bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white font-extrabold text-xs tracking-wide border border-emerald-700/40 border-b-[3px] border-b-black shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Memverifikasi kredensial...</span>
                  ) : (
                    <>
                      <span>
                        {role === "admin"
                          ? "Masuk ke Panel Admin BPH"
                          : "Masuk ke Akun Siswa"}
                      </span>
                      <ArrowRight size={14} className="text-amber-300" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              {role === "admin" ? (
                <Link
                  href="/admin"
                  className="font-extrabold text-emerald-900 hover:underline inline-flex items-center gap-1"
                >
                  <span>Akses Cepat Pengurus: Buka Panel Admin Langsung</span>
                  <ArrowRight size={12} />
                </Link>
              ) : (
                <Link
                  href="/"
                  className="font-extrabold text-emerald-900 hover:underline"
                >
                  Kembali ke Beranda Utama
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-7 text-center text-xs text-emerald-200/70">
          <Link href="/" className="hover:text-amber-300 font-semibold transition-colors">
            ← Kembali ke Beranda Publik ROHIS SMAPA
          </Link>
        </div>
      </div>
    </div>
  );
}
