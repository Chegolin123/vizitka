"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, animate } from "motion/react";

type AnimatedCounterProps = {
  /** Целевое значение (числовая часть) */
  value: number;
  /** Префикс перед числом, например "$" */
  prefix?: string;
  /** Суффикс после числа, например "+", "%", "k" */
  suffix?: string;
  /** Сколько знаков после запятой (для дробных вроде 99.9%) */
  decimals?: number;
  /** Длительность анимации в секундах */
  duration?: number;
  className?: string;
};

/**
 * Отсчёт числа от 0 до value при попадании в viewport.
 *
 * - один раз (once: true) — повторный скролл не перезапускает
 * - использует motion's animate() с easing для плавного замедления
 * - reduced-motion: показывает финальное значение сразу
 * - форматирование с разделителями разрядов (1,234)
 */
export default function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const reduce = Boolean(useReducedMotion());

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced-motion: сразу финальное значение
    if (reduce) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          const controls = animate(0, value, {
            duration,
            ease: [0.22, 1, 0.36, 1], // --ease-out
            onUpdate: (v) => setDisplay(v),
          });
          return () => controls.stop();
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration, reduce]);

  const formatted =
    decimals > 0
      ? display.toLocaleString("ru-RU", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(display).toLocaleString("ru-RU");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
