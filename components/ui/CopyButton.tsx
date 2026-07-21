"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  className?: string;
  /** Текст в покое */
  label?: string;
  /** Текст после копирования */
  copiedLabel?: string;
};

/**
 * Кнопка копирования значения в буфер обмена.
 *
 * - использует navigator.clipboard с fallback на execCommand для старых браузеров
 * - визуальный feedback: иконка ✓ + смена текста на «Скопировано» на 2с
 * - чтобы не ломать layout, размер кнопки фиксируется через min-w
 */
export default function CopyButton({
  value,
  className,
  label = "Копировать",
  copiedLabel = "Скопировано",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback для старых/незащищённых контекстов
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Буфер недоступен — тихо игнорируем
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`${label}: ${value}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs transition-all duration-base ease-out-expo active:scale-95",
        copied
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
          : "border-cloudy/50 bg-cream-soft/60 text-ink-soft hover:border-clay hover:text-clay",
        className
      )}
    >
      <span className="text-sm leading-none">{copied ? "✓" : "⧉"}</span>
      {copied ? copiedLabel : label}
    </button>
  );
}
