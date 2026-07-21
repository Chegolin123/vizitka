"use client";

import { cn } from "@/lib/utils";

/**
 * Контролы карусели: стрелки по бокам + точки-индикаторы снизу.
 *
 * - Стрелки скрыты на мобильном (там управляют свайпом)
 * - Точки — глобальный навигатор, видны везде
 * - Активная точка — шире + clay, плавная анимация
 * - Полная accessibility: aria-label, aria-current, button type
 */
type CarouselControlsProps = {
  count: number;
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
  /** Infinite loop — стрелки всегда активны */
  infinite?: boolean;
};

export default function CarouselControls({
  count,
  activeIndex,
  onPrev,
  onNext,
  onDotClick,
  infinite = false,
}: CarouselControlsProps) {
  // В infinite-режиме границы не достигаются — стрелки всегда активны.
  // В finite-режиме — дизейблимся на краях.
  const isFirst = !infinite && activeIndex === 0;
  const isLast = !infinite && activeIndex === count - 1;

  return (
    <>
      {/* Стрелки — по бокам, скрыты на мобиле */}
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        aria-label="Предыдущий слайд"
        className={cn(
          "absolute left-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cloudy/40 bg-cream-card/95 text-ink shadow-[var(--shadow-card)] backdrop-blur-sm transition-all duration-base ease-out-expo hover:scale-110 hover:border-clay hover:text-clay disabled:pointer-events-none disabled:opacity-30 md:flex",
          isFirst && "opacity-30"
        )}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={isLast}
        aria-label="Следующий слайд"
        className={cn(
          "absolute right-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cloudy/40 bg-cream-card/95 text-ink shadow-[var(--shadow-card)] backdrop-blur-sm transition-all duration-base ease-out-expo hover:scale-110 hover:border-clay hover:text-clay disabled:pointer-events-none disabled:opacity-30 md:flex",
          isLast && "opacity-30"
        )}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Точки-индикаторы.
          role="group" вместо tablist/tab — табы требуют tabpanel-связи,
          которой у нас нет (слайды не switching content, а визуальные карточки).
          Здесь это пагинация "перейти к слайду N". */}
      <div
        role="group"
        aria-label="Навигация по слайдам"
        className="mt-6 flex items-center justify-center gap-1"
      >
        {Array.from({ length: count }, (_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              type="button"
              aria-pressed={isActive}
              aria-current={isActive ? "true" : undefined}
              aria-label={`Перейти к слайду ${i + 1}`}
              onClick={() => onDotClick(i)}
              // Touch target 44×44px — обёртка с padding, визуальная точка внутри
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-base ease-out-expo hover:bg-clay/5"
            >
              <span
                aria-hidden
                className={cn(
                  "block rounded-full transition-all duration-base ease-out-expo",
                  isActive
                    ? "h-2 w-8 bg-clay"
                    : "h-2 w-2 bg-ink/30 hover:bg-clay/50"
                )}
              />
            </button>
          );
        })}
      </div>
    </>
  );
}
