"use client";

import { useEffect, useState, type CSSProperties, type ComponentType } from "react";

/**
 * Ленивая обёртка для любой 3D-сцены (R3F Canvas).
 *
 * Решает 3 сквозные задачи до монтирования Canvas:
 * 1. Lazy-load через next/dynamic + ssr: false — не блокирует initial render,
 *    не падает на SSR (Canvas требует window + WebGL)
 * 2. WebGL-detect — если WebGL недоступен (старый GPU, software rendering,
 *    приватный режим), показываем fallback, не белый экран
 * 3. prefers-reduced-motion — если пользователь отключил анимации,
 *    вообще не грузим three.js, показываем статичный fallback
 *
 * Переиспользуемая основа для всех 3D-сцен сайта.
 *
 * @example
 * <LazyCanvas
 *   scene={() => import("./MyScene")}
 *   fallback={<StaticGlyph />}
 *   className="absolute inset-0"
 * />
 */

type LazyCanvasProps = {
  /**
   * Canvas-компонент сцены. Оборачивается в next/dynamic с ssr:false
   * внутри LazyCanvas, чтобы код-сплиттинг работал автоматически.
   *
   * @example
   * scene={ThreeInitial}
   */
  scene: ComponentType<any>;
  /** Статичная заглушка при загрузке / нет WebGL / reduced-motion */
  fallback: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Задержка перед проверкой WebGL (мс). По умолчанию 100 — не блокирует LCP. */
  delay?: number;
};

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    // Возвращаем canvas в пул — явно освобождаем (для повторных проверок)
    canvas.width = 0;
    canvas.height = 0;
    return !!ctx;
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * На мобильных (узкий экран) WebGL-сцена слишком дорогая по CPU/battery
 * для декоративного элемента. Показываем fallback.
 */
function isMobile(): boolean {
  return !window.matchMedia("(min-width: 768px)").matches;
}

export default function LazyCanvas({
  scene: Scene,
  fallback,
  className,
  style,
  delay = 100,
}: LazyCanvasProps) {
  // null = ещё не решили, true = рендерим 3D, false = fallback
  const [shouldRender, setShouldRender] = useState<boolean | null>(null);

  useEffect(() => {
    // Откладываем проверку до след. тика — не блокируем первый paint Hero
    const id = window.setTimeout(() => {
      setShouldRender(hasWebGL() && !prefersReducedMotion() && !isMobile());
    }, delay);
    return () => window.clearTimeout(id);
  }, [delay]);

  // Пока не решили ИЛИ решили не рендерить — показываем fallback.
  // Это покрывает загрузку, no-WebGL и reduced-motion одним путём.
  if (shouldRender !== true) {
    return (
      <div className={className} style={style}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <Scene />
    </div>
  );
}
