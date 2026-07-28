"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Backend live-demo: визуализация request/response цикла.
 *
 * Анимация проходит по слоям backend-стека:
 * Client → Controller → Service → DB → Service → Controller → Client
 *
 * Каждый шаг подсвечивается по очереди, пакет «путешествует» по линии.
 * Имитация обработки API-запроса в реальном времени.
 */

type Step = "client-out" | "controller" | "service" | "db" | "service-back" | "controller-back" | "client-in";

const STEPS: { id: Step; label: string; x: number }[] = [
  { id: "client-out", label: "GET /api/user", x: 12 },
  { id: "controller", label: "Controller", x: 37 },
  { id: "service", label: "Service.find()", x: 62 },
  { id: "db", label: "SELECT * FROM users", x: 88 },
  { id: "service-back", label: "Service.map()", x: 62 },
  { id: "controller-back", label: "res.json()", x: 37 },
  { id: "client-in", label: "200 OK · 23ms", x: 12 },
];

export default function BackendDemo() {
  const [stepIdx, setStepIdx] = useState(0);
  const reduce = Boolean(useReducedMotion());

  useEffect(() => {
    if (reduce) return; // статично при reduced-motion
    const id = window.setInterval(() => {
      setStepIdx((i) => (i + 1) % STEPS.length);
    }, 700);
    return () => window.clearInterval(id);
  }, [reduce]);

  const current = STEPS[stepIdx];

  return (
    <div className="relative z-[70] isolate w-full text-xs">
      {/* === Схема слоёв === */}
      <div className="relative rounded-lg border border-cloudy/40 bg-cream-soft p-3">
        <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-ink-muted">
          <span>↔ request / response</span>
          <span className="tabular-nums">{Math.round((stepIdx + 1) * 3.3)}ms</span>
        </div>

        {/* Горизонтальная линия с точками-слоями */}
        <div className="relative flex h-12 items-center justify-between">
          {/* Фоновая линия */}
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-cloudy/40" />

          {/* Слои (Client / Controller / Service / DB).
              Короткие labels — не выходят за края на узких карточках. */}
          {[
            { x: 12, label: "Client" },
            { x: 37, label: "Ctrl" },
            { x: 62, label: "Svc" },
            { x: 88, label: "DB" },
          ].map((node) => (
            <div
              key={node.label}
              className="absolute -translate-x-1/2 flex flex-col items-center gap-1"
              style={{ left: `${node.x}%` }}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full transition-all duration-base ease-out-expo ${
                  Math.abs(current.x - node.x) < 1
                    ? "scale-150 bg-clay shadow-[0_0_8px_rgba(193,95,60,0.6)]"
                    : "bg-cloudy"
                }`}
              />
              <span className="font-mono text-[8px] text-ink-muted">
                {node.label}
              </span>
            </div>
          ))}

          {/* Путешествующий пакет-индикатор */}
          <div
            className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay transition-all duration-500 ease-in-out"
            style={{ left: `${current.x}%` }}
          />
        </div>

        {/* Текущий шаг — текстовая подпись */}
        <div className="mt-3 rounded border border-cloudy/40 bg-cream-card px-2 py-1.5 text-center">
          <code
            key={stepIdx}
            className="font-mono text-[10px] text-clay"
            style={{
              animation: "demo-fade-in 0.3s ease-out",
            }}
          >
            {current.label}
          </code>
        </div>
      </div>

      <style>{`
        @keyframes demo-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
