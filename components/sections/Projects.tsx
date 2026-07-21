import { stories } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import Carousel from "@/components/ui/Carousel";

/**
 * Секция портфолио — карусель stories.
 *
 * Старая сетка с фильтрами заменена на physics-based карусель по ТЗ.
 * Бэкап старой версии: Projects.tsx.bak
 *
 * Контент (8 stories-карточек) — в lib/content.ts → stories[].
 * Логика карусели — в components/ui/Carousel.tsx.
 */
export default function Projects() {
  return (
    <section id="projects" className="section relative overflow-hidden">
      <div className="container-px">
        <Reveal>
          <span className="section-eyebrow">/ портфолио</span>
          <h2 className="section-title">Избранные работы</h2>
          <p className="mt-4 max-w-2xl text-ink-soft">
            Несколько проектов, которыми горжусь. Потяни мышью или пальцем,
            кликни по карточке или используй стрелки клавиатуры ←→.
          </p>
        </Reveal>

        <Reveal direction="up" delay={150}>
          <Carousel stories={stories} className="mt-12" />
        </Reveal>

        <Reveal>
          <p className="mt-8 text-center text-xs text-ink-muted">
            ✦ Все проекты — из открытого кода на{" "}
            <a
              href="https://github.com/Chegolin123"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-clay underline-offset-2 hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
