import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // === Anthropic-палитра ===
        // Источник: Mobbin (Claude Brand Color Palette).
        // ВАЖНО: DEFAULT/400 = #A84A2B (был #C15F3C) — потемнел ради WCAG AA
        // контраста на cream-фоне (4.95:1 вместо 3.80:1). Прошлая светлая
        // терракота сохранена как clay-300 для decorative-целей (градиенты).
        clay: {
          DEFAULT: "#A84A2B", // основной — проходит AA 4.95:1 на cream
          50: "#FBF1ED",
          100: "#F5DDD3",
          200: "#E8B5A1",
          300: "#C15F3C", // Crail — старый DEFAULT, для decorative (градиенты)
          400: "#A84A2B", // основной (alias DEFAULT)
          500: "#8A3B22", // darker hover
          600: "#6B2C18",
        },
        // Cream / Pampas — тёплый parchment-фон
        cream: {
          DEFAULT: "#F4F3EE", // Pampas
          soft: "#EDEAE0",    // чуть глубже для секций
          card: "#FFFFFF",    // карточки остаются белыми
        },
        // Cloudy — приглушённый серо-бежевый (пассивный текст, рамки)
        cloudy: {
          DEFAULT: "#B1ADA1",
          100: "#E8E5DC", // лёгкие рамки
          200: "#D4D0C4", // hover-состояния
          400: "#B1ADA1", // Cloudy — muted text
          500: "#8C8979", // darker muted
        },
        // Тёплый чёрный (не холодный zinc!) для основного текста
        ink: {
          DEFAULT: "#141413", // тёплый near-black
          soft: "#3D3B36",    // secondary text
          muted: "#6B6862",   // tertiary / captions
        },
      },
      // Кастомные easings (по стандарту emil-design-eng)
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out-expo": "cubic-bezier(0.65, 0, 0.35, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
        emphasized: "cubic-bezier(0.3, 0, 0, 1)",
      },
      transitionDuration: {
        fast: "140ms",
        base: "220ms",
        slow: "360ms",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-shift": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-vertical": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-30px, 20px) scale(0.95)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "marquee-vertical": "marquee-vertical 30s linear infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "aurora-drift": "aurora-drift 20s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
