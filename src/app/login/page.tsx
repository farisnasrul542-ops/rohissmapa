"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Globe,
} from "lucide-react";
import {
  verifyAdminPassword,
  loginAdminSession,
  isAdminAuthenticated,
} from "@/lib/adminAuth";

export default function LoginPage() {
  const router = useRouter();
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
        setErrorMsg(
          "Kata sandi (Password) atau Username salah! Silakan coba kembali."
        );
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#041811] via-[#07261b] to-[#03110c] p-4 text-white relative overflow-hidden select-none">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white p-2 shadow-[0_14px_30px_rgba(0,0,0,0.4)] border border-white/25 mb-3">
            <Image
              src="/images/logo-transparent.png"
              alt="Logo Rohis SMA Negeri 4 Purwokerto"
              width={64}
              height={64}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-[10px] font-black tracking-widest uppercase text-amber-300 inline-flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>PORTAL KHUSUS PENGURUS BPH</span>
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Login Admin Rohis SMAPA
          </h1>
          <p className="text-xs text-emerald-200/70 mt-1">
            SMA Negeri 4 Purwokerto • Terproteksi Kata Sandi
          </p>
        </div>

        {/* 3D Tactile Card Box */}
        <div className="bg-white text-slate-900 rounded-[28px] overflow-hidden shadow-[0_28px_70px_-15px_rgba(0,0,0,0.55)] border border-slate-200/90 border-b-[5px] border-b-slate-300">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#062017] via-emerald-700 to-[#062017]" />

          <div className="p-7 sm:p-8">
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5">
                <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
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
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 focus:bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Kata Sandi (Password) *
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
                    placeholder="Masukkan password admin..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 focus:bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
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
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white font-extrabold text-xs tracking-wide border border-emerald-700/40 border-b-[3px] border-b-black shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <Lock size={14} className="text-amber-300" />
                <span>
                  {isLoading
                    ? "Memverifikasi kredensial..."
                    : "Masuk ke Panel Admin BPH"}
                </span>
                <ArrowRight size={14} className="text-amber-300" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-7 text-center text-xs text-emerald-200/70">
          <a
            href="https://rohis-sman4pwt.web.id/"
            className="hover:text-amber-300 font-semibold transition-colors inline-flex items-center gap-1.5"
          >
            <Globe size={13} />
            <span>Buka Website Umum (rohis-sman4pwt.web.id)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
