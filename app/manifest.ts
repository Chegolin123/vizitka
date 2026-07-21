import type { MetadataRoute } from "next";
import { profile } from "@/lib/content";

/**
 * PWA manifest — позволяет «Добавить на главный экран».
 *
 * Цвета берём из фирменной палитры: theme = clay, background = cream.
 * Иконки берутся из App Router file conventions (app/icon.tsx, app/apple-icon.tsx).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.name,
    description: profile.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#F4F3EE", // cream
    theme_color: "#A84A2B", // clay (AA-контраст)
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
