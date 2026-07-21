"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Радиус свечения за курсором (px) */
  spotlightSize?: number;
};

/**
 * Карточка со «spotlight»-эффектом: тёплое глиняное свечение
 * следует за курсором внутри границ элемента.
 *
 * Реализация:
 * - onMouseMove обновляет CSS-переменные --mx/--my
 * - радиальный градиент в ::before читает эти переменные
 * - opacity:0 по умолчанию → opacity:1 на hover (плавное появление)
 * - pointer-events: none у overlay, так как чисто декоративный слой
 *
 * Проверка на hover: на тач-устройствах onMouseMove не сработает —
 * эффект просто не активируется, деградация корректная.
 */
export default function SpotlightCard({
  children,
  className,
  spotlightSize = 320,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - rect.left + "px");
    el.style.setProperty("--my", e.clientY - rect.top + "px");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "group/spotlight relative overflow-hidden",
        className
      )}
      style={
        {
          "--spotlight-size": `${spotlightSize}px`,
        } as React.CSSProperties
      }
    >
      {/* Spotlight-слой: радиальный градиент следует за --mx/--my */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-base ease-out-expo group-hover/spotlight:opacity-100"
        style={{
          background:
            "radial-gradient(var(--spotlight-size) circle at var(--mx) var(--my), rgba(193, 95, 60, 0.12), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
