"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import {
  ImageIcon,
  Plus,
  Search,
  Calendar,
  MapPin,
  Trash2,
  Edit3,
  X,
  ExternalLink,
  Info,
  CheckCircle2,
  Save,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { GalleryItem } from "@/lib/adminData";
import { formatGoogleDriveUrl, handleGoogleDriveImageError } from "@/lib/driveUtils";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import { pushCloudSync } from "@/lib/cloudSync";
import ImageCropField from "@/components/admin/ImageCropField";
import { useAdminOverlay } from "@/hooks/useAdminOverlay";
import { usePublicSiteUrl } from "@/hooks/usePublicSiteUrl";

export default function AdminGaleriPage() {
  const publicSiteUrl = usePublicSiteUrl();
  const {
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    showToast,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useAdminOverlay(isFormOpen || Boolean(deletingItem), dialogRef, () => {
    setIsFormOpen(false);
    setDeletingItem(null);
  });

  const categories = [
    "Semua",
    "Kegiatan",
    "Kajian",
    "Sosial",
    "PHBI & Syiar",
    "Kaderisasi",
  ];

  const [formData, setFormData] = useState({
    title: "",
    category: "Kegiatan",
    date: "18 Oktober 2026",
    location: "Aula SMA N 4 Purwokerto",
    imageUrl: "/images/rohis-akhdir-38.jpg",
    caption: "",
  });

  const filteredGallery = useMemo(() => {
    return gallery.filter((item) => {
      if (activeTab !== "Semua") {
        const itemCat = (item.category || "").toLowerCase();
        const tabCat = activeTab.toLowerCase();
        if (!itemCat.includes(tabCat)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          (item.caption && item.caption.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [gallery, activeTab, searchQuery]);

  const openAddForm = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      category: "Kegiatan",
      date: "18 Oktober 2026",
      location: "Aula SMAN 4 Purwokerto",
      imageUrl: "/images/rohis-akhdir-38.jpg",
      caption: "",
    });
    setIsFormOpen(true);
  };

  const openEditForm = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      date: item.date,
      location: item.location,
      imageUrl: item.imageUrl,
      caption: item.caption,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("Judul foto dokumentasi wajib diisi!", "warning");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      date: formData.date.trim(),
      location: formData.location.trim(),
      imageUrl: formData.imageUrl.trim() || "/images/rohis-akhdir-38.jpg",
      caption: formData.caption.trim(),
    };

    if (editingItem) {
      updateGalleryItem(editingItem.id, payload);
      showToast("Foto galeri berhasil diperbarui!", "success");
    } else {
      addGalleryItem(payload);
      showToast("Foto galeri baru berhasil ditambahkan!", "success");
    }

    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    deleteGalleryItem(deletingItem.id);
    showToast(`Foto "${deletingItem.title}" berhasil dihapus.`, "info");
    setDeletingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER (MOCKUP 06) ── */}
      <div className="admin-page-heading flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dokumentasi &amp; Galeri
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola foto dokumentasi kegiatan dan syiar ROHIS SMAN 4 Purwokerto.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#007a4d] hover:bg-[#006841] text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Tambah Galeri</span>
        </button>
      </div>

      {/* ── TABS & SEARCH BAR (MOCKUP 06) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 admin-tabs p-1 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              aria-pressed={activeTab === cat}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === cat
                  ? "bg-[#d7f0e3] text-[#006d44]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul atau kegiatan"
            aria-label="Cari dokumentasi galeri"
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

      {/* ── GALLERY GRID (MOCKUP 06) ── */}
      {filteredGallery.length === 0 ? (
        <div className="admin-surface bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200/80">
          Tidak ada foto galeri yang cocok dengan filter atau kata kunci.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGallery.map((item) => {
            const { src: imgSrc } = parseImageCrop(item.imageUrl);

            return (
              <div
                key={item.id}
                className="admin-surface bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  {/* Photo Container */}
                  <div className="admin-gallery-photo relative w-full h-48 bg-slate-100 overflow-hidden">
                    <Image
                      src={formatGoogleDriveUrl(imgSrc)}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleGoogleDriveImageError}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-semibold bg-[#d7f0e3] text-[#006d44] px-2.5 py-0.5 rounded-full shadow-2xs">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>{item.date}</span>
                      <span>&bull;</span>
                      <MapPin size={12} />
                      <span className="truncate">{item.location}</span>
                    </p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {item.caption || "Dokumentasi kegiatan syiar Rohis SMAPA."}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-slate-100 mt-2">
                  <a
                    href={`${publicSiteUrl}/galeri`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#007a4d] hover:underline"
                  >
                    <span>Lihat di Web</span>
                    <ExternalLink size={11} />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
                      title="Edit Foto"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-600 text-xs font-medium transition-colors cursor-pointer"
                      title="Hapus Foto"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL TAMBAH & EDIT GALERI (MOCKUP 06) ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={editingItem ? "Edit Foto Galeri" : "Tambah Foto Galeri"} tabIndex={-1} className="admin-dialog admin-surface bg-white rounded-3xl w-full max-w-lg border border-slate-200/80 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingItem ? "Edit Foto Galeri" : "Tambah Foto Galeri"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unggah atau atur dokumentasi kegiatan untuk ditampilkan di website publik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Tutup formulir galeri"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar" data-lenis-prevent>
              {/* Foto with ImageCropField */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Foto Dokumentasi <span className="text-rose-500">*</span>
                </label>
                <ImageCropField
                  value={formData.imageUrl}
                  onChange={(val) => setFormData({ ...formData, imageUrl: val })}
                  aspectRatio="16:10"
                  label=""
                  placeholder="https://drive.google.com/... atau URL foto"
                />
              </div>

              {/* Judul Kegiatan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Judul Foto / Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Kajian Akbar Isra Mi'raj"
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
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                >
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Kajian">Kajian</option>
                  <option value="Sosial">Sosial</option>
                  <option value="PHBI & Syiar">PHBI & Syiar</option>
                  <option value="Kaderisasi">Kaderisasi</option>
                  <option value="Peribadahan">Peribadahan</option>
                </select>
              </div>

              {/* Tanggal & Lokasi */}
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
                    placeholder="18 Oktober 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Lokasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Aula SMAN 4 Purwokerto"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8faf9] text-xs font-medium text-slate-800 focus:outline-none focus:border-[#007a4d] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Caption / Keterangan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Keterangan / Caption
                </label>
                <textarea
                  rows={3}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Dokumentasi kebersamaan peserta kajian dan pengurus Rohis..."
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
                  Simpan Galeri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DIALOG KONFIRMASI HAPUS ── */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-label="Konfirmasi hapus foto galeri" tabIndex={-1} className="admin-dialog admin-surface bg-white rounded-3xl w-full max-w-sm border border-slate-200/80 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Hapus foto galeri ini?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Foto &ldquo;<span className="font-semibold text-slate-900">{deletingItem.title}</span>&rdquo; akan dihapus secara permanen dari website.
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
