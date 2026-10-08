"use client";

import { useState, useMemo } from "react";
import {
  KEPENGURUSAN_PERIODS,
  ACTIVE_PERIOD,
  PENGURUS_DATA,
} from "@/lib/pengurusData";
import { PengurusMember } from "@/lib/types";
import {
  CheckCircle2,
  Sparkles,
  Quote,
  X,
  Search,
  Users,
  Award,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { SITE } from "@/lib/constants";

export default function KepengurusanSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(ACTIVE_PERIOD);
  const [selectedDivision, setSelectedDivision] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalMember, setActiveModalMember] =
    useState<PengurusMember | null>(null);

  // List of unique divisions for current period
  const currentPeriodMembers = useMemo(() => {
    return PENGURUS_DATA[selectedPeriod] || [];
  }, [selectedPeriod]);

  const divisions = useMemo(() => {
    const list = ["Semua"];
    currentPeriodMembers.forEach((m) => {
      if (!list.includes(m.division)) {
        list.push(m.division);
      }
    });
    return list;
  }, [currentPeriodMembers]);

  // Filtered members by division and search query
  const filteredMembers = useMemo(() => {
    return currentPeriodMembers.filter((m) => {
      const matchDivision =
        selectedDivision === "Semua" || m.division === selectedDivision;
      const matchQuery =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.classGrade.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDivision && matchQuery;
    });
  }, [currentPeriodMembers, selectedDivision, searchQuery]);

  const isActivePeriod = selectedPeriod === ACTIVE_PERIOD;

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden" id="kepengurusan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 1. HORIZONTAL PERIOD FILTER TABS (MATCHES REFERENCE PHOTO) ── */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto py-2 px-2 no-scrollbar">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-[#f4f6f8] p-1.5 rounded-full border border-slate-200/80 shadow-inner">
            {KEPENGURUSAN_PERIODS.map((period) => {
              const isActive = selectedPeriod === period;
              return (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setSelectedDivision("Semua");
                    setSearchQuery("");
                  }}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-[#0b1c14] text-white shadow-md shadow-emerald-950/20"
                      : "bg-[#e5ecf2] hover:bg-[#d9e3ec] text-slate-700 font-semibold"
                  }`}
                >
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  )}
                  <span>{period}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. HEADER INFO & BADGE ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* Active Period Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-3 border transition-colors bg-emerald-50 text-emerald-700 border-emerald-200">
            <span
              className={`w-2 h-2 rounded-full ${
                isActivePeriod ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span>
              {isActivePeriod ? "Periode Aktif" : "Arsip Demisioner"}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
            Kepengurusan {selectedPeriod}
          </h2>

          {/* Subtitle with dynamic member count */}
          <p className="text-sm sm:text-base font-medium text-slate-500">
            {currentPeriodMembers.length} pengurus terdaftar
          </p>
        </div>

        {/* ── 3. DIVISION TABS & SEARCH (OPTIONAL ENHANCEMENT) ── */}
        {divisions.length > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
            {/* Division Filter Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto py-1 no-scrollbar">
              {divisions.map((div) => {
                const isDivActive = selectedDivision === div;
                const count =
                  div === "Semua"
                    ? currentPeriodMembers.length
                    : currentPeriodMembers.filter((m) => m.division === div).length;
                return (
                  <button
                    key={div}
                    onClick={() => setSelectedDivision(div)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isDivActive
                        ? "bg-emerald-800 text-white shadow-sm"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {div} ({count})
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama / jabatan..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-600 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── 4. MEMBER CARDS GRID (EXACT LAYOUT AS REFERENCE PHOTO) ── */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setActiveModalMember(member)}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group flex flex-col cursor-pointer"
              >
                {/* Image Frame with soft blue-gray backdrop matching reference */}
                <div className="h-80 sm:h-96 relative flex items-end justify-center overflow-hidden bg-[#eef3f8]">
                  {/* Subtle top pill badge for Division / Sash */}
                  {member.sashTitle && (
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-white/90 backdrop-blur-md text-emerald-950 border border-slate-200/80 shadow-xs">
                        {member.sashTitle}
                      </span>
                    </div>
                  )}

                  {/* Cutout portrait positioned at bottom */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* White bottom text container */}
                <div className="bg-white p-5 text-center flex flex-col items-center justify-center flex-1 border-t border-slate-100/60">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-1 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-700 mb-0.5 line-clamp-1">
                    {member.role}
                  </p>
                  <p className="text-xs font-medium text-slate-500 mb-3">
                    {member.classGrade}
                  </p>

                  {/* ── FITUR INSTAGRAM PERSIS SEPERTI GAMBAR REFERENSI ── */}
                  <div className="w-full pt-3 border-t border-slate-100 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-semibold mb-0.5">
                      <GraduationCap size={15} className="text-amber-700/80 shrink-0" />
                      <span>{SITE.schoolName}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 mb-2.5">
                      Periode {member.period}
                    </p>

                    {member.instagram ? (
                      <a
                        href={`https://instagram.com/${member.instagram.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#fa7e1e] via-[#d62976] to-[#962fbf] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-500/20 hover:shadow-pink-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between gap-2 group/btn cursor-pointer"
                        title={`Buka Instagram @${member.instagram.replace(/^@/, "")}`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {/* Instagram Camera Icon */}
                          <svg
                            className="w-4 h-4 shrink-0 fill-none stroke-current"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                          </svg>
                          <span className="truncate">@{member.instagram.replace(/^@/, "")}</span>
                        </div>
                        {/* External Link Icon ↗ */}
                        <svg
                          className="w-3.5 h-3.5 shrink-0 fill-none stroke-current group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                          viewBox="0 0 24 24"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    ) : (
                      <div className="w-full py-2 px-3 rounded-full bg-slate-100 text-slate-400 text-xs font-medium text-center">
                        Rohis SMAPA
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300 max-w-xl mx-auto">
            <Users size={40} className="mx-auto text-slate-400 mb-3" />
            <h4 className="text-base font-bold text-slate-700 mb-1">
              Tidak ada data pengurus
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Tidak ditemukan pengurus untuk filter yang dipilih.
            </p>
            <button
              onClick={() => {
                setSelectedDivision("Semua");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* ── 5. MODAL DETAIL PENGURUS ── */}
      {activeModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveModalMember(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-md transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Image Header */}
            <div className="h-64 sm:h-72 bg-[#eef3f8] relative flex items-end justify-center overflow-hidden">
              <img
                src={activeModalMember.image}
                alt={activeModalMember.name}
                className="w-full h-full object-contain object-bottom"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-800 text-white shadow-md">
                  Periode {activeModalMember.period}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                  {activeModalMember.name}
                </h3>
                <p className="text-sm font-bold text-emerald-800 mb-1">
                  {activeModalMember.role}
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>{activeModalMember.classGrade}</span>
                  <span>•</span>
                  <span>Divisi {activeModalMember.division}</span>
                </div>
              </div>

              {/* Quote / Motto */}
              {activeModalMember.quote && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 mb-6 relative">
                  <Quote size={20} className="text-emerald-700/30 mb-1" />
                  <p className="text-xs sm:text-sm italic text-emerald-950 font-medium leading-relaxed">
                    "{activeModalMember.quote}"
                  </p>
                </div>
              )}

              {/* Actions / Social Link */}
              <div className="flex flex-col items-center justify-center pt-4 border-t border-slate-100">
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-semibold mb-0.5">
                  <GraduationCap size={15} className="text-amber-700/80 shrink-0" />
                  <span>{SITE.schoolName}</span>
                </div>
                <p className="text-xs font-medium text-slate-400 mb-3">
                  Periode {activeModalMember.period}
                </p>

                {activeModalMember.instagram ? (
                  <a
                    href={`https://instagram.com/${activeModalMember.instagram.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-xs py-2.5 px-5 rounded-full bg-gradient-to-r from-[#fa7e1e] via-[#d62976] to-[#962fbf] hover:opacity-95 text-white font-bold text-sm shadow-md shadow-pink-500/25 hover:shadow-pink-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between gap-2 group/btn cursor-pointer mb-4"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <svg
                        className="w-4 h-4 shrink-0 fill-none stroke-current"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      <span className="truncate">@{activeModalMember.instagram.replace(/^@/, "")}</span>
                    </div>
                    <svg
                      className="w-4 h-4 shrink-0 fill-none stroke-current group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                      viewBox="0 0 24 24"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 mb-4">{SITE.schoolName}</span>
                )}

                <button
                  onClick={() => setActiveModalMember(null)}
                  className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Tutup Jendela
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
