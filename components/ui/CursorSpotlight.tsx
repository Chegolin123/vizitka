"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Глобальный cursor-spotlight: мягкое глиняное свечение
 * следует за курсором по всей странице.
 *
 * - фиксированный div с radial-gradient, позиция обновляется через
 *   CSS-переменные на documentElement
 * - pointer-events: none, z-index под UI но над фоном
 * - только при hover:hover и pointer:fine (без тач)
 * - reduced-motion: не монтируется
 */
export default function CursorSpotlight() {
  const reduce = Boolean(useReducedMotion());

  useEffect(() => {
    if (reduce) return;

    // Проверяем, есть ли настоящий курсор
    const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fineQuery.matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
        document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      style={{
        background:
          "radial-gradient(600px circle at var(--cursor-x, -100px) var(--cursor-y, -100px), rgba(193, 95, 60, 0.06), transparent 65%)",
      }}
    />
  );
}
