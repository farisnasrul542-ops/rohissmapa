"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

/** Only the photograph tilts: surrounding copy stays still and readable. */
export default function ClayTilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 220, damping: 28 });
  const rotateY = useSpring(y, { stiffness: 220, damping: 28 });

  const reset = () => { x.set(0); y.set(0); };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 6);
    y.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 7);
  };

  return (
    <div className={`clay-tilt-stage ${className}`} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
      <motion.div className="clay-tilt-object" style={{ rotateX: reducedMotion ? 0 : rotateX, rotateY: reducedMotion ? 0 : rotateY }}>
        {children}
      </motion.div>
    </div>
  );
}
