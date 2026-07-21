"use client";

import { useState, type FormEvent } from "react";
import { profile, contact } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Форма обратной связи через mailto:.
 *
 * Без бэкенда — при сабмите собирает mailto-ссылку с заполненными полями
 * и открывает почтовый клиент пользователя с готовым письмом.
 *
 * Особенности:
 * - валидация email и обязательных полей (нативная + custom)
 * - выбор типа проекта чипами (множественный выбор)
 * - подсветка ошибок, состояние «отправлено»
 * - accessibility: label htmlFor, aria-invalid, focus-visible
 *
 * Если позже добавим бэкенд — onChange/onSubmit собраны так, что
 * легко заменить window.location.href на fetch().
 */

type FormState = {
  name: string;
  email: string;
  message: string;
  types: string[];
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
    types: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Укажи имя";
    if (!form.email.trim()) e.email = "Укажи email";
    else if (!EMAIL_RE.test(form.email)) e.email = "Неверный формат email";
    if (!form.message.trim()) e.message = "Расскажи о задаче";
    else if (form.message.trim().length < 10)
      e.message = "Хотя бы пара предложений (10+ символов)";
    return e;
  }

  function toggleType(type: string) {
    setForm((f) => ({
      ...f,
      types: f.types.includes(type)
        ? f.types.filter((t) => t !== type)
        : [...f.types, type],
    }));
    // Сбрасываем возможную ошибку после взаимодействия
    if (errors.message) setErrors({});
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Собираем mailto-ссылку
    const subject = `С сайта-визитки: ${form.types.join(", ") || "проект"}`;
    const body = [
      `Имя: ${form.name}`,
      `Email: ${form.email}`,
      form.types.length ? `Интересует: ${form.types.join(", ")}` : null,
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    const href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
    // Открываем почтовый клиент
    window.location.href = href;
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as keyof FormErrors])
      setErrors((er) => ({ ...er, [key]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Связаться с Алексеем" className="space-y-5">
      {/* Имя + Email — два в ряд на десктопе */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Имя"
          id="name"
          value={form.name}
          onChange={(v) => update("name", v)}
          error={errors.name}
          placeholder="Как тебя зовут?"
          autoComplete="name"
          required
        />
        <Field
          label="Email"
          id="email"
          type="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      {/* Чипы типа проекта */}
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-ink-soft">
          Что нужно сделать?
          <span className="ml-2 text-xs text-ink-muted">(можно несколько)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {contact.projectTypes.map((type) => {
            const active = form.types.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-base ease-out-expo active:scale-95",
                  active
                    ? "border-clay bg-clay text-white"
                    : "border-cloudy/50 bg-cream-soft/40 text-ink-soft hover:border-clay/50 hover:text-clay"
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Сообщение */}
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-ink-soft"
        >
          Расскажи о задаче
        </label>
        <textarea
          id="message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={!!errors.message}
          aria-required="true"
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Несколько слов о проекте: что за продукт, какие сроки, чего хочется добиться…"
          rows={5}
          className={cn(
            "w-full resize-none rounded-xl border bg-cream-card px-4 py-3 text-sm text-ink placeholder:text-ink-muted transition-colors duration-base ease-out-expo focus:outline-none focus:ring-2 focus:ring-clay/30",
            errors.message
              ? "border-red-400/60 focus:border-red-400"
              : "border-cloudy/50 focus:border-clay"
          )}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1.5 text-xs text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      {/* Сабмит */}
      <button
        type="submit"
        className="btn-primary w-full sm:w-auto"
        disabled={sent}
      >
        {sent ? "✓ Открываю почтовый клиент…" : "Отправить сообщение"}
      </button>

      {sent && (
        <p className="text-xs text-ink-muted">
          Не открылось? Напиши напрямую на{" "}
          <a
            href={`mailto:${profile.email}`}
            className="font-medium text-clay underline-offset-2 hover:underline"
          >
            {profile.email}
          </a>
        </p>
      )}
    </form>
  );
}

/* === Вспомогательный компонент текстового поля === */

function Field({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  autoComplete,
  required = false,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-ink-soft"
      >
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-clay">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-required={required || undefined}
        aria-describedby={error ? errorId : undefined}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border bg-cream-card px-4 py-3 text-sm text-ink placeholder:text-ink-muted transition-colors duration-base ease-out-expo focus:outline-none focus:ring-2 focus:ring-clay/30",
          error
            ? "border-red-400/60 focus:border-red-400"
            : "border-cloudy/50 focus:border-clay"
        )}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
