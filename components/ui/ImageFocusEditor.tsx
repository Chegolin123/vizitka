"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Dev-only: draggable focal-point маркер + zoom (колесо мыши) для настройки
 * object-position и масштаба фото на карточках карусели.
 *
 * Рендерится поверх image-зоны. В production — null.
 *
 * Механика:
 * - Drag маркера (onPointerDown на маркере → document mousemove/mouseup):
 *   меняет object-position (X/Y в %)
 * - Колесо мыши над image-зоной: zoom (0.8–1.5, шаг 0.02)
 * - localStorage persist для focus И zoom раздельно
 * - Кнопка 📋 копирует готовые строки для content.ts
 */

type Props = {
  storyId: string;
  initialFocus?: string;
  initialZoom?: number;
  onChange: (focus: string) => void;
  onZoomChange: (zoom: number) => void;
};

const STORAGE_FOCUS = "vizitka:imgfocus:";
const STORAGE_ZOOM = "vizitka:imgzoom:";
const DEBOUNCE_MS = 250;

function parseFocus(focus: string | undefined): { x: number; y: number } {
  if (!focus) return { x: 50, y: 50 };
  const m = focus.match(/(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (!m) return { x: 50, y: 50 };
  return {
    x: Math.max(0, Math.min(100, parseFloat(m[1]))),
    y: Math.max(0, Math.min(100, parseFloat(m[2]))),
  };
}

export default function ImageFocusEditor({
  storyId,
  initialFocus,
  initialZoom = 1.0,
  onChange,
  onZoomChange,
}: Props) {
  const isProd = process.env.NODE_ENV === "production";

  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  // --- Focus ---
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window === "undefined") return parseFocus(initialFocus);
    const stored = window.localStorage.getItem(STORAGE_FOCUS + storyId);
    return parseFocus(stored ?? initialFocus);
  });

  // --- Zoom ---
  const [zoom, setZoom] = useState(() => {
    if (typeof window === "undefined") return initialZoom;
    const stored = window.localStorage.getItem(STORAGE_ZOOM + storyId);
    return stored ? Math.max(0.8, Math.min(1.5, parseFloat(stored))) : initialZoom;
  });

  const [copied, setCopied] = useState(false);
  const [hasFocusOverride, setHasFocusOverride] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem(STORAGE_FOCUS + storyId));
  });
  const [hasZoomOverride, setHasZoomOverride] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem(STORAGE_ZOOM + storyId));
  });

  const hasOverride = hasFocusOverride || hasZoomOverride;

  // Синхронизация focus с родителем
  const focusString = `${pos.x.toFixed(0)}% ${pos.y.toFixed(0)}%`;
  useEffect(() => {
    onChange(focusString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusString]);

  // Синхронизация zoom с родителем
  useEffect(() => {
    onZoomChange(zoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  // Debounced persist в localStorage
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistFocus = useCallback(
    (x: number, y: number) => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
      writeTimer.current = setTimeout(() => {
        window.localStorage.setItem(STORAGE_FOCUS + storyId, `${x.toFixed(0)}% ${y.toFixed(0)}%`);
        setHasFocusOverride(true);
      }, DEBOUNCE_MS);
    },
    [storyId]
  );

  const persistZoom = useCallback(
    (val: number) => {
      window.localStorage.setItem(STORAGE_ZOOM + storyId, val.toFixed(2));
      setHasZoomOverride(true);
    },
    [storyId]
  );

  // ====== Drag: document-level mousemove/mouseup (надёжнее pointer capture) ======
  const handleMarkerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();  // не запускать carousel-drag
      e.preventDefault();
      draggingRef.current = true;

      // Применяем первое смещение — от позиции клика
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const clamped = {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      };
      setPos(clamped);
    },
    []
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const clamped = {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      };
      setPos(clamped);
      persistFocus(clamped.x, clamped.y);
    };
    const onMouseUp = () => {
      draggingRef.current = false;
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [persistFocus]);

  // ====== Wheel-zoom ======
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.stopPropagation(); // не скроллить страницу
      setZoom((prev) => {
        const delta = e.deltaY > 0 ? -0.03 : 0.03;
        const next = Math.max(0.8, Math.min(1.5, +(prev + delta).toFixed(2)));
        persistZoom(next);
        return next;
      });
    },
    [persistZoom]
  );

  // ====== Buttons ======
  const handleCopy = useCallback(async () => {
    const lines = [
      `imageFocus: "${pos.x.toFixed(0)}% ${pos.y.toFixed(0)}%",`,
      `imageZoom: ${zoom.toFixed(2)},`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      console.warn("[ImageFocusEditor] clipboard:", lines.join(" | "));
    }
  }, [pos, zoom]);

  const handleReset = useCallback(() => {
    window.localStorage.removeItem(STORAGE_FOCUS + storyId);
    window.localStorage.removeItem(STORAGE_ZOOM + storyId);
    setHasFocusOverride(false);
    setHasZoomOverride(false);
    setPos(parseFocus(initialFocus));
    setZoom(initialZoom);
  }, [initialFocus, initialZoom]);

  // Production gate — ПОСЛЕ всех hooks (rules-of-hooks).
  if (isProd) return null;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      // pointer-events:auto только для wheel/drag; маркер отдельно.
      // container не блокирует carousel-drag — stopPropagation в handleMarkerDown.
      className="pointer-events-auto absolute inset-0 z-[100]"
      aria-hidden={false}
    >
      {/* Кроссхер — тонкая 10% сетка */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(168,74,43,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,74,43,0.4) 1px, transparent 1px)",
          backgroundSize: "10% 10%",
        }}
      />

      {/* Направляющие через маркер (X и Y) */}
      <div
        aria-hidden
        className="pointer-events-none absolute h-px w-full bg-clay/60"
        style={{ top: `${pos.y}%` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute h-full w-px bg-clay/60"
        style={{ left: `${pos.x}%` }}
      />

      {/* Маркер — только onPointerDown (drag через document mousemove) */}
      <div
        ref={markerRef}
        onPointerDown={handleMarkerDown}
        role="slider"
        aria-label={`Focal point для ${storyId}: ${pos.x.toFixed(0)}% ${pos.y.toFixed(0)}%, zoom ${zoom.toFixed(2)}`}
        aria-valuenow={Math.round(pos.x)}
        className="pointer-events-auto absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-full border-2 border-white bg-clay shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:cursor-grabbing"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </div>

      {/* Zoom индикатор — справа вверху */}
      <div className="pointer-events-none absolute right-2 top-2 rounded-lg bg-ink/85 px-2 py-0.5 font-mono text-[10px] text-cream backdrop-blur-sm">
        {zoom.toFixed(2)}×
        {hasZoomOverride && (
          <span className="ml-1 rounded bg-clay/40 px-0.5 text-[8px] uppercase text-clay-200">dev</span>
        )}
        <span className="ml-1 text-[8px] text-cream/40">↕ scroll</span>
      </div>

      {/* Контрол-бар снизу-слева */}
      <div className="pointer-events-auto absolute bottom-2 left-2 z-[110] flex items-center gap-1.5 rounded-lg bg-ink/85 px-2 py-1 font-mono text-[10px] text-cream backdrop-blur-sm">
        <span className="tabular-nums text-clay-300">
          {pos.x.toFixed(0)}% {pos.y.toFixed(0)}%
        </span>
        {hasFocusOverride && (
          <span className="rounded bg-clay/30 px-1 text-[8px] text-clay-200">pos</span>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="rounded px-1 py-0.5 text-[10px] transition-colors hover:bg-cream/15"
          aria-label="Скопировать строки imageFocus и imageZoom для content.ts"
          title="Скопировать для content.ts"
        >
          {copied ? "✓" : "📋"}
        </button>
        {hasOverride && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded px-1 py-0.5 text-[10px] transition-colors hover:bg-cream/15"
            aria-label="Сбросить focal point и zoom"
            title="Сбросить"
          >
            ↺
          </button>
        )}
      </div>
    </div>
  );
}
