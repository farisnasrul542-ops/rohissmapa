import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rohis-sman4purwokerto.sch.id"),
  referrer: "no-referrer",
  title: "ROHIS SMA Negeri 4 Purwokerto — Platform Digital Resmi Pelajar Muslim SMAPA",
  description: "Wadah pembinaan karakter, ukhuwah Islamiyah, dan dakwah pelajar SMA Negeri 4 Purwokerto, Jawa Tengah.",
  keywords: [
    "Rohis SMAPA",
    "Rohis SMAN 4 Purwokerto",
    "SMA Negeri 4 Purwokerto",
    "Pelajar Muslim Purwokerto",
    "Dakwah Sekolah",
    "Musholla Al-Ikhlas SMAN 4",
    "Keputrian SMAPA",
    "Mentoring SMAPA"
  ],
  authors: [{ name: "Rohis SMA Negeri 4 Purwokerto" }],
  openGraph: {
    title: "ROHIS SMA Negeri 4 Purwokerto — Berilmu, Berakhlak Mulia, dan Berprestasi",
    description: "Platform digital resmi Kerohanian Islam (ROHIS) SMA Negeri 4 Purwokerto.",
    siteName: "ROHIS SMAN 4 PURWOKERTO",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/logo-square.png",
        width: 512,
        height: 512,
        alt: "Logo ROHIS SMA Negeri 4 Purwokerto",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon.ico" }
    ],
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased text-gray-900 bg-[#fafaf7]" suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
