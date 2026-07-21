"use client";

import { useEffect, useState } from "react";

/**
 * Плёночный шум (film grain) поверх всей страницы.
 *
 * - SVG-фильтр feTurbulence как data-URI — без внешних картинок
 * - mix-blend-mode: multiply делает зерно «въевшимся» в cream-фон
 * - очень низкий opacity (4%) — добавляет тактильности, но не отвлекает
 * - pointer-events: none, фиксированный, z-index наверху (но под UI)
 * - анимация смещения — зерно «живёт», как плёнка
 *
 * Останавливается когда:
 * - вкладка не видна (document.hidden) — экономит CPU/battery
 * - prefers-reduced-motion (через CSS-глобал)
 */
export default function GrainOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    // Инициализация
    setVisible(!document.hidden);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.04] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Анимация смещения — зерно «живёт». Пауза если вкладка не видна. */}
      <div
        className={visible ? "h-full w-full animate-[grain_8s_steps(10)_infinite]" : "h-full w-full"}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)'/%3E%3C/svg%3E\")",
        }}
      />
      <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }
      `}</style>
    </div>
  );
}
