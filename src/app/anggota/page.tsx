"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KepengurusanSection from "@/components/KepengurusanSection";
import { SITE } from "@/lib/constants";
import { Users, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AnggotaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-14 lg:pt-38 lg:pb-16 bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-amber-300 text-xs font-bold mb-4 backdrop-blur-md shadow-md">
            <Users size={14} className="text-amber-400" />
            <span>Struktur Organisasi & Keanggotaan</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Pengurus & Anggota Rohis SMAPA
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Daftar lengkap dewan kepengurusan Badan Pengurus Harian (BPH) dan seluruh divisi per divisi serta arsip kepengurusan demisioner SMA Negeri 4 Purwokerto.
          </p>
        </div>
      </section>

      {/* Main Kepengurusan Section */}
      <KepengurusanSection />

      {/* CTA Join */}
      <section className="py-16 bg-emerald-950 text-white border-t border-emerald-800/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles size={32} className="mx-auto text-amber-400 mb-4 animate-bounce" />
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Tertarik Menjadi Bagian dari Pengurus Rohis?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xl mx-auto mb-8 leading-relaxed">
            Kami membuka kesempatan bagi seluruh siswa-siswi muslim SMAN 4 Purwokerto untuk bersama menebar manfaat, belajar kepemimpinan, dan meraih ridho Allah SWT.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/pendaftaran"
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all"
            >
              Daftar Sekarang
            </Link>
            <Link
              href="/program"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Lihat Program Kerja
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
