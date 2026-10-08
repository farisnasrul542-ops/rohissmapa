"use client";

import { useState } from "react";
import { EventItem } from "@/lib/types";
import { X, CheckCircle2, Calendar, MapPin, Users, Ticket, ArrowRight } from "lucide-react";

interface Props {
  event: EventItem | null;
  onClose: () => void;
}

export default function EventRegisterModal({ event, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    whatsapp: "",
    classGrade: "X",
  });

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.school || !formData.whatsapp) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 mb-2">
            Pendaftaran Online
          </span>
          <h3 className="text-xl font-bold leading-snug">{event.title}</h3>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-emerald-200/90">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-amber-300" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-amber-300" />
              {event.location.split(",")[0]}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-xl font-extrabold text-emerald-950 mb-1">
                Pendaftaran Berhasil!
              </h4>
              <p className="text-xs text-gray-600 mb-6 max-w-sm mx-auto">
                Alhamdulillah, data pendaftaran Anda telah tercatat di sistem ROHIS Banyumas. Konfirmasi dan tiket barcode telah dikirimkan ke WhatsApp Anda.
              </p>

              {/* Digital Pass Preview */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left mb-6">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2 mb-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">TIKET MASUK ELEKTRONIK</span>
                  <Ticket size={16} className="text-emerald-700" />
                </div>
                <div className="text-sm font-bold text-emerald-950">{formData.name}</div>
                <div className="text-xs text-emerald-800">{formData.school} ({formData.classGrade})</div>
                <div className="mt-2 text-[10px] font-mono text-emerald-600">ID: TKT-{Math.floor(100000 + Math.random() * 900000)}</div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition-colors shadow-md"
              >
                Selesai & Simpan Tiket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Lengkap Pelajar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Raihan Al-Fatih"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Asal Sekolah *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SMAN 1 Purwokerto"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tingkat Kelas
                  </label>
                  <select
                    value={formData.classGrade}
                    onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="X">Kelas X (10)</option>
                    <option value="XI">Kelas XI (11)</option>
                    <option value="XII">Kelas XII (12)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="08xxxxxxxxxx (untuk pengiriman tiket barcode)"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                <span>Kuota tersisa: <strong>{event.quota - event.registered} peserta</strong></span>
                <span className="font-bold text-emerald-800">GRATIS</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white font-bold text-sm hover:from-emerald-700 hover:to-emerald-900 transition-all shadow-md shadow-emerald-950/15"
              >
                Kirim Pendaftaran Sekarang
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
