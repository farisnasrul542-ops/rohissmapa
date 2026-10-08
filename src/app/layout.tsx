import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col font-sans antialiased text-gray-900 bg-[#fafaf7]">
        {children}
      </body>
    </html>
  );
}
