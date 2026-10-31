"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  CalendarDays,
  PlusCircle,
  Search,
  Clock,
  MapPin,
  Trash2,
  Edit3,
  X,
  Sparkles,
  UserCheck,
  ChevronDown,
  Save,
  Link2,
  Type,
  FileText,
  User,
  Briefcase,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { EventItem } from "@/lib/types";
import { formatGoogleDriveUrl, handleGoogleDriveImageError } from "@/lib/driveUtils";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import ImageCropField from "@/components/admin/ImageCropField";

export default function AdminAgendaPage() {
  const { events, addEvent, updateEvent, deleteEvent, toggleEventStatus, searchQuery } =
    useAdmin();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Kajian" as EventItem["category"],
    date: "30 Oktober 2026",
    time: "15:30 - 17:00 WIB",
    location: "Musholla Al-Ikhlas SMAN 4 Purwokerto",
    speaker: "Ustadz Toyyib Yuliadi, Sh. M.Pd",
    speakerRole: "Guru PAI & Pembina Rohis SMAPA",
    status: "open" as EventItem["status"],
    image:
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
    description: "",
  });

  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "Kajian" as EventItem["category"],
    date: "",
    time: "",
    location: "",
    speaker: "",
    speakerRole: "",
    status: "open" as EventItem["status"],
    image: "",
    description: "",
  });

  // Lock body scroll & Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAddModalOpen(false);
        setEditingEvent(null);
      }
    };
    if (isAddModalOpen || editingEvent) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddModalOpen, editingEvent]);

  const openEditEventModal = (event: EventItem) => {
    setEditingEvent(event);
    setEditFormData({
      title: event.title,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      speaker: event.speaker || "",
      speakerRole: event.speakerRole || "",
      status: event.status,
      image: event.image,
      description: event.description,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editFormData.title.trim() || !editFormData.description.trim())
      return;

    updateEvent(editingEvent.id, {
      title: editFormData.title.trim(),
      category: editFormData.category,
      date: editFormData.date.trim(),
      time: editFormData.time.trim(),
      location: editFormData.location.trim(),
      speaker: editFormData.speaker.trim(),
      speakerRole: editFormData.speakerRole.trim(),
      status: editFormData.status,
      image: formatGoogleDriveUrl(editFormData.image.trim()),
      description: editFormData.description.trim(),
    });

    setEditingEvent(null);
  };

  const query = (localSearch || searchQuery).toLowerCase();

  const filteredEvents = events.filter((e) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "upcoming"
        ? e.status !== "completed"
        : e.status === "completed";

    const matchesSearch =
      e.title.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query) ||
      (e.speaker && e.speaker.toLowerCase().includes(query));

    return matchesTab && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    addEvent({
      ...formData,
      quota: 0,
      registered: 0,
      image: formatGoogleDriveUrl(formData.image.trim()),
    });

    setIsAddModalOpen(false);
    setFormData({
      title: "",
      category: "Kajian",
      date: "30 Oktober 2026",
      time: "15:30 - 17:00 WIB",
      location: "Musholla Al-Ikhlas SMAN 4 Purwokerto",
      speaker: "Ustadz Toyyib Yuliadi, Sh. M.Pd",
      speakerRole: "Guru PAI & Pembina Rohis SMAPA",
      status: "open",
      image:
        "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
      description: "",
    });
  };

  const upcomingCount = events.filter((e) => e.status !== "completed").length;
  const completedCount = events.filter((e) => e.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 border-b-[4px] border-b-slate-300/80 shadow-[0_8px_24px_-6px_rgba(6,32,23,0.05)]">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] text-white flex items-center justify-center border border-emerald-700/40 border-b-[3px] border-b-black shadow-md shrink-0">
            <CalendarDays size={22} className="text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-950/[0.06] text-emerald-950 border border-emerald-900/15">
                PENJADWALAN SYIAR
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                • {upcomingCount} Terjadwal / {completedCount} Selesai
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Manajemen Agenda & Jadwal Kajian
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola jadwal kegiatan dakwah, kajian Jumat, LDKR, dan informasi pemateri Musholla Al-Ikhlas SMAPA
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white font-extrabold text-xs border border-emerald-700/40 border-b-[3px] border-b-black shadow-md transition-all hover:-translate-y-0.5 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle size={15} className="text-amber-300" />
          <span>Tambah Agenda Baru</span>
        </button>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 border-b-[3px] border-b-slate-300/70 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div
          data-lenis-prevent="true"
          onWheel={(e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0 overscroll-contain"
        >
          {[
            { id: "all", label: `Semua (${events.length})` },
            { id: "upcoming", label: `Akan Datang (${upcomingCount})` },
            { id: "completed", label: `Selesai (${completedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#062017] text-white border border-emerald-800 border-b-2 border-b-black shadow-xs"
                  : "bg-slate-100/80 hover:bg-slate-200/80 text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-80 relative shrink-0">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Cari judul kegiatan, lokasi, atau pemateri..."
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

      {/* ── EVENTS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl border border-slate-200/90 border-b-[4px] border-b-slate-300/90 hover:border-emerald-800/35 hover:border-b-[#062017] overflow-hidden shadow-[0_8px_24px_-6px_rgba(6,32,23,0.06)] hover:shadow-[0_18px_36px_-8px_rgba(6,32,23,0.12)] flex flex-col hover:-translate-y-0.5 transition-all duration-200 group"
          >
            {/* Event Image & Badges */}
            <div className="relative h-44 w-full bg-[#062017] overflow-hidden">
              <img
                src={parseImageCrop(event.image).src}
                alt={event.title}
                referrerPolicy="no-referrer"
                onError={(e) => handleGoogleDriveImageError(e, event.image)}
                style={getImageCropStyle(event.image)}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#062017]/90 text-emerald-100 border border-white/15 backdrop-blur-md shadow-xs">
                  {event.category}
                </span>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-xs border ${
                    event.status === "completed"
                      ? "bg-slate-900/85 text-slate-200 border-white/15"
                      : "bg-white/95 text-emerald-950 border-white"
                  }`}
                >
                  {event.status === "completed" ? "✓ Selesai" : "● Akan Datang"}
                </span>
              </div>

              <div className="absolute bottom-3 left-3.5 right-3.5">
                <p className="text-[10.5px] font-bold text-amber-300 mb-0.5">
                  {event.date} • {event.time}
                </p>
                <h3 className="font-extrabold text-sm text-white line-clamp-1">
                  {event.title}
                </h3>
              </div>
            </div>

            {/* Event Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600 font-semibold">
                  <MapPin size={13} className="text-emerald-800 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>

                {event.speaker && (
                  <div className="flex items-center gap-2 text-slate-600 font-semibold">
                    <UserCheck size={13} className="text-emerald-800 shrink-0" />
                    <span className="truncate">
                      {event.speaker} ({event.speakerRole || "Pemateri"})
                    </span>
                  </div>
                )}

                <p className="text-slate-500 text-[11.5px] line-clamp-2 leading-relaxed pt-1">
                  {event.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80">
                  Terbuka Umum
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditEventModal(event)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#062017] text-slate-800 hover:text-white border border-slate-200/90 border-b-2 border-b-slate-300 hover:border-[#062017] text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs"
                    title="Edit rincian agenda"
                  >
                    <Edit3 size={12} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() =>
                      toggleEventStatus(
                        event.id,
                        event.status === "completed" ? "open" : "completed"
                      )
                    }
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-200/70 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                    title="Ganti status pelaksanaan"
                  >
                    {event.status === "completed" ? "Aktifkan" : "Selesai"}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Yakin ingin menghapus agenda "${event.title}"?`)) {
                        deleteEvent(event.id);
                      }
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-colors cursor-pointer"
                    title="Hapus Agenda"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/90">
          <CalendarDays size={36} className="mx-auto mb-2 text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">
            Tidak ada agenda yang cocok
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Coba ubah kata kunci pencarian atau pilih tab status di atas.
          </p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 1: TAMBAH AGENDA BARU (STICKY HEADER + SCROLL BODY + STICKY FOOTER)
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
            className="bg-white rounded-[28px] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_28px_70px_-15px_rgba(6,32,23,0.45)] border border-slate-200/90 overscroll-contain"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-[#062017] via-emerald-800 to-[#062017] shrink-0" />

            {/* Sticky Header */}
            <div className="px-6 sm:px-7 py-4.5 bg-gradient-to-b from-slate-50/90 to-white border-b border-slate-200/80 flex items-center justify-between gap-4 shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950 bg-emerald-950/[0.07] border border-emerald-900/15 px-2.5 py-0.5 rounded-md">
                  FORMULIR AGENDA BARU
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1 tracking-tight">
                  Tambah Agenda & Kajian Rohis SMAPA
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <form
              ref={addFormRef}
              id="add-agenda-form"
              onSubmit={handleCreateSubmit}
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-7 py-5 space-y-4 text-xs custom-scrollbar"
            >
              <ImageCropField
                label="URL Gambar Poster / Banner (Atau Upload File)"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
                aspectRatio="16:10"
                previewBadge={formData.category}
                previewTitle={formData.title || "Judul Agenda Baru"}
                previewSubtitle={`${formData.date} • ${formData.time}`}
              />

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Judul Kegiatan / Kajian <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Type
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kajian Rutin Jumat: Adab Penuntut Ilmu"
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
                    Kategori Kegiatan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as EventItem["category"],
                        })
                      }
                      className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all cursor-pointer"
                    >
                      <option value="Kajian">Kajian</option>
                      <option value="MABIT">MABIT (Malam Bina Iman & Taqwa)</option>
                      <option value="Pelatihan">Pelatihan / Leadership</option>
                      <option value="Sosial">Bakti Sosial & Peduli</option>
                      <option value="Lomba">Lomba Islami Pelajar</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Status Pelaksanaan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as EventItem["status"],
                        })
                      }
                      className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all cursor-pointer"
                    >
                      <option value="open">Akan Datang (Terjadwal)</option>
                      <option value="completed">Selesai Dilaksanakan</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Tanggal Kegiatan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 30 Oktober 2026"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Waktu / Jam Pelaksanaan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 15:30 - 17:00 WIB"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Lokasi Musholla / Ruangan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Musholla Al-Ikhlas SMAN 4 Purwokerto"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Nama Pemateri / Ustadz
                  </label>
                  <div className="relative">
                    <User
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="Contoh: Ustadz Toyyib Yuliadi, Sh. M.Pd"
                      value={formData.speaker}
                      onChange={(e) =>
                        setFormData({ ...formData, speaker: e.target.value })
                      }
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Jabatan / Keterangan Pemateri
                  </label>
                  <div className="relative">
                    <Briefcase
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="Contoh: Pembina Rohis & Guru PAI SMAPA"
                      value={formData.speakerRole}
                      onChange={(e) =>
                        setFormData({ ...formData, speakerRole: e.target.value })
                      }
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Deskripsi & Arahan Kegiatan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FileText
                    size={14}
                    className="absolute left-3.5 top-3 text-slate-400 pointer-events-none"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Jelaskan ringkasan materi kajian, perlengkapan yang perlu dibawa siswa, dsb..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-medium leading-relaxed focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>
            </form>

            {/* Sticky Footer */}
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
                form="add-agenda-form"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white font-extrabold text-xs border border-emerald-700/40 border-b-[2.5px] border-b-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} className="text-amber-300" />
                <span>Simpan & Terbitkan Agenda</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 2: EDIT AGENDA & KAJIAN (STICKY HEADER + SCROLL BODY + STICKY FOOTER)
         ════════════════════════════════════════════════════════════════════════ */}
      {editingEvent && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overscroll-contain"
          onClick={() => setEditingEvent(null)}
          onWheel={(e) => {
            if (editFormRef.current && !editFormRef.current.contains(e.target as Node)) {
              editFormRef.current.scrollTop += e.deltaY;
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
            className="bg-white rounded-[28px] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_28px_70px_-15px_rgba(6,32,23,0.45)] border border-slate-200/90 overscroll-contain"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-[#062017] via-emerald-800 to-[#062017] shrink-0" />

            {/* Sticky Header */}
            <div className="px-6 sm:px-7 py-4.5 bg-gradient-to-b from-slate-50/90 to-white border-b border-slate-200/80 flex items-center justify-between gap-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950 bg-emerald-950/[0.07] border border-emerald-900/15 px-2.5 py-0.5 rounded-md">
                    EDIT AGENDA
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">
                    ID: {editingEvent.id}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Perbarui Agenda & Kajian Dakwah
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <form
              ref={editFormRef}
              id="edit-agenda-form"
              onSubmit={handleEditSubmit}
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-7 py-5 space-y-4 text-xs custom-scrollbar"
            >
              {/* Interactive Banner Crop & Preview Studio */}
              <ImageCropField
                label="URL Gambar Poster / Banner (Atau Upload File)"
                value={editFormData.image}
                onChange={(val) =>
                  setEditFormData({ ...editFormData, image: val })
                }
                aspectRatio="16:10"
                previewBadge={editFormData.category}
                previewTitle={`Preview Banner: ${editFormData.title || "Tanpa Judul"}`}
                previewSubtitle={`${editFormData.date} • ${editFormData.time}`}
              />

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Judul Kegiatan / Kajian <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Type
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kajian Rutin Jumat: Adab Penuntut Ilmu"
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
                    Kategori Kegiatan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={editFormData.category}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          category: e.target.value as EventItem["category"],
                        })
                      }
                      className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all cursor-pointer"
                    >
                      <option value="Kajian">Kajian</option>
                      <option value="MABIT">MABIT (Malam Bina Iman & Taqwa)</option>
                      <option value="Pelatihan">Pelatihan / Leadership</option>
                      <option value="Sosial">Bakti Sosial & Peduli</option>
                      <option value="Lomba">Lomba Islami Pelajar</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Status Pelaksanaan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={editFormData.status}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value as EventItem["status"],
                        })
                      }
                      className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all cursor-pointer"
                    >
                      <option value="open">Akan Datang (Terjadwal)</option>
                      <option value="completed">Selesai Dilaksanakan</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Tanggal Kegiatan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 25 Oktober 2026"
                      value={editFormData.date}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, date: e.target.value })
                      }
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Waktu / Jam Pelaksanaan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 15:30 - 17:00 WIB"
                      value={editFormData.time}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, time: e.target.value })
                      }
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Lokasi Musholla / Ruangan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Musholla Al-Ikhlas SMAN 4 Purwokerto"
                    value={editFormData.location}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, location: e.target.value })
                    }
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Nama Pemateri / Ustadz
                  </label>
                  <div className="relative">
                    <User
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="Contoh: Ustadz Toyyib Yuliadi, Sh. M.Pd"
                      value={editFormData.speaker}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, speaker: e.target.value })
                      }
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    Jabatan / Keterangan Pemateri
                  </label>
                  <div className="relative">
                    <Briefcase
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="Contoh: Pembina Rohis & Guru PAI SMAPA"
                      value={editFormData.speakerRole}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          speakerRole: e.target.value,
                        })
                      }
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Deskripsi & Arahan Kegiatan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FileText
                    size={14}
                    className="absolute left-3.5 top-3 text-slate-400 pointer-events-none"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Jelaskan ringkasan materi kajian, perlengkapan yang perlu dibawa..."
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 focus:bg-white text-slate-900 font-medium leading-relaxed focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all"
                  />
                </div>
              </div>
            </form>

            {/* Sticky Footer */}
            <div className="px-6 sm:px-7 py-4 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-mono text-[10px]">ESC</kbd> untuk menutup
              </span>
              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 border-b-2 border-b-slate-300 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="edit-agenda-form"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#0d3b2a] to-[#051a12] hover:from-[#114a35] hover:to-[#072419] text-white font-extrabold text-xs border border-emerald-700/40 border-b-[2.5px] border-b-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} className="text-amber-300" />
                  <span>Simpan Perubahan Agenda</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
