import Link from "next/link";
import { SITE } from "@/lib/constants";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#08281d] via-[#051c14] to-[#03120d] text-white pt-16 pb-12 border-t border-emerald-900/40 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/50">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center text-white shadow-lg border border-emerald-500/30">
                <span className="font-black text-xs text-amber-300">SMAPA</span>
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  {SITE.fullName}
                </span>
                <span className="text-xs text-emerald-300/80 font-medium">
                  SMA Negeri 4 Purwokerto • Periode {SITE.period}
                </span>
              </div>
            </div>

            <p className="text-sm text-emerald-100/70 leading-relaxed mb-6 max-w-sm">
              {SITE.tagline} {SITE.narrative}
            </p>

            <div className="flex flex-col gap-2.5 text-xs text-emerald-200/80">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span>{SITE.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-amber-400 shrink-0" />
                <span>{SITE.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-amber-400 shrink-0" />
                <span>{SITE.phone} (Sekretariat Rohis SMAPA)</span>
              </div>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-4">
              Navigasi Utama
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-emerald-100/70">
              <li>
                <Link href="/tentang" className="hover:text-amber-300 transition-colors">
                  Profil & Visi Misi
                </Link>
              </li>
              <li>
                <Link href="/anggota" className="hover:text-amber-300 transition-colors">
                  Kepengurusan & Anggota
                </Link>
              </li>
              <li>
                <Link href="/program" className="hover:text-amber-300 transition-colors">
                  5 Divisi & Program Kerja
                </Link>
              </li>
              <li>
                <Link href="/agenda" className="hover:text-amber-300 transition-colors">
                  Jadwal Agenda & Kajian
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-amber-300 transition-colors">
                  Galeri Dokumentasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-4">
              Layanan Siswa
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-emerald-100/70">
              <li>
                <Link href="/pendaftaran" className="hover:text-amber-300 transition-colors">
                  Pendaftaran Anggota Rohis
                </Link>
              </li>
              <li>
                <Link href="/aspirasi" className="hover:text-amber-300 transition-colors">
                  Kotak Aspirasi & Suara Siswa
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-amber-300 transition-colors">
                  Hubungi Pengurus & Pembina
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-300 transition-colors">
                  Portal Masuk Rohis SMAPA
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials & Hotline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-4">
              Koneksi & Media
            </h4>
            <p className="text-xs text-emerald-100/60 leading-relaxed mb-4">
              Ikuti kabar kegiatan, kultum harian, dan dokumentasi rohis di media resmi SMAPA:
            </p>
            <div className="flex items-center gap-3 mb-6">
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 flex items-center justify-center transition-colors border border-emerald-700/40"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href={SITE.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 flex items-center justify-center transition-colors border border-emerald-700/40"
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-700/30">
              <span className="text-[10px] font-bold text-emerald-300 block mb-1">
                Pusat Aktivitas:
              </span>
              <p className="text-[11px] text-emerald-100/90 leading-tight">
                {SITE.mosqueName} • Kampus SMA Negeri 4 Purwokerto
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/60">
          <p>© {new Date().getFullYear()} {SITE.fullName}. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1">
            <span>Dikelola dengan cinta</span>
            <Heart size={13} className="text-amber-400 fill-amber-400 inline" />
            <span>oleh Tim Medinfo Rohis SMAN 4 Purwokerto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
