"use client";

import { useEffect, useState, useRef } from "react";
import { nav, profile } from "@/lib/content";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Scroll-слушатель: подсветка фона навбара при прокрутке
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Блокировка прокрутки body когда моб. меню открыто
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape-обработчик для закрытия моб. меню + фокус возвращается на бургер
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
      // Простой focus-trap: Tab/Shift+Tab циклит внутри меню
      if (e.key === "Tab" && mobileMenuRef.current) {
        const focusables = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    // При открытии — фокус на первую ссылку
    const t = window.setTimeout(() => {
      const first = mobileMenuRef.current?.querySelector<HTMLElement>("a, button");
      first?.focus();
    }, 100);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  // Active section: IntersectionObserver над всеми section[id]
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Берём верхний visible-сектор
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const initial = profile.name.trim().charAt(0).toUpperCase();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-base ease-out-expo",
        scrolled
          ? "border-b border-cloudy/40 bg-cream/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-px flex h-16 items-center justify-between">
        {/* Лого-инициал */}
        <a href="#top" className="group flex items-center gap-2 font-semibold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-clay font-mono text-lg text-white shadow-[var(--shadow-clay)] transition-transform duration-base ease-out-expo group-hover:scale-105">
            {initial}
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        {/* Десктоп-меню с подсветкой активной секции */}
        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors duration-base ease-out-expo",
                    isActive
                      ? "text-clay"
                      : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
                  )}
                >
                  {item.label}
                  {/* Активная точка-индикатор */}
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-clay"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <a href="#contact" className="btn-primary !px-5 !py-2">
            Связаться
          </a>
        </div>

        {/* Бургер */}
        <button
          ref={burgerRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/15 text-ink md:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={cn(
                "block h-0.5 w-5 bg-current transition-transform duration-base ease-out-expo",
                open && "translate-y-2 rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 bg-current transition-opacity duration-base",
                open && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 bg-current transition-transform duration-base ease-out-expo",
                open && "-translate-y-2 -rotate-45"
              )}
            />
          </div>
        </button>
      </nav>

      {/* Мобильное меню */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={cn(
          "md:hidden overflow-hidden border-t border-cloudy/40 bg-cream/95 backdrop-blur-md transition-[max-height,opacity] duration-slow ease-out-expo",
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
        // inert скрывает скрытые ссылки от Tab когда меню закрыто
        inert={!open ? true : undefined}
      >
        <ul className="container-px flex flex-col gap-1 py-4">
          {nav.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "block rounded-lg px-4 py-3 transition-colors duration-base ease-out-expo",
                    isActive
                      ? "bg-clay/10 text-clay"
                      : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
          <li className="px-2 pt-2">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-primary w-full"
            >
              Связаться
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
