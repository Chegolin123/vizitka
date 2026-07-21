/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Unsplash отдаёт изображения через images.unsplash.com
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Долго кэшировать оптимизированные изображения — по умолчанию 60с.
    // 30 дней — для визитки с редкими обновлениями фото.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compiler: {
    // В проде убираем все console.* (кроме error) —
    // меньше шумит в DevTools у пользователя, минимальный размер бандла.
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error"] }
        : false,
  },
  experimental: {
    // Tree-shaking barrel-imports из больших библиотек.
    // motion (Framer Motion) и @react-three/drei экспортируют много всего
    // через корневой index — без этой опции в бандл может попасть лишнее.
    optimizePackageImports: ["motion", "@react-three/drei", "@react-three/fiber"],
  },
  async headers() {
    return [
      {
        // Базовые security-headers на всех маршрутах
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
