"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";
import type { Story } from "@/lib/content";
import CarouselControls from "./CarouselControls";

/**
 * Infinite Carousel с собственным pointer-drag (не motion's drag).
 *
 * Почему собственный drag, а не motion's drag="x":
 * - motion's drag с dragElastic даёт упругое сопротивление (карточка движется
 *   медленнее курсора) → пользователь тянет на 200px, карточка сдвигается на 30px,
 *   потом onDragEnd читает заниженный offset и возвращает на ту же карточку.
 * - Собственный pointer-drag двигает карточку 1:1 с курсором → естественное ощущение.
 *
 * Архитектура:
 * 1. onPointerDown: захватываем pointer, записываем стартовую позицию
 * 2. onPointerMove: обновляем x = startX + delta (1:1 с курсором)
 * 3. onPointerUp: считаем velocity по последним N событиям, snap к ближайшей
 *    карточке с учётом направления flick. Если |velocity| большая —
 *    можно перепрыгнуть через 1-2 карточки.
 *
 * Clone-based infinite loop:
 * - extendedStories = [clone-3, clone-2, clone-1, real0..real6, clone+1, clone+2, clone+3]
 * - Старт на real-индексе CLONES=3
 * - При onDragEnd, если target улетел в зону клонов — teleport (set без анимации)
 *   в эквивалентную real-позицию. Математически та же X — визуально незаметно.
 */

// === Геометрия ===
const CARD_W = 320;
const CARD_H = 520; // увеличено с 440 → больше места под длинные цитаты
const GAP = 24;
const STEP = CARD_W + GAP;
const CLONES = 3;

// === Параметры drag-физики ===
// Порог velocity (px/s) для определения flick. Ниже = более чувствительный.
const FLICK_VELOCITY = 350;
// При каком смещении drag (в долях CARD_W) snap на соседнюю даже без flick
const DRAG_THRESHOLD = 0.4; // 40% ширины карточки
// Множитель проекции: при flick дораскатываем на velocity * FACTOR px
const INERTIA_FACTOR = 0.4;
// Max перепрыгиваемых карточек за один flick
const MAX_FLICK_JUMP = 3;

// === Snap spring (с overshoot = резинка) ===
const SNAP_SPRING = {
  type: "spring" as const,
  stiffness: 220,
  damping: 18,
  mass: 0.7,
};

const SCALE_MIN = 0.85;
const OPACITY_MIN = 0.7;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

type CarouselProps = {
  stories: Story[];
  autoplayMs?: number;
  className?: string;
};

export default function Carousel({
  stories,
  autoplayMs = 5000,
  className,
}: CarouselProps) {
  const reduce = Boolean(useReducedMotion());
  const N = stories.length;

  // === Расширенный массив с клонами ===
  const totalLength = N + CLONES * 2;
  const extendedStories = useRef<Story[]>([]).current;
  if (extendedStories.length === 0) {
    for (let i = -CLONES; i < N + CLONES; i++) {
      extendedStories.push(stories[((i % N) + N) % N]);
    }
  }

  // === State ===
  const [activeIndex, setActiveIndex] = useState(0);
  const realIndexRef = useRef(CLONES);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportW, setViewportW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // === Drag state (refs — не вызывают re-render) ===
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0); // позиция курсора в начале drag
  const dragStartValueRef = useRef(0); // значение x в начале drag
  const lastMoveRef = useRef<{ x: number; t: number }[]>([]); // история для velocity
  const dragAnimationRef = useRef<ReturnType<typeof animate> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // === Motion values ===
  const x = useMotionValue(0);

  // === Viewport resize через ResizeObserver над контейнером ===
  // Раньше использовали window.innerWidth — но Carousel может быть уже окна
  // (например, при наличии боковой панели или max-width). Берём реальную ширину.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setViewportW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // === Target X для real-индекса ===
  const getTargetX = useCallback(
    (realIndex: number) => {
      const viewportCenter = viewportW / 2;
      return -(realIndex * STEP + CARD_W / 2 - viewportCenter);
    },
    [viewportW]
  );

  // === paddingLeft с минимальным полом (16px) ===
  // Без этого на viewport ≤ CARD_W (320px) padding = 0 или отрицательный,
  // и первая карточка прижата к левому краю — выглядит сломанной.
  const padLeft = Math.max(viewportW / 2 - CARD_W / 2, 16);

  // === Инициализация ===
  useEffect(() => {
    x.set(getTargetX(CLONES));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTargetX]);

  // === Корректировка при resize ===
  useEffect(() => {
    x.set(getTargetX(realIndexRef.current));
  }, [getTargetX, x]);

  // === Snap к real-индексу ===
  // Teleport выполняется через onComplete у animate() — гарантия что spring
  // завершён, без гонки с setTimeout. Teleport ставит x в математически
  // эквивалентную позицию (та же карточка видна по центру), визуально невидим.
  const snapToReal = useCallback(
    (targetReal: number, animated = true) => {
      // Останавливаем любую текущую анимацию x
      dragAnimationRef.current?.stop();

      const targetX = getTargetX(targetReal);
      const needsTeleport = targetReal < CLONES || targetReal >= N + CLONES;

      if (animated && !reduce) {
        dragAnimationRef.current = animate(x, targetX, {
          ...SNAP_SPRING,
          // Teleport строго после settling spring — без гонки с таймером
          onComplete: () => {
            if (needsTeleport) {
              const logical = ((targetReal - CLONES) % N + N) % N;
              const newReal = CLONES + logical;
              x.set(getTargetX(newReal));
              realIndexRef.current = newReal;
            }
          },
        });
      } else {
        x.set(targetX);
        // Reduced-motion: teleport сразу
        if (needsTeleport) {
          const logical = ((targetReal - CLONES) % N + N) % N;
          const newReal = CLONES + logical;
          x.set(getTargetX(newReal));
          realIndexRef.current = newReal;
        }
      }

      realIndexRef.current = targetReal;
      const logical = ((targetReal - CLONES) % N + N) % N;
      setActiveIndex(logical);
    },
    [getTargetX, reduce, x, N]
  );

  // Совместимость: оставляем scheduleTeleportIfNeeded как no-op для тех,
  // кто вызывал его в старом коде. Teleport теперь внутри snapToReal.
  const scheduleTeleportIfNeeded = useCallback(() => {}, []);

  // === Переход на логический индекс (точки) ===
  const goToLogical = useCallback(
    (logicalIndex: number) => {
      const currentLogical = ((realIndexRef.current - CLONES) % N + N) % N;
      let delta = logicalIndex - currentLogical;
      if (delta > N / 2) delta -= N;
      if (delta < -N / 2) delta += N;
      snapToReal(realIndexRef.current + delta);
      scheduleTeleportIfNeeded();
    },
    [snapToReal, scheduleTeleportIfNeeded, N]
  );

  // === Подсчёт velocity из истории перемещений ===
  // Берём последние ~100ms и считаем px/s
  const computeVelocity = useCallback(() => {
    const history = lastMoveRef.current;
    if (history.length < 2) return 0;
    const now = history[history.length - 1];
    // Найти событие ~100ms назад
    const cutoff = now.t - 100;
    let oldest = history[0];
    for (const h of history) {
      if (h.t >= cutoff) {
        oldest = h;
        break;
      }
    }
    const dt = now.t - oldest.t;
    if (dt < 16) return 0; // слишком мало времени
    return ((now.x - oldest.x) / dt) * 1000; // px/s
  }, []);

  // === Pointer drag handlers ===
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    // Только левая кнопка / touch
    if (e.pointerType === "mouse" && e.button !== 0) return;

    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartValueRef.current = x.get();
    lastMoveRef.current = [{ x: e.clientX, t: performance.now() }];
    // Останавливаем любую анимацию (snap/autoplay)
    dragAnimationRef.current?.stop();
    // Захват pointer — события продолжают идти даже если курсор вышел за границы
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsPaused(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - dragStartXRef.current;
    // 1:1 с курсором — НИКАКОЙ эластичности
    x.set(dragStartValueRef.current + delta);

    // Записываем в историю для velocity (ограничиваем размер)
    const now = performance.now();
    const history = lastMoveRef.current;
    history.push({ x: e.clientX, t: now });
    // Чистим старые (>200ms)
    while (history.length > 1 && history[0].t < now - 200) {
      history.shift();
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsPaused(false);

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* игнорируем */
    }

    const currentReal = realIndexRef.current;
    const velocity = computeVelocity(); // px/s, позитивная = вправо
    const totalDrag = e.clientX - dragStartXRef.current; // px, позитивный = вправо

    let targetReal = currentReal;

    if (Math.abs(velocity) >= FLICK_VELOCITY) {
      // === FLICK ===
      // velocity отрицательная при движении влево (хотим след. карточку, real+1)
      // velocity положительная при движении вправо (хотим пред. карточку, real-1)
      const direction = velocity < 0 ? 1 : -1;
      // Сила flick → сколько карточек перепрыгнуть
      // Проецируем дораскатывание: velocity(px/s) * INERTIA_FACTOR(s) / STEP(px)
      const projectedSteps = Math.abs(velocity) * INERTIA_FACTOR / STEP;
      const jump = clamp(Math.ceil(projectedSteps), 1, MAX_FLICK_JUMP);
      targetReal = currentReal + direction * jump;
    } else {
      // === МЕДЛЕННЫЙ DRAG — N карточек по длине свайпа ===
      // Считаем сколько STEP'ов пройдено: |totalDrag| / STEP.
      // Если протянули на 2.4 карточки — snap на 2; на 2.6 → на 3.
      // Минимум 1 (если превысили порог), иначе 0 (возврат).
      const direction = totalDrag < 0 ? 1 : -1; // тянули влево → след., вправо → пред.
      const cardsPassed = Math.abs(totalDrag) / STEP;
      // Маленький drag (< 0.4 карточки) → возврат на текущую
      if (cardsPassed > DRAG_THRESHOLD) {
        const jump = Math.max(1, Math.round(cardsPassed));
        targetReal = currentReal + direction * clamp(jump, 1, MAX_FLICK_JUMP);
      }
    }

    snapToReal(targetReal);
    scheduleTeleportIfNeeded();
  };

  // === Клавиатура ===
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      snapToReal(realIndexRef.current + 1);
      scheduleTeleportIfNeeded();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      snapToReal(realIndexRef.current - 1);
      scheduleTeleportIfNeeded();
    }
  };

  // === Autoplay ===
  useEffect(() => {
    if (reduce || autoplayMs === 0 || isPaused) return;
    const id = window.setInterval(() => {
      snapToReal(realIndexRef.current + 1);
      scheduleTeleportIfNeeded();
    }, autoplayMs);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, autoplayMs, isPaused, snapToReal]);

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => !isDraggingRef.current && setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsPaused(false);
        }
      }}
    >
      <div
        ref={containerRef}
        className="relative overflow-hidden py-8 touch-none focus-visible:outline-2 focus-visible:outline-clay focus-visible:-outline-offset-4"
        role="region"
        aria-roledescription="carousel"
        aria-label="Избранные работы"
        tabIndex={0}
        onKeyDown={onKeyDown}
        // Собственный pointer-drag
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: reduce ? "default" : "grab", touchAction: "pan-y" }}
      >
        <motion.div
          className="flex items-center select-none"
          style={{
            x,
            gap: GAP,
            paddingLeft: padLeft,
          }}
        >
          {extendedStories.map((story, realIdx) => {
            const logicalIdx = ((realIdx - CLONES) % N + N) % N;
            return (
              <CarouselCard
                key={`${story.id}-${realIdx}`}
                story={story}
                realIndex={realIdx}
                x={x}
                viewportW={viewportW}
                isActive={logicalIdx === activeIndex}
                reduce={reduce}
                onClick={() => {
                  // Клик только если не было drag (иначе клик после drag переключает)
                  if (Math.abs(x.get() - getTargetX(realIndexRef.current)) < 5) {
                    goToLogical(logicalIdx);
                  }
                }}
                cardNumber={logicalIdx + 1}
                cardTotal={N}
              />
            );
          })}
        </motion.div>
      </div>

      <CarouselControls
        count={N}
        activeIndex={activeIndex}
        onPrev={() => {
          snapToReal(realIndexRef.current - 1);
          scheduleTeleportIfNeeded();
        }}
        onNext={() => {
          snapToReal(realIndexRef.current + 1);
          scheduleTeleportIfNeeded();
        }}
        onDotClick={goToLogical}
        infinite
      />

      {/* Live region для скринридеров: объявляет смену слайда */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Слайд {activeIndex + 1} из {N}: {stories[activeIndex]?.projectTitle}
      </div>
    </div>
  );
}

/* ===================== CarouselCard ===================== */

type CardProps = {
  story: Story;
  realIndex: number;
  x: ReturnType<typeof useMotionValue<number>>;
  viewportW: number;
  isActive: boolean;
  reduce: boolean;
  onClick: () => void;
  cardNumber: number;
  cardTotal: number;
};

function CarouselCard({
  story,
  realIndex,
  x,
  viewportW,
  isActive,
  reduce,
  onClick,
  cardNumber,
  cardTotal,
}: CardProps) {
  const cardLeftInViewport = viewportW / 2 - CARD_W / 2 + realIndex * STEP;
  const cardCenterInViewport = cardLeftInViewport + CARD_W / 2;

  const distanceToCenter = useTransform(x, (latestX) => {
    return Math.abs(viewportW / 2 - (cardCenterInViewport + latestX));
  });

  const scale = useTransform(
    distanceToCenter,
    [0, CARD_W],
    [1, reduce ? 1 : SCALE_MIN]
  );
  const opacity = useTransform(
    distanceToCenter,
    [0, CARD_W * 1.2],
    [1, reduce ? 1 : OPACITY_MIN]
  );

  // Parallax картинки
  const imgX = useTransform(x, (latestX) => (reduce ? 0 : latestX * -0.15));

  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={`Слайд ${cardNumber} из ${cardTotal}: ${story.projectTitle}`}
      tabIndex={0}
      onKeyDown={(e) => {
        // Активация с клавиатуры (Enter/Space) — то же что click
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="relative shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-clay focus-visible:-outline-offset-4 focus-visible:rounded-2xl"
      style={{
        width: CARD_W,
        height: CARD_H,
        scale,
        opacity,
        perspective: 1000,
        // Запрещаем drag-handle блокировать click детей (ссылки и т.д.)
        pointerEvents: "auto",
      }}
      onClick={onClick}
      data-active={isActive || undefined}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-2xl border bg-cream-card transition-shadow duration-base ease-out-expo",
          isActive
            ? "border-clay/30 shadow-[0_30px_60px_-20px_rgba(193,95,60,0.35)]"
            : "border-cloudy/40 shadow-[var(--shadow-card)]"
        )}
      >
        <div className="relative h-1/2 w-full overflow-hidden bg-cream-soft">
          <motion.div
            className="absolute inset-0"
            style={{ x: imgX, scale: 1.15 }}
          >
            <Image
              src={story.image}
              alt={story.projectTitle}
              fill
              sizes="(max-width: 768px) 85vw, 320px"
              className="object-cover"
              draggable={false}
              // priority для первых карточек + соседей — мгновенная загрузка
              // того что видно в initial viewport. Остальные — lazy.
              priority={Math.abs(realIndex - CLONES) <= 1}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />

          <span className="absolute left-3 top-3 rounded-full bg-cream-card/95 px-2.5 py-1 font-mono text-xs font-medium text-clay backdrop-blur-sm">
            {story.shortLabel}
          </span>
          <div className="absolute right-3 top-3 flex items-center gap-1.5">
            <span className="rounded-full bg-ink/60 px-2 py-0.5 font-mono text-xs text-cream backdrop-blur-sm">
              {story.year}
            </span>
            {/* Иконка-ссылка на GitHub-репозиторий */}
            <a
              href={story.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Открыть код проекта ${story.projectTitle} на GitHub (в новой вкладке)`}
              onClick={(e) => e.stopPropagation()}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/60 text-cream backdrop-blur-sm transition-colors duration-base ease-out-expo hover:bg-clay hover:text-white"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 5 18 5.3 18 5.3c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z" />
              </svg>
            </a>
          </div>
          <h3 className="absolute bottom-3 left-4 right-4 text-xl font-bold text-white">
            {story.projectTitle}
          </h3>
        </div>

        <div className="flex h-1/2 flex-col justify-between overflow-hidden p-5">
          <blockquote className="line-clamp-4 text-sm leading-relaxed text-ink-soft">
            «{story.quote}»
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clay/10 font-mono text-xs font-bold text-clay"
              aria-hidden
            >
              {story.avatarInitial}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-ink">
                {story.authorName}
              </div>
              <div className="truncate text-xs text-ink-muted">
                {story.authorRole}
              </div>
            </div>
          </figcaption>
        </div>
      </div>
    </motion.div>
  );
}
