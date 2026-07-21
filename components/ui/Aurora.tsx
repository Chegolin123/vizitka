"use client";

import { useReducedMotion } from "motion/react";

/**
 * Aurora — дрейфующие размытые цветные орбы на фоне.
 *
 * - 3 крупных blur-круга в Anthropic-палитре (clay, clay-300, cloudy)
 * - плавный дрейф через CSS-анимации aurora-drift (20s ease-in-out)
 * - исключительно декоративно: pointer-events: none, position fixed
 * - на prefers-reduced-motion орбы статичны (только цвет)
 *
 * Важно: blur-[120px] + transform — GPU-ускорено, не триггерит layout.
 */
type Orb = {
  className: string;
  size: string;
  position: string;
  delay: string;
  duration: string;
};

const ORBS: Orb[] = [
  {
    className: "bg-clay/20",
    size: "h-[32rem] w-[32rem]",
    position: "-top-32 -left-20",
    delay: "0s",
    duration: "22s",
  },
  {
    className: "bg-clay-200/25",
    size: "h-[28rem] w-[28rem]",
    position: "top-1/3 -right-32",
    delay: "-7s",
    duration: "26s",
  },
  {
    className: "bg-cloudy/30",
    size: "h-[24rem] w-[24rem]",
    position: "bottom-0 left-1/4",
    delay: "-14s",
    duration: "30s",
  },
];

export default function Aurora() {
  const reduce = Boolean(useReducedMotion());

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className={`absolute ${orb.position} ${orb.size} ${orb.className} rounded-full blur-[120px]`}
          style={{
            animation: reduce
              ? "none"
              : `aurora-drift ${orb.duration} ease-in-out ${orb.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
