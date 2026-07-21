"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * TypeScript live-demo: компилятор находит ошибку типа.
 *
 * Поочерёдно показывает 2 состояния:
 * 1. Код с ошибкой типа (number присваивается в string) — красная подсветка + ❌
 * 2. Код с исправленной типизацией — зелёная подсветка + ✓
 *
 * Цикл каждые 4с, имитация работы tsc в реальном времени.
 */

const BAD_CODE = `const name: <hl>string</hl> = <err>42</err>;
// Type 'number' is not
// assignable to 'string'`;

const GOOD_CODE = `const name: <hl>string</hl> = <ok>"Алексей"</ok>;
// ✓ All checks passed`;

export default function TypeScriptDemo() {
  const [phase, setPhase] = useState<"bad" | "good">("bad");
  const reduce = Boolean(useReducedMotion());

  useEffect(() => {
    if (reduce) return; // статично при reduced-motion
    const id = window.setInterval(() => {
      setPhase((p) => (p === "bad" ? "good" : "bad"));
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduce]);

  const code = phase === "bad" ? BAD_CODE : GOOD_CODE;
  const isError = phase === "bad";

  return (
    <div className="relative z-[70] isolate text-xs">
      {/* Заголовок окна с tsc */}
      <div className="flex items-center justify-between rounded-t-lg border border-cloudy/40 border-b-0 bg-ink px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-cream/60">tsc</span>
          <span className="font-mono text-[10px] text-cream/40">--strict</span>
        </div>
        <div
          className={`flex items-center gap-1 text-[10px] font-medium transition-colors duration-base ${
            isError ? "text-rose-300" : "text-emerald-300"
          }`}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: isError ? "#fb7185" : "#34d399",
              animation: "demo-pulse 1.5s ease-in-out infinite",
            }}
          />
          {isError ? "error" : "ok"}
        </div>
      </div>

      {/* Code-панель */}
      <div className="rounded-b-lg border border-cloudy/40 bg-ink p-3 font-mono text-[10px] leading-relaxed text-cream/90">
        <pre className="whitespace-pre-wrap">
          {code.split("\n").map((line, i) => (
            <div key={i} className="min-h-[14px]">
              {renderLine(line)}
            </div>
          ))}
        </pre>

        {/* Статус-бар снизу */}
        <div
          className={`mt-2 border-t border-cream/10 pt-2 text-[9px] transition-colors duration-base ${
            isError ? "text-rose-300" : "text-emerald-300"
          }`}
        >
          {isError ? "❌ Found 1 error in 1 file" : "✓ No type errors"}
        </div>
      </div>

      <style>{`
        @keyframes demo-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/**
 * Простой парсер тегов <hl>, <err>, <ok> в строке кода.
 * Делаю через split чтобы не тащить markdown-парсер.
 */
function renderLine(line: string) {
  if (!line.includes("<")) {
    return <>{line}</>;
  }
  // Разбиваем по тегам
  const parts: React.ReactNode[] = [];
  const regex = /<(hl|err|ok)>([^<]+)<\/\1>/g;
  let lastIdx = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIdx) {
      parts.push(line.slice(lastIdx, match.index));
    }
    const [, tag, content] = match;
    if (tag === "hl") {
      parts.push(
        <span key={key++} className="text-sky-300">
          {content}
        </span>
      );
    } else if (tag === "err") {
      parts.push(
        <span
          key={key++}
          className="rounded bg-rose-500/30 px-0.5 text-rose-200 underline decoration-wavy decoration-rose-400"
        >
          {content}
        </span>
      );
    } else if (tag === "ok") {
      parts.push(
        <span key={key++} className="rounded bg-emerald-500/30 px-0.5 text-emerald-200">
          {content}
        </span>
      );
    }
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < line.length) {
    parts.push(line.slice(lastIdx));
  }
  return <>{parts}</>;
}
