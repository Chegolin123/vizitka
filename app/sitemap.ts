import type { MetadataRoute } from "next";

/**
 * sitemap.xml — App Router генерирует автоматически из этого файла.
 *
 * Для одностраничного сайта — один URL. Если позже появятся новые страницы
 * (например, /blog/[slug]), добавь их сюда.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
