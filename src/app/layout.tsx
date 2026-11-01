import type { Metadata, Viewport } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://rohis-sman4pwt.web.id"),
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
    url: "https://rohis-sman4pwt.web.id/",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var h = window.location.hostname.toLowerCase();
                var p = window.location.pathname;
                // Jika membuka domain khusus admin (workers.dev) di root "/", langsung arahkan ke /admin sebelum halaman dimuat
                if (h.includes("workers.dev") && (p === "/" || p === "" || p === "/index.html")) {
                  window.location.replace("/admin");
                }
                // Jika membuka domain umum (rohis-sman4pwt.web.id) dan mencoba akses /admin atau /login, langsung tolak dan kembalikan ke beranda umum
                if (h.includes("rohis-sman4pwt.web.id") && (p.startsWith("/admin") || p.startsWith("/login"))) {
                  window.location.replace("/");
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased text-gray-900 bg-[#fafaf7]" suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
