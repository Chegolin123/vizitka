import Image from "next/image";
import { skills, images, type SkillGroup } from "@/lib/content";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import ReactDemo from "@/components/skills/ReactDemo";
import TypeScriptDemo from "@/components/skills/TypeScriptDemo";
import BackendDemo from "@/components/skills/BackendDemo";
import DevOpsDemo from "@/components/skills/DevOpsDemo";

/**
 * Секция навыков с live-демонстрациями.
 *
 * Каждая карточка содержит:
 * - иконку + название категории
 * - интерактивный mini-demo (живой код/анимация работы технологии)
 * - теги стека
 *
 * Demos:
 * - React: живой useState counter, реально работает
 * - TypeScript: компилятор находит тип-ошибку в реальном времени
 * - Backend: request/response цикл через слои
 * - DevOps: CI/CD pipeline анимация
 */
const DEMO_COMPONENTS: Record<SkillGroup["demo"], React.ComponentType> = {
  react: ReactDemo,
  typescript: TypeScriptDemo,
  backend: BackendDemo,
  devops: DevOpsDemo,
};

export default function Skills() {
  return (
    <section id="skills" className="section">
      {/* Тёмная панель — драматический контраст на странице.
          Скруглённые верхние края → панель «поднимается» из cream-фона. */}
      <div className="relative overflow-hidden rounded-t-[2.5rem] bg-ink px-5 py-16 sm:px-8 sm:py-20">
        {/* Декоративное clay-свечение внутри тёмной панели */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-1/4 h-60 w-60 rounded-full bg-clay/15 blur-[100px]"
        />

        <div className="container-px relative">
          <Reveal>
            <span className="section-eyebrow">/ навыки</span>
            <h2 className="section-title text-cream">Технологии в деле</h2>
            <p className="mt-4 max-w-2xl text-cream/70">
              Не просто список слов. Каждая категория ниже — с живой
              мини-демонстрацией того, как технология работает на самом деле.
            </p>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2">
            {skills.map((group) => {
              const Demo = DEMO_COMPONENTS[group.demo];
              return (
                <RevealItem key={group.title}>
                  <TiltCard maxTilt={4} className="h-full">
                    <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-cream/10 bg-cream/5 p-6 backdrop-blur-sm transition-all duration-base ease-out-expo hover:border-clay/30 hover:bg-cream/[0.08]">
                      {/* Header карточки */}
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-clay/30 bg-clay/15 text-xl transition-transform duration-base ease-out-expo group-hover:scale-110"
                        >
                          {group.icon}
                        </span>
                        <div>
                          <h3 className="font-semibold text-cream">{group.title}</h3>
                          <p className="text-[11px] text-cream/50">
                            {group.demoCaption}
                          </p>
                        </div>
                      </div>

                      {/* === Live demo-область ===
                          w-full + h-full обёртка: demo занимает всю ширину
                          карточки и вертикально центрируется. Одинаковая
                          минимальная высота для всех 4 карточек. */}
                      <div className="flex min-h-[160px] w-full items-center">
                        <div className="w-full">
                          <Demo />
                        </div>
                      </div>

                      {/* Теги стека */}
                      <ul className="mt-auto flex flex-wrap gap-1.5 border-t border-cream/10 pt-3">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-cream/15 bg-cream/10 px-3 py-1 font-mono text-xs text-cream/70 transition-colors duration-base ease-out-expo group-hover:border-clay/30 group-hover:text-cream"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TiltCard>
                </RevealItem>
              );
            })}
          </RevealGroup>

          {/* === CTA: GitHub-профиль — clay-tinted на тёмном === */}
          <Reveal delay={200}>
            <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-clay/40 bg-clay/10 p-6 sm:flex-row sm:p-8">
              <div className="flex items-center gap-4 text-center sm:text-left">
                {/* GitHub-иконка */}
                <span
                  aria-hidden
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-clay/20"
                >
                  <svg
                    className="h-6 w-6 text-clay-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 5 18 5.3 18 5.3c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-cream">
                    Хотите посмотреть код поближе?
                  </p>
                  <p className="mt-1 text-sm text-cream/60">
                    10 публичных репозиториев на GitHub — TypeScript, Python,
                    пет-проекты и боты. Структура и стиль — как есть.
                  </p>
                </div>
              </div>
              <a
                href="https://github.com/Chegolin123"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary shrink-0"
              >
                Открыть GitHub →
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
