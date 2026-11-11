"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  Variants,
} from "framer-motion";

const EASE_ENTRANCE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * 1. Top Scroll Progress Bar (Subtle Emerald Clay Indicator)
 */
export function ScrollProgressBar() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#087A53] via-[#12A372] to-[#087A53] origin-left z-[100] pointer-events-none"
    />
  );
}

/**
 * 2. Section & Block Reveal on Scroll (02_PROMPT_ANIMASI.md: opacity 0->1, y 20->0px, 400-550ms, once: true, threshold 15-20%)
 */
interface CinematicRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  scale?: number;
  once?: boolean;
}

export function CinematicReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.48,
  direction = "up",
  distance = 20,
  scale = 1,
  once = true,
}: CinematicRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const clampedDistance = Math.min(distance, 24);
  const clampedDelay = Math.min(delay, 0.24);

  const getInitialOffset = () => {
    switch (direction) {
      case "up":
        return { y: clampedDistance, x: 0 };
      case "down":
        return { y: -clampedDistance, x: 0 };
      case "left":
        return { x: clampedDistance, y: 0 };
      case "right":
        return { x: -clampedDistance, y: 0 };
      case "none":
        return { x: 0, y: 0 };
    }
  };

  const offset = getInitialOffset();

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: scale === 1 ? 1 : Math.max(scale, 0.98),
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{ once, amount: 0.16 }}
      transition={{
        duration: Math.min(Math.max(duration, 0.4), 0.55),
        delay: clampedDelay,
        ease: EASE_ENTRANCE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * 3. Card Grid Stagger Container (02_PROMPT_ANIMASI.md: 40-60ms per item, max total delay 240ms)
 */
interface CinematicStaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
}

export function CinematicStagger({
  children,
  className = "",
  staggerDelay = 0.05,
  delayChildren = 0.04,
  once = true,
}: CinematicStaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: Math.min(staggerDelay, 0.06),
        delayChildren: Math.min(delayChildren, 0.12),
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CinematicStaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: EASE_ENTRANCE,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * 4. Hero & Section Text Entrance (02_PROMPT_ANIMASI.md: opacity 0->1, y 16->0px, 450-600ms, stagger 60-80ms)
 */
export function CinematicTextLine({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: Math.min(delay, 0.28),
        ease: EASE_ENTRANCE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * 5. Subtle Parallax Image Container (Disabled on Reduced Motion)
 */
export function ParallaxImageContainer({
  children,
  className = "",
  offset = 12,
}: {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const safeOffset = prefersReducedMotion ? 0 : Math.min(offset, 14);
  const y = useTransform(scrollYProgress, [0, 1], [-safeOffset, safeOffset]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y, scale: prefersReducedMotion ? 1 : 1.03 }}
        className="w-full h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
