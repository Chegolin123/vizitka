"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * DevOps live-demo: CI/CD pipeline анимация.
 *
 * Поочерёдно подсвечивает стадии CI/CD:
 * git push → build → test → docker build → deploy → ✓ live
 *
 * Каждая стадия показывает иконку/статус (running ✓/✗),
 * прогресс-полоска показывает «время» обработки.
 */

type StageStatus = "pending" | "running" | "done" | "failed";

type Stage = {
  id: string;
  label: string;
  command: string;
};

const STAGES: Stage[] = [
  { id: "push", label: "git push", command: "main → origin" },
  { id: "install", label: "Install deps", command: "npm ci" },
  { id: "lint", label: "Lint", command: "eslint + tsc" },
  { id: "build", label: "Build", command: "next build" },
  { id: "test", label: "Tests", command: "vitest run" },
  { id: "docker", label: "Docker", command: "build & push" },
  { id: "deploy", label: "Deploy", command: "kubectl rollout" },
];

const STEP_DURATION = 600; // ms на стадию

export default function DevOpsDemo() {
  const [currentStage, setCurrentStage] = useState(0);
  const reduce = Boolean(useReducedMotion());

  useEffect(() => {
    if (reduce) return; // статично при reduced-motion
    const id = window.setInterval(() => {
      setCurrentStage((s) => (s + 1) % (STAGES.length + 2)); // +2 для паузы в конце
    }, STEP_DURATION);
    return () => window.clearInterval(id);
  }, [reduce]);

  const getStatus = (idx: number): StageStatus => {
    if (idx < currentStage) return "done";
    if (idx === currentStage) return "running";
    return "pending";
  };

  // Все стадии выполнены → "deployed" состояние
  const allDone = currentStage >= STAGES.length;

  return (
    <div className="relative z-[70] isolate w-full text-xs">
      {/* Header: workflow name */}
      <div className="mb-2 flex items-center justify-between rounded-t-lg border border-cloudy/40 bg-ink px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <svg className="h-3 w-3 text-cream/60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 5 18 5.3 18 5.3c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z" />
          </svg>
          <span className="font-mono text-[10px] text-cream/80">deploy.yml</span>
        </div>
        <span
          className={`font-mono text-[10px] ${
            allDone ? "text-emerald-300" : "text-amber-300"
          }`}
        >
          {allDone ? "✓ deployed" : "running…"}
        </span>
      </div>

      {/* Список стадий */}
      <div className="space-y-1 rounded-b-lg border border-cloudy/40 border-t-0 bg-ink p-3">
        {STAGES.map((stage, idx) => {
          const status = allDone ? "done" : getStatus(idx);
          return (
            <div
              key={stage.id}
              className={`flex items-center gap-2 rounded px-2 py-1 transition-colors duration-base ${
                status === "running"
                  ? "bg-amber-500/15"
                  : status === "done"
                    ? "bg-emerald-500/10"
                    : "bg-transparent"
              }`}
            >
              {/* Иконка статуса */}
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-[9px]">
                {status === "done" && <span className="text-emerald-300">✓</span>}
                {status === "running" && (
                  <span
                    className="block h-2 w-2 rounded-full border border-amber-300/40 border-t-amber-300"
                    style={{
                      animation: "demo-spin 0.6s linear infinite",
                    }}
                  />
                )}
                {status === "pending" && (
                  <span className="block h-1.5 w-1.5 rounded-full bg-cream/20" />
                )}
              </span>

              {/* Лейбл стадии */}
              <span
                className={`flex-1 font-mono text-[10px] transition-colors duration-base ${
                  status === "pending" ? "text-cream/40" : "text-cream/90"
                }`}
              >
                {stage.label}
              </span>

              {/* Команда справа */}
              <span
                className={`font-mono text-[9px] ${
                  status === "pending"
                    ? "text-cream/30"
                    : status === "done"
                      ? "text-emerald-300/70"
                      : "text-amber-300/70"
                }`}
              >
                {stage.command}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes demo-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
