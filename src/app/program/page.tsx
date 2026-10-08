"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DIVISIONS, SITE } from "@/lib/constants";
import { CheckCircle2, Users, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";
import Link from "next/link";

export default function ProgramPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Struktur Kerja & Aksi Nyata
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            5 Divisi & Program Kerja Rohis SMAPA
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
            Rancangan program pembinaan keislaman, mentoring, kajian keputrian, dan kegiatan sosial siswa-siswi SMA Negeri 4 Purwokerto periode 2025/2026.
          </p>
        </div>
      </section>

      {/* Program Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 -mt-8 relative z-10">
        <div className="space-y-8">
          {DIVISIONS.map((prog: any) => (
            <div
              key={prog.id}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-emerald-950/5 border border-emerald-900/10 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white"
                    style={{ backgroundColor: prog.color }}
                  >
                    {prog.shortName}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
                    {prog.name}
                  </h2>
                </div>

                <div className="flex items-center gap-4 text-xs bg-gray-50 px-4 py-2 rounded-2xl border border-gray-200/60">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Koordinator:</span>
                    <span className="font-bold text-gray-900">{prog.coordinator}</span>
                  </div>
                  <span className="w-px h-6 bg-gray-200" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Kader Divisi:</span>
                    <span className="font-bold text-emerald-800">{prog.members?.length || 4} Siswa</span>
                  </div>
                </div>
              </div>

              <div className="py-6">
                <p className="text-sm text-gray-700 leading-relaxed mb-6">
                  {prog.description}
                </p>

                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Program Kerja & Agenda Prioritas:
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mb-6">
                  {prog.programs?.map((detail: string, i: number) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 text-xs font-medium text-emerald-950 flex items-start gap-2.5"
                    >
                      <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Susunan Anggota Divisi:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {prog.members?.map((m: any) => (
                      <span
                        key={m.id}
                        className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <span>{m.name}</span>
                        <span className="text-[10px] text-gray-400">({m.classGrade})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bergabung */}
        <div className="mt-12 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Tertarik Bergabung dengan Salah Satu Divisi?</h3>
            <p className="text-xs text-emerald-200/80">
              Pendaftaran anggota Rohis SMA Negeri 4 Purwokerto dibuka untuk seluruh siswa kelas X, XI, dan XII.
            </p>
          </div>
          <Link
            href="/pendaftaran"
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shrink-0 transition-colors"
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
