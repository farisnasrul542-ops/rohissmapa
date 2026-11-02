"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useInView, useTransform } from "framer-motion";

/**
 * 1. Global Glowing Scroll Progress Bar
 * Placed at the very top of the screen, tracks scroll reading timeline
 * with spring physics and an amber-emerald luxury glow.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 origin-left z-[9999] pointer-events-none shadow-[0_0_12px_rgba(251,191,36,0.8),0_0_4px_rgba(16,185,129,0.5)]"
    />
  );
}

/**
 * 2. Animated Counter with Cinematic easeOutExpo
 * Counts up numbers gracefully when scrolled into view.
 */
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
  noSeparator?: boolean;
}

export function AnimatedCounter({
  value,
  suffix = "",
  duration = 1800,
  className = "",
  noSeparator = false,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const current = Math.floor(easedProgress * value);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {noSeparator ? displayValue : displayValue.toLocaleString("id-ID")}
      {suffix && <span className="text-amber-500 font-extrabold">{suffix}</span>}
    </span>
  );
}

/**
 * 3. Cinematic Viewport Reveal
 * Restrained, high-end motion with subtle blur clearing and custom cubic bezier easing.
 */
interface CinematicRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
}

export function CinematicReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 32,
  duration = 0.75,
}: CinematicRevealProps) {
  const getInitialOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
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
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Smooth filmic deceleration
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * 4. Cinematic Stagger Container & Items
 * For cards, badges, and features that appear in sequential rhythm.
 */
export function CinematicStagger({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CinematicStaggerItem({
  children,
  className = "",
  distance = 28,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * 5. Cinematic Text Line Reveal
 * Reveals lines of text with elegant deceleration and subtle blur clearing.
 */
interface CinematicTextLineProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
}

export function CinematicTextLine({
  children,
  delay = 0,
  duration = 0.8,
  className = "",
  distance = 24,
}: CinematicTextLineProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: distance }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * 6. Subtle Parallax Image Container
 * Shifts images gently inside overflow-hidden frames as the visitor scrolls by.
 */
interface ParallaxImageContainerProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  offset?: number;
}

export function ParallaxImageContainer({
  children,
  className = "",
  speed = 18,
  offset,
}: ParallaxImageContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectiveSpeed = offset ?? speed;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-effectiveSpeed, effectiveSpeed]);

  const hasPos =
    className.includes("absolute") ||
    className.includes("fixed") ||
    className.includes("relative");

  return (
    <div
      ref={containerRef}
      className={`${hasPos ? "" : "relative"} overflow-hidden ${className}`}
    >
      <motion.div style={{ y }} className="w-full h-full relative will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

