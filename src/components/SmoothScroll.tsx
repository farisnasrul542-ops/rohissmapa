"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Completely disable smooth scroll on Admin & Login routes
    // Dashboards, data entry, modals, and management pages need instant native mouse wheel scrolling.
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
      return;
    }

    // 2. Respect reduced motion accessibility
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
      infinite: false,
      prevent: (node) => {
        if (!node || !(node instanceof HTMLElement)) return false;
        return (
          node.hasAttribute("data-lenis-prevent") ||
          node.closest("[data-lenis-prevent]") !== null ||
          node.closest("[role='dialog']") !== null ||
          node.closest(".overflow-y-auto") !== null ||
          node.closest(".overflow-x-auto") !== null ||
          node.closest(".overflow-auto") !== null ||
          node.closest("textarea") !== null ||
          node.closest("select") !== null
        );
      },
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
