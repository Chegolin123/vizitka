"use client";

import { useState, useEffect, useCallback } from "react";
import { useReducedMotion } from "motion/react";

/**
 * React live-demo: рабочий useState-counter с подсветкой синтаксиса.
 *
 * Показывает прямо в карточке навыков:
 * - слева: pseudo-code с подсветкой
 * - справа: живой результат (кнопка + значение, реально обновляется)
 *
 * Авто-демо: раз в 2с «клик» происходит сам (если пользователь не кликнул),
 * чтобы анимация была видна без взаимодействия.
 */
export default function ReactDemo() {
  const [count, setCount] = useState(0);
  const [autoMode, setAutoMode] = useState(true);
  const reduce = Boolean(useReducedMotion());

  // Авто-демо: +1 каждые 2с. Отключаем при reduced-motion.
  useEffect(() => {
    if (!autoMode || reduce) return;
    const id = window.setInterval(() => {
      setCount((c) => c + 1);
    }, 1800);
    return () => window.clearInterval(id);
  }, [autoMode, reduce]);

  const handle_click = useCallback(() => {
    setAutoMode(false); // пользователь перехватил
    setCount((c) => c + 1);
  }, []);

  return (
    <div className="relative z-[70] isolate grid w-full grid-cols-2 gap-3 text-xs">
      {/* === Code-панель === */}
      <div className="rounded-lg border border-cloudy/40 bg-ink p-3 font-mono text-[10px] leading-relaxed">
        <div className="mb-2 flex gap-1">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
        </div>
        <pre className="text-cream/90">
          <span className="text-fuchsia-300">function</span>{" "}
          <span className="text-amber-300">Counter</span>() {"{"}
          {"\n"}
          {"  "}
          <span className="text-fuchsia-300">const</span> [count, setCount] ={" "}
          <span className="text-sky-300">useState</span>(
          <span className="text-emerald-300">0</span>)
          {"\n"}
          {"  "}
          <span className="text-fuchsia-300">return</span> (
          {"\n"}
          {"    "}
          <span className="text-rose-300">&lt;button</span>{" "}
          <span className="text-sky-300">onClick</span>=
          <span className="text-emerald-300">{"{() =>"}</span>{" "}
          <span className="text-amber-300">setCount</span>(count+
          <span className="text-emerald-300">1</span>)
          <span className="text-emerald-300">{"}"}</span>
          <span className="text-rose-300">&gt;</span>
          {"\n"}
          {"      "}Count: {"{"}count{"}"}
          {"\n"}
          {"    "}
          <span className="text-rose-300">&lt;/button&gt;</span>
          {"\n"}
          {"  "})
          {"\n"}
          {"}"}
        </pre>
      </div>

      {/* === Живой результат === */}
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-cloudy/40 bg-cream-soft p-3">
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Count: {count.toString().padStart(2, "0")}
          </div>
          <div
            className="mt-1 text-3xl font-bold text-clay tabular-nums"
            // key заставит анимацию pop при каждом изменении
            key={count}
            style={{
              animation: "demo-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {count}
          </div>
        </div>
        <button
          type="button"
          onClick={handle_click}
          className="rounded-full bg-clay px-4 py-1.5 text-[10px] font-semibold text-white transition-transform duration-fast ease-out-expo hover:scale-105 active:scale-95"
        >
          +1
        </button>
        {autoMode && (
          <span className="text-[9px] text-ink-muted">↻ авто-демо</span>
        )}
      </div>

      <style>{`
        @keyframes demo-pop {
          0% { transform: scale(0.7); opacity: 0.5; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
