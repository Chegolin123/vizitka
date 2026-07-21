import Aurora from "./Aurora";
import FloatingElements from "./FloatingElements";
import CursorSpotlight from "./CursorSpotlight";
import GrainOverlay from "./GrainOverlay";
import PaperTexture from "./PaperTexture";
import TopographicLines from "./TopographicLines";

/**
 * Композитный фон страницы: все декоративные слои вместе.
 *
 * Порядок слоёв (снизу вверх):
 *  1. TopographicLines — контурные линии как на карте (fixed, -z-10)
 *  2. PaperTexture     — текстура бумаги поверх (fixed, -z-10, multiply)
 *  3. Aurora           — дрейфующие цветные орбы (fixed, -z-10)
 *  4. FloatingElements — дрейфующие code-символы (fixed, -z-10)
 *  5. Сетка            — локальный декор (fixed, -z-10)
 *   6. CursorSpotlight — глобальное свечение за курсором (fixed, z-30)
 *  7. GrainOverlay     — плёночный шум поверх всего (fixed, z-60)
 *
 * Все слои pointer-events: none и уважают prefers-reduced-motion.
 *
 * ПРИМЕЧАНИЕ: раньше здесь был плоский гигантский инициал — он убран,
 * потому что каноничный глиф теперь 3D-инициал в Hero (ThreeInitial),
 * а дублирование создавало визуальный шум.
 */
export default function Background() {

  return (
    <>
      {/* Слой 1: контурные линии */}
      <TopographicLines />

      {/* Слой 2: текстура бумаги */}
      <PaperTexture />

      {/* Слой 3+4: орбы и code-символы */}
      <Aurora />
      <FloatingElements />

      {/* Слой 5: локальный декор — сетка.
          Плоский гигантский инициал убран: теперь каноничный глиф —
          3D-инициал в Hero (ThreeInitial), а не дублирующий плоский. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #141413 1px, transparent 1px), linear-gradient(to bottom, #141413 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Слой 6: cursor-spotlight */}
      <CursorSpotlight />

      {/* Слой 7: плёночный шум поверх всего */}
      <GrainOverlay />
    </>
  );
}
