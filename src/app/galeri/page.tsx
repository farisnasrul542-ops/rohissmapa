"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GALLERY_DATA } from "@/lib/constants";
import { parseImageCrop, getImageCropStyle } from "@/lib/imageCropUtils";
import { handleGoogleDriveImageError } from "@/lib/driveUtils";
import { ScrollProgressBar, CinematicReveal } from "@/components/ScrollAnimations";
import { Calendar, Tag } from "lucide-react";

export default function GaleriPage() {
  const [galleryList, setGalleryList] = useState<any[]>([...GALLERY_DATA]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rohis_admin_gallery");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGalleryList(parsed);
        }
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <ScrollProgressBar />
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CinematicReveal direction="up" delay={0.1}>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Dokumentasi Kegiatan
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Galeri Dokumentasi Rohis SMAPA
            </h1>
            <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
              Dokumentasi visual momen ibadah berjamaah di Musholla Al-Ikhlas, kajian keputrian, LDKR, dan bakti sosial SMA Negeri 4 Purwokerto.
            </p>
          </CinematicReveal>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryList.map((item: any, idx: number) => {
            const rawImg = item.coverImage || item.image || "/images/dokumentasi-muskerta.jpg";
            return (
              <CinematicReveal
                key={item.id || idx}
                direction="up"
                delay={Math.min(idx * 0.06, 0.2)}
              >
                <div
                  className="bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full"
                >
                  <div>
                    <div className="relative h-56 w-full overflow-hidden bg-emerald-950">
                      <img
                        src={parseImageCrop(rawImg).src}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleGoogleDriveImageError(e, rawImg)}
                        style={getImageCropStyle(rawImg)}
                        className="w-full h-full transition-transform duration-500"
                      />
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-800 text-white shadow">
                          {item.category}
                        </span>
                        {item.emoji && (
                          <span className="w-6 h-6 rounded-full bg-white/90 text-xs flex items-center justify-center shadow">
                            {item.emoji}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Calendar size={13} className="text-emerald-700" />
                        <span>{item.date}</span>
                      </div>

                      <h3 className="text-base font-extrabold text-emerald-950 mb-2 leading-snug group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.description || item.caption}
                      </p>
                    </div>
                  </div>
                </div>
              </CinematicReveal>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
