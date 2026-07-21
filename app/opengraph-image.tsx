import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

/**
 * Динамическая OpenGraph-картинка (для Telegram/LinkedIn/Twitter превью).
 *
 * Рисуется через next/og ImageResponse — никаких внешних файлов.
 * 1200×630 — стандартный размер для всех соцсетей.
 *
 * Стиль: cream-фон, clay-инициал, имя, роль — повторяет эстетику сайта.
 *
 * force-dynamic: генерируется при запросе, не при сборке.
 * Это обходит баг @vercel/og на Windows при статической prerender-генерации
 * (fileURLToPath ломается на Windows file URLs).
 */
export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default function OpengraphImage() {
  const initial = profile.name.trim().charAt(0).toUpperCase() || "A";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#F4F3EE", // cream
          color: "#141413", // ink
          position: "relative",
        }}
      >
        {/* Декоративный clay-круг справа сверху */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "#A84A2B",
            opacity: 0.15,
            filter: "blur(80px)",
            display: "flex",
          }}
        />

        {/* Лого-инициал + имя */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: "#A84A2B",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 700,
            }}
          >
            {initial}
          </div>
          <div style={{ fontSize: 28, color: "#6B6862" }}>{profile.location}</div>
        </div>

        {/* Имя крупно */}
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.03em", display: "flex" }}>
          {profile.name}
        </div>

        {/* Роль */}
        <div
          style={{
            fontSize: 40,
            marginTop: 16,
            color: "#A84A2B",
            display: "flex",
          }}
        >
          {profile.role}
        </div>

        {/* Тэглайн */}
        <div
          style={{
            fontSize: 26,
            marginTop: 32,
            color: "#3D3B36",
            maxWidth: 900,
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          {profile.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
