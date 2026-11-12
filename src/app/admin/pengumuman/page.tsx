"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  X,
  Info,
  ArrowRight,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminPengumumanPage() {
  const { announcement, updateAnnouncement, showToast } = useAdmin();

  const [title, setTitle] = useState(announcement.title || "Kajian Rutin Jumat");
  const [content, setContent] = useState(
    announcement.content || "Mari mengikuti kajian bersama di Musholla Al-Ikhlas."
  );
  const [isActive, setIsActive] = useState(announcement.isActive ?? true);
  const [category, setCategory] = useState<string>("Informasi Umum");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const categories = ["Informasi Umum", "Penting", "Agenda"];

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement({
      title: title.trim(),
      content: content.trim(),
      isActive,
      type: category === "Penting" ? "urgent" : category === "Agenda" ? "event" : "info",
    });
    setSavedSuccess(true);
    showToast("Pengumuman berhasil disimpan!", "success");
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Pengumuman &amp; Informasi Pembina
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola pengumuman yang ditampilkan di website publik dan lihat informasi pembina ROHIS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── LEFT COLUMN: PENGATURAN PENGUMUMAN (MOCKUP 03) ── */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-block bg-[#d7f0e3] text-[#006d44] font-semibold text-xs px-3 py-1 rounded-full mb-5">
              Pengaturan Pengumuman
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-5">
              {/* Siaran Aktif Toggle */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      Siaran Aktif
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-[#d7f0e3] text-[#006d44]"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isActive ? "ON" : "OFF"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Aktifkan untuk menampilkan pengumuman di website publik.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007a4d]"></div>
                </label>
              </div>

              {/* Kategori Pengumuman */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Kategori Pengumuman
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        category === cat
                          ? "bg-[#007a4d] text-white shadow-xs"
                          : "bg-[#f8faf9] text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Judul */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Judul <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Kajian Rutin Jumat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                />
              </div>

              {/* Isi Pengumuman */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Isi Pengumuman <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Mari mengikuti kajian bersama di Musholla Al-Ikhlas."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#007a4d] hover:bg-[#006841] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Save size={15} />
                <span>Simpan Pengumuman</span>
              </button>
            </form>
          </div>

          {/* Success Toast */}
          {savedSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-[#d7f0e3] text-[#006d44] border border-[#006d44]/20 text-xs font-medium flex items-center justify-between animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Pengumuman berhasil disimpan.</span>
              </div>
              <button
                type="button"
                onClick={() => setSavedSuccess(false)}
                className="text-[#006d44] hover:opacity-80"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: PRATINJAU & DEWAN PEMBINA (MOCKUP 03) ── */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: Pratinjau Pengumuman */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
            <div className="inline-block bg-[#d7f0e3] text-[#006d44] font-semibold text-xs px-3 py-1 rounded-full mb-1">
              Pratinjau Pengumuman
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Tampilan pengumuman di website publik (contoh).
            </p>

            <div className="p-4 rounded-2xl bg-[#f8faf9] border border-slate-200 flex items-center gap-4">
              <div className="w-20 h-16 relative shrink-0">
                <Image
                  src="/images/logo-transparent.png"
                  alt="Logo Rohis"
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
              <div className="w-px h-12 bg-slate-200 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="inline-block text-[10px] font-semibold text-[#006d44] bg-[#d7f0e3] px-2 py-0.5 rounded-full mb-1">
                  {category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {title || "Kajian Rutin Jumat"}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                  {content || "Mari mengikuti kajian bersama di Musholla Al-Ikhlas."}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Dewan Pembina */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
            <div className="inline-block bg-[#d7f0e3] text-[#006d44] font-semibold text-xs px-3 py-1 rounded-full mb-4">
              Dewan Pembina
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pembina 1 */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-[#f8faf9]">
                <div className="relative w-full h-36 bg-slate-200">
                  <Image
                    src="/images/pembina-1.png"
                    alt="Toyyib Yuliadi"
                    fill
                    sizes="(max-width: 640px) 100vw, 240px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-semibold bg-[#d7f0e3] text-[#006d44] px-2 py-0.5 rounded-full">
                      Pembina 1
                    </span>
                  </div>
                </div>
                <div className="p-3 text-center">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    Toyyib Yuliadi, Sh. M.Pd.
                  </h4>
                  <p className="text-[10.5px] text-slate-500 mt-0.5 truncate">
                    Guru Pembina PAI SMA Negeri 4 Purwokerto
                  </p>
                </div>
              </div>

              {/* Pembina 2 */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-[#f8faf9]">
                <div className="relative w-full h-36 bg-slate-200">
                  <Image
                    src="/images/pembina-2.png"
                    alt="Saifur Ro'yi"
                    fill
                    sizes="(max-width: 640px) 100vw, 240px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-semibold bg-[#d7f0e3] text-[#006d44] px-2 py-0.5 rounded-full">
                      Pembina 2
                    </span>
                  </div>
                </div>
                <div className="p-3 text-center">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    Saifur Ro&apos;yi, S.Pd.
                  </h4>
                  <p className="text-[10.5px] text-slate-500 mt-0.5 truncate">
                    Guru Pembina PAI SMA Negeri 4 Purwokerto
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                <Info size={13} className="text-[#006d44]" />
                Ubah foto dan sambutan melalui Editor Beranda.
              </span>
              <Link
                href="/admin/content/home"
                className="text-xs font-semibold text-[#007a4d] hover:underline flex items-center gap-1"
              >
                <span>Buka Editor Sambutan</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
