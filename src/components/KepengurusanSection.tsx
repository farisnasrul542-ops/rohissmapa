"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  KEPENGURUSAN_PERIODS,
  ACTIVE_PERIOD,
  PENGURUS_DATA,
} from "@/lib/pengurusData";
import { PengurusMember } from "@/lib/types";
import {
  Quote,
  X,
  Search,
  Users,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";

export default function KepengurusanSection({ preview = false }: { preview?: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const [selectedPeriod, setSelectedPeriod] = useState<string>(ACTIVE_PERIOD);
  const [selectedDivision, setSelectedDivision] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalMember, setActiveModalMember] =
    useState<PengurusMember | null>(null);
  const profileModalBodyRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

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

  const filteredMembers = useMemo(() => {
    return currentPeriodMembers.filter((m) => {
      const matchDivision =
        selectedDivision === "Semua" || m.division === selectedDivision;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.classGrade.toLowerCase().includes(q) ||
        m.division.toLowerCase().includes(q);
      return matchDivision && matchQuery;
    });
  }, [currentPeriodMembers, selectedDivision, searchQuery]);

  // Modal Escape & scroll lock
  useEffect(() => {
    if (!activeModalMember) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 30);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setActiveModalMember(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [activeModalMember]);

  const formatClassLabel = (grade: string) => {
    if (!grade) return "";
    return grade.toLowerCase().startsWith("kelas") ? grade : `Kelas ${grade}`;
  };

  return (
    <section
      id="kepengurusan"
      aria-label="Kenali Pengurus Kami"
      className={`py-10 sm:py-14 relative overflow-hidden scroll-mt-24 ${preview ? "clay-member-preview" : ""}`}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Matches 04_profil_pengurus.png) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#153E32] tracking-tight">
              Kenali Pengurus Kami
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#4A6B5F] mt-1">
              Periode {selectedPeriod} • {currentPeriodMembers.length} pengurus
            </p>
          </div>

          {/* Period Selector Pills */}
          <div
            role="tablist"
            aria-label="Pilih Periode Kepengurusan"
            className="inline-flex items-center gap-1.5 p-1.5 rounded-full clay-inner self-start sm:self-auto"
          >
            {KEPENGURUSAN_PERIODS.map((period) => {
              const isActive = selectedPeriod === period;
              return (
                <button
                  key={period}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => {
                    setSelectedPeriod(period);
                    setSelectedDivision("Semua");
                    setSearchQuery("");
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[36px] ${
                    isActive
                      ? "clay-btn-emerald text-white"
                      : "text-[#3B5E52] hover:text-[#153E32]"
                  }`}
                >
                  Periode {period}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Pills & Search Bar in Clay Container (Matches 04_profil_pengurus.png) */}
        <div className="clay-card p-3 sm:p-4 mb-7 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Division Filter Pills */}
          <div
            data-lenis-prevent="true"
            onWheel={(e) => {
              if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar overscroll-contain"
          >
            {divisions.map((div) => {
              const isDivActive = selectedDivision === div;
              const count =
                div === "Semua"
                  ? currentPeriodMembers.length
                  : currentPeriodMembers.filter((m) => m.division === div)
                      .length;
              return (
                <button
                  key={div}
                  type="button"
                  onClick={() => setSelectedDivision(div)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer min-h-[38px] ${
                    isDivActive
                      ? "clay-btn-emerald text-white"
                      : "clay-btn-mint text-[#153E32]"
                  }`}
                >
                  {div} ({count})
                </button>
              );
            })}
          </div>

          {/* Clay Search Input */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A6B5F] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau jabatan"
              aria-label="Cari nama atau jabatan pengurus"
              className="w-full pl-9 pr-9 py-2 rounded-full clay-input text-xs sm:text-sm text-[#153E32] placeholder-[#6A8A7F] min-h-[40px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Hapus pencarian"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A6B5F] hover:text-[#153E32] cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Member Cards Grid (4-col Desktop, 2-col Mobile matching 04_profil_pengurus.png) */}
        <AnimatePresence mode="wait">
          {filteredMembers.length > 0 ? (
            <motion.div
              key={`${selectedPeriod}-${selectedDivision}-${searchQuery}`}
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -4 }
              }
              transition={{
                duration: prefersReducedMotion ? 0.05 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
            >
              {(preview ? filteredMembers.slice(0, 4) : filteredMembers).map((member) => {
                const igHandle = member.instagram
                  ? member.instagram.replace(/^@/, "")
                  : "";
                return (
                  <article
                    key={member.id}
                    onClick={() => setActiveModalMember(member)}
                    className="clay-member-card clay-card clay-card-hover p-2.5 sm:p-4 flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      {/* Soft Mint Avatar Box */}
                      <div className={`clay-member-avatar relative ${preview ? "h-24 sm:h-32" : "h-36 min-[400px]:h-44 sm:h-52"} w-full rounded-[16px] overflow-hidden bg-gradient-to-b from-[#DFF6EC] via-[#ECF9F3] to-[#FFFFFF] border border-white/80 flex items-end justify-center p-2 sm:p-3 mb-3`}>
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-contain object-bottom transition-transform duration-300 group-hover:scale-103"
                          loading="lazy"
                        />
                      </div>

                      {/* Identity Details */}
                      <div className="px-0.5 text-left">
                        <h3 className="font-heading font-extrabold text-xs sm:text-[15px] text-[#153E32] group-hover:text-[#087A53] transition-colors leading-snug line-clamp-2 min-h-[2.1rem] sm:min-h-[2.4rem] mb-1.5">
                          {member.name}
                        </h3>

                        <div className="mb-2">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold clay-pill-mint max-w-full truncate">
                            {member.role}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-[#4A6B5F] mb-3">
                          <GraduationCap
                            size={14}
                            className="text-[#087A53] shrink-0"
                          />
                          <span className="truncate">
                            {formatClassLabel(member.classGrade)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Instagram / Contact Pill Button */}
                    <div className="pt-2 border-t border-[#DCEAE3]">
                      {igHandle ? (
                        <a
                          href={`https://instagram.com/${igHandle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={`Buka Instagram @${igHandle}`}
                          className="w-full py-2 px-2.5 sm:px-3 rounded-full clay-inner hover:bg-[#DCF8EC] text-[#153E32] text-[11px] sm:text-xs font-bold flex items-center justify-between gap-1.5 transition-colors min-h-[36px]"
                        >
                          <span className="inline-flex items-center gap-1.5 min-w-0">
                            <svg
                              className="w-3.5 h-3.5 shrink-0 text-[#087A53] fill-none stroke-current"
                              viewBox="0 0 24 24"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="2"
                                y="2"
                                width="20"
                                height="20"
                                rx="5"
                                ry="5"
                              />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                            <span className="truncate">Instagram</span>
                          </span>
                          <ArrowUpRight
                            size={13}
                            className="text-[#087A53] shrink-0"
                          />
                        </a>
                      ) : (
                        <span className="w-full py-2 px-3 rounded-full clay-inner text-[#4A6B5F] text-[11px] font-semibold flex items-center justify-center min-h-[36px]">
                          Rohis SMAPA
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 clay-card max-w-lg mx-auto px-6"
            >
              <Users size={36} className="mx-auto text-[#087A53] mb-3" />
              <h4 className="font-heading text-base font-extrabold text-[#153E32] mb-1">
                Tidak ada data pengurus
              </h4>
              <p className="text-xs sm:text-sm text-[#4A6B5F] mb-4">
                Tidak ditemukan pengurus untuk kata kunci atau filter divisi
                yang dipilih.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDivision("Semua");
                  setSearchQuery("");
                }}
                className="clay-btn-emerald px-5 py-2 rounded-full text-xs font-bold cursor-pointer"
              >
                Reset Filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {preview && (
          <div className="clay-preview-more">
            <Link href="/tentang#kepengurusan" className="clay-btn-white px-5 py-3 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 min-h-[44px]">
              Lihat seluruh pengurus ({currentPeriodMembers.length}) <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* Member Detail Clay Modal */}
      <AnimatePresence>
        {activeModalMember && (
          <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overscroll-contain"
            onClick={() => setActiveModalMember(null)}
            onWheel={(e) => {
              if (
                profileModalBodyRef.current &&
                !profileModalBodyRef.current.contains(e.target as Node)
              ) {
                profileModalBodyRef.current.scrollTop += e.deltaY;
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.05 : 0.2 }}
              className="fixed inset-0 bg-[#0D2B22]/38 backdrop-blur-[4px]"
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="pengurus-modal-title"
              data-lenis-prevent="true"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.98 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 10, scale: 0.98 }
              }
              transition={{
                duration: prefersReducedMotion ? 0.08 : 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-10 clay-card max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden p-4 sm:p-5 overscroll-contain shadow-[0_24px_60px_-15px_rgba(15,62,46,0.28)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setActiveModalMember(null)}
                aria-label="Tutup profil pengurus"
                className="absolute top-6 right-6 z-20 w-9 h-9 rounded-full clay-btn-white flex items-center justify-center text-[#153E32] cursor-pointer"
              >
                <X size={17} />
              </button>

              <div className="h-52 sm:h-56 rounded-[18px] bg-gradient-to-b from-[#DFF6EC] via-[#ECF9F3] to-[#FFFFFF] relative flex items-center justify-center p-4 overflow-hidden shrink-0">
                <img
                  src={activeModalMember.image}
                  alt={activeModalMember.name}
                  className="w-full h-full object-contain object-center"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold clay-pill-mint">
                    Periode {activeModalMember.period}
                  </span>
                </div>
              </div>

              <div
                ref={profileModalBodyRef}
                data-lenis-prevent="true"
                className="pt-4 px-2 overflow-y-auto overscroll-contain flex-1 custom-scrollbar"
              >
                <div className="text-center mb-4">
                  <h3
                    id="pengurus-modal-title"
                    className="font-heading text-lg sm:text-xl font-extrabold text-[#153E32] mb-1"
                  >
                    {activeModalMember.name}
                  </h3>
                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold clay-pill-mint mb-1.5">
                    {activeModalMember.role}
                  </span>
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#4A6B5F]">
                    <span>{formatClassLabel(activeModalMember.classGrade)}</span>
                    <span>•</span>
                    <span>Divisi {activeModalMember.division}</span>
                  </div>
                </div>

                {activeModalMember.quote && (
                  <div className="clay-inner-mint p-4 mb-4">
                    <Quote size={18} className="text-[#087A53] mb-1" />
                    <p className="text-xs sm:text-sm italic text-[#153E32] font-medium leading-relaxed">
                      &ldquo;{activeModalMember.quote}&rdquo;
                    </p>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-[#DCEAE3]">
                  {activeModalMember.instagram && (
                    <a
                      href={`https://instagram.com/${activeModalMember.instagram.replace(
                        /^@/,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-full clay-btn-mint text-xs sm:text-sm font-bold flex items-center justify-between"
                    >
                      <span>
                        Instagram @{activeModalMember.instagram.replace(/^@/, "")}
                      </span>
                      <ArrowUpRight size={15} />
                    </a>
                  )}

                  {activeModalMember.whatsapp && (
                    <a
                      href={`https://wa.me/${activeModalMember.whatsapp.replace(
                        /[^0-9]/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-full clay-btn-emerald text-xs sm:text-sm font-bold flex items-center justify-between"
                    >
                      <span>WhatsApp {activeModalMember.whatsapp}</span>
                      <ArrowUpRight size={15} />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveModalMember(null)}
                    className="w-full py-2.5 rounded-full clay-btn-white text-xs font-bold text-[#153E32] cursor-pointer mt-1"
                  >
                    Tutup Rincian
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
