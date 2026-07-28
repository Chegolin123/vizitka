import Image from "next/image";
import { contact, images } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "./ContactForm";
import ContactInfoCard from "./ContactInfoCard";

export default function Contact() {
  return (
    <section id="contact" className="section relative overflow-hidden">
      {/* Clay radial glow вместо невидимого фото — чище и on-brand */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(168,74,43,0.12), transparent 70%)",
        }}
      />

      <div className="container-px">
        {/* Шапка секции — самый эмоциональный заголовок на сайте */}
        <Reveal>
          <span className="section-eyebrow">/ контакты</span>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Давай <span className="text-gradient">сделаем</span> что-нибудь крутое
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg text-ink-soft">
            {contact.subline}
          </p>
        </Reveal>

        {/* Двухколоночный layout: слева форма, справа инфо-карточка */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-8">
          {/* Левая колонка — форма с clay top-accent */}
          <Reveal direction="up">
            <div className="relative overflow-hidden rounded-2xl border border-cloudy/40 bg-cream-card p-6 shadow-[var(--shadow-card)] sm:p-8">
              {/* Clay top-accent bar — визуальный сигнал «это действие» */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-clay to-clay-300"
              />
              <h3 className="mb-6 text-lg font-semibold text-ink">
                Напиши сообщение
              </h3>
              <ContactForm />
            </div>
          </Reveal>

          {/* Правая колонка — инфо-карточка */}
          <Reveal direction="up" delay={120}>
            <ContactInfoCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
