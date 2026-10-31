"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { EventItem } from "@/lib/types";
import {
  X,
  Calendar,
  MapPin,
  Clock,
  UserCheck,
  Sparkles,
  Info,
} from "lucide-react";
import { formatGoogleDriveUrl, handleGoogleDriveImageError } from "@/lib/driveUtils";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";

interface Props {
  event: EventItem | null;
  onClose: () => void;
}

export default function EventRegisterModal({ event, onClose }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);

  if (!event) return null;

  const imageUrl = event.image
    ? formatGoogleDriveUrl(event.image)
    : "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop";

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overscroll-contain"
      onWheel={(e) => {
        if (bodyRef.current && !bodyRef.current.contains(e.target as Node)) {
          bodyRef.current.scrollTop += e.deltaY;
        }
      }}
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-950/10 overflow-hidden max-h-[90vh] flex flex-col overscroll-contain"
      >
        {/* Banner Image / Header */}
        <div className="relative h-44 sm:h-52 w-full bg-emerald-950 shrink-0 overflow-hidden">
          <img
            src={parseImageCrop(imageUrl).src}
            alt={event.title}
            referrerPolicy="no-referrer"
            onError={(e) => handleGoogleDriveImageError(e, imageUrl)}
            style={getImageCropStyle(imageUrl)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors z-10 backdrop-blur-sm cursor-pointer"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>

          {/* Badge & Title */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-emerald-950 mb-1.5 shadow-sm">
              {event.category || "Kajian & Syiar"}
            </span>
            <h3 className="text-lg sm:text-xl font-black leading-snug drop-shadow-sm text-white">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div
          ref={bodyRef}
          data-lenis-prevent="true"
          className="p-6 space-y-4 overflow-y-auto overscroll-contain text-xs flex-1 custom-scrollbar"
        >
          {/* Key Schedule Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-emerald-700 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Tanggal</p>
                <p className="font-bold text-gray-900">{event.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={15} className="text-emerald-700 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Waktu</p>
                <p className="font-bold text-gray-900">{event.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin size={15} className="text-emerald-700 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Tempat</p>
                <p className="font-bold text-gray-900">{event.location}</p>
              </div>
            </div>

            {event.speaker && (
              <div className="flex items-center gap-2 sm:col-span-2">
                <UserCheck size={15} className="text-emerald-700 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Pemateri / Pembina</p>
                  <p className="font-bold text-gray-900">
                    {event.speaker} {event.speakerRole ? `(${event.speakerRole})` : ""}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="font-extrabold text-emerald-950 mb-1 flex items-center gap-1.5 text-xs">
              <Info size={13} className="text-emerald-700" />
              <span>Deskripsi & Agenda Kegiatan:</span>
            </h4>
            <p className="text-gray-600 leading-relaxed text-xs">
              {event.description}
            </p>
          </div>

          {/* Terbuka Langsung Notice (NO REGISTRATION) */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
            <div className="font-extrabold flex items-center gap-1.5 text-emerald-900">
              <Sparkles size={14} className="text-amber-500" />
              <span>Terbuka Langsung untuk Seluruh Siswa SMAPA</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Acara ini tidak memerlukan pendaftaran peserta. Seluruh siswa/siswi muslim SMA Negeri 4 Purwokerto dipersilakan langsung hadir di tempat tepat waktu.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-gray-100 flex items-center justify-end bg-gray-50/50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white font-extrabold text-xs shadow-md transition-all"
          >
            Tutup Informasi
          </button>
        </div>
      </div>
    </div>
  );
}
