import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/constants";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.publicUrl || "https://rohis-sman4pwt.web.id"),
  title: {
    default: `${SITE.name} — ${SITE.shortDesc}`,
    template: `%s | ${SITE.shortName}`,
  },
  description: SITE.narrative,
  icons: {
    icon: [
      { url: "/images/logo-square.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/images/logo-square.png",
    apple: "/images/logo-square.png",
  },
  openGraph: {
    title: `${SITE.name} — ${SITE.shortDesc}`,
    description: SITE.narrative,
    images: [
      {
        url: "/images/logo-square.png",
        width: 800,
        height: 800,
        alt: SITE.logoAlt,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased clay-canvas text-[#153E32] selection:bg-[#DCF8EC] selection:text-[#087A53] overflow-x-hidden">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
