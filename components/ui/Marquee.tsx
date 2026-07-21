import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  /** Скорость: меньше = быстрее. По умолчанию 40s на полный цикл. */
  duration?: string;
  /** Направление reverse */
  reverse?: boolean;
  /** Поставить разделитель между элементами */
  separator?: React.ReactNode;
  className?: string;
  itemClassName?: string;
};

/**
 * Бесконечная бегущая лента.
 *
 * Трюк: контейнер дублирует содержимое (items + items), анимация
 * translateX(0 → -50%) = сдвиг ровно на одну «порцию» — потому шов
 * незаметен и получается бесконечность.
 *
 * Края затухают через mask-image.
 * Reduced-motion: анимация обнуляется глобально в CSS, лента статична.
 */
export default function Marquee({
  items,
  duration = "40s",
  reverse = false,
  separator,
  className,
  itemClassName,
}: MarqueeProps) {
  // Двойной набор для бесшовного цикла
  const loop = [...items, ...items];

  return (
    <div
      className={cn(
        // Маска по краям — затухание
        "group relative flex overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-10 pr-10",
          "animate-marquee",
          reverse && "[animation-direction:reverse]"
        )}
        style={{ animationDuration: duration }}
      >
        {loop.map((item, i) => (
          <span key={i} className={cn("flex items-center gap-10", itemClassName)}>
            <span>{item}</span>
            {separator}
          </span>
        ))}
      </div>
    </div>
  );
}
