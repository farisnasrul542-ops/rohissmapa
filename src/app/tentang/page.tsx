"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KepengurusanSection from "@/components/KepengurusanSection";
import { ScrollProgressBar, CinematicReveal } from "@/components/ScrollAnimations";
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
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function TentangPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf7]">
      <ScrollProgressBar />
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-14 lg:pt-40 lg:pb-16 bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Profil & Kepengurusan Organisasi
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Profil & Kepengurusan Rohis SMAPA
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Mengenal lebih dekat visi, misi, filosofi gerakan, dewan pembina guru PAI, serta struktur dewan kepengurusan Badan Pengurus Harian (BPH) SMA Negeri 4 Purwokerto.
          </p>

          {/* Quick Sub-Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-3xl mx-auto">
            <a
              href="#visi-misi"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/15 backdrop-blur-sm transition-all"
            >
              Visi & Misi
            </a>
            <a
              href="#tentang-kami"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/15 backdrop-blur-sm transition-all"
            >
              Latar Belakang
            </a>
            <a
              href="#pembina"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/15 backdrop-blur-sm transition-all"
            >
              Dewan Pembina
            </a>
            <a
              href="#kepengurusan"
              className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-md shadow-amber-400/20 transition-all flex items-center gap-1.5"
            >
              <Users size={13} />
              <span>Struktur Kepengurusan</span>
            </a>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section id="visi-misi" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 scroll-mt-24">
        <CinematicReveal direction="up" delay={0.1}>
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
        </CinematicReveal>

        {/* Narrative & Quote (Image 2 Style) */}
        <CinematicReveal direction="up" delay={0.15}>
          <div id="tentang-kami" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 scroll-mt-24">
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 border border-emerald-900/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide mb-4">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>{ABOUT_CONTENT.tag}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight mb-4">
                {ABOUT_CONTENT.title}
              </h2>
              <p className="text-sm sm:text-base font-bold text-emerald-900/90 leading-relaxed mb-4">
                {ABOUT_CONTENT.lead}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {ABOUT_CONTENT.paragraph1}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {ABOUT_CONTENT.paragraph2}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-200/80 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-950 mb-1">
                      {ABOUT_CONTENT.highlights[0].title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {ABOUT_CONTENT.highlights[0].desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-950 mb-1">
                      {ABOUT_CONTENT.highlights[1].title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {ABOUT_CONTENT.highlights[1].desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Photo Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-emerald-950/10 border border-emerald-900/10 group bg-emerald-950/5">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src="/images/dokumentasi-smapa.jpg"
                    alt="Dokumentasi Pertemuan Kader Rohis SMA Negeri 4 Purwokerto"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>

              {/* Warm Quote Card */}
              <div className="rounded-3xl p-6 bg-[#FAF7F2] border border-amber-900/10 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <Quote className="w-7 h-7 text-amber-500 fill-amber-500/20 mb-3" />
                  <p className="text-sm italic text-emerald-950/90 font-medium leading-relaxed mb-4">
                    &ldquo;{ABOUT_CONTENT.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900/75 pt-3 border-t border-amber-900/10">
                    <span className="text-amber-600 font-bold">—</span>
                    <span>{ABOUT_CONTENT.quoteAuthor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CinematicReveal>
      </section>

      {/* Identitas & Makna Lambang */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <CinematicReveal direction="up" delay={0.15}>
          <div className="bg-gradient-to-br from-[#062017] via-[#0b3324] to-[#041610] text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-emerald-950/20 border border-emerald-500/20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm bg-white p-7 sm:p-8 rounded-3xl shadow-2xl border border-white/30 flex items-center justify-center">
                <Image
                  src="/images/logo-transparent.png"
                  alt="Logo Resmi Rohis SMA Negeri 4 Purwokerto"
                  width={360}
                  height={220}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-amber-300 text-xs font-bold tracking-wide mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Identitas & Filosofi Lambang</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
                Logo Resmi ROHIS SMA Negeri 4 Purwokerto
              </h2>
              <p className="text-sm text-emerald-100/85 leading-relaxed mb-6">
                Lambang resmi ROHIS SMAPA memadukan siluet kubah masjid dan menara agung sebagai simbol keimanan, ketakwaan, serta keluhuran budi pekerti Islam. Tipografi blok <strong>ROHIS</strong> dengan ornamen menara di bagian bawah melambangkan pondasi dakwah yang kokoh di kalangan pelajar, berpayung pada nama kebanggaan <strong>SMA Negeri 4 Purwokerto</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                  <span className="font-extrabold text-amber-300 block mb-1">Kubah & Menara Masjid</span>
                  <span className="text-emerald-100/70">Pusat ibadah pembinaan spiritual dan syiar kebaikan yang senantiasa meninggi menuju ridha Allah SWT.</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                  <span className="font-extrabold text-amber-300 block mb-1">Pita Kehormatan SMAPA</span>
                  <span className="text-emerald-100/70">Komitmen persatuan, ukhuwah islamiyah, dan dedikasi nyata kader muslim bagi kemajuan almamater tercinta.</span>
                </div>
              </div>
            </div>
          </div>
        </CinematicReveal>
      </section>

      {/* Dewan Pembina Guru PAI */}
      <section id="pembina" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/60 scroll-mt-24">
        <CinematicReveal direction="up" delay={0.1}>
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
        </CinematicReveal>

        <CinematicReveal direction="up" delay={0.2} distance={20}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {TEAM_MEMBERS[0]?.members.map((m, mIdx) => (
              <div
                key={mIdx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-900/10 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-6 group"
              >
                {/* Foto Pembina */}
                <div className="relative w-44 sm:w-48 aspect-square rounded-2xl overflow-hidden shrink-0 shadow-md border border-emerald-900/15 bg-emerald-950/5">
                  <Image
                    src={m.image}
                    alt={`Foto ${m.name} - ${m.role}`}
                    fill
                    sizes="(max-width: 640px) 176px, 192px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Penjelasan & Keterangan di Samping Foto */}
                <div className="flex flex-col justify-between flex-1 h-full text-center sm:text-left">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-bold border border-emerald-200/60 mb-2.5">
                      <GraduationCap size={13} className="text-emerald-700" />
                      <span>{m.role}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-emerald-950 tracking-tight leading-snug mb-1">
                      {m.name}
                    </h3>

                    <p className="text-xs font-semibold text-emerald-700 mb-3.5">
                      {m.classGrade} • SMA Negeri 4 Purwokerto
                    </p>

                    <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-5">
                      {m.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-center sm:justify-start gap-2 text-[11px] text-emerald-800/90 font-medium">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>Membina Periode {SITE.period}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CinematicReveal>
      </section>

      {/* Kepengurusan Interaktif (Sesuai Referensi) */}
      <KepengurusanSection />

      {/* CTA Aspirasi Pelajar */}
      <section className="py-16 bg-gradient-to-br from-[#062017] via-[#092b1e] to-[#041610] text-white border-t border-emerald-800/40">
        <CinematicReveal direction="up" delay={0.1}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Sparkles size={32} className="mx-auto text-amber-400 mb-4 animate-bounce" />
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Sampaikan Ide, Masukan, atau Pertanyaanmu
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xl mx-auto mb-8 leading-relaxed">
              Kotak Aspirasi Pelajar SMAPA siap menampung suara, saran kebaikan, usulan kegiatan musholla, dan konsultasi keagamaan secara aman.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/aspirasi"
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                Kirim Aspirasi Siswa
              </Link>
              <Link
                href="/program"
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all hover:scale-105 active:scale-95"
              >
                Lihat 6 Divisi & Proker
              </Link>
            </div>
          </div>
        </CinematicReveal>
      </section>

      <Footer />
    </div>
  );
}
