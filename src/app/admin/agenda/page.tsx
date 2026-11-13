"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Plus,
  Search,
  Clock,
  MapPin,
  Trash2,
  Edit3,
  X,
  ExternalLink,
  User,
  Info,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { EventItem } from "@/lib/types";
import { formatGoogleDriveUrl, handleGoogleDriveImageError } from "@/lib/driveUtils";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import { pushCloudSync } from "@/lib/cloudSync";
import ImageCropField from "@/components/admin/ImageCropField";
import { useAdminOverlay } from "@/hooks/useAdminOverlay";
import { usePublicSiteUrl } from "@/hooks/usePublicSiteUrl";

export default function AdminAgendaPage() {
  const publicSiteUrl = usePublicSiteUrl();
  const { events, addEvent, updateEvent, deleteEvent, showToast } = useAdmin();

  // Filters & Search
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Drawer State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);

  // Delete Confirmation State
  const [deletingItem, setDeletingItem] = useState<EventItem | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useAdminOverlay(isFormOpen || Boolean(deletingItem), dialogRef, () => {
    setIsFormOpen(false);
    setDeletingItem(null);
  });

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    category: "Kajian" as EventItem["category"],
    date: "27 Jan 2025",
    time: "08.00 - 11.30",
    location: "Aula SMA N 4 Purwokerto",
    speaker: "Saifur Ro'yi, S.Pd.",
    speakerRole: "Guru Pembina PAI SMA Negeri 4 Purwokerto",
    status: "open" as EventItem["status"],
    image: "/images/rohis-akhdir-38.jpg",
    description: "",
  });

  const categories = [
    "Kajian",
    "Kajian & Peringatan Islam",
    "Organisasi",
    "Sosial",
    "Pelatihan",
    "PHBI",
    "Muskerta",
  ];

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // Tab filter
      if (activeTab === "upcoming" && e.status === "completed") {
        return false;
      }
      if (activeTab === "completed" && e.status !== "completed") {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          (e.speaker && e.speaker.toLowerCase().includes(q)) ||
          e.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [events, activeTab, searchQuery]);

  const openAddForm = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      category: "Kajian & Peringatan Islam" as any,
      date: "Sen, 27 Jan 2025",
      time: "08.00 - 11.30",
      location: "Aula SMAN 4 Purwokerto",
      speaker: "Saifur Ro'yi, S.Pd.",
      speakerRole: "Guru Pembina PAI SMA Negeri 4 Purwokerto",
      status: "open",
      image: "/images/rohis-akhdir-38.jpg",
      description: "",
    });
    setIsFormOpen(true);
  };

  const openEditForm = (item: EventItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      date: item.date,
      time: item.time,
      location: item.location,
      speaker: item.speaker || "",
      speakerRole: item.speakerRole || "",
      status: item.status,
      image: item.image,
      description: item.description,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date.trim()) {
      showToast("Judul dan Tanggal kegiatan wajib diisi!", "warning");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      date: formData.date.trim(),
      time: formData.time.trim(),
      location: formData.location.trim(),
      speaker: formData.speaker.trim(),
      speakerRole: formData.speakerRole.trim(),
      status: formData.status,
      image: formData.image.trim() || "/images/rohis-akhdir-38.jpg",
      description: formData.description.trim(),
      quota: 150,
      registered: 45,
    };

    if (editingItem) {
      updateEvent(editingItem.id, payload);
      showToast("Agenda berhasil diperbarui!", "success");
    } else {
      addEvent(payload);
      showToast("Agenda baru berhasil ditambahkan!", "success");
    }

    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    deleteEvent(deletingItem.id);
    showToast(`Agenda "${deletingItem.title}" berhasil dihapus.`, "info");
    setDeletingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER (MOCKUP 04) ── */}
      <div className="admin-page-heading flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Agenda
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola agenda dan kegiatan ROHIS SMAN 4 Purwokerto.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#007a4d] hover:bg-[#006841] text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Tambah Agenda</span>
        </button>
      </div>

      {/* ── TABS & SEARCH BAR (MOCKUP 04) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 admin-tabs p-1 bg-white rounded-2xl border border-slate-200/80 shadow-2xs self-start">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            aria-pressed={activeTab === "all"}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#d7f0e3] text-[#006d44]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            aria-pressed={activeTab === "upcoming"}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-[#d7f0e3] text-[#006d44]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Akan Datang
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            aria-pressed={activeTab === "completed"}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "completed"
                ? "bg-[#d7f0e3] text-[#006d44]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Selesai
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, lokasi, atau pemateri"
            aria-label="Cari agenda"
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007a4d] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── INFO BANNER (MOCKUP 04) ── */}
      <div className="admin-notice p-4 rounded-2xl bg-[#d7f0e3]/50 border border-[#006d44]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-[#006d44]">
          <Info size={16} className="shrink-0" />
          <span>
            Agenda yang dikelola di sini akan ditampilkan pada halaman Agenda di website publik ROHIS SMAN 4 Purwokerto.
          </span>
        </div>
        <a
          href={`${publicSiteUrl}/agenda`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#006d44] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Lihat di Web Publik</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* ── AGENDA TABLE (MOCKUP 04) ── */}
      <div className="admin-surface bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8faf9] text-slate-500 font-semibold border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No.</th>
                <th className="py-3 px-4 w-32">Foto Kegiatan</th>
                <th className="py-3 px-4">Judul Kegiatan</th>
                <th className="py-3 px-4 w-40">Tanggal</th>
                <th className="py-3 px-4 w-32">Status</th>
                <th className="py-3 px-4 w-36 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    Tidak ada agenda yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((item, idx) => {
                  const isUpcoming = item.status !== "completed";
                  const { src: imgSrc } = parseImageCrop(item.image);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* No. */}
                      <td className="py-3 px-4 text-center text-slate-500 font-medium">
                        {idx + 1}
                      </td>

                      {/* Foto */}
                      <td className="py-3 px-4">
                        <div className="relative w-20 h-13 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <Image
                            src={formatGoogleDriveUrl(imgSrc)}
                            alt={item.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                            onError={handleGoogleDriveImageError}
                          />
                        </div>
                      </td>

                      {/* Judul Kegiatan & Category */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          {item.category} • {item.location}
                        </span>
                      </td>

                      {/* Tanggal */}
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {item.date}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isUpcoming
                              ? "bg-[#d7f0e3] text-[#006d44]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isUpcoming ? "Akan Datang" : "Selesai"}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                          >
                            <Edit3 size={12} className="text-slate-500" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingItem(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 text-rose-700 text-xs font-medium transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} className="text-rose-500" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Counter */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan 1–{filteredEvents.length} dari {events.length} agenda
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="p-1 rounded-md text-slate-300 border border-slate-200"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2.5 py-0.5 rounded-md bg-[#007a4d] text-white font-semibold">
              1
            </span>
            <button
              disabled
              className="p-1 rounded-md text-slate-300 border border-slate-200"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL / PANEL TAMBAH & EDIT AGENDA (MOCKUP 04) ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={editingItem ? "Edit Agenda" : "Tambah Agenda"} tabIndex={-1} className="admin-dialog admin-surface bg-white rounded-3xl w-full max-w-lg border border-slate-200/80 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingItem ? "Edit Agenda" : "Tambah Agenda"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tambah agenda atau kegiatan baru untuk ditampilkan di website publik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Tutup formulir agenda"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar" data-lenis-prevent>
              {/* Foto Kegiatan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Foto Kegiatan <span className="text-rose-500">*</span>
                </label>
                <ImageCropField
                  value={formData.image}
                  onChange={(val) => setFormData({ ...formData, image: val })}
                  aspectRatio="16:9"
                  label=""
                  placeholder="https://drive.google.com/... atau URL foto"
                />
              </div>

              {/* Judul Kegiatan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Judul Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Peringatan Isra Mi'raj"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kategori <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as any })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tanggal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="Sen, 27 Jan 2025"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Waktu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="08.00 - 11.30"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Lokasi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Aula SMAN 4 Purwokerto"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Pemateri & Jabatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pemateri <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      required
                      value={formData.speaker}
                      onChange={(e) =>
                        setFormData({ ...formData, speaker: e.target.value })
                      }
                      placeholder="Saifur Ro'yi, S.Pd."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jabatan Pemateri <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.speakerRole}
                    onChange={(e) =>
                      setFormData({ ...formData, speakerRole: e.target.value })
                    }
                    placeholder="Guru Pembina PAI SMA Negeri 4 Purwokerto"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Status Kegiatan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Status Kegiatan
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status !== "completed"}
                      onChange={() => setFormData({ ...formData, status: "open" })}
                      className="text-[#007a4d] focus:ring-[#007a4d]"
                    />
                    <span>Akan Datang (Aktif)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === "completed"}
                      onChange={() => setFormData({ ...formData, status: "completed" })}
                      className="text-[#007a4d] focus:ring-[#007a4d]"
                    />
                    <span>Selesai (Arsip)</span>
                  </label>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Deskripsi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Kegiatan peringatan hari besar keagamaan diisi kajian dan hikmah..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Notice Pill */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#d7f0e3]/60 text-[#006d44] border border-[#006d44]/15 text-xs font-medium">
                <Info size={14} className="shrink-0" />
                <span>Perubahan belum disimpan.</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#007a4d] hover:bg-[#006841] text-white shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DIALOG KONFIRMASI HAPUS (MOCKUP 04) ── */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-label="Konfirmasi hapus agenda" tabIndex={-1} className="admin-dialog admin-surface bg-white rounded-3xl w-full max-w-sm border border-slate-200/80 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Hapus agenda ini?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Agenda &ldquo;<span className="font-semibold text-slate-900">{deletingItem.title}</span>&rdquo; akan dihapus secara permanen dan tidak dapat dikembalikan.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
