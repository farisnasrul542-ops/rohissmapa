"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquareHeart,
  Search,
  Clock,
  Sparkles,
  MessageSquare,
  Send,
  Trash2,
  X,
  User,
  ChevronDown,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { StudentAspirasi } from "@/lib/adminData";

export default function AdminAspirasiPage() {
  const { aspirasiList, replyAspirasi, deleteAspirasi, searchQuery } =
    useAdmin();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState("");
  const [replyModalItem, setReplyModalItem] = useState<StudentAspirasi | null>(
    null
  );
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<
    "pending" | "in_review" | "resolved"
  >("resolved");

  const replyFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReplyModalItem(null);
    };
    if (replyModalItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [replyModalItem]);

  const query = (localSearch || searchQuery).toLowerCase();

  const filteredAspirasi = aspirasiList.filter((item) => {
    const matchesStatus =
      statusFilter === "all" ? true : item.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" ? true : item.category === categoryFilter;

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.message.toLowerCase().includes(query) ||
      item.senderName.toLowerCase().includes(query) ||
      (item.adminReply && item.adminReply.toLowerCase().includes(query));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const openReplyModal = (item: StudentAspirasi) => {
    setReplyModalItem(item);
    setReplyText(item.adminReply || "");
    setReplyStatus(item.status === "pending" ? "resolved" : item.status);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalItem || !replyText.trim()) return;

    replyAspirasi(replyModalItem.id, replyText.trim(), replyStatus);
    setReplyModalItem(null);
    setReplyText("");
  };

  const pendingCount = aspirasiList.filter((a) => a.status === "pending").length;
  const resolvedCount = aspirasiList.filter((a) => a.status === "resolved").length;

  return (
    <div className="space-y-6">
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 border-b-[4px] border-b-slate-300/80 shadow-[0_8px_24px_-6px_rgba(6,32,23,0.05)]">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-amber-300 flex items-center justify-center border border-emerald-700/40 border-b-[3px] border-b-black shadow-md shrink-0">
            <MessageSquareHeart size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-950/[0.06] text-emerald-950 border border-emerald-900/15">
                SUARA & KONSELING SISWA
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                • {pendingCount} Menunggu / {resolvedCount} Terjawab
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kotak Aspirasi & Layanan Konseling Pelajar
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tampung usulan kegiatan dakwah, masukan fasilitas Musholla Al-Ikhlas, dan pertanyaan keagamaan siswa SMAPA
            </p>
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 border-b-[3px] border-b-slate-300/70 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div
            data-lenis-prevent="true"
            onWheel={(e) => {
              if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0 overscroll-contain"
          >
            {[
              { id: "all", label: `Semua (${aspirasiList.length})` },
              { id: "pending", label: `Belum Ditanggapi (${pendingCount})` },
              { id: "in_review", label: "Sedang Ditinjau" },
              { id: "resolved", label: `Selesai Dijawab (${resolvedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-[#062017] text-white border border-emerald-800 border-b-2 border-b-black shadow-xs"
                    : "bg-slate-100/80 hover:bg-slate-200/80 text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Custom Category Select */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-3.5 pr-9 py-2 rounded-xl border border-slate-200/90 bg-slate-50/70 focus:bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-800 cursor-pointer"
              >
                <option value="all">Semua Kategori</option>
                <option value="Program Dakwah & Kajian">Program Dakwah & Kajian</option>
                <option value="Fasilitas Musholla Al-Ikhlas">Fasilitas Musholla Al-Ikhlas</option>
                <option value="Konseling & Curhat">Konseling & Curhat</option>
                <option value="Saran & Kritik">Saran & Kritik</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Cari aspirasi atau pengirim..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200/90 bg-slate-50/70 focus:bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-800 transition-all"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── ASPIRASI CARDS FEED ── */}
      <div className="space-y-4">
        {filteredAspirasi.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 border-b-[4px] border-b-slate-300/90 hover:border-emerald-800/35 shadow-[0_8px_24px_-6px_rgba(6,32,23,0.05)] transition-all space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border ${
                    item.status === "resolved"
                      ? "bg-[#062017] text-emerald-100 border-emerald-800"
                      : item.status === "in_review"
                      ? "bg-slate-100 text-slate-800 border-slate-300"
                      : "bg-amber-50 text-amber-950 border-amber-300/80"
                  }`}
                >
                  {item.status === "resolved"
                    ? "✓ Selesai Dijawab"
                    : item.status === "in_review"
                    ? "◷ Sedang Ditinjau"
                    : "● Menunggu Balasan"}
                </span>

                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80">
                  {item.category}
                </span>

                {item.isAnonymous && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                    Anonim
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Clock size={12} />
                <span>{item.createdAt}</span>
              </div>
            </div>

            {/* Title & Message */}
            <div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                {item.title}
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 border-l-[4px] border-l-[#062017]">
                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                  &quot;{item.message}&quot;
                </p>
              </div>
            </div>

            {/* Sender identity */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                  <User size={13} />
                </div>
                <span>
                  Pengirim: <strong className="text-slate-900">{item.senderName}</strong>{" "}
                  ({item.senderClass})
                </span>
                {item.contact && (
                  <span className="text-emerald-800 font-bold">
                    • Kontak: {item.contact}
                  </span>
                )}
              </div>
            </div>

            {/* Admin Response Box */}
            {item.adminReply && (
              <div className="p-4 rounded-2xl bg-emerald-950/[0.04] border border-emerald-900/15 text-xs">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 font-extrabold text-emerald-950">
                    <Sparkles size={13} className="text-emerald-800" />
                    <span>Tanggapan Resmi BPH Rohis SMAPA:</span>
                  </div>
                  {item.repliedAt && (
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {item.repliedAt}
                    </span>
                  )}
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {item.adminReply}
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => openReplyModal(item)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white font-extrabold text-xs border border-emerald-700/40 border-b-[2.5px] border-b-black shadow-sm transition-all cursor-pointer"
              >
                <MessageSquare size={13} className="text-amber-300" />
                <span>{item.adminReply ? "Perbarui Tanggapan" : "Tanggapi Aspirasi"}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Hapus aspirasi "${item.title}"?`)) {
                    deleteAspirasi(item.id);
                  }
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-colors cursor-pointer"
                title="Hapus Aspirasi"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {filteredAspirasi.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/90">
            <MessageSquareHeart size={36} className="mx-auto mb-2 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-800">
              Tidak ada aspirasi yang cocok
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Semua aspirasi siswa telah ditangani atau filter pencarian tidak menemukan hasil.
            </p>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL: TANGGAPI ASPIRASI (STICKY HEADER + SCROLL BODY + STICKY FOOTER)
         ════════════════════════════════════════════════════════════════════════ */}
      {replyModalItem && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overscroll-contain"
          onClick={() => setReplyModalItem(null)}
          onWheel={(e) => {
            if (replyFormRef.current && !replyFormRef.current.contains(e.target as Node)) {
              replyFormRef.current.scrollTop += e.deltaY;
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
            className="bg-white rounded-[28px] max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_28px_70px_-15px_rgba(6,32,23,0.45)] border border-slate-200/90 overscroll-contain"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-[#062017] via-emerald-800 to-[#062017] shrink-0" />

            {/* Sticky Header */}
            <div className="px-6 sm:px-7 py-4.5 bg-gradient-to-b from-slate-50/90 to-white border-b border-slate-200/80 flex items-center justify-between gap-4 shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950 bg-emerald-950/[0.07] border border-emerald-900/15 px-2.5 py-0.5 rounded-md">
                  RESPON PENGURUS BPH
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 tracking-tight">
                  {replyModalItem.adminReply
                    ? "Perbarui Tanggapan Aspirasi"
                    : "Tanggapi Aspirasi Siswa"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReplyModalItem(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <form
              ref={replyFormRef}
              id="reply-aspirasi-form"
              onSubmit={handleReplySubmit}
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-7 py-5 space-y-4 text-xs custom-scrollbar"
            >
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 border-l-[4px] border-l-[#062017]">
                <p className="font-extrabold text-slate-900 mb-1">
                  {replyModalItem.title}
                </p>
                <p className="text-slate-600 italic leading-relaxed">
                  &quot;{replyModalItem.message}&quot;
                </p>
                <p className="text-[10.5px] font-semibold text-slate-400 mt-2">
                  Pengirim: {replyModalItem.senderName} ({replyModalItem.senderClass})
                </p>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Status Penanganan
                </label>
                <div className="relative">
                  <select
                    value={replyStatus}
                    onChange={(e) => setReplyStatus(e.target.value as any)}
                    className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 cursor-pointer"
                  >
                    <option value="resolved">✓ Selesai Dijawab (Tampil Publik)</option>
                    <option value="in_review">◷ Sedang Ditinjau BPH</option>
                    <option value="pending">● Belum Ditanggapi</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Isi Tanggapan Resmi BPH Rohis <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan jawaban yang santun, solutif, dan jelas..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-medium leading-relaxed focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                />
              </div>
            </form>

            {/* Sticky Footer */}
            <div className="px-6 sm:px-7 py-4 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setReplyModalItem(null)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 border-b-2 border-b-slate-300 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="reply-aspirasi-form"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white font-extrabold text-xs border border-emerald-700/40 border-b-[2.5px] border-b-black shadow-md transition-all cursor-pointer"
              >
                <Send size={13} className="text-amber-300" />
                <span>Kirim Tanggapan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
