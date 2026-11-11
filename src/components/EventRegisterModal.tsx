"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EventItem } from "@/lib/types";
import {
  X,
  Calendar,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { formatGoogleDriveUrl, handleGoogleDriveImageError } from "@/lib/driveUtils";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";

interface Props {
  event: EventItem | null;
  onClose: () => void;
}

export default function EventRegisterModal({ event, onClose }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!event) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [event, onClose]);

  const formatDate = (raw?: string) => {
    if (!raw) return "";
    if (raw.includes("-") && raw.length === 10) {
      try {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }
      } catch {}
    }
    return raw;
  };

  return (
    <AnimatePresence>
      {event && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overscroll-contain"
          onWheel={(e) => {
            if (bodyRef.current && !bodyRef.current.contains(e.target as Node)) {
              bodyRef.current.scrollTop += e.deltaY;
            }
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.05 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0D2B22]/38 backdrop-blur-[4px]"
            aria-hidden="true"
          />

          {/* Clay Modal Panel (Matches 08_agenda_rincian.png) */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="agenda-modal-title"
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
            className="relative z-10 w-full max-w-[540px] clay-card p-3 sm:p-4 max-h-[92vh] flex flex-col overflow-hidden overscroll-contain shadow-[0_24px_60px_-15px_rgba(15,62,46,0.28)]"
          >
            {/* Top Image Frame with Circular Clay Close Button */}
            <div className="relative h-48 sm:h-56 w-full rounded-[18px] overflow-hidden bg-[#E5F2EC] shrink-0">
              {(() => {
                const imageUrl = event.image
                  ? formatGoogleDriveUrl(event.image)
                  : "/images/dokumentasi-smapa.jpg";
                return (
                  <img
                    src={parseImageCrop(imageUrl).src}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleGoogleDriveImageError(e, imageUrl)}
                    style={getImageCropStyle(imageUrl)}
                    className="w-full h-full object-cover"
                  />
                );
              })()}

              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 w-10 h-10 rounded-full clay-btn-white flex items-center justify-center text-[#153E32] z-10 cursor-pointer"
                aria-label="Tutup rincian kegiatan"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div
              ref={bodyRef}
              data-lenis-prevent="true"
              className="px-2 sm:px-3 pt-4 pb-2 space-y-4 overflow-y-auto overscroll-contain flex-1 custom-scrollbar"
            >
              {/* Category Badge & Title */}
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold clay-pill-mint mb-2">
                  {event.category || "Kegiatan Rohis"}
                </span>
                <h3
                  id="agenda-modal-title"
                  className="font-heading text-xl sm:text-2xl font-extrabold text-[#153E32] leading-snug"
                >
                  {event.title}
                </h3>
              </div>

              {/* Mint Clay Schedule Table (Matches 08_agenda_rincian.png) */}
              <div className="clay-inner-mint p-3.5 sm:p-4 space-y-2.5 text-xs sm:text-[13.5px]">
                <div className="flex items-start gap-3 pb-2 border-b border-[#BFE6D3]/60">
                  <Calendar
                    size={16}
                    className="text-[#087A53] shrink-0 mt-0.5"
                  />
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                    <span className="font-semibold text-[#3B5E52]">
                      Tanggal:
                    </span>
                    <span className="font-bold text-[#153E32]">
                      {formatDate(event.date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-2 border-b border-[#BFE6D3]/60">
                  <Clock size={16} className="text-[#087A53] shrink-0 mt-0.5" />
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                    <span className="font-semibold text-[#3B5E52]">Waktu:</span>
                    <span className="font-bold text-[#153E32]">
                      {event.time}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-start gap-3 ${
                    event.speaker ? "pb-2 border-b border-[#BFE6D3]/60" : ""
                  }`}
                >
                  <MapPin
                    size={16}
                    className="text-[#087A53] shrink-0 mt-0.5"
                  />
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                    <span className="font-semibold text-[#3B5E52]">
                      Tempat:
                    </span>
                    <span className="font-bold text-[#153E32] sm:text-right">
                      {event.location}
                    </span>
                  </div>
                </div>

                {event.speaker && (
                  <div className="flex items-start gap-3">
                    <UserCheck
                      size={16}
                      className="text-[#087A53] shrink-0 mt-0.5"
                    />
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                      <span className="font-semibold text-[#3B5E52]">
                        Pembina / Pemateri:
                      </span>
                      <span className="font-bold text-[#153E32] sm:text-right">
                        {event.speaker}
                        {event.speakerRole ? ` (${event.speakerRole})` : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tentang Kegiatan */}
              <div>
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#153E32] mb-1.5">
                  Tentang Kegiatan
                </h4>
                <p className="text-xs sm:text-sm text-[#3B5E52] leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Bottom Notice Pill + Tutup Rincian Button Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="clay-inner-mint px-3.5 py-2.5 rounded-full flex items-center gap-2 text-xs font-semibold text-[#153E32]">
                  <CheckCircle2
                    size={16}
                    className="text-[#087A53] shrink-0"
                  />
                  <span>Terbuka untuk siswa. Tidak perlu pendaftaran.</span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="clay-btn-emerald px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold cursor-pointer shrink-0 text-center"
                >
                  Tutup rincian
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
