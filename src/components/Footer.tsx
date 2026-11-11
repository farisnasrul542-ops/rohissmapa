import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";
import { MapPin } from "lucide-react";

const FOOTER_LINKS = [
  { href: "/tentang", label: "Profil" },
  { href: "/program", label: "Divisi" },
  { href: "/agenda", label: "Agenda" },
  { href: "/galeri", label: "Galeri" },
];

export default function Footer() {
  return (
    <footer className="w-full pt-8 pb-8 sm:pt-10 sm:pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto">
        <div className="clay-card px-5 py-6 sm:px-8 sm:py-7">
          {/* Top Row: Brand, Mosque Location, Nav Links, Instagram */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 pb-5 border-b border-[#DCEAE3]">
            {/* Left: Brand + Location */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
              <Link
                href="/"
                className="flex items-center gap-2.5 group shrink-0"
              >
                <div className="relative w-9 h-9 rounded-full clay-pill-white p-1 flex items-center justify-center shrink-0">
                  <Image
                    src="/images/logo-transparent.png"
                    alt={SITE.logoAlt}
                    fill
                    sizes="36px"
                    className="object-contain p-0.5"
                  />
                </div>
                <div className="leading-tight text-left">
                  <span className="font-heading font-extrabold text-sm text-[#153E32] block">
                    ROHIS SMAN 4
                  </span>
                  <span className="text-xs text-[#4A6B5F] font-medium block">
                    Purwokerto
                  </span>
                </div>
              </Link>

              <span
                className="hidden sm:inline-block w-px h-7 bg-[#D5E6DF]"
                aria-hidden="true"
              />

              <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-medium text-[#3B5E52]">
                <span className="w-6 h-6 rounded-full clay-icon-sq flex items-center justify-center shrink-0">
                  <MapPin size={13} className="text-[#087A53]" />
                </span>
                <span>Musholla Al-Ikhlas SMA Negeri 4 Purwokerto</span>
              </div>
            </div>

            {/* Right: Quick Links + Instagram */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
              <nav
                aria-label="Navigasi Footer"
                className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1 text-xs sm:text-[13px] font-semibold text-[#153E32]"
              >
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-[#087A53] transition-colors py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <span
                className="hidden sm:inline-block w-px h-5 bg-[#D5E6DF]"
                aria-hidden="true"
              />

              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full clay-pill-mint text-xs sm:text-[13px] font-bold text-[#087A53] hover:opacity-90 transition-opacity"
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>{SITE.instagram}</span>
              </a>
            </div>
          </div>

          {/* Bottom Row: Copyright */}
          <div className="pt-4 text-center text-xs text-[#5E7D72] font-medium">
            © 2026 Rohis SMAN 4 Purwokerto. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </div>
    </footer>
  );
}
