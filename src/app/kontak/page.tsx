"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/constants";
import {
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Clock,
  Building,
} from "lucide-react";

export default function KontakPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Pusat Informasi
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Hubungi Rohis SMAN 4 Purwokerto
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
            Pintu komunikasi terbuka untuk bimbingan keagamaan, permohonan kajian, konsultasi siswa, dan kemitraan kegiatan sekolah.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-emerald-950/5 border border-emerald-900/10">
              <h3 className="text-lg font-black text-emerald-950 mb-6">
                Kantor Sekretariat Bersama
              </h3>

              <div className="space-y-5 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Alamat Sekretariat:</span>
                    <span className="text-gray-600 leading-relaxed block mt-0.5">{SITE.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Hotline WhatsApp:</span>
                    <a href="https://wa.me/6282134567890" target="_blank" rel="noreferrer" className="text-emerald-800 font-semibold hover:underline block mt-0.5">
                      {SITE.whatsapp} (Fast Response)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Surat Elektronik (Email):</span>
                    <span className="text-gray-600 block mt-0.5">{SITE.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Jam Operasional Layanan:</span>
                    <span className="text-gray-600 block mt-0.5">Senin - Ahad: 08.00 - 17.00 WIB</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
                  Media Sosial Resmi
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-900 font-bold text-xs hover:bg-emerald-100 transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 text-red-900 font-bold text-xs hover:bg-red-100 transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
                    </svg>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-emerald-950/5 border border-emerald-900/10">
            <h3 className="text-lg font-black text-emerald-950 mb-1">
              Kirimkan Pesan atau Permohonan Resmi
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Silakan isi formulir di bawah ini. Tim administrasi kami akan merespons dalam waktu 1x24 jam kerja.
            </p>

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-lg font-black text-emerald-950 mb-2">
                  Pesan Terkirim dengan Baik
                </h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto mb-6">
                  Jazakumullah khairan. Pesan Anda telah diteruskan ke bidang sekretariat Rohis Banyumas.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nama Lengkap / Instansi *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda atau Nama Sekolah"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="08xxxxxxxxxx"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      placeholder="nama@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Perihal Keperluan *
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                    >
                      <option value="Undangan Acara / Audiensi">Undangan Acara / Audiensi Sekolah</option>
                      <option value="Permohonan Pemateri Rohis">Permohonan Asatidz / Pemateri Kajian</option>
                      <option value="Konsultasi Siswa">Konsultasi Siswa & Keanggotaan Rohis</option>
                      <option value="Kerjasama & Sponsorship">Kerjasama & Sponsorship Dakwah</option>
                      <option value="Lainnya">Pertanyaan Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Isi Pesan / Keterangan Lengkap *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Sampaikan perihal atau kebutuhan Anda secara terperinci..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white font-black text-xs tracking-wide shadow-md shadow-emerald-950/15 hover:from-emerald-700 hover:to-emerald-900 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
