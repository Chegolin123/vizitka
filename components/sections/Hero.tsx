"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { profile, socials, images } from "@/lib/content";
import { iconMap } from "@/components/ui/Icons";
import Magnetic from "@/components/ui/Magnetic";
import LazyThreeInitial from "@/components/three/LazyThreeInitial";
import TiltCard from "@/components/ui/TiltCard";

function containerVariants(reduce: boolean): Variants {
  if (reduce) {
    return { hidden: { opacity: 1 }, visible: { opacity: 1 } };
  }
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
}

function itemVariants(reduce: boolean): Variants {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3 } },
    };
  }
  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

export default function Hero() {
  const reduce = Boolean(useReducedMotion());
  const cv = containerVariants(reduce);
  const iv = itemVariants(reduce);

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      <div className="container-px grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* === ЛЕВАЯ КОЛОНКА: текст === */}
        <motion.div
          variants={cv}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start text-left"
        >
          {/* Бейдж доступности */}
          {profile.available && (
            <motion.div
              variants={iv}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-cloudy/50 bg-cream-card/80 px-4 py-1.5 text-xs text-ink-soft shadow-[var(--shadow-card)] backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Открыт к новым проектам
            </motion.div>
          )}

          {/* Имя. Visually-hidden часть внутри H1 усиливает SEO и a11y —
              поисковик и скринридер видят "Алексей — Web Full-Stack разработчик",
              а визуально остаётся только имя с градиентом. */}
          <motion.h1
            variants={iv}
            className="text-balance text-5xl font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="text-gradient">{profile.name}</span>
            <span className="sr-only">
              {" "}
              — {profile.role}
            </span>
          </motion.h1>

          {/* Роль */}
          <motion.p
            variants={iv}
            className="mt-5 font-mono text-sm text-ink-soft sm:text-base"
          >
            {profile.role}
          </motion.p>

          {/* Тэглайн */}
          <motion.p
            variants={iv}
            className="mt-5 max-w-xl text-pretty text-base text-ink-muted sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={iv}
            className="mt-8 flex flex-col items-start gap-3 sm:flex-row"
          >
            <Magnetic strength={0.3}>
              <a href="#contact" className="btn-primary">
                Написать мне
              </a>
            </Magnetic>
            <a href="#about" className="btn-ghost">
              Узнать больше
            </a>
          </motion.div>

          {/* Соцсети */}
          <motion.div variants={iv} className="mt-10 flex items-center gap-3">
            {socials.map((social) => {
              const Icon = iconMap[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cloudy/50 text-ink-soft transition-colors duration-base ease-out-expo hover:border-clay hover:text-clay"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </motion.div>
        </motion.div>

        {/* === ПРАВАЯ КОЛОНКА: большое фото с parallax-tilt === */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <TiltCard maxTilt={6} scale={1.01} className="h-full">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-cloudy/40 shadow-[0_20px_60px_-20px_rgba(20,20,19,0.3)] sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image
            src={images.hero.src}
            alt={images.hero.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            // Лёгкое увеличение для «живости»
          />
          {/* Градиентный overlay — терракотовый снизу, для атмосферы и интеграции с фоном */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-clay/30 via-transparent to-transparent mix-blend-multiply"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-cream/20 via-transparent to-ink/10"
          />

          {/* 3D-инициал «А» — парит в правом верхнем углу фото.
              Ленивая загрузка + WebGL-detect + reduced-motion fallback
              обрабатываются внутри LazyThreeInitial. */}
          <div
            aria-hidden
            className="absolute right-0 top-0 h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
          >
            <LazyThreeInitial className="h-full w-full" />
          </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>

      {/* Индикатор скролла */}
      <motion.a
        href="#about"
        aria-label="Прокрутить вниз"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink-muted transition-colors duration-base ease-out-expo hover:text-clay lg:flex"
      >
        <span className="font-mono text-xs">scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-current p-1">
          <motion.span
            className="h-2 w-1 rounded-full bg-current"
            animate={reduce ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
