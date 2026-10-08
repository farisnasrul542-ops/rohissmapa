"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventRegisterModal from "@/components/EventRegisterModal";
import {
  SITE,
  ORG_STATS,
  ABOUT_CONTENT,
  EVENTS_DATA,
  GALLERY_DATA,
} from "@/lib/constants";
import { EventItem } from "@/lib/types";
import {
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Building,
  CheckCircle2,
  Quote,
  MessageSquareHeart,
  ImageIcon,
} from "lucide-react";

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7] text-gray-900 selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />

      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-36 pb-28 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-36 bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/3 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-left">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold mb-6 backdrop-blur-md shadow-lg shadow-emerald-950/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{SITE.heroTag}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-left">
              ROHIS SMAN 4 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-sm">
                PURWOKERTO
              </span>
            </h1>

            <div className="text-lg sm:text-2xl font-bold text-amber-300/90 mb-4 text-left">
              {SITE.heroLead}
            </div>

            {/* Narrative */}
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed mb-8 text-left max-w-2xl">
              {SITE.narrative}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4">
              <Link
                href="/pendaftaran"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Send size={16} className="text-emerald-950" />
                <span>Daftar Anggota Rohis</span>
              </Link>

              <Link
                href="/tentang"
                className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Sparkles size={16} className="text-emerald-300" />
                <span>Profil Rohis SMAPA</span>
              </Link>
            </div>

            {/* Badges from school info */}
            <div className="mt-12 pt-8 border-t border-emerald-800/40 flex flex-wrap items-center justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-emerald-200/80">
              <div className="inline-flex items-center gap-2 bg-emerald-900/60 px-3.5 py-2 rounded-xl border border-emerald-700/40">
                <ShieldCheck size={16} className="text-amber-400 shrink-0" />
                <span>{SITE.metaStatus}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-900/60 px-3.5 py-2 rounded-xl border border-emerald-700/40">
                <MapPin size={16} className="text-amber-400 shrink-0" />
                <span>{SITE.photoLoc}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-900/60 px-3.5 py-2 rounded-xl border border-emerald-700/40">
                <Building size={16} className="text-amber-400 shrink-0" />
                <span>{SITE.mosqueName}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. LIVE METRICS & STATS ── */}
      <section className="relative z-20 -mt-10 sm:-mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 border border-emerald-900/10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {ORG_STATS.map((stat: any, idx: number) => (
            <div
              key={stat.label}
              className={`flex flex-col justify-center ${
                idx !== 0 ? "lg:border-l lg:border-gray-100 lg:pl-6" : ""
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
                {stat.value.toLocaleString("id-ID")}
                <span className="text-amber-500 font-extrabold">{stat.suffix}</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-700 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. TENTANG KAMI (ABOUT SECTION) ── */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
              {ABOUT_CONTENT.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight mb-4">
              {ABOUT_CONTENT.title}
            </h2>
            <p className="text-base font-bold text-emerald-900/90 leading-relaxed mb-4">
              {ABOUT_CONTENT.lead}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {ABOUT_CONTENT.paragraph1}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {ABOUT_CONTENT.paragraph2}
            </p>

            {/* 4 Key Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 mb-6">
              {ABOUT_CONTENT.points.map((pt, i) => (
                <div key={i} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/80">
                  <h4 className="text-xs font-extrabold text-emerald-950 mb-1">
                    {pt.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quote & Photo Side */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 shadow-xl border border-emerald-700/30 relative">
              <Quote size={40} className="text-amber-400/30 mb-4" />
              <p className="text-sm sm:text-base italic leading-relaxed text-emerald-100 mb-6">
                {ABOUT_CONTENT.quote}
              </p>
              <div className="text-xs font-bold text-amber-300">
                Dewan Pembina & Pengurus Rohis SMAPA
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-300/80">
                <span>SMA Negeri 4 Purwokerto</span>
                <span className="font-bold text-amber-400">Periode {SITE.period}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. AGENDA & EVENT TERBARU ── */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Agenda Kegiatan
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
              Agenda & Kajian Rohis SMAPA
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Jadwal kegiatan syiar, mentoring, kajian Jumat berkah, dan keputrian di lingkungan SMA Negeri 4 Purwokerto.
            </p>
          </div>

          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 group"
          >
            <span>Lihat Semua Jadwal</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EVENTS_DATA.slice(0, 3).map((event: any) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-900/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-900/10">
                    {event.type}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    {event.date}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-emerald-950 mb-3 leading-snug">
                  {event.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-6">
                  {event.description}
                </p>

                <div className="space-y-2 text-xs text-gray-500 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-700 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-800 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Daftar / Ikuti Acara</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. DOKUMENTASI KEGIATAN PILIHAN SMAPA ── */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-[#fafaf7] via-emerald-50/40 to-[#fafaf7] border-t border-emerald-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
                Dokumentasi Kegiatan
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
                Galeri Syiar & Ukhuwah SMAPA
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Potret nyata aktivitas pembiasaan ibadah di Musholla Al-Ikhlas, kajian keputrian, dan kegiatan kepemimpinan SMA Negeri 4 Purwokerto.
              </p>
            </div>

            <Link
              href="/galeri"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 group"
            >
              <span>Buka Galeri Lengkap</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_DATA.slice(0, 3).map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-emerald-950">
                    <img
                      src={item.coverImage || item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-800 text-white shadow">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-semibold text-emerald-700 block mb-1.5">
                      {item.date}
                    </span>
                    <h3 className="text-base font-extrabold text-emerald-950 leading-snug group-hover:text-emerald-700 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-50 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">Dokumentasi SMAPA</span>
                  <Link
                    href="/galeri"
                    className="font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                  >
                    <span>Lihat Foto</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA PENDAFTARAN ANGGOTA & ASPIRASI ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block mb-2">
              Ayo Bergabung Bersama Kami!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Jadilah Bagian dari Keluarga Besar Rohis SMAPA!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Tingkatkan wawasan keislaman, temukan sahabat taat di sekolah, asah keterampilan kepemimpinan, dan dapatkan pengalaman berharga di SMA Negeri 4 Purwokerto.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/pendaftaran"
              className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs text-center shadow-lg transition-all hover:scale-105"
            >
              Isi Formulir Pendaftaran
            </Link>
            <Link
              href="/aspirasi"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquareHeart size={14} />
              <span>Kotak Aspirasi Siswa</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Event Register Modal */}
      {selectedEvent && (
        <EventRegisterModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <Footer />
    </div>
  );
}
