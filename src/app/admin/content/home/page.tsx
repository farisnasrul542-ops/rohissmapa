"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  BarChart3,
  BookOpen,
  GraduationCap,
  Calendar,
  ImageIcon,
  Send,
  Sliders,
  Save,
  RotateCcw,
  ExternalLink,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Quote,
  ShieldCheck,
  Building,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { HomeCmsData, DEFAULT_HOME_CMS, normalizeHomeCms } from "@/lib/homeCmsData";
import { formatGoogleDriveUrl } from "@/lib/driveUtils";
import { pushCloudSync } from "@/lib/cloudSync";
import ImageCropField from "@/components/admin/ImageCropField";

type SubnavTab =
  | "hero"
  | "stats"
  | "about"
  | "sambutan"
  | "agenda"
  | "gallery"
  | "closing"
  | "sections";

export default function HomeCmsEditorPage() {
  const { homeCms, updateHomeCms, resetHomeCms } = useAdmin();

  // Local draft state for editing before saving - always normalized with defaults
  const [draft, setDraft] = useState<HomeCmsData>(() => normalizeHomeCms(homeCms));
  const [activeTab, setActiveTab] = useState<SubnavTab>("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activePembinaTab, setActivePembinaTab] = useState<1 | 2>(1);

  // Sync draft whenever context updates, ensuring full normalization
  useEffect(() => {
    if (homeCms) {
      setDraft(normalizeHomeCms(homeCms));
    }
  }, [homeCms]);

  // Clean stale/legacy localStorage data on client mount if missing agenda or gallery
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rohis_home_cms");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.agenda || !parsed.gallery) {
          const healed = normalizeHomeCms(parsed);
          setDraft(healed);
          updateHomeCms(healed);
          localStorage.setItem("rohis_home_cms", JSON.stringify(healed));
        }
      }
    } catch {}
  }, []);

  const markChanged = () => {
    if (!hasChanges) setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    const safeData = normalizeHomeCms(draft);
    try {
      // 1. Immediately persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("rohis_home_cms", JSON.stringify(safeData));

        // 2. Dispatch custom event for same-window / same-tab instant updates
        window.dispatchEvent(
          new CustomEvent("rohis_cms_updated", { detail: safeData })
        );

        // 3. Post to BroadcastChannel for real-time multi-tab syncing
        if ("BroadcastChannel" in window) {
          const bc = new BroadcastChannel("rohis_cms_channel");
          bc.postMessage(safeData);
          bc.close();
        }
      }

      // 4. Update AdminContext state
      updateHomeCms(safeData);

      // 5. Explicitly push to persistent cloud sync
      pushCloudSync({ rohis_home_cms: safeData });
    } catch (err) {
      console.error("Gagal menyimpan CMS:", err);
    }

    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
    }, 450);
  };

  const handleReset = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin mengembalikan seluruh konten Beranda ke pengaturan default awal Rohis SMAPA?"
      )
    ) {
      resetHomeCms();
      setDraft(DEFAULT_HOME_CMS);
      setHasChanges(false);
    }
  };

  // Helper updater functions with safe spread
  const updateHero = (field: keyof HomeCmsData["hero"], val: string) => {
    setDraft((raw) => {
      const prev = normalizeHomeCms(raw);
      return {
        ...prev,
        hero: { ...prev.hero, [field]: val },
      };
    });
    markChanged();
  };

  const updateAbout = (field: keyof HomeCmsData["about"], val: string) => {
    setDraft((raw) => {
      const prev = normalizeHomeCms(raw);
      return {
        ...prev,
        about: { ...prev.about, [field]: val },
      };
    });
    markChanged();
  };

  const updateAgenda = (field: keyof HomeCmsData["agenda"], val: string) => {
    setDraft((raw) => {
      const prev = normalizeHomeCms(raw);
      return {
        ...prev,
        agenda: { ...prev.agenda, [field]: val },
      };
    });
    markChanged();
  };

  const updateGallery = (field: "tag" | "title" | "lead", val: string) => {
    setDraft((raw) => {
      const prev = normalizeHomeCms(raw);
      return {
        ...prev,
        gallery: { ...prev.gallery, [field]: val },
      };
    });
    markChanged();
  };

  const updateClosing = (field: keyof HomeCmsData["closing"], val: string) => {
    setDraft((raw) => {
      const prev = normalizeHomeCms(raw);
      return {
        ...prev,
        closing: { ...prev.closing, [field]: val },
      };
    });
    markChanged();
  };

  const toggleSection = (key: keyof HomeCmsData["sections"]) => {
    setDraft((raw) => {
      const prev = normalizeHomeCms(raw);
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [key]: !prev.sections[key],
        },
      };
    });
    markChanged();
  };

  const subnavItems: Array<{ id: SubnavTab; label: string; icon: any }> = [
    { id: "hero", label: "Hero", icon: Sparkles },
    { id: "stats", label: "Statistik", icon: BarChart3 },
    { id: "about", label: "Tentang Kami", icon: BookOpen },
    { id: "sambutan", label: "Sambutan Pembina", icon: GraduationCap },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "gallery", label: "Galeri", icon: ImageIcon },
    { id: "closing", label: "Ajakan Bergabung", icon: Send },
    { id: "sections", label: "Konfigurasi Seksi", icon: Sliders },
  ];

  const agenda = draft?.agenda || DEFAULT_HOME_CMS.agenda;
  const gallery = draft?.gallery || DEFAULT_HOME_CMS.gallery;
  const hero = draft?.hero || DEFAULT_HOME_CMS.hero;
  const about = draft?.about || DEFAULT_HOME_CMS.about;
  const sambutan = draft?.sambutan || DEFAULT_HOME_CMS.sambutan;
  const closing = draft?.closing || DEFAULT_HOME_CMS.closing;
  const stats = draft?.stats || DEFAULT_HOME_CMS.stats;
  const sections = draft?.sections || DEFAULT_HOME_CMS.sections;

  return (
    <div className="space-y-6 pb-28">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#d7f0e3] text-[#006d44]">
              Editor Beranda
            </span>
            <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Live Home CMS
            </span>
            {hasChanges && (
              <span className="text-[10.5px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 animate-pulse">
                &bull; Perubahan belum disimpan
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Editor Konten Beranda
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Sesuaikan konten dan tampilan halaman beranda website publik ROHIS SMAPA. Seluruh perubahan yang disimpan akan otomatis tersinkronisasi ke web publik.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-all cursor-pointer"
            title="Kembalikan ke konfigurasi awal"
          >
            <RotateCcw size={13} />
            <span>Reset Default</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all"
          >
            <Eye size={13} className="text-slate-500" />
            <span>Pratinjau Beranda</span>
            <ExternalLink size={11} className="text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007a4d] hover:bg-[#006841] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={14} />
            <span>{isSaving ? "Menyimpan & Menyinkron..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </div>

      {/* Subnav Tabs Bar */}
      <div
        data-lenis-prevent="true"
        onWheel={(e) => {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.currentTarget.scrollLeft += e.deltaY;
          }
        }}
        className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto scrollbar-thin overscroll-contain"
      >
        <div className="flex items-center gap-1 min-w-max">
          {subnavItems.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-[#007a4d] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon
                  size={14}
                  className={active ? "text-white" : "text-slate-400"}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 1. HERO & HEADLINE ── */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                BAGIAN 1 DARI 8
              </span>
              <h2 className="text-lg font-black text-emerald-950 mt-1">
                Hero Banner &amp; Headline Pembuka
              </h2>
              <p className="text-xs text-gray-500">
                Konten utama yang pertama kali dilihat siswa dan pengunjung saat membuka website.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Headline Baris 1
              </label>
              <input
                type="text"
                value={hero?.titleLine1 || ""}
                onChange={(e) => updateHero("titleLine1", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Headline Baris 2 (Gradasi Emas)
              </label>
              <input
                type="text"
                value={hero?.titleLine2 || ""}
                onChange={(e) => updateHero("titleLine2", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Lead Phrase (Sub-Headline Emas)
              </label>
              <input
                type="text"
                value={hero?.leadPhrase || ""}
                onChange={(e) => updateHero("leadPhrase", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Narasi Lengkap Hero
              </label>
              <textarea
                rows={3}
                value={hero?.narrative || ""}
                onChange={(e) => updateHero("narrative", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Buttons */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Teks Tombol Profil Rohis (Putih)
              </label>
              <input
                type="text"
                value={hero?.btnPrimaryText || ""}
                onChange={(e) => updateHero("btnPrimaryText", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Link Tombol Profil Rohis
              </label>
              <input
                type="text"
                value={hero?.btnPrimaryLink || ""}
                onChange={(e) => updateHero("btnPrimaryLink", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Teks Tombol Galeri (Emas)
              </label>
              <input
                type="text"
                value={hero?.btnSecondaryText || ""}
                onChange={(e) => updateHero("btnSecondaryText", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Link Tombol Galeri
              </label>
              <input
                type="text"
                value={hero?.btnSecondaryLink || ""}
                onChange={(e) => updateHero("btnSecondaryLink", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-mono text-[11px]"
              />
            </div>

            {/* Kartu Showcase Hero: Foto, Judul, Badge, Lokasi, Deskripsi & Meta Bawah */}
            <div className="md:col-span-2 pt-4 border-t border-gray-100 space-y-4">
              <div className="bg-emerald-50/60 rounded-2xl p-4 sm:p-5 border border-emerald-900/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-emerald-950 text-sm">
                      Kartu Showcase Hero (Foto Utama &amp; Informasi)
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Kelola foto showcase, badge sudut, lokasi, judul, deskripsi, serta 3 butir meta di bawah kartu. Semua kolom teks bersifat opsional dan boleh dikosongkan jika tidak ingin ditampilkan.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900">
                    Hero Showcase
                  </span>
                </div>

                <ImageCropField
                  label="Foto Kartu Utama Hero"
                  value={hero?.showcaseImageUrl || "/images/rohis-akhdir-38.jpg"}
                  onChange={(val) => updateHero("showcaseImageUrl", val)}
                  aspectRatio="16:10"
                  previewBadge={hero?.showcaseBadge || ""}
                  previewTitle={hero?.showcaseTitle || ""}
                  previewSubtitle={hero?.showcaseLocation ? `📍 ${hero.showcaseLocation}` : ""}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Badge Kanan Atas Foto <span className="text-[11px] font-normal text-gray-500">(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={hero?.showcaseBadge ?? ""}
                      onChange={(e) => updateHero("showcaseBadge", e.target.value)}
                      placeholder="Contoh: RBC X PECETIKAH (Kosongkan jika tidak ingin ada badge)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Lokasi Pin Foto <span className="text-[11px] font-normal text-gray-500">(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={hero?.showcaseLocation ?? ""}
                      onChange={(e) => updateHero("showcaseLocation", e.target.value)}
                      placeholder="Contoh: SMAN 4 PURWOKERTO (Kosongkan jika tidak ingin ada lokasi)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">
                      Judul Kartu Foto <span className="text-[11px] font-normal text-gray-500">(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={hero?.showcaseTitle ?? ""}
                      onChange={(e) => updateHero("showcaseTitle", e.target.value)}
                      placeholder="Contoh: ROHIS AKHDIR 38 (Kosongkan jika tidak ingin ada judul)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-black text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">
                      Deskripsi Singkat di Atas Foto <span className="text-[11px] font-normal text-gray-500">(Opsional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={hero?.showcaseDescription ?? ""}
                      onChange={(e) => updateHero("showcaseDescription", e.target.value)}
                      placeholder="Contoh: Pertemuan akbar dan kaderisasi... (Kosongkan jika tidak ingin ada deskripsi)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
                    />
                  </div>

                  {/* 3 Meta Info Bawah */}
                  <div className="md:col-span-2 pt-2 border-t border-emerald-900/10">
                    <label className="block font-bold text-emerald-950 mb-1">
                      3 Butir Informasi Meta (Di Bawah Kartu Foto)
                    </label>
                    <p className="text-[11px] text-gray-500 mb-2">
                      Semua butir boleh dikosongkan. Jika semua dikosongkan, baris info ini akan otomatis disembunyikan.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold block mb-1">
                          Meta Kiri (Opsional)
                        </span>
                        <input
                          type="text"
                          value={hero?.showcaseMeta1 ?? ""}
                          onChange={(e) => updateHero("showcaseMeta1", e.target.value)}
                          placeholder="Contoh: RESMI • LOMBA TINGKAT KAB"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-[11px] font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold block mb-1">
                          Meta Tengah (Opsional)
                        </span>
                        <input
                          type="text"
                          value={hero?.showcaseMeta2 ?? ""}
                          onChange={(e) => updateHero("showcaseMeta2", e.target.value)}
                          placeholder="Contoh: 2026 • PURWOKERTO"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-[11px] font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold block mb-1">
                          Meta Kanan (Opsional)
                        </span>
                        <input
                          type="text"
                          value={hero?.showcaseMeta3 ?? ""}
                          onChange={(e) => updateHero("showcaseMeta3", e.target.value)}
                          placeholder="Contoh: 15+ SMA / SMK / MA"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-[11px] font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. STATISTIK CAPAIAN (4 ANGKA) ── */}
      {activeTab === "stats" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                BAGIAN 2 DARI 8
              </span>
              <h2 className="text-lg font-black text-emerald-950 mt-1">
                Statistik &amp; 4 Angka Capaian Organisasi
              </h2>
              <p className="text-xs text-gray-500">
                Atur 4 metrik pencapaian yang tampil mencolok tepat di bawah hero banner pada website publik.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((st, idx) => (
              <div
                key={st.id || idx}
                className="p-5 rounded-2xl border border-gray-200 bg-[#fafafa] text-xs space-y-3 hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-900 text-[11px] uppercase">
                    KARTU METRIK #{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    Posisi {idx + 1}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Nilai Angka (Value)
                    </label>
                    <input
                      type="number"
                      value={st.value}
                      onChange={(e) => {
                        const newS = [...stats];
                        newS[idx] = { ...newS[idx], value: Number(e.target.value) };
                        setDraft({ ...draft, stats: newS });
                        markChanged();
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-black text-lg text-emerald-950"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Suffix (&apos;+&apos;, &apos;%&apos;, atau kosong)
                    </label>
                    <input
                      type="text"
                      value={st.suffix}
                      onChange={(e) => {
                        const newS = [...stats];
                        newS[idx] = { ...newS[idx], suffix: e.target.value };
                        setDraft({ ...draft, stats: newS });
                        markChanged();
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-black text-amber-600 text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Label Keterangan
                  </label>
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => {
                      const newS = [...stats];
                      newS[idx] = { ...newS[idx], label: e.target.value };
                      setDraft({ ...draft, stats: newS });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-bold text-gray-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. TENTANG KAMI (ABOUT EDITORIAL) ── */}
      {activeTab === "about" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                BAGIAN 3 DARI 8
              </span>
              <h2 className="text-lg font-black text-emerald-950 mt-1">
                Tentang Kami (Editorial 2-Kolom &amp; Quote Box)
              </h2>
              <p className="text-xs text-gray-500">
                Format editorial seimbang dengan kutipan hangat, foto dokumentasi Muskerta, dan 2 poin nilai keunggulan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Tagline Bagian
              </label>
              <input
                type="text"
                value={about?.tag || ""}
                onChange={(e) => updateAbout("tag", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Judul Besar Headline
              </label>
              <input
                type="text"
                value={about?.title || ""}
                onChange={(e) => updateAbout("title", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-black text-emerald-950"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Lead Text Pengantar
              </label>
              <textarea
                rows={2}
                value={about?.lead || ""}
                onChange={(e) => updateAbout("lead", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Paragraf Penjelasan 1
              </label>
              <textarea
                rows={3}
                value={about?.paragraph1 || ""}
                onChange={(e) => updateAbout("paragraph1", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Paragraf Penjelasan 2
              </label>
              <textarea
                rows={3}
                value={about?.paragraph2 || ""}
                onChange={(e) => updateAbout("paragraph2", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            {/* Poin Nilai 1 & 2 */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <span className="text-[10px] font-black uppercase text-emerald-800">
                Poin Nilai 1 (Sinergi &amp; Ukhuwah)
              </span>
              <input
                type="text"
                value={about?.point1Title || ""}
                onChange={(e) => updateAbout("point1Title", e.target.value)}
                placeholder="Judul Poin 1"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-bold"
              />
              <textarea
                rows={2}
                value={about?.point1Desc || ""}
                onChange={(e) => updateAbout("point1Desc", e.target.value)}
                placeholder="Deskripsi Poin 1"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[11px]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-800">
                Poin Nilai 2 (Kaderisasi Berkelanjutan)
              </span>
              <input
                type="text"
                value={about?.point2Title || ""}
                onChange={(e) => updateAbout("point2Title", e.target.value)}
                placeholder="Judul Poin 2"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-bold"
              />
              <textarea
                rows={2}
                value={about?.point2Desc || ""}
                onChange={(e) => updateAbout("point2Desc", e.target.value)}
                placeholder="Deskripsi Poin 2"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[11px]"
              />
            </div>

            {/* Foto Muskerta & Quote Box */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <span className="text-[10px] font-black uppercase text-gray-700 block">
                  Foto Dokumentasi Seksi Tentang Kami
                </span>
                <ImageCropField
                  label="URL Foto Dokumentasi / Upload Perangkat"
                  value={about?.photoUrl || "/images/dokumentasi-smapa.jpg"}
                  onChange={(val) => updateAbout("photoUrl", val)}
                  aspectRatio="4:3"
                  compact
                  showGoogleDriveHint={false}
                  previewBadge={about?.photoBadge || "TENTANG KAMI"}
                />
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Badge Cap Foto (Opsional)
                  </label>
                  <input
                    type="text"
                    value={about?.photoBadge || ""}
                    onChange={(e) => updateAbout("photoBadge", e.target.value)}
                    placeholder="Contoh: DOKUMENTASI KADER SMAPA"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[11px] font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-amber-200/70 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-950 font-bold">
                  <Quote size={14} className="text-amber-600" />
                  <span>Kartu Kutipan Kader</span>
                </div>
                <textarea
                  rows={2}
                  value={about?.quoteText || ""}
                  onChange={(e) => updateAbout("quoteText", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-200 bg-white italic text-xs"
                />
                <input
                  type="text"
                  value={about?.quoteAuthor || ""}
                  onChange={(e) => updateAbout("quoteAuthor", e.target.value)}
                  placeholder="Penulis Kutipan"
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-200 bg-white font-bold text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. SAMBUTAN PEMBINA 1 & 2 ── */}
      {activeTab === "sambutan" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                BAGIAN 4 DARI 8
              </span>
              <h2 className="text-lg font-black text-emerald-950 mt-1">
                Sambutan Pembina 1 &amp; Pembina 2 Rohis SMAPA
              </h2>
              <p className="text-xs text-gray-500">
                Pilih tab pembina di kanan untuk mengedit naskah sambutan, gelar, foto studio, dan salam pembuka.
              </p>
            </div>

            {/* Pembina switcher */}
            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl shrink-0">
              <button
                type="button"
                onClick={() => setActivePembinaTab(1)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activePembinaTab === 1
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pembina 1
              </button>
              <button
                type="button"
                onClick={() => setActivePembinaTab(2)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activePembinaTab === 2
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pembina 2
              </button>
            </div>
          </div>

          {/* Section meta tag */}
          <div className="text-xs pb-3 border-b border-gray-100">
            <label className="block font-bold text-gray-700 mb-1">
              Kicker Tag Sambutan
            </label>
            <input
              type="text"
              value={sambutan?.tag || ""}
              onChange={(e) => {
                setDraft((raw) => {
                  const prev = normalizeHomeCms(raw);
                  return {
                    ...prev,
                    sambutan: { ...prev.sambutan, tag: e.target.value },
                  };
                });
                markChanged();
              }}
              className="w-full max-w-md px-3 py-2 rounded-xl border border-gray-200"
            />
          </div>

          {/* Active Pembina Form */}
          {activePembinaTab === 1 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 font-bold">
                <GraduationCap size={16} className="text-emerald-700" />
                <span>Pengaturan Data: Pembina 1 ({sambutan?.pembina1?.name || ""})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Nama Lengkap &amp; Gelar
                  </label>
                  <input
                    type="text"
                    value={sambutan?.pembina1?.name || ""}
                    onChange={(e) => {
                      setDraft((raw) => {
                        const prev = normalizeHomeCms(raw);
                        return {
                          ...prev,
                          sambutan: {
                            ...prev.sambutan,
                            pembina1: {
                              ...prev.sambutan.pembina1,
                              name: e.target.value,
                            },
                          },
                        };
                      });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Label Keterangan (Harus &apos;Pembina 1&apos;)
                  </label>
                  <input
                    type="text"
                    value={sambutan?.pembina1?.role || ""}
                    onChange={(e) => {
                      setDraft((raw) => {
                        const prev = normalizeHomeCms(raw);
                        return {
                          ...prev,
                          sambutan: {
                            ...prev.sambutan,
                            pembina1: {
                              ...prev.sambutan.pembina1,
                              role: e.target.value,
                            },
                          },
                        };
                      });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <ImageCropField
                  label="URL Foto Studio Pembina 1 / Upload Perangkat"
                  value={
                    sambutan?.pembina1?.image ||
                    DEFAULT_HOME_CMS.sambutan.pembina1.image
                  }
                  onChange={(val) => {
                    setDraft((raw) => {
                      const prev = normalizeHomeCms(raw);
                      return {
                        ...prev,
                        sambutan: {
                          ...prev.sambutan,
                          pembina1: {
                            ...prev.sambutan.pembina1,
                            image: val,
                          },
                        },
                      };
                    });
                    markChanged();
                  }}
                  aspectRatio="circle"
                  previewTitle={sambutan?.pembina1?.name || "Pembina 1"}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Salam Pembuka
                </label>
                <input
                  type="text"
                  value={sambutan?.pembina1?.salamPembuka || ""}
                  onChange={(e) => {
                    setDraft((raw) => {
                      const prev = normalizeHomeCms(raw);
                      return {
                        ...prev,
                        sambutan: {
                          ...prev.sambutan,
                          pembina1: {
                            ...prev.sambutan.pembina1,
                            salamPembuka: e.target.value,
                          },
                        },
                      };
                    });
                    markChanged();
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 italic font-semibold"
                />
              </div>

              {/* Dynamic Paragraphs */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-700">
                    Paragraf Naskah Sambutan ({sambutan?.pembina1?.paragraphs?.length || 0} Paragraf)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const current = sambutan?.pembina1?.paragraphs || [];
                      const newArr = [...current, "Paragraf baru sambutan..."];
                      setDraft((raw) => {
                        const prev = normalizeHomeCms(raw);
                        return {
                          ...prev,
                          sambutan: {
                            ...prev.sambutan,
                            pembina1: {
                              ...prev.sambutan.pembina1,
                              paragraphs: newArr,
                            },
                          },
                        };
                      });
                      markChanged();
                    }}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Tambah Paragraf</span>
                  </button>
                </div>

                {(sambutan?.pembina1?.paragraphs || []).map((p, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="text-[11px] font-bold text-gray-400 mt-2">
                      #{idx + 1}
                    </span>
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => {
                        const current = [...(sambutan?.pembina1?.paragraphs || [])];
                        current[idx] = e.target.value;
                        setDraft((raw) => {
                          const prev = normalizeHomeCms(raw);
                          return {
                            ...prev,
                            sambutan: {
                              ...prev.sambutan,
                              pembina1: {
                                ...prev.sambutan.pembina1,
                                paragraphs: current,
                              },
                            },
                          };
                        });
                        markChanged();
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200"
                    />
                    {(sambutan?.pembina1?.paragraphs?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const current = (sambutan?.pembina1?.paragraphs || []).filter(
                            (_, i) => i !== idx
                          );
                          setDraft((raw) => {
                            const prev = normalizeHomeCms(raw);
                            return {
                              ...prev,
                              sambutan: {
                                ...prev.sambutan,
                                pembina1: {
                                  ...prev.sambutan.pembina1,
                                  paragraphs: current,
                                },
                              },
                            };
                          });
                          markChanged();
                        }}
                        className="p-1 text-gray-400 hover:text-rose-600 mt-2"
                        title="Hapus paragraf ini"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Salam Penutup
                </label>
                <input
                  type="text"
                  value={sambutan?.pembina1?.salamPenutup || ""}
                  onChange={(e) => {
                    setDraft((raw) => {
                      const prev = normalizeHomeCms(raw);
                      return {
                        ...prev,
                        sambutan: {
                          ...prev.sambutan,
                          pembina1: {
                            ...prev.sambutan.pembina1,
                            salamPenutup: e.target.value,
                          },
                        },
                      };
                    });
                    markChanged();
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 italic font-semibold"
                />
              </div>
            </div>
          )}

          {activePembinaTab === 2 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 font-bold">
                <GraduationCap size={16} className="text-emerald-700" />
                <span>Pengaturan Data: Pembina 2 ({sambutan?.pembina2?.name || ""})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Nama Lengkap &amp; Gelar
                  </label>
                  <input
                    type="text"
                    value={sambutan?.pembina2?.name || ""}
                    onChange={(e) => {
                      setDraft((raw) => {
                        const prev = normalizeHomeCms(raw);
                        return {
                          ...prev,
                          sambutan: {
                            ...prev.sambutan,
                            pembina2: {
                              ...prev.sambutan.pembina2,
                              name: e.target.value,
                            },
                          },
                        };
                      });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Label Keterangan (Harus &apos;Pembina 2&apos;)
                  </label>
                  <input
                    type="text"
                    value={sambutan?.pembina2?.role || ""}
                    onChange={(e) => {
                      setDraft((raw) => {
                        const prev = normalizeHomeCms(raw);
                        return {
                          ...prev,
                          sambutan: {
                            ...prev.sambutan,
                            pembina2: {
                              ...prev.sambutan.pembina2,
                              role: e.target.value,
                            },
                          },
                        };
                      });
                      markChanged();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <ImageCropField
                  label="Foto Studio Pembina 2 (Upload / URL & Atur Posisi Crop)"
                  value={sambutan?.pembina2?.image || DEFAULT_HOME_CMS.sambutan.pembina2.image}
                  onChange={(newVal) => {
                    setDraft((raw) => {
                      const prev = normalizeHomeCms(raw);
                      return {
                        ...prev,
                        sambutan: {
                          ...prev.sambutan,
                          pembina2: {
                            ...prev.sambutan.pembina2,
                            image: newVal,
                          },
                        },
                      };
                    });
                    markChanged();
                  }}
                  aspectRatio="circle"
                  previewTitle={sambutan?.pembina2?.name || "Pembina 2 Rohis SMAPA"}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Salam Pembuka
                </label>
                <input
                  type="text"
                  value={sambutan?.pembina2?.salamPembuka || ""}
                  onChange={(e) => {
                    setDraft((raw) => {
                      const prev = normalizeHomeCms(raw);
                      return {
                        ...prev,
                        sambutan: {
                          ...prev.sambutan,
                          pembina2: {
                            ...prev.sambutan.pembina2,
                            salamPembuka: e.target.value,
                          },
                        },
                      };
                    });
                    markChanged();
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 italic font-semibold"
                />
              </div>

              {/* Dynamic Paragraphs */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-700">
                    Paragraf Naskah Sambutan ({sambutan?.pembina2?.paragraphs?.length || 0} Paragraf)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const current = sambutan?.pembina2?.paragraphs || [];
                      const newArr = [...current, "Paragraf baru sambutan..."];
                      setDraft((raw) => {
                        const prev = normalizeHomeCms(raw);
                        return {
                          ...prev,
                          sambutan: {
                            ...prev.sambutan,
                            pembina2: {
                              ...prev.sambutan.pembina2,
                              paragraphs: newArr,
                            },
                          },
                        };
                      });
                      markChanged();
                    }}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Tambah Paragraf</span>
                  </button>
                </div>

                {(sambutan?.pembina2?.paragraphs || []).map((p, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="text-[11px] font-bold text-gray-400 mt-2">
                      #{idx + 1}
                    </span>
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => {
                        const current = [...(sambutan?.pembina2?.paragraphs || [])];
                        current[idx] = e.target.value;
                        setDraft((raw) => {
                          const prev = normalizeHomeCms(raw);
                          return {
                            ...prev,
                            sambutan: {
                              ...prev.sambutan,
                              pembina2: {
                                ...prev.sambutan.pembina2,
                                paragraphs: current,
                              },
                            },
                          };
                        });
                        markChanged();
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200"
                    />
                    {(sambutan?.pembina2?.paragraphs?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const current = (sambutan?.pembina2?.paragraphs || []).filter(
                            (_, i) => i !== idx
                          );
                          setDraft((raw) => {
                            const prev = normalizeHomeCms(raw);
                            return {
                              ...prev,
                              sambutan: {
                                ...prev.sambutan,
                                pembina2: {
                                  ...prev.sambutan.pembina2,
                                  paragraphs: current,
                                },
                              },
                            };
                          });
                          markChanged();
                        }}
                        className="p-1 text-gray-400 hover:text-rose-600 mt-2"
                        title="Hapus paragraf ini"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Salam Penutup
                </label>
                <input
                  type="text"
                  value={sambutan?.pembina2?.salamPenutup || ""}
                  onChange={(e) => {
                    setDraft((raw) => {
                      const prev = normalizeHomeCms(raw);
                      return {
                        ...prev,
                        sambutan: {
                          ...prev.sambutan,
                          pembina2: {
                            ...prev.sambutan.pembina2,
                            salamPenutup: e.target.value,
                          },
                        },
                      };
                    });
                    markChanged();
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 italic font-semibold"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 5. AGENDA & 3D COVERFLOW ── */}
      {activeTab === "agenda" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                BAGIAN 5 DARI 8
              </span>
              <h2 className="text-lg font-black text-emerald-950 mt-1">
                Agenda Kegiatan &amp; Slider 3D Coverflow
              </h2>
              <p className="text-xs text-gray-500">
                Atur judul, narasi pengantar, dan petunjuk interaksi slider 3D agenda di halaman beranda.
              </p>
            </div>
            <Link
              href="/admin/agenda"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <span>Kelola Daftar Jadwal Agenda</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Kicker Tagline
              </label>
              <input
                type="text"
                value={agenda?.tag || ""}
                onChange={(e) => updateAgenda("tag", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Judul Utama Seksi Agenda
              </label>
              <input
                type="text"
                value={agenda?.title || ""}
                onChange={(e) => updateAgenda("title", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-black text-emerald-950"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Narasi Pengantar Agenda
              </label>
              <textarea
                rows={2}
                value={agenda?.lead || ""}
                onChange={(e) => updateAgenda("lead", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Petunjuk Interaksi (Hint Text di Bawah Garis Gradasi)
              </label>
              <input
                type="text"
                value={agenda?.hintText || ""}
                onChange={(e) => updateAgenda("hintText", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-semibold text-amber-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 6. GALERI DOKUMENTASI KEGIATAN SMAPA ── */}
      {activeTab === "gallery" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                BAGIAN 6 DARI 8
              </span>
              <h2 className="text-lg font-black text-emerald-950 mt-1">
                Galeri &amp; Dokumentasi Pilihan Beranda
              </h2>
              <p className="text-xs text-gray-500">
                Sesuaikan teks pembuka dan 3 kartu foto sorotan dokumentasi yang tampil di beranda.
              </p>
            </div>
            <Link
              href="/admin/galeri"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <span>Buka Manajemen Galeri Foto Lengkap</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pb-4 border-b border-gray-100">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Kicker Tag Dokumentasi
              </label>
              <input
                type="text"
                value={gallery?.tag || ""}
                onChange={(e) => updateGallery("tag", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Judul Utama Galeri
              </label>
              <input
                type="text"
                value={gallery?.title || ""}
                onChange={(e) => updateGallery("title", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-black text-emerald-950"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Lead Deskripsi Pengantar
              </label>
              <textarea
                rows={2}
                value={gallery?.lead || ""}
                onChange={(e) => updateGallery("lead", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>
          </div>

          {/* 3 Highlight Cards */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-emerald-950">
              3 Kartu Foto Pilihan Beranda
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(gallery?.items || []).slice(0, 3).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-2xl border border-gray-200 bg-[#fafafa] text-xs space-y-3 hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-emerald-800 text-[10px] uppercase">
                        FOTO SOROTAN #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item.category || ""}
                        onChange={(e) => {
                          const newItems = [...(gallery?.items || [])];
                          newItems[idx] = { ...newItems[idx], category: e.target.value };
                          setDraft({
                            ...draft,
                            gallery: { ...gallery, items: newItems },
                          });
                          markChanged();
                        }}
                        placeholder="Kategori"
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 text-right w-24"
                      />
                    </div>

                    <ImageCropField
                      compact
                      label="Foto Sorotan (Upload / URL & Crop)"
                      value={item.image || ""}
                      onChange={(newVal) => {
                        const newItems = [...(gallery?.items || [])];
                        newItems[idx] = {
                          ...newItems[idx],
                          image: newVal,
                        };
                        setDraft({
                          ...draft,
                          gallery: { ...gallery, items: newItems },
                        });
                        markChanged();
                      }}
                      aspectRatio="16:10"
                      previewTitle={item.title || `Sorotan #${idx + 1}`}
                    />

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Judul Kegiatan
                      </label>
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) => {
                          const newItems = [...(gallery?.items || [])];
                          newItems[idx] = { ...newItems[idx], title: e.target.value };
                          setDraft({
                            ...draft,
                            gallery: { ...gallery, items: newItems },
                          });
                          markChanged();
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Tanggal Pelaksanaan
                      </label>
                      <input
                        type="text"
                        value={item.date || ""}
                        onChange={(e) => {
                          const newItems = [...(gallery?.items || [])];
                          newItems[idx] = { ...newItems[idx], date: e.target.value };
                          setDraft({
                            ...draft,
                            gallery: { ...gallery, items: newItems },
                          });
                          markChanged();
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 7. AJAKAN BERGABUNG (CTA CLOSING) ── */}
      {activeTab === "closing" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                BAGIAN 7 DARI 8
              </span>
              <h2 className="text-lg font-black text-emerald-950 mt-1">
                Closing Banner &amp; Ajakan Bergabung (CTA)
              </h2>
              <p className="text-xs text-gray-500">
                Panggilan pendaftaran kader baru yang terletak di bagian paling bawah halaman sebelum footer.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Badge Kicker
              </label>
              <input
                type="text"
                value={closing?.tag || ""}
                onChange={(e) => updateClosing("tag", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Judul Utama Ajakan (CTA)
              </label>
              <input
                type="text"
                value={closing?.title || ""}
                onChange={(e) => updateClosing("title", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-black text-base text-emerald-950"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Sub-Headline Ajakan
              </label>
              <textarea
                rows={2}
                value={closing?.subtitle || ""}
                onChange={(e) => updateClosing("subtitle", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Teks Tombol Utama (Pendaftaran)
              </label>
              <input
                type="text"
                value={closing?.btnPrimaryText || ""}
                onChange={(e) => updateClosing("btnPrimaryText", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Link Tombol Utama
              </label>
              <input
                type="text"
                value={closing?.btnPrimaryLink || ""}
                onChange={(e) => updateClosing("btnPrimaryLink", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Teks Tombol Sekunder (Kotak Aspirasi)
              </label>
              <input
                type="text"
                value={closing?.btnSecondaryText || ""}
                onChange={(e) => updateClosing("btnSecondaryText", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Link Tombol Sekunder
              </label>
              <input
                type="text"
                value={closing?.btnSecondaryLink || ""}
                onChange={(e) => updateClosing("btnSecondaryLink", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 8. KONFIGURASI SEKSI (VISIBILITAS) ── */}
      {activeTab === "sections" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                BAGIAN 8 DARI 8
              </span>
              <h2 className="text-lg font-black text-emerald-950 mt-1">
                Visibilitas &amp; Toggle 7 Seksi Beranda Publik
              </h2>
              <p className="text-xs text-gray-500">
                Aktifkan atau sembunyikan blok komponen tertentu pada halaman beranda publik.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {[
              {
                key: "showHero" as const,
                label: "1. Hero Banner & Headline Utama",
                desc: "Bagian paling atas dengan judul, sub-headline emas, dan tombol aksi.",
              },
              {
                key: "showStats" as const,
                label: "2. Statistik Capaian (4 Angka)",
                desc: "Counter kader aktif, divisi, proker, dan tahun berdiri.",
              },
              {
                key: "showAbout" as const,
                label: "3. Tentang Kami (Editorial & Quote)",
                desc: "Format editorial 2-kolom dokumentasi Muskerta, 2 poin nilai, dan quote.",
              },
              {
                key: "showSambutan" as const,
                label: "4. Sambutan Pembina 1 & 2",
                desc: "Naskah sambutan resmi dari Toyyib Yuliadi, Sh. M.Pd dan Saifur Ro'yi, S.Pd.",
              },
              {
                key: "showAgenda" as const,
                label: "5. Agenda Kegiatan & 3D Coverflow",
                desc: "Slider 3D interaktif jadwal kajian Musholla Al-Ikhlas.",
              },
              {
                key: "showGallery" as const,
                label: "6. Galeri Dokumentasi Pilihan",
                desc: "3 kartu foto dokumentasi kegiatan syiar Rohis SMAPA.",
              },
              {
                key: "showClosing" as const,
                label: "7. Closing Banner & Ajakan Daftar",
                desc: "Ajakan bergabung calon anggota baru dan link ke formulir pendaftaran.",
              },
            ].map((sec) => (
              <div
                key={sec.key}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-emerald-200 transition-colors"
              >
                <div>
                  <p className="font-extrabold text-gray-900">{sec.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{sec.desc}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                  <input
                    type="checkbox"
                    checked={Boolean(sections?.[sec.key])}
                    onChange={() => toggleSection(sec.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Sticky Save Footer Bar */}
      <div className="fixed bottom-6 left-4 sm:left-auto right-4 sm:right-8 z-40 max-w-xl ml-auto">
        <div className="p-3 px-5 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-xl border border-slate-200/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                hasChanges ? "bg-amber-500 animate-pulse" : "bg-[#007a4d]"
              }`}
            />
            <span className="text-xs font-medium text-slate-600">
              {hasChanges
                ? "Ada perubahan belum disimpan"
                : "Semua perubahan telah tersimpan & sinkron"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <button
                type="button"
                onClick={() => {
                  setDraft(normalizeHomeCms(homeCms));
                  setHasChanges(false);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#007a4d] hover:bg-[#006841] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={14} />
              <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
