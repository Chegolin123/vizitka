/**
 * Единый источник hex-значений фирменной палитры (Anthropic-вдохновленной).
 *
 * Из этого файла читают и Tailwind (через tailwind.config.ts),
 * и 3D-материалы (через ThreeInitial и др.). Раньше цвета хардкодились
 * отдельно в каждом месте — это приводило к рассинхрону при правках.
 *
 * Значения синхронизированы с tailwind.config.ts → colors.
 */

export const palette = {
  // === Crail — фирменная терракота Claude ===
  // DEFAULT/400 = #A84A2B (WCAG AA контраст на cream), 300 = старый #C15F3C
  clay: {
    50: "#FBF1ED",
    100: "#F5DDD3",
    200: "#E8B5A1",
    300: "#C15F3C", // старый DEFAULT — для decorative
    400: "#A84A2B", // DEFAULT — основной акцент (AA)
    500: "#8A3B22", // darker hover
    600: "#6B2C18",
  },
  // === Cream / Pampas — тёплый parchment-фон ===
  cream: {
    DEFAULT: "#F4F3EE",
    soft: "#EDEAE0",
    card: "#FFFFFF",
  },
  // === Cloudy — приглушённый серо-бежевый ===
  cloudy: {
    100: "#E8E5DC",
    200: "#D4D0C4",
    400: "#B1ADA1",
    500: "#8C8979",
  },
  // === Ink — тёплый near-black для текста ===
  ink: {
    DEFAULT: "#141413",
    soft: "#3D3B36",
    muted: "#6B6862",
  },
} as const;

// Короткие алиасы для удобства в 3D-коде (там нужны плоские строки, не объекты)
export const CLAY_HEX = palette.clay[400];
export const CLAY_DARK_HEX = palette.clay[500];
export const CLAY_LIGHT_HEX = palette.clay[300];
export const CREAM_HEX = palette.cream.DEFAULT;
export const CLOUDY_HEX = palette.cloudy[400];
export const INK_HEX = palette.ink.DEFAULT;

// Тёплые цвета освещения для 3D-сцен (как в ThreeInitial)
export const LIGHT_WARM_FILL = "#FFF4E6";
export const LIGHT_WARM_RIM = "#FFE0C2";

// Easing из globals.css :root — для согласованности motion и CSS
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
