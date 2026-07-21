_Written: 2026-07-21T19:46:34.814Z_

# Vizitka — проект сайта-визитки Алексея Chegolin123

## Кто
- **Алексей** — web full-stack middle разработчик  
- **Telegram:** @NoWayWhile  
- **Email:** finnik142@gmail.com  
- **GitHub:** github.com/Chegolin123 (10 публичных репо)  
- **Версия сайта:** Next.js 14.2 (App Router) + TypeScript + Tailwind 3.4 + motion 11.18 + three.js r169  

## Где проект
C:\Users\Aleks\Desktop\zcode\vizitka  
**Dev-сервер:** http://localhost:3000 (запускать `npm run dev:clean` если билд словил stale .next)  

## Ключевые файлы
| Назначение | Файл |
|---|---|
| Весь контент (тексты, ссылки, проекты) | `lib/content.ts` |
| Палитра (hex) | `lib/theme.ts` |
| Единые стили (классы .card .section .btn-primary) | `app/globals.css` |
| Carousel physics-based | `components/ui/Carousel.tsx` |
| 3D-инициал | `components/three/ThreeInitial.tsx` |

## Что сделано (эта сессия)
- Полная accessibility-обработка (WCAG AA + 17 пунктов)  
- 3D-инициал исправлен (Text3D → troika) + LazyCanvas generic  
- TiltCard на Skills/WhyMe/About/Projects  
- GitHub интегрирован (соцсети, кнопка в Skills, иконки в карусели)  
- Real stories из GitHub (8 проектов вместо выдумок)  
- GitHub описания у 10 репозиториев  
- Vercel Analytics + Speed Insights  
- Drag: N карточек по длине свайпа  
- Images: w=640 q=70, bg-cream-soft placeholder  
- Carousel infinite-loop: teleport через onComplete  
- CARD_H улучшена 440→520, line-clamp-4  
- Skills demos: z-[70] isolate (убрал замыленность)  
- Отступы между секциями сокращены  

## Проблемы
1. `npm run build` иногда падает с ETIMEDOUT на Google Fonts — это сеть окружения, на деплой на Vercel не влияет  
2. Stitch MCP не работает (Google Stitch бага в outputSchema)  
3. `projects` тип/массив в content.ts устарел — не используется, но остался  
4. Нет деплоя, нет реального фото, нет настоящей contact-формы  

## Как управлять сайтом
На 99% меняется через `lib/content.ts`: имена, ссылки, тексты в любой секции. Палитра — `lib/theme.ts` + `tailwind.config.ts`.  
После `npm run build` всегда `npm run dev:clean` (или `rm -rf .next && npm run dev`).
