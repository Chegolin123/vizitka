/**
 * Текстура бумаги поверх всего фона.
 *
 * - SVG-фильтр feTurbulence с очень низкой baseFrequency
 *   (0.04 вместо 0.85 как у grain) — даёт «волокнистую» бумажную структуру
 * - mix-blend-mode: multiply — въедается в cream-фон
 * - очень низкий opacity (3%) — почти невидим, но добавляет «не-плоскостности»
 * - фиксированный, pointer-events: none
 *
 * В отличие от GrainOverlay (мелкое зерно плёнки), PaperTexture —
 * крупная «волнистая» структура, как у parchment/kraft-бумаги.
 */
export default function PaperTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-[0.03] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' seed='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
      }}
    />
  );
}
