import Image from "next/image";
import { about, images } from "@/lib/content";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import TiltCard from "@/components/ui/TiltCard";

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container-px">
        <Reveal>
          <span className="section-eyebrow">/ о себе</span>
          <h2 className="section-title">Кто я и чем занимаюсь</h2>
        </Reveal>

        {/* Текст + фото бок о бок */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          {/* Текст */}
          <Reveal direction="up">
            <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          {/* Inline-фото */}
          <Reveal direction="left" delay={150}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-cloudy/40 shadow-[var(--shadow-card)]">
              <Image
                src={images.about.src}
                alt={images.about.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-slow ease-out-expo hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent mix-blend-multiply"
              />
            </div>
          </Reveal>
        </div>

        {/* Метрики — на всю ширину, под текстом */}
        <RevealGroup className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {about.stats.map((stat) => (
            <RevealItem key={stat.label}>
              <TiltCard className="h-full">
                <div className="card card-hover flex h-full flex-col items-center justify-center p-6 text-center">
                  <span className="text-3xl font-bold text-gradient sm:text-4xl">
                    {typeof stat.value === "number" ? (
                      <AnimatedCounter
                        value={stat.value}
                        suffix={"suffix" in stat ? stat.suffix : ""}
                      />
                    ) : (
                      stat.value
                    )}
                  </span>
                  <span className="mt-2 text-xs text-ink-muted sm:text-sm">
                    {stat.label}
                  </span>
                </div>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
