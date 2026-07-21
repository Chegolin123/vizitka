import Link from "next/link";
import { profile } from "@/lib/content";

/**
 * Кастомная 404-страница в фирменной cream-эстетике.
 *
 * Большой глиняный «404», короткое пояснение, CTA «На главную».
 * Лёгкая анимация через CSS — без motion (404 должен грузиться мгновенно).
 */
export default function NotFound() {
  const initial = profile.name.trim().charAt(0).toUpperCase() || "A";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Фоновое свечение */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-clay/20 blur-[120px]"
      />

      <div className="relative">
        {/* Лого-инициал */}
        <span className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-clay font-mono text-2xl font-bold text-white shadow-[0_8px_24px_-8px_rgba(193,95,60,0.45)]">
          {initial}
        </span>

        {/* Большой 404 */}
        <h1 className="text-gradient text-[8rem] font-bold leading-none tracking-tight sm:text-[12rem]">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
          Здесь ничего нет
        </h2>

        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          Страница, которую ты ищешь, не существует или была перемещена.
          Давай вернёмся туда, где есть что посмотреть.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            ← На главную
          </Link>
          <Link
            href="/#contact"
            className="btn-ghost"
          >
            Связаться со мной
          </Link>
        </div>
      </div>
    </main>
  );
}
