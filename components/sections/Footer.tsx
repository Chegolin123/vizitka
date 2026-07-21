import { profile, nav } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cloudy/40 py-10">
      <div className="container-px flex flex-col items-center justify-between gap-6 sm:flex-row">
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
    </footer>
  );
}
