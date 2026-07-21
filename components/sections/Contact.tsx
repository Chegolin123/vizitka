import Image from "next/image";
import { contact, images } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "./ContactForm";
import ContactInfoCard from "./ContactInfoCard";

export default function Contact() {
  return (
    <section id="contact" className="section relative overflow-hidden">
      {/* Фоновое фото с тёплым overlay (остаётся для атмосферы) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-25"
      >
        <Image
          src={images.contactBg.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/80 to-cream" />
      </div>

      <div className="container-px">
        {/* Шапка секции */}
        <Reveal>
          <span className="section-eyebrow">/ контакты</span>
          <h2 className="section-title">
            Давай <span className="text-gradient">сделаем</span> что-нибудь крутое
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg text-ink-soft">
            {contact.subline}
          </p>
        </Reveal>

        {/* Двухколоночный layout: слева форма, справа инфо-карточка */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-8">
          {/* Левая колонка — форма */}
          <Reveal direction="up">
            <div className="card p-6 sm:p-8">
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
