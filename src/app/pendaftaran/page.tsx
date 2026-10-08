"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE, DIVISIONS } from "@/lib/constants";
import { CheckCircle2, ShieldCheck, ArrowRight, UserPlus, HeartHandshake } from "lucide-react";

export default function PendaftaranPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    nisn: "",
    gender: "Laki-laki",
    classGrade: "X (Fase E)",
    classRoom: "X-1",
    whatsapp: "",
    email: "",
    divisionInterest: "Divisi Syiar & Peribadahan",
    motivation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.whatsapp) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Penerimaan Anggota Baru
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Pendaftaran Rohis SMAN 4 Purwokerto
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
            Mari bergabung dalam lingkaran kebaikan pelajar muslim SMA Negeri 4 Purwokerto. Tumbuhkan potensi ibadah, kepemimpinan, dan ukhuwah bersama kami.
          </p>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-emerald-950/5 border border-emerald-900/10">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 mb-3">
                Ahlan wa Sahlan, {form.name}!
              </h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
                Formulir pendaftaran kamu telah berhasil dikirim ke pengurus Rohis SMA Negeri 4 Purwokerto. Kakak panitia akan segera menghubungimu melalui WhatsApp di nomor <strong>{form.whatsapp}</strong> untuk informasi jadwal pertemuan dan grup mentoring.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/agenda"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-800 text-white font-bold text-xs shadow-md hover:bg-emerald-900 transition-colors"
                >
                  Jelajahi Jadwal Kegiatan Rohis
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-emerald-950 mb-1">
                  Biodata Siswa / Calon Anggota
                </h3>
                <p className="text-xs text-gray-500">
                  Khusus siswa-siswi SMA Negeri 4 Purwokerto kelas X, XI, dan XII.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Raihan Al-Fatih"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Laki-laki">Laki-laki (Ikhwan)</option>
                    <option value="Perempuan">Perempuan (Akhwat / Keputrian)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Jenjang Tingkat Kelas *
                  </label>
                  <select
                    value={form.classGrade}
                    onChange={(e) => setForm({ ...form, classGrade: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                  >
                    <option value="X (Fase E)">Kelas X (Fase E)</option>
                    <option value="XI (Fase F)">Kelas XI (Fase F)</option>
                    <option value="XII (Fase F)">Kelas XII (Fase F Lanjutan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Rombel / Kelas Saat Ini *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: X-2, X-5, XI MIPA 1, XI IPS 2"
                    value={form.classRoom}
                    onChange={(e) => setForm({ ...form, classRoom: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Alamat Email (Opsional)
                  </label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Minat Bidang / Divisi Rohis SMAPA *
                </label>
                <select
                  value={form.divisionInterest}
                  onChange={(e) => setForm({ ...form, divisionInterest: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                >
                  {DIVISIONS.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.shortName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Motivasi Bergabung (Singkat)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan alasan dan harapanmu bergabung dengan Rohis SMA Negeri 4 Purwokerto..."
                  value={form.motivation}
                  onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Pendaftaran ini 100% <strong>GRATIS</strong> dan terbuka bagi seluruh siswa-siswi muslim SMA Negeri 4 Purwokerto di bawah bimbingan Guru PAI SMAPA.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-950/20 hover:from-emerald-700 hover:to-emerald-900 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus size={16} />
                <span>Kirim Formulir Pendaftaran Anggota</span>
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
