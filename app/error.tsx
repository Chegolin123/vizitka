"use client";

import { useEffect } from "react";

/**
 * Глобальный error boundary (App Router).
 *
 * Срабатывает, если любой клиентский компонент бросает ошибку во время
 * рендера (упал three.js canvas, изображение, motion и т.д.).
 * Без этого пользователь видел бы пустой белый экран.
 *
 * Reset() повторно монтирует error boundary с детьми — часто помогает
 * при transient-ошибках (临时). Если ошибка повторится — этот же UI покажется снова.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Логируем ошибку — на проде можно отправить в Sentry/Analytics
    console.error("[app-error]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-clay/20 blur-[120px]"
      />

      <div className="relative">
        <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-clay font-mono text-2xl font-bold text-white">
          !
        </span>

        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          Что-то пошло не так
        </h1>

        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          Произошла непредвиденная ошибка. Можно попробовать перезагрузить
          страницу — обычно это помогает.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn-primary">
            Попробовать снова
          </button>
          <a href="/" className="btn-ghost">
            На главную
          </a>
        </div>

        {/* digest — внутренний идентификатор ошибки, не показываем пользователям,
            но оставляем в DOM для разработчиков через data-attr */}
        {error.digest && (
          <p className="mt-6 font-mono text-xs text-ink-muted" aria-hidden>
            ref: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
