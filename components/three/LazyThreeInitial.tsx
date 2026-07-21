"use client";

import dynamic from "next/dynamic";
import type { CSSProperties } from "react";
import LazyCanvas from "./LazyCanvas";
import { ThreeInitialFallback } from "./ThreeInitial";

/**
 * Ленивая обёртка конкретно для 3D-инициала.
 *
 * Делегирует всю сквозную логику (WebGL-detect, reduced-motion, lazy-load)
 * переиспользуемому <LazyCanvas>, передавая ему:
 * - scene: ThreeInitial (обёрнутый в next/dynamic ssr:false для код-сплиттинга)
 * - fallback: статичный глиф
 *
 * Если в будущем появятся другие 3D-сцены — они используют <LazyCanvas>
 * напрямую со своим scene/fallback.
 */

const ThreeInitial = dynamic(() => import("./ThreeInitial"), {
  ssr: false,
  loading: () => <ThreeInitialFallback />,
});

export default function LazyThreeInitial({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <LazyCanvas
      scene={ThreeInitial}
      fallback={<ThreeInitialFallback />}
      className={className}
      style={style}
    />
  );
}
