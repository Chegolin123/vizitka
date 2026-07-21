import type { MetadataRoute } from "next";

/**
 * robots.txt — App Router генерирует автоматически из этого файла.
 *
 * Разрешаем всё, указываем sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
