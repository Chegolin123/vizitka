"use client";

import { useReducedMotion } from "motion/react";

/**
 * Дрейфующие фоновые элементы — code-символы и геометрия.
 *
 * - разбросаны по экрану, медленно дрейфуют (CSS float-анимации)
 * - очень бледные (ink/[0.05]) — добавляют «объём», не отвлекая
 * - на reduced-motion статичны
 * - pointer-events: none
 *
 * Идея в духе Linear/Vercel-портфолио: тонкая «рабочая» атмосфера.
 */
type FloatingItem = {
  content: string;
  className: string;
  style: React.CSSProperties;
  rotate: string;
};

const ITEMS: FloatingItem[] = [
  {
    content: "</>",
    className: "font-mono text-7xl font-bold text-clay/10",
    style: { top: "12%", left: "8%" },
    rotate: "-12deg",
  },
  {
    content: "{ }",
    className: "font-mono text-8xl font-bold text-ink/[0.05]",
    style: { top: "22%", right: "10%" },
    rotate: "8deg",
  },
  {
    content: "() =>",
    className: "font-mono text-6xl font-bold text-clay/8",
    style: { top: "60%", left: "6%" },
    rotate: "-6deg",
  },
  {
    content: "★",
    className: "text-5xl text-clay/15",
    style: { top: "78%", right: "14%" },
    rotate: "0deg",
  },
  {
    content: "[ ]",
    className: "font-mono text-7xl font-bold text-ink/[0.05]",
    style: { top: "45%", right: "5%" },
    rotate: "12deg",
  },
  {
    content: "#",
    className: "font-mono text-9xl font-bold text-clay/8",
    style: { top: "8%", left: "45%" },
    rotate: "0deg",
  },
];

export default function FloatingElements() {
  const reduce = Boolean(useReducedMotion());

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className={`absolute select-none ${item.className}`}
          style={{
            ...item.style,
            transform: `rotate(${item.rotate})`,
            animation: reduce
              ? "none"
              : `float ${8 + i * 1.5}s ease-in-out ${i * -1.2}s infinite`,
          }}
        >
          {item.content}
        </span>
      ))}
    </div>
  );
}
