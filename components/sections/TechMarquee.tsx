import { marqueeSkills } from "@/lib/content";
import Marquee from "@/components/ui/Marquee";

/**
 * Секция с бегущей лентой ключевых технологий.
 *
 * Драматичный переход между Hero и About: bold-лента с edge fades.
 */
export default function TechMarquee() {
  const sep = (
    <span className="text-clay/50" aria-hidden>
      ✦
    </span>
  );

  return (
    <section
      aria-label="Технологии"
      className="border-y border-cloudy/30 bg-cream-soft py-8 sm:py-10"
    >
      <Marquee
        items={marqueeSkills}
        duration="40s"
        separator={sep}
        itemClassName="font-mono text-xl font-semibold text-ink-soft sm:text-2xl"
      />
    </section>
  );
}
