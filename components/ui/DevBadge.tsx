"use client";

/**
 * Маленькая плашка в углу экрана — индикатор dev-режима.
 *
 * Показывается ТОЛЬКО в development (gate через process.env.NODE_ENV).
 * В production tree-shaking вырежет весь компонент.
 *
 * Подсказывает разработчику что на карточках карусели активны
 * focal-point маркеры (ImageFocusEditor).
 */
export default function DevBadge() {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[200] select-none">
      <div className="flex items-center gap-2 rounded-full border border-clay/40 bg-ink/90 px-3 py-1.5 font-mono text-[10px] font-medium text-cream shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-clay" />
        </span>
        <span>DEV · focus-edit</span>
      </div>
    </div>
  );
}
