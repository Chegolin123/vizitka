"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  type SVGProps,
} from "react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";

/**
 * Каркас анимированной иконки в стиле pqoqubbw/icons.
 *
 * - 24×24 stroke-svg (совместимо с lucide)
 * - по умолчанию анимация запускается по hover и сбрасывается на mouse leave
 * - императивный handle { startAnimation, stopAnimation } для управления
 *   по клику / скроллу / чему угодно
 * - уважает prefers-reduced-motion: на reduce анимация не запускается
 */

export type IconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

type IconProps = {
  size?: number;
  className?: string;
  // onAnimationStart/End конфликтуют у motion с нативными AnimationEvent —
  // режем их из публичных пропсов, мы управляем анимацией через controls.
} & Omit<
  SVGProps<SVGSVGElement>,
  "ref" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

const baseProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const svgVariants: Variants = {
  normal: { opacity: 1 },
  animate: { opacity: 1 },
};

const transition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1], // --ease-out
};

/**
 * Создаёт анимированную иконку.
 * @param renderPaths — функция, рендерящая <motion.path>/<motion.rect>/...
 *                      с заданными variants. Контейнер svg управляется сам.
 */
export function createAnimatedIcon(
  renderPaths: () => React.ReactNode
) {
  const Icon = forwardRef<IconHandle, IconProps>(
    ({ size = 24, className, ...svgProps }, ref) => {
      const controls = useAnimation();
      const reduce = Boolean(useReducedMotion());

      useImperativeHandle(
        ref,
        () => ({
          startAnimation: () => {
            if (reduce) return;
            controls.start("animate");
          },
          stopAnimation: () => {
            controls.start("normal");
          },
        }),
        [controls, reduce]
      );

      const onEnter = useCallback(() => {
        if (reduce) return;
        controls.start("animate");
      }, [controls, reduce]);

      const onLeave = useCallback(() => {
        controls.start("normal");
      }, [controls]);

      return (
        <motion.svg
          {...baseProps}
          {...svgProps}
          width={size}
          height={size}
          className={className}
          variants={svgVariants}
          initial="normal"
          animate={controls}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {renderPaths()}
        </motion.svg>
      );
    }
  );
  Icon.displayName = "AnimatedIcon";
  return Icon;
}

/** Экспортируем transition для переиспользования в фабрике иконок. */
export const iconTransition = transition;
