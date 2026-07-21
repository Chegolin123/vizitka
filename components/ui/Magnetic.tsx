"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Сила притяжения, px отступа максимума. ~0.3–0.5 — приятный диапазон. */
  strength?: number;
};

/**
 * «Магнитный» элемент: плавно следует за курсором внутри своих границ.
 *
 * - useSpring придаёт естественную инерцию (не «прилипает» к курсору резко)
 * - при prefers-reduced-motion полностью отключается
 * - только для pointer:fine (на тач-экранах не активируется onMouseMove)
 */
export default function Magnetic({
  children,
  className,
  strength = 0.35,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring с критическим демпфированием — без отскока, плавный след
  const sx = useSpring(x, { stiffness: 250, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 250, damping: 22, mass: 0.6 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
    >
      {children}
    </motion.div>
  );
}
