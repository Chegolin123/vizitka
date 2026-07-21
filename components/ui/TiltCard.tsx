"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Максимальный угол наклона в градусах. 6–10 — приятный диапазон. */
  maxTilt?: number;
  /** «Глубина» — насколько сильно ближняя часть приподнимается (scale). */
  scale?: number;
};

/**
 * Карточка с 3D-наклоном за курсором.
 *
 * Даёт ~90% ощущения 3D-объёта без three.js. Использует motion/react:
 * - useMotionValue для позиции курсора (0..1 внутри карточки)
 * - useSpring с теми же параметрами что Magnetic: stiffness 250, damping 22, mass 0.6
 * - useTransform переводит 0..1 в угол наклона (±maxTilt°)
 *
 * Координирует с существующим .card-hover (translateY(-4px) на hover):
 * - perspective ставится на внутреннюю обёртку
 * - transform: rotateX/rotateY + scale применяется к motion.div
 * - .card-hover работает на дочернем .card, конфликта transform нет
 *
 * Accessibility:
 * - prefers-reduced-motion: карточка статична, не отслеживает курсор
 * - @media (hover: hover) and (pointer: fine) — на тач просто карточка,
 *   onMouseMove не срабатывает
 */
export default function TiltCard({
  children,
  className,
  maxTilt = 8,
  scale = 1.02,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());

  // Позиция курсора в нормализованных координатах [-0.5, 0.5]
  // 0 = центр карточки
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring-сглаживание — идентично Magnetic для единого «почерка»
  const sx = useSpring(x, { stiffness: 250, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 250, damping: 22, mass: 0.6 });

  // Преобразуем нормализованные координаты в угол наклона
  const rotateY = useTransform(sx, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [maxTilt, -maxTilt]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Нормализуем в [-0.5, 0.5]
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // На reduced-motion просто рендерим children без transform-обёртки
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        // Важно: transform-style preserve-3d чтобы дочерние .card-hover
        // и spotlight корректно позиционировались в 3D-пространстве
        transformStyle: "preserve-3d",
      }}
      className={cn("relative", className)}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        // transition для плавности возврата к 0,0 при mouseleave
        className="h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
