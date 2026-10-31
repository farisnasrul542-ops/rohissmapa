"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Megaphone,
  GraduationCap,
  Save,
  Sparkles,
  Type,
  FileText,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { PEMBINA_WELCOME } from "@/lib/constants";

export default function AdminPengumumanPage() {
  const { announcement, updateAnnouncement } = useAdmin();

  const [title, setTitle] = useState(announcement.title);
  const [content, setContent] = useState(announcement.content);
  const [isActive, setIsActive] = useState(announcement.isActive);
  const [type, setType] = useState<"info" | "urgent" | "event">(
    announcement.type
  );

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement({
      title,
      content,
      isActive,
      type,
    });
  };

  return (
    <div className="space-y-6">
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 border-b-[4px] border-b-slate-300/80 shadow-[0_8px_24px_-6px_rgba(6,32,23,0.05)]">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-emerald-100 flex items-center justify-center border border-emerald-700/40 border-b-[3px] border-b-black shadow-md shrink-0">
            <Megaphone size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-950/[0.06] text-emerald-950 border border-emerald-900/15">
                SIARAN & PEMBINAAN
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                • {isActive ? "Siaran Aktif" : "Siaran Nonaktif"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Broadcast Pengumuman & Informasi Dewan Pembina
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur running announcement publik dan tinjau amanat dari dewan guru pembina Rohis SMAPA
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pengumuman Broadcast Banner (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 border-b-[4px] border-b-slate-300/90 shadow-[0_10px_28px_-8px_rgba(6,32,23,0.06)]">
            <div className="flex items-center gap-2 text-emerald-900 text-xs font-black uppercase tracking-wider mb-1.5">
              <Sparkles size={14} />
              <span>Konfigurasi Siaran Utama</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mb-1">
              Pengaturan Teks Pengumuman Berjalan
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Pengumuman ini tampil di bagian atas dashboard pengurus dan bar informasi publik.
            </p>

            {/* Live Banner Preview */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#062017] via-[#0b3324] to-[#041610] text-white border border-emerald-800/40 shadow-md">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                  PREVIEW BANNER SIARAN
                </span>
                <span className="text-[10px] font-bold text-emerald-200/80">
                  {isActive ? "● Ditampilkan" : "○ Disembunyikan"}
                </span>
              </div>
              <p className="text-xs font-extrabold text-white mb-0.5">
                {title || "Judul Pengumuman"}
              </p>
              <p className="text-[11.5px] text-emerald-100/85 leading-relaxed">
                {content || "Isi pengumuman siaran akan tampil di sini..."}
              </p>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <p className="font-extrabold text-slate-900">
                    Status Tayang Pengumuman
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isActive
                      ? "Sedang aktif ditampilkan di banner utama"
                      : "Dinonaktifkan / disembunyikan sementara"}
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#062017]"></div>
                </label>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Kategori Pengumuman
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "info", label: "Informasi Umum" },
                    { id: "urgent", label: "Penting / Mendesak" },
                    { id: "event", label: "Agenda Mendatang" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id as any)}
                      className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                        type === t.id
                          ? "bg-[#062017] text-white border-emerald-900 border-b-2 border-b-black shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200/90 hover:bg-slate-100"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Judul Ringkas <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Type
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Kajian Rutin Jumat & Evaluasi BPH SMAPA"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Isi Pesan Siaran (Broadcast) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FileText
                    size={14}
                    className="absolute left-3.5 top-3 text-slate-400 pointer-events-none"
                  />
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Ketik pengumuman yang ingin disampaikan kepada pengurus dan siswa..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-medium leading-relaxed focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] font-semibold text-slate-400">
                  Terakhir diperbarui: {announcement.updatedAt}
                </span>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white font-extrabold text-xs border border-emerald-700/40 border-b-[2.5px] border-b-black shadow-md transition-all cursor-pointer"
                >
                  <Save size={14} className="text-amber-300" />
                  <span>Simpan Pengumuman</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Dewan Pembina Rohis SMAPA (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 border-b-[4px] border-b-slate-300/90 shadow-[0_10px_28px_-8px_rgba(6,32,23,0.06)] space-y-5">
            <div>
              <div className="flex items-center gap-2 text-emerald-900 text-xs font-black uppercase tracking-wider mb-1">
                <GraduationCap size={16} />
                <span>Dewan Guru Pembina Rohis</span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                Profil & Amanat Pembina Rohis SMAPA
              </h3>
            </div>

            <div className="space-y-4">
              {PEMBINA_WELCOME.pembinaList.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl border border-slate-200/80 border-b-[2.5px] border-b-slate-300 bg-slate-50/60 text-xs space-y-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-xs bg-[#062017]">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#062017] text-emerald-100">
                        {p.role}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {p.role === "Pembina 1"
                          ? "Pembina Utama & Guru PAI"
                          : "Pembina Rohis & Pendamping Syiar"}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 italic line-clamp-3 leading-relaxed text-[11.5px] bg-white p-3 rounded-xl border border-slate-200/70">
                    &quot;{p.paragraphs[0]}&quot;
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 border-l-[4px] border-l-[#062017] text-[11.5px] text-slate-700">
              <p className="font-extrabold text-slate-900 mb-0.5">Catatan BPH:</p>
              <p className="leading-relaxed">
                Setiap pergantian kurikulum mentoring dan jadwal kajian akbar wajib dikonsultasikan bersama Pembina 1 & Pembina 2.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
