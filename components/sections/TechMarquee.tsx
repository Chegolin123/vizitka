import { marqueeSkills } from "@/lib/content";
import Marquee from "@/components/ui/Marquee";

/**
 * Секция с бегущей лентой ключевых технологий.
 *
 * Две ленты идут в противоположных направлениях — создаёт динамичный
 * «кинетический» эффект без перегруза.
 *
 * Reduced-motion: ленты останавливаются (через CSS-глобал).
 */
export default function TechMarquee() {
  const sep = (
    <span className="text-clay/40" aria-hidden>
      ✦
    </span>
  );

  return (
    <section aria-label="Технологии" className="border-y border-cloudy/30 bg-cream-soft/40 py-6">
      <div className="flex flex-col gap-4">
        <Marquee
          items={marqueeSkills}
          duration="45s"
          separator={sep}
          itemClassName="font-mono text-lg font-medium text-ink-soft"
        />
      </div>
    </section>
  );
}
