"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, Text, Float } from "@react-three/drei";
import { CLAY_HEX, LIGHT_WARM_FILL, LIGHT_WARM_RIM } from "@/lib/theme";
import { profile } from "@/lib/content";

/**
 * 3D-инициал для Hero — объёмная буква из имени профиля.
 *
 * Реализация через drei <Text> (troika-three-text):
 * - SDF-рендеринг, поддерживает любой шрифт через font-prop (URL или локальный)
 * - НЕ требует предгенерации MSDF-файла — надёжнее, чем Text3D
 * - outlineWidth + outlineColor дают «объём» без extrude-геометрии
 *
 * Материал/освещение:
 * - терракотовый clay (#C15F3C) с лёгкой металличностью
 * - 3-точечный свет: key (clay) + fill (тёплый нейтральный) + rim (контурный)
 *
 * Производительность:
 * - dpr cap [1, 2] — не рендерим на retina в 4K
 * - alpha: true — прозрачный фон, композиция с Hero-фото
 * - <Center> автомасштабирует букву под viewport Canvas
 *
 * Accessibility:
 * - reduced-motion обрабатывается на уровне LazyCanvas (вообще не монтируется)
 * - здесь можно считать reduce=false всегда
 */

function InitialMesh() {
  const initial = profile.name.trim().charAt(0).toUpperCase() || "A";

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <Center>
        {/*
          outlineWidth даёт «толщину» — визуально похоже на extrude,
          но без тяжёлой geometry. outlineOffsetZ создаёт псевдо-depth.
          color из lib/theme.ts — единый источник палитры.
        */}
        <Text
          fontSize={2.2}
          color={CLAY_HEX}
          outlineWidth={0.06}
          outlineColor={CLAY_HEX}
          outlineOpacity={0.9}
          // font не указываем — troika использует системный sans-serif.
          // Не зависим от внешних CDN (раньше был drei.poly.pizza).
          anchorX="center"
          anchorY="middle"
        >
          {initial}
          {/* meshStandardMaterial даёт реакцию на освещение, в отличие от
              дефолтного troika-материала. Цвет берётся из prop color выше. */}
          <meshStandardMaterial
            color={CLAY_HEX}
            roughness={0.35}
            metalness={0.25}
            envMapIntensity={0.8}
          />
        </Text>
      </Center>
    </Float>
  );
}

/**
 * Сам Canvas. Отдельный компонент для ленивой загрузки через next/dynamic.
 */
export default function ThreeInitial() {
  return (
    <Canvas
      // dpr cap: на retina рендерим максимум в 2x
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true, // прозрачный фон — compos с Hero-фото
        // powerPreference НЕ ставим "high-performance" — он будит dGPU
        // на dual-GPU ноутбуках, что избыточно для декоративного элемента.
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* 3-точечное освещение для объёма */}
      <ambientLight intensity={0.6} />
      {/* Key light — терракотовый, слева сверху */}
      <directionalLight position={[3, 4, 3]} intensity={2.5} color={CLAY_HEX} />
      {/* Fill light — тёплый нейтральный, справа */}
      <directionalLight position={[-3, 1, 2]} intensity={0.8} color={LIGHT_WARM_FILL} />
      {/* Rim light — контурный, сзади */}
      <directionalLight position={[0, -2, -3]} intensity={1.2} color={LIGHT_WARM_RIM} />

      <Suspense fallback={null}>
        <InitialMesh />
      </Suspense>
    </Canvas>
  );
}

/* === Заглушка при загрузке / отсутствии WebGL === */

export function ThreeInitialFallback() {
  const initial = profile.name.trim().charAt(0).toUpperCase() || "A";
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="select-none font-mono text-[10rem] font-bold leading-none text-clay/20">
        {initial}
      </span>
    </div>
  );
}
