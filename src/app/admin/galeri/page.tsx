"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ImageIcon,
  PlusCircle,
  Search,
  Trash2,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  Edit3,
  Save,
  ChevronDown,
  Link2,
  Type,
  FileText,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { GalleryItem } from "@/lib/adminData";
import { formatGoogleDriveUrl, handleGoogleDriveImageError } from "@/lib/driveUtils";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import ImageCropField from "@/components/admin/ImageCropField";

const GALLERY_CATEGORIES = [
  "Semua",
  "Kajian",
  "Muskerta & Raker",
  "Peribadahan",
  "Kaderisasi",
  "Bakti Sosial",
  "Keputrian",
  "PHBI & Syiar",
] as const;

export default function AdminGaleriPage() {
  const {
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    searchQuery,
  } = useAdmin();
  const [localSearch, setLocalSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Kajian",
    date: "30 Oktober 2026",
    location: "Musholla Al-Ikhlas SMAN 4 Purwokerto",
    imageUrl:
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
    caption: "",
  });

  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "Kajian",
    date: "",
    location: "",
    imageUrl: "",
    caption: "",
  });

  // Lock body scroll when modal is open & allow Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAddModalOpen(false);
        setEditingItem(null);
      }
    };
    if (isAddModalOpen || editingItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddModalOpen, editingItem]);

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setEditFormData({
      title: item.title,
      category: item.category,
      date: item.date,
      location: item.location,
      imageUrl: item.imageUrl,
      caption: item.caption,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editFormData.title.trim() || !editFormData.imageUrl.trim())
      return;

    updateGalleryItem(editingItem.id, {
      title: editFormData.title.trim(),
      category: editFormData.category,
      date: editFormData.date.trim(),
      location: editFormData.location.trim(),
      imageUrl: formatGoogleDriveUrl(editFormData.imageUrl.trim()),
      caption: editFormData.caption.trim(),
    });
    setEditingItem(null);
  };

  const query = (localSearch || searchQuery).toLowerCase();

  const filteredGallery = gallery.filter((g) => {
    const matchesCat =
      selectedCategory === "Semua" ||
      g.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      g.title.toLowerCase().includes(query) ||
      g.category.toLowerCase().includes(query) ||
      g.location.toLowerCase().includes(query) ||
      g.caption.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) return;

    addGalleryItem({
      ...formData,
      imageUrl: formatGoogleDriveUrl(formData.imageUrl.trim()),
    });
    setIsAddModalOpen(false);
    setFormData({
      title: "",
      category: "Kajian",
      date: "30 Oktober 2026",
      location: "Musholla Al-Ikhlas SMAN 4 Purwokerto",
      imageUrl:
        "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
      caption: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 border-b-[4px] border-b-slate-300/80 shadow-[0_8px_24px_-6px_rgba(6,32,23,0.05)]">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-white flex items-center justify-center border border-emerald-700/40 border-b-[3px] border-b-black shadow-md shrink-0">
            <ImageIcon size={22} className="text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-950/[0.06] text-emerald-950 border border-emerald-900/15">
                ARSIP MEDIA SYIAR
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                • {gallery.length} Koleksi Foto
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Dokumentasi & Galeri Kegiatan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola foto dokumentasi syiar, musyawarah kerja, kajian, dan agenda Rohis SMA Negeri 4 Purwokerto
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white font-extrabold text-xs border border-emerald-700/40 border-b-[3px] border-b-black shadow-md transition-all hover:-translate-y-0.5 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle size={15} className="text-amber-300" />
          <span>Tambah Dokumentasi Foto</span>
        </button>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 border-b-[3px] border-b-slate-300/70 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div
            data-lenis-prevent="true"
            onWheel={(e) => {
              if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0 overscroll-contain"
          >
            {GALLERY_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-[#062017] text-white border border-emerald-800 border-b-2 border-b-black shadow-xs"
                      : "bg-slate-100/80 hover:bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Cari judul, kategori, atau lokasi..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200/90 bg-slate-50/70 focus:bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
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

      {/* ── GALLERY CARDS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200/90 border-b-[4px] border-b-slate-300/90 hover:border-emerald-800/35 hover:border-b-[#062017] overflow-hidden shadow-[0_8px_24px_-6px_rgba(6,32,23,0.06)] hover:shadow-[0_18px_36px_-8px_rgba(6,32,23,0.12)] transition-all duration-200 hover:-translate-y-0.5 group flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-[#062017] overflow-hidden">
                <img
                  src={parseImageCrop(item.imageUrl).src}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleGoogleDriveImageError(e, item.imageUrl)}
                  style={getImageCropStyle(item.imageUrl)}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#062017]/90 text-emerald-100 border border-white/15 backdrop-blur-md shadow-xs">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/90 text-slate-800 backdrop-blur-md shadow-xs">
                    {item.id}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                  <div className="flex items-center gap-1.5 text-[10.5px] text-amber-300 font-bold mb-0.5">
                    <Calendar size={11} />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-white line-clamp-1">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                  <MapPin size={12} className="text-emerald-800 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <p className="text-slate-600 line-clamp-2 leading-relaxed">
                  {item.caption || "Dokumentasi kegiatan resmi Rohis SMA Negeri 4 Purwokerto."}
                </p>
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                href={item.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-slate-500 hover:text-emerald-900 inline-flex items-center gap-1 transition-colors"
              >
                <span>Buka Gambar</span>
                <ExternalLink size={11} />
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-800 hover:text-white bg-white hover:bg-[#062017] border border-slate-200/90 border-b-2 border-b-slate-300 hover:border-[#062017] transition-all cursor-pointer shadow-2xs"
                  title="Edit data dokumentasi foto"
                >
                  <Edit3 size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus foto dokumentasi "${item.title}"?`)) {
                      deleteGalleryItem(item.id);
                    }
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-colors cursor-pointer"
                  title="Hapus foto"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGallery.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/90">
          <ImageIcon size={36} className="mx-auto mb-2 text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">
            Tidak ada foto dokumentasi yang cocok
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Ubah kata kunci pencarian atau pilih kategori lainnya.
          </p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 1: TAMBAH DOKUMENTASI FOTO BARU (STICKY HEADER + SCROLL BODY + STICKY FOOTER)
         ════════════════════════════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overscroll-contain"
          onClick={() => setIsAddModalOpen(false)}
          onWheel={(e) => {
            if (addFormRef.current && !addFormRef.current.contains(e.target as Node)) {
              addFormRef.current.scrollTop += e.deltaY;
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
            className="bg-white rounded-[28px] max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_28px_70px_-15px_rgba(6,32,23,0.45)] border border-slate-200/90 overscroll-contain"
          >
            {/* Top Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#062017] via-emerald-800 to-[#062017] shrink-0" />

            {/* Sticky Modal Header */}
            <div className="px-6 sm:px-7 py-4.5 bg-gradient-to-b from-slate-50/90 to-white border-b border-slate-200/80 flex items-center justify-between gap-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950 bg-emerald-950/[0.07] border border-emerald-900/15 px-2.5 py-0.5 rounded-md">
                    DOKUMENTASI BARU
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Tambah Foto Kegiatan Rohis
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              ref={addFormRef}
              id="add-gallery-form"
              onSubmit={handleSubmit}
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-7 py-5 space-y-4 text-xs custom-scrollbar"
            >
              {/* Interactive Image Crop & Preview Studio */}
              <ImageCropField
                label="URL Gambar Foto / Upload Perangkat *"
                value={formData.imageUrl}
                onChange={(val) => setFormData({ ...formData, imageUrl: val })}
                aspectRatio="16:10"
                previewBadge={formData.category}
                previewTitle={formData.title || "Judul Kegiatan Baru"}
                previewSubtitle={`${formData.date} • ${formData.location}`}
              />

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Nama / Judul Kegiatan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Type
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pembagian Takjil Buka Puasa SMAPA"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all cursor-pointer"
                    >
                      <option value="Kajian">Kajian & Mentoring</option>
                      <option value="Muskerta & Raker">Muskerta & Raker</option>
                      <option value="Peribadahan">Peribadahan Musholla</option>
                      <option value="Kaderisasi">Kaderisasi & Pelatihan</option>
                      <option value="Bakti Sosial">Bakti Sosial</option>
                      <option value="Keputrian">Keputrian Muslimah</option>
                      <option value="PHBI & Syiar">PHBI & Syiar</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Tanggal Pelaksanaan
                  </label>
                  <div className="relative">
                    <Calendar
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      placeholder="Contoh: 30 Oktober 2026"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Lokasi Dokumentasi
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Contoh: Musholla Al-Ikhlas SMAN 4 Purwokerto"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Keterangan Singkat / Caption
                </label>
                <div className="relative">
                  <FileText
                    size={14}
                    className="absolute left-3.5 top-3 text-slate-400 pointer-events-none"
                  />
                  <textarea
                    rows={3}
                    placeholder="Ceritakan momen dalam foto kegiatan ini..."
                    value={formData.caption}
                    onChange={(e) =>
                      setFormData({ ...formData, caption: e.target.value })
                    }
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-medium leading-relaxed focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>
            </form>

            {/* Sticky Modal Footer */}
            <div className="px-6 sm:px-7 py-4 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 border-b-2 border-b-slate-300 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="add-gallery-form"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white font-extrabold text-xs border border-emerald-700/40 border-b-[2.5px] border-b-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} className="text-amber-300" />
                <span>Simpan Dokumentasi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 2: EDIT DOKUMENTASI FOTO (STICKY HEADER + SCROLL BODY + STICKY FOOTER)
         ════════════════════════════════════════════════════════════════════════ */}
      {editingItem && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overscroll-contain"
          onClick={() => setEditingItem(null)}
          onWheel={(e) => {
            if (editFormRef.current && !editFormRef.current.contains(e.target as Node)) {
              editFormRef.current.scrollTop += e.deltaY;
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
            className="bg-white rounded-[28px] max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_28px_70px_-15px_rgba(6,32,23,0.45)] border border-slate-200/90 overscroll-contain"
          >
            {/* Top Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#062017] via-emerald-800 to-[#062017] shrink-0" />

            {/* Sticky Modal Header — Never Clips! */}
            <div className="px-6 sm:px-7 py-4.5 bg-gradient-to-b from-slate-50/90 to-white border-b border-slate-200/80 flex items-center justify-between gap-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950 bg-emerald-950/[0.07] border border-emerald-900/15 px-2.5 py-0.5 rounded-md">
                    EDIT DOKUMENTASI
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">
                    ID: {editingItem.id}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Perbarui Data Foto Dokumentasi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <form
              ref={editFormRef}
              id="edit-gallery-form"
              onSubmit={handleEditSubmit}
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-7 py-5 space-y-4 text-xs custom-scrollbar"
            >
              {/* Interactive Image Crop & Preview Studio */}
              <ImageCropField
                label="URL Gambar Foto / Upload Perangkat *"
                value={editFormData.imageUrl}
                onChange={(val) =>
                  setEditFormData({ ...editFormData, imageUrl: val })
                }
                aspectRatio="16:10"
                previewBadge={editFormData.category}
                previewTitle={`Live Preview: ${editFormData.title || "Tanpa Judul"}`}
                previewSubtitle={`${editFormData.date} • ${editFormData.location}`}
              />

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Nama / Judul Kegiatan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Type
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Musyawarah Kerja Anggota (MUSKERTA) 2026"
                    value={editFormData.title}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, title: e.target.value })
                    }
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={editFormData.category}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          category: e.target.value,
                        })
                      }
                      className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all cursor-pointer"
                    >
                      <option value="Kajian">Kajian & Mentoring</option>
                      <option value="Muskerta & Raker">Muskerta & Raker</option>
                      <option value="Peribadahan">Peribadahan Musholla</option>
                      <option value="Kaderisasi">Kaderisasi & Pelatihan</option>
                      <option value="Bakti Sosial">Bakti Sosial</option>
                      <option value="Keputrian">Keputrian Muslimah</option>
                      <option value="PHBI & Syiar">PHBI & Syiar</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Tanggal Pelaksanaan
                  </label>
                  <div className="relative">
                    <Calendar
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={editFormData.date}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, date: e.target.value })
                      }
                      placeholder="Contoh: 28 September 2026"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Lokasi Dokumentasi
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        location: e.target.value,
                      })
                    }
                    placeholder="Contoh: Lapangan SMAN 4 Purwokerto"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Keterangan Singkat / Caption
                </label>
                <div className="relative">
                  <FileText
                    size={14}
                    className="absolute left-3.5 top-3 text-slate-400 pointer-events-none"
                  />
                  <textarea
                    rows={3}
                    placeholder="Ceritakan momen dalam foto kegiatan ini..."
                    value={editFormData.caption}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        caption: e.target.value,
                      })
                    }
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-medium leading-relaxed focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>
            </form>

            {/* Sticky Modal Footer */}
            <div className="px-6 sm:px-7 py-4 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-mono text-[10px]">ESC</kbd> untuk menutup
              </span>
              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 border-b-2 border-b-slate-300 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="edit-gallery-form"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white font-extrabold text-xs border border-emerald-700/40 border-b-[2.5px] border-b-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} className="text-amber-300" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
