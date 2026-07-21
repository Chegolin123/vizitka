"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
} from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  /** Направление входа */
  direction?: Direction;
  /** Задержка старта в мс */
  delay?: number;
  className?: string;
  /** Если true — элемент виден сразу (для ssr-критичных блоков) */
  once?: boolean;
} & Omit<HTMLMotionProps<"div">, "ref">;

const distance = 24;

function buildVariants(direction: Direction, reduce: boolean): Variants {
  // При reduced-motion: убираем только перемещение, opacity оставляем.
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }

  const offset =
    direction === "up"
      ? { y: distance }
      : direction === "down"
        ? { y: -distance }
        : direction === "left"
          ? { x: distance }
          : direction === "right"
            ? { x: -distance }
            : {};

  return {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // --ease-out
        delay: 0,
      },
    },
  };
}

/**
 * Появление элемента при попадании в viewport.
 *
 * На motion + IntersectionObserver (whileInView):
 * - GPU-ускорённый transform + opacity (никакого layout/paint)
 * - Уважает prefers-reduced-motion: убирает перемещение, оставляет fade
 * - Прерываемость: повторный скролл ретаргетит с текущей позиции
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  once = true,
  ...rest
}: RevealProps) {
  const reduce = Boolean(useReducedMotion());
  const variants = buildVariants(direction, reduce);

  return (
    <motion.div
      data-reveal=""
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px 0px -80px 0px" }}
      transition={{ delay: delay / 1000 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Контейнер, который проводит staggered-появление детей.
 * Используется в сетках (skills) и группах.
 *
 * Дети должны быть <RevealItem> (или motion-элементами с теми же вариантами).
 */
const staggerVariants = (reduce: boolean): Variants =>
  reduce
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.06, // 60ms — в рекомендуемом диапазоне 30–80ms
            delayChildren: 0.04,
          },
        },
      };

export function RevealGroup({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "ref">) {
  const reduce = Boolean(useReducedMotion());
  return (
    <motion.div
      data-reveal=""
      className={cn(className)}
      variants={staggerVariants(reduce)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const itemVariants = (reduce: boolean): Variants =>
  reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      };

/** Элемент внутри <RevealGroup>: подхватывает stagger родителя. */
export function RevealItem({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "ref">) {
  const reduce = Boolean(useReducedMotion());
  return (
    <motion.div className={cn(className)} variants={itemVariants(reduce)} {...rest}>
      {children}
    </motion.div>
  );
}
