"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { profile, socials, images } from "@/lib/content";
import { iconMap } from "@/components/ui/Icons";
import Magnetic from "@/components/ui/Magnetic";
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
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-clay/30 bg-clay/5 px-4 py-1.5 text-[13px] font-medium text-ink-soft shadow-[0_0_0_4px_rgba(168,74,43,0.06)] backdrop-blur-sm"
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
            className="text-balance text-6xl font-bold leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-8xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            <span className="text-gradient">{profile.name}</span>
            <span className="sr-only">
              {" "}
              — {profile.role}
            </span>
          </motion.h1>

          {/* Роль — крупная подзаголовок, не мелкая mono-строка */}
          <motion.p
            variants={iv}
            className="mt-4 text-xl font-semibold text-ink sm:text-2xl"
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
            {/* Clay glow ЗА фото — мягкое свечение, не искажает цвет кожи */}
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-[2rem] bg-clay/20 blur-3xl"
            />
            {/* Портретный слот 3/4 — классический ratio для фото человека.
                object-top показывает лицо (центр тяжести вверху), не торс. */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-cloudy/30 shadow-[0_20px_60px_-20px_rgba(20,20,19,0.3)]">
              <Image
                src={images.hero.src}
                alt={images.hero.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
              {/* Только тонкий bottom-gradient для глубины.
                Никакого clay multiply — он уродует кожу человека. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent"
              />
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
