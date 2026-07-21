import { whyMe, whyMeMetrics, workProcess, profile } from "@/lib/content";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import TiltCard from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

/**
 * Секция «Почему я» — теперь композитная.
 *
 * Три блока:
 * 1. Метрики-доказательства (4 крупные цифры с отсчётом)
 * 2. Процесс работы (вертикальный timeline из 5 фаз)
 * 3. Преимущества (6 карточек, как раньше но компактнее)
 *
 * Цель: снять страхи клиента КОНКРЕТНЫМИ данными, а не общими словами.
 */
export default function WhyMe() {
  return (
    <section id="why-me" className="section">
      <div className="container-px">
        {/* === Заголовок === */}
        <Reveal>
          <span className="section-eyebrow">/ почему я</span>
          <h2 className="section-title">
            Что вы получаете, работая со мной
          </h2>
          <p className="mt-4 max-w-2xl text-ink-soft">
            Не общие обещания, а конкретные цифры, прозрачный процесс и
            обязательства — то, что реально снижает риск для вашего бизнеса.
          </p>
        </Reveal>

        {/* === БЛОК 1: Метрики-доказательства === */}
        <Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {whyMeMetrics.map((metric) => (
              <div
                key={metric.label}
                className="relative overflow-hidden rounded-2xl border border-cloudy/40 bg-cream-card p-5 text-center shadow-[var(--shadow-card)]"
              >
                {/* Декоративный глиняный glow */}
                <div
                  aria-hidden
                  className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-clay/10 blur-2xl"
                />
                <div className="relative">
                  <div className="text-3xl font-bold text-gradient sm:text-4xl">
                    <AnimatedCounter
                      value={metric.value}
                      suffix={metric.suffix}
                      decimals={"decimals" in metric ? metric.decimals : 0}
                    />
                  </div>
                  <div className="mt-2 text-sm font-medium text-ink">
                    {metric.label}
                  </div>
                  <div className="mt-1 text-[11px] text-ink-muted">
                    {metric.sublabel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* === БЛОК 2: Процесс работы (timeline) === */}
        <div className="mt-16">
          <Reveal>
            <h3 className="text-2xl font-bold text-ink sm:text-3xl">
              Как я работаю
            </h3>
            <p className="mt-2 max-w-2xl text-ink-soft">
              Прозрачный процесс без сюрпризов: вы всегда знаете, на каком этапе
              проект и что получите на выходе.
            </p>
          </Reveal>

          <div className="mt-10">
            {workProcess.map((phase, i) => (
              <Reveal key={phase.phase} delay={i * 80}>
                <TimelineItem phase={phase} isLast={i === workProcess.length - 1} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* === БЛОК 3: Преимущества === */}
        <div className="mt-16">
          <Reveal>
            <h3 className="text-2xl font-bold text-ink sm:text-3xl">
              Принципы, на которых я работаю
            </h3>
            <p className="mt-2 max-w-2xl text-ink-soft">
              Не просто «напишу код и исчезну». Это как именно я веду проекты,
              чтобы вы спали спокойно.
            </p>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyMe.map((item) => (
              <RevealItem key={item.title}>
                <TiltCard maxTilt={4} className="h-full">
                  <div className="card card-hover group h-full">
                    <div className="flex items-start gap-4">
                      <span
                        aria-hidden
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-clay/10 text-xl transition-transform duration-base ease-out-expo group-hover:scale-110 group-hover:bg-clay/15"
                      >
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="font-semibold text-ink">{item.title}</h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* === Mini-CTA: переход к контакту === */}
        {/* Заполняет визуальную пустоту перед секцией Contact.
            Подводит клиента к действию без давления. */}
        <Reveal delay={200}>
          <div className="mt-16 overflow-hidden rounded-3xl border border-clay/30 bg-gradient-to-br from-clay/5 to-transparent p-8 text-center sm:p-12">
            <p className="text-balance text-xl font-semibold text-ink sm:text-2xl">
              Звучит как то, что вам нужно?
            </p>
            <p className="mx-auto mt-3 max-w-md text-ink-soft">
              Расскажите о задаче — отвечу в течение 4 часов с первыми мыслями и
              оценкой по срокам. Без обязательств.
            </p>
            <a href="#contact" className="btn-primary mt-6">
              Обсудить проект →
            </a>
            <p className="mt-4 font-mono text-xs text-ink-muted">
              {profile.email} · {profile.location}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* === Timeline item === */

type TimelinePhase = (typeof workProcess)[number];

function TimelineItem({
  phase,
  isLast,
}: {
  phase: TimelinePhase;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-3 sm:gap-6">
      {/* Левая колонка: phase-circle + connecting line */}
      <div className="relative flex flex-col items-center">
        {/* Phase-кружок с номером — меньше на mobile чтобы не теснить карточку */}
        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-clay bg-cream-card font-mono text-xs font-bold text-clay shadow-[0_0_0_4px_rgba(244,243,238,1)] sm:h-12 sm:w-12 sm:text-sm">
          {phase.phase}
        </div>
        {/* Соединительная линия вниз (кроме последнего) */}
        {!isLast && (
          <div
            aria-hidden
            className="mt-1 w-px flex-1 bg-gradient-to-b from-clay/40 to-clay/10"
            style={{ minHeight: "2rem" }}
          />
        )}
      </div>

      {/* Правая колонка: содержимое фазы */}
      <div className={cn("min-w-0 flex-1 pb-10", isLast && "pb-0")}>
        <TiltCard maxTilt={2} className="h-full">
          <div className="card group flex h-full flex-col gap-3">
            {/* Header: иконка + название + длительность.
                flex-wrap позволяет pill-длительности перенестись ниже на узких экранах. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clay/10 text-base transition-transform duration-base ease-out-expo group-hover:scale-110 sm:h-10 sm:w-10 sm:text-lg"
              >
                {phase.icon}
              </span>
              <h4 className="min-w-0 flex-1 text-base font-semibold text-ink sm:text-lg">
                {phase.title}
              </h4>
              <span className="shrink-0 rounded-full border border-clay/30 bg-clay/5 px-2.5 py-1 font-mono text-xs font-medium text-clay">
                {phase.duration}
              </span>
            </div>

            {/* Описание */}
            <p className="text-sm leading-relaxed text-ink-soft">
              {phase.description}
            </p>

            {/* Deliverables-чипы */}
            <ul className="mt-auto flex flex-wrap gap-1.5 border-t border-cloudy/30 pt-3">
              {phase.deliverables.map((d) => (
                <li
                  key={d}
                  className="inline-flex items-center gap-1 rounded-full border border-cloudy/50 bg-cream-soft/60 px-2.5 py-0.5 font-mono text-[10px] text-ink-soft"
                >
                  <span className="text-clay" aria-hidden>
                    ✓
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
