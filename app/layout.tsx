import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { profile, socials } from "@/lib/content";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    type: "website",
    locale: "ru_RU",
    siteName: profile.name,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
  },
  // OG-image и favicon берутся из file conventions App Router:
  // app/opengraph-image.tsx, app/icon.tsx, app/apple-icon.tsx
};

export const viewport: Viewport = {
  themeColor: "#F4F3EE",
};

/**
 * JSON-LD структурированные данные для Google rich results.
 * Person-schema помогает поисковику понять, что это сайт конкретного человека.
 */
function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    url: siteUrl,
    description: profile.tagline,
    sameAs: socials
      .filter((s) => !s.href.startsWith("mailto:"))
      .map((s) => s.href),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        {/* Skip-link для клавиатурных пользователей: первый фокусируемый элемент */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-clay focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Перейти к содержимому
        </a>
        <PersonJsonLd />
        {children}
        {/* Vercel Analytics — бесплатно, без cookies, приватно.
            На проде (после деплоя на Vercel) метрики видны в дашборде. */}
        <Analytics />
        {/* Speed Insights — Core Web Vitals (LCP/CLS/INP) в реальном времени. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
