import { profile, nav } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-clay/20 bg-cream-soft py-12">
      <div className="container-px">
        {/* CTA echo — закрывает цикл */}
        <div className="mb-8 text-center">
          <p className="text-lg font-medium text-ink">
            Открыт к новым проектам —{" "}
            <a
              href={`mailto:${profile.email}`}
              className="text-clay underline-offset-2 hover:underline"
            >
              напишите
            </a>
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-cloudy/30 pt-8 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-clay font-mono text-sm text-white">
              {profile.name.trim().charAt(0).toUpperCase()}
            </span>
            <span className="text-ink-soft">
              © {year} {profile.name}
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-ink-soft transition-colors duration-base ease-out-expo hover:text-clay"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <p className="font-mono text-xs text-ink-muted">
            Built with Next.js & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
