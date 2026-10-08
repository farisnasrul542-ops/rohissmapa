"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  HelpCircle,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

export default function AspirasiPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    identity: "Siswa Kelas X (Fase E)",
    category: "Program Dakwah & Kajian",
    message: "",
    contact: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Suara Pelajar
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Kotak Aspirasi Siswa SMAPA
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
            Sampaikan usulan kegiatan, masukan untuk kemakmuran Musholla Al-Ikhlas, atau gagasan program dakwah baru kepada pengurus Rohis SMA Negeri 4 Purwokerto.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <section className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-emerald-950/5 border border-emerald-900/10">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-emerald-950 mb-2">
                Aspirasi Diterima!
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mb-6">
                Terima kasih atas kepedulian dan gagasan baikmu. Tim Pengurus Rohis SMAPA bersama Guru Pembina PAI akan meninjau dan mendiskusikan aspirasimu.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs"
              >
                Kirim Aspirasi Baru
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Judul / Pokok Ide Aspirasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Usulan Lomba Esai Dakwah Antar-Sekolah Saat Libur Semester"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Kategori Aspirasi
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Program Dakwah & Kajian">Program Dakwah & Kajian Musholla</option>
                    <option value="Fasilitas Musholla Al-Ikhlas">Fasilitas & Kebersihan Musholla</option>
                    <option value="Kegiatan PHBI & Lomba">Kegiatan PHBI & Peringatan Hari Besar</option>
                    <option value="Media & Syiar Digital">Ide Konten & Syiar Digital SMAPA</option>
                    <option value="Usulan & Masukan Umum">Usulan & Masukan Umum Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Identitas / Jenjang Siswa (Opsional)
                  </label>
                  <select
                    value={form.identity}
                    onChange={(e) => setForm({ ...form, identity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Siswa Kelas X (Fase E)">Siswa Kelas X (Fase E)</option>
                    <option value="Siswa Kelas XI (Fase F)">Siswa Kelas XI (Fase F)</option>
                    <option value="Siswa Kelas XII (Fase F Lanjutan)">Siswa Kelas XII (Fase F Lanjutan)</option>
                    <option value="Alumni SMAN 4 Purwokerto">Alumni SMAN 4 Purwokerto</option>
                    <option value="Guru / Tenaga Pendidik">Guru / Tenaga Pendidik</option>
                    <option value="Anonim (Rahasia)">Anonim (Rahasia)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Uraian Aspirasi & Solusi yang Ditawarkan *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Jelaskan secara mendalam latar belakang masalah dan saran konkret yang bisa dieksekusi bersama..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kontak WhatsApp / Email (Opsional jika ingin dihubungi kembali)
                </label>
                <input
                  type="text"
                  placeholder="08xxxxxxxxxx / email@kamu.com"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white font-black text-xs tracking-wide shadow-md hover:from-emerald-700 hover:to-emerald-900 transition-all flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>Kirimkan Aspirasi Saya</span>
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
