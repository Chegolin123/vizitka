import { profile, socials, contact } from "@/lib/content";
import { iconMap } from "@/components/ui/Icons";
import CopyButton from "@/components/ui/CopyButton";

/**
 * Карточка контактной информации — правая колонка секции контактов.
 *
 * Содержит:
 * - email с кнопкой копирования
 * - ключевые метрики (время ответа, часовой пояс, доступность)
 * - соцсети как подписанные строки (а не только иконки)
 * - типы сотрудничества
 */
export default function ContactInfoCard() {
  const metaRows = [
    { icon: "⏱", label: "Отвечаю", value: contact.responseTime },
    { icon: "🌍", label: "Часовой пояс", value: contact.timezone },
    { icon: "✅", label: "Статус", value: contact.availability },
  ];

  // Соцсети без email (он уже в шапке карточки)
  const otherSocials = socials.filter((s) => s.icon !== "email");

  return (
    <div className="card flex h-full flex-col gap-6">
      {/* Email — главный, с копированием */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
          Email
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`mailto:${profile.email}`}
            className="text-lg font-semibold text-ink underline-offset-4 transition-colors duration-base ease-out-expo hover:text-clay hover:underline"
          >
            {profile.email}
          </a>
          <CopyButton value={profile.email} label="Копировать" />
        </div>
      </div>

      {/* Метрики */}
      <div className="space-y-3">
        {metaRows.map((row) => (
          <div key={row.label} className="flex items-start gap-3">
            <span className="mt-0.5 text-base" aria-hidden>
              {row.icon}
            </span>
            <div>
              <p className="text-xs text-ink-muted">{row.label}</p>
              <p className="text-sm font-medium text-ink-soft">{row.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Типы сотрудничества */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
          Форматы работы
        </p>
        <div className="flex flex-wrap gap-2">
          {contact.collaborationTypes.map((type) => (
            <span
              key={type}
              className="rounded-full border border-cloudy/50 bg-cream-soft/60 px-3 py-1 text-xs text-ink-soft"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Соцсети как подписанные строки */}
      <div className="mt-auto">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-muted">
          Также я тут
        </p>
        <ul className="space-y-2">
          {otherSocials.map((social) => {
            const Icon = iconMap[social.icon];
            return (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-base ease-out-expo hover:bg-cream-soft/60"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cloudy/50 text-ink-soft transition-colors duration-base ease-out-expo group-hover:border-clay group-hover:text-clay">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-ink-soft transition-colors group-hover:text-ink">
                    {social.label}
                  </span>
                  <span className="ml-auto text-ink-muted opacity-0 transition-opacity duration-base ease-out-expo group-hover:opacity-100">
                    →
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
