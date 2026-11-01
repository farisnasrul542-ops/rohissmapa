"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventRegisterModal from "@/components/EventRegisterModal";
import { ScrollProgressBar, CinematicReveal } from "@/components/ScrollAnimations";
import { EVENTS_DATA } from "@/lib/constants";
import { EventItem } from "@/lib/types";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import { handleGoogleDriveImageError } from "@/lib/driveUtils";
import { pullCloudSync } from "@/lib/cloudSync";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AgendaPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [eventList, setEventList] = useState<any[]>(EVENTS_DATA);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rohis_admin_events");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEventList(
            parsed.map((e: any) => ({
              ...e,
              type: e.category || e.type || "Kajian",
            }))
          );
        }
      }
    } catch {}

    pullCloudSync().then((synced) => {
      if (Array.isArray(synced?.rohis_admin_events) && synced.rohis_admin_events.length > 0) {
        setEventList(
          synced.rohis_admin_events.map((e: any) => ({
            ...e,
            type: e.category || e.type || "Kajian",
          }))
        );
      }
    });
  }, []);

  const categories = ["Semua", "Kajian", "Pelatihan", "Sosial", "Workshop", "Organisasi", "Lomba"];

  const filteredEvents = eventList.filter((e: any) => {
    const matchCat =
      activeCategory === "Semua" ||
      (e.type && e.type.toLowerCase() === activeCategory.toLowerCase()) ||
      (e.category && e.category.toLowerCase() === activeCategory.toLowerCase());
    const matchSearch =
      (e.title && e.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.speaker && e.speaker.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <ScrollProgressBar />
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CinematicReveal direction="up" delay={0.1}>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Kalender Dakwah Pelajar
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Agenda & Kegiatan Rohis SMAPA
            </h1>
            <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
              Jadwal kajian rutin, keputrian Jumat, pembiasaan sholat berjamaah di Musholla Al-Ikhlas, dan kegiatan dakwah pelajar SMAPA. Terbuka langsung untuk seluruh siswa tanpa perlu mendaftar.
            </p>
          </CinematicReveal>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-6 relative z-10">
        <CinematicReveal direction="up" delay={0.15}>
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-emerald-950/5 border border-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-emerald-800 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari agenda, lokasi, pemateri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>
        </CinematicReveal>
      </section>

      {/* Event Cards Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: any, idx: number) => (
            <CinematicReveal
              key={event.id}
              direction="up"
              delay={Math.min(idx * 0.06, 0.2)}
            >
              <div
                className="bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full"
              >
              <div>
                {event.image && (
                  <div className="relative h-44 w-full overflow-hidden bg-emerald-950">
                    <img
                      src={parseImageCrop(event.image).src}
                      alt={event.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleGoogleDriveImageError(e, event.image)}
                      style={getImageCropStyle(event.image)}
                      className="w-full h-full transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}
                <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                    {event.type}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    <Calendar size={13} className="text-emerald-700" />
                    {event.date}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-emerald-950 mb-2 group-hover:text-emerald-700 transition-colors leading-snug">
                  {event.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                  {event.description}
                </p>

                <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-700 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-700 shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  {event.speaker && (
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-emerald-700 shrink-0" />
                      <span className="line-clamp-1 font-medium text-gray-800">{event.speaker}</span>
                    </div>
                  )}
                </div>
                </div>
              </div>

              <div className="p-6 pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() =>
                    setSelectedEvent({
                      id: `evt-${event.id}`,
                      slug: `event-${event.id}`,
                      title: event.title,
                      category: event.type,
                      date: event.date,
                      time: event.time,
                      location: event.location,
                      speaker: event.speaker,
                      quota: 150,
                      registered: 75,
                      status: "open",
                      image:
                        event.image ||
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
                      description: event.description,
                    })
                  }
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Lihat Rincian Kegiatan</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </CinematicReveal>
        ))}
      </div>
      </section>

      <EventRegisterModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <Footer />
    </div>
  );
}
