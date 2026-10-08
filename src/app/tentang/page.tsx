"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KepengurusanSection from "@/components/KepengurusanSection";
import { ABOUT_CONTENT, TEAM_MEMBERS, SITE } from "@/lib/constants";
import {
  Compass,
  Target,
  Award,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  BookOpen,
  Quote,
  Building,
} from "lucide-react";
import Link from "next/link";

export default function TentangPage() {
  const timelineSMAPA = [
    {
      year: "1985",
      tag: "Awal Berdiri",
      title: "Inisiasi Pembinaan Rohis Siswa SMAN 4",
      desc: "Dimulainya kegiatan tadarus dan pembinaan akhlak pelajar muslim di lingkungan kampus SMA Negeri 4 Purwokerto bersama guru PAI perintis.",
      location: "SMAN 4 Purwokerto"
    },
    {
      year: "2005",
      tag: "Pusat Ibadah",
      title: "Peresmian Musholla Al-Ikhlas SMAPA",
      desc: "Pembangunan musholla representatif sekolah sebagai pusat ibadah shalat berjamaah, kultum harian, dan kajian ba'da dzuhur.",
      location: "Musholla Al-Ikhlas"
    },
    {
      year: "2018",
      tag: "Era Kreatif",
      title: "Digitalisasi Dakwah & Media Jurnalistik",
      desc: "Peluncuran majalah dinding modern dan media sosial resmi @rohis_smapa untuk menyebarkan pesan positif keislaman bagi generasi milenial.",
      location: "Lab Komputer & Musholla"
    },
    {
      year: "2022",
      tag: "Kaderisasi",
      title: "Standarisasi Kurikulum LDKR & Mentoring",
      desc: "Penguatan sistem pembinaan kader melalui Latihan Dasar Kepemimpinan Rohis terpadu serta pembentukan lingkaran mentoring halaqah pekanan.",
      location: "Aula Pertemuan SMAPA"
    },
    {
      year: "2025",
      tag: "Masa Kini",
      title: "Sinergi Prestasi & Generasi Berakhlak Mulia",
      desc: "Penguatan kolaborasi dengan OSIS-MPK, program Keputrian Jumat berkah, dan aksi bakti sosial peduli siswa prasejahtera.",
      location: "Kampus SMAN 4 Purwokerto"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Profil Organisasi
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Tentang Rohis SMAN 4 Purwokerto
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Mengenal lebih dekat wadah pembinaan keislaman, pengembangan diri, dan keteladanan akhlak mulia bagi seluruh siswa-siswi muslim SMA Negeri 4 Purwokerto.
          </p>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Visi */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-emerald-950/5 border border-emerald-900/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Compass size={20} />
                </div>
                <h2 className="text-xl font-black text-emerald-950">Visi Organisasi</h2>
              </div>
              <p className="text-sm sm:text-base font-bold text-emerald-900 leading-relaxed mb-4">
                “Terwujudnya Generasi Muda Muslim SMA Negeri 4 Purwokerto yang Bertaqwa, Berilmu, Berakhlakul Karimah, Cerdas, dan Berprestasi.”
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Menjadi pilar pembinaan keagamaan di sekolah yang menumbuhkan kecintaan terhadap Al-Qur'an dan Sunnah, serta berintegritas tinggi dalam kehidupan bermasyarakat.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-emerald-800">
              Prinsip: Berilmu, Beramal, Berakhlak
            </div>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-emerald-950/5 border border-emerald-900/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <Target size={20} />
              </div>
              <h2 className="text-xl font-black text-emerald-950">Misi Utama</h2>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Membiasakan shalat berjamaah, dhuha, dan tadarus Al-Qur'an secara rutin di sekolah.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Mengembangkan wawasan Islam rahmatan lil 'alamin melalui halaqah mentoring siswa.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Membina kepribadian muslimah melalui kajian keputrian Jumat dan fiqih wanita.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                <span>Melatih kepemimpinan amanah dan kepedulian sosial melalui bakti sosial sekolah.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Narrative & Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-xl shadow-emerald-950/5 border border-emerald-900/10">
            <h2 className="text-2xl font-black text-emerald-950 mb-4">
              Jejak Langkah & Nilai Pembinaan di SMAPA
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {ABOUT_CONTENT.paragraph1}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              {ABOUT_CONTENT.paragraph2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              {ABOUT_CONTENT.points.slice(0, 2).map((pt, i) => (
                <div key={i} className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
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

          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 shadow-xl border border-emerald-700/30">
              <Quote size={40} className="text-amber-400/30 mb-4" />
              <p className="text-sm sm:text-base italic leading-relaxed text-emerald-100 mb-6">
                {ABOUT_CONTENT.quote}
              </p>
              <div className="text-xs font-bold text-amber-300">
                Keluarga Besar Rohis SMAPA
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-300/80">
                <span>SMA Negeri 4 Purwokerto</span>
                <span className="font-bold text-amber-400">{SITE.establishedYear}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Linimasa Sejarah SMAPA */}
      <section className="py-20 bg-emerald-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Perjalanan Waktu
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Linimasa Jejak Langkah Rohis SMAPA
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-2">
              Sejarah panjang pembinaan karakter keislaman di kampus SMA Negeri 4 Purwokerto.
            </p>
          </div>

          <div className="relative border-l-2 border-emerald-800 ml-4 md:ml-28 space-y-10">
            {timelineSMAPA.map((item) => (
              <div key={item.year} className="relative pl-8 md:pl-12 group">
                <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-amber-400 text-emerald-950 font-black text-xs flex items-center justify-center shadow-md">
                  {item.year.slice(2)}
                </div>

                <div className="bg-emerald-900/40 rounded-2xl p-6 border border-emerald-800/50 hover:border-emerald-600/40 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-300">
                      Tahun {item.year} • {item.tag}
                    </span>
                    <span className="text-[11px] text-emerald-300/70">{item.location}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dewan Pembina Guru PAI */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Bimbingan Guru PAI
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
            Dewan Pembina Rohis SMAPA
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Membimbing, mengarahkan, dan mengawal kegiatan dakwah dan pembinaan karakter islami siswa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {TEAM_MEMBERS[0]?.members.map((m, mIdx) => (
            <div
              key={mIdx}
              className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm hover:shadow-lg transition-all flex items-start gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-black text-xl shrink-0 shadow">
                {m.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-emerald-950">{m.name}</h3>
                <p className="text-xs font-bold text-emerald-700 mb-1">{m.role}</p>
                <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-50 text-[10px] font-bold text-emerald-800 mb-2 border border-emerald-100">
                  {m.classGrade}
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {m.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kepengurusan Interaktif (Sesuai Referensi) */}
      <KepengurusanSection />

      <Footer />
    </div>
  );
}
