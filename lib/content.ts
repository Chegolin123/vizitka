/**
 * Контент сайта-визитки.
 * Меняй значения здесь — они подтянутся во все секции автоматически.
 */

export const profile = {
  name: "Алексей",
  role: "Web Full-Stack разработчик · Middle",
  location: "Москва, Россия",
  email: "finnik142@gmail.com",
  // Короткий слоган для hero-секции
  tagline: "Создаю быстрые, надёжные и красивые веб-приложения — от идеи до прода.",
  // Доступность для заказов
  available: true,
} as const;

export const about = {
  // Параграфы блока «О себе». Можно 1–3 абзаца.
  paragraphs: [
    "Привет! Меня зовут Алексей — я web full-stack разработчик уровня middle. Занимаюсь проектированием и разработкой веб-приложений полного цикла: от архитектуры и UI до бэкенда, БД и деплоя.",
    "Люблю чистый код, хорошую архитектуру и интерфейсы, с которыми приятно работать. Постоянно следю за новыми технологиями и внедряю лучшие практики в свои проекты.",
  ],
  // Метрики-счётчики (анимированный отсчёт при попадании в viewport).
  // Если value — число, используется AnimatedCounter. Для нечисловых (∞) — статика.
  stats: [
    { value: 5, suffix: "+", label: "лет в коммерческой разработке" },
    { value: 30, suffix: "+", label: "проектов в проде" },
    { value: 120, suffix: "+", label: "коммитов в месяц" },
    { value: "∞", label: "кружек кофе" },
  ],
} as const;

export type SkillGroup = {
  title: string;
  icon: string;
  items: string[];
  /** Какой live-demo компонент рисовать (см. components/skills/) */
  demo:
    | "react"
    | "typescript"
    | "backend"
    | "devops";
  /** Короткая подпись под demo-областью */
  demoCaption: string;
};

export const skills: SkillGroup[] = [
  {
    title: "Frontend",
    icon: "🎨",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "Zustand"],
    demo: "react",
    demoCaption: "Живой React-компонент: useState обновляет UI мгновенно",
  },
  {
    title: "Backend",
    icon: "⚙️",
    items: ["Node.js", "Express", "NestJS", "PostgreSQL", "MongoDB", "Redis", "Prisma"],
    demo: "backend",
    demoCaption: "Request → Controller → DB → Response: realtime-цикл",
  },
  {
    title: "DevOps & Tools",
    icon: "🚀",
    items: ["Docker", "GitHub Actions", "Git", "Linux", "Nginx", "AWS"],
    demo: "devops",
    demoCaption: "CI/CD pipeline: push → build → test → deploy",
  },
  {
    title: "TypeScript",
    icon: "🔷",
    items: ["Strict mode", "Generics", "Utility types", "Type inference", "Decorators"],
    demo: "typescript",
    demoCaption: "Компилятор ловит ошибку типа до запуска кода",
  },
];

// Плоский список ключевых технологий для бегущей ленты (Marquee).
// Берём самое значимое из каждой группы.
export const marqueeSkills: string[] = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "NestJS",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
  "Docker",
  "Redis",
  "GraphQL",
  "Git",
];

/**
 * Контент секции контактов.
 * Заполняется под себя — все поля подтягиваются в форму и инфо-карточку.
 */
export const contact = {
  // Заголовок-призыв в шапке секции
  headline: "Давай обсудим твой проект",
  subline:
    "Открыт для интересных задач, фриланса и full-time. Отвечаю быстро и по делу — без воды.",
  // Что предлагаю — chip'ы над формой, задают контекст
  projectTypes: [
    "Web-приложение",
    "Лендинг / сайт",
    "API / бэкенд",
    "Консультация",
    "Code review",
    "Full-time",
  ],
  // Метрики контакта для инфо-карточки
  responseTime: "обычно в течение 24 часов",
  timezone: "UTC+3 (Москва)",
  availability: "Открыт к новым проектам",
  // Типы сотрудничества (для инфо-карточки)
  collaborationTypes: ["Фриланс", "Контракт", "Full-time", "Part-time"],
} as const;

/**
 * Фоновые/inline-изображения в Anthropic-эстетике.
 * Источник: Unsplash (бесплатно, commercial use, без атрибуции).
 *
 * URL включает параметры Unsplash для оптимизации:
 *   w=1600 — ширина источника (не тянем оригинал 5000+ px)
 *   q=80 — качество 80% (визуально идентично 100, минус 50% трафика)
 *   fit=crop — обрезка под пропорции
 *   auto=format — AVIF/WebP автоматически
 *
 * Меняй ID фото на любое с images.unsplash.com — next/image всё оптимизирует.
 */
export const images = {
  // Hero-фото: фото Алексея в куртке (живой casual-вайб).
  hero: {
    src: "/photos/photo2-jacket.png",
    alt: "Алексей — web full-stack разработчик",
  },
  // Inline-фото в About: студийный портрет (чёрное поло).
  about: {
    src: "/photos/photo1-polo.png",
    alt: "Алексей, студийный портрет",
  },
  // Фоновое фото в Skills: очень приглушённое, под текстурой.
  skillsBg: {
    src: "https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=1200&q=70&auto=format&fit=crop",
    alt: "",
  },
  // Фоновое фото в Contact: тёплый бетон/текстура.
  contactBg: {
    src: "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=1200&q=70&auto=format&fit=crop",
    alt: "",
  },
} as const;

export type SocialLink = {
  label: string;
  href: string;
  // Иконки, реально присутствующие в массиве socials ниже.
  // Если добавишь LinkedinIcon/TwitterIcon — расширь тип и iconMap.
  icon: "github" | "telegram" | "email";
};

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/Chegolin123", icon: "github" },
  { label: "Telegram", href: "https://t.me/NoWayWhile", icon: "telegram" },
  { label: "Email", href: "mailto:finnik142@gmail.com", icon: "email" },
];

export const nav = [
  { label: "О себе", href: "#about" },
  { label: "Навыки", href: "#skills" },
  { label: "Портфолио", href: "#projects" },
  { label: "Контакты", href: "#contact" },
] as const;

/**
 * Портфолио проектов.
 *
 * ⚠️ Сейчас здесь ВЫДУМАННЫЕ кейсы как структурный пример.
 * Замени на свои реальные проекты: меняешь поля — карточки подтянутся.
 *
 * Для каждого проекта:
 * - title — название
 * - category — тег для фильтра (должен совпадать с projectsFilters ниже)
 * - description — коротко, чем занимался (1-2 предложения)
 * - challenge — конкретная проблема (для tooltip/expand)
 * - solution — что сделал
 * - stack — массив технологий
 * - image — Unsplash-фото как заглушка (замени на свой скриншот)
 * - links — live demo и/или репозиторий (опционально)
 * - year — год
 * - featured — выделить карточку (она шире)
 */
export type Project = {
  title: string;
  category: string;
  description: string;
  challenge: string;
  solution: string;
  stack: string[];
  image: string;
  links?: { live?: string; repo?: string };
  year: number;
  featured?: boolean;
};

export const projectsFilters = [
  "Все",
  "Web App",
  "E-commerce",
  "SaaS",
  "API",
  "Open Source",
] as const;

export const projects: Project[] = [
  {
    title: "Nebula Analytics",
    category: "SaaS",
    description:
      "SaaS-дашборд для продуктовой аналитики с real-time метриками и когортным анализом.",
    challenge:
      "Тяжёлые агрегации по 50M+ событий в день, интерфейс должен оставаться быстрым.",
    solution:
      "Перешёл с REST на GraphQL + materialized views в Postgres, время загрузки отчётов упало с 8с до 300мс.",
    stack: ["Next.js", "TypeScript", "GraphQL", "PostgreSQL", "Redis", "Prisma"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    links: { live: "#", repo: "#" },
    year: 2025,
    featured: true,
  },
  {
    title: "Marketplace «Kraft»",
    category: "E-commerce",
    description:
      "Маркетплейс handmade-товаров с оплатой, профилями продавцов и рейтингами.",
    challenge:
      "Сложная логика комиссий и split-платежей между платформой и продавцами.",
    solution:
      "Интегрировал Stripe Connect, спроектировал финансовую модель, покрыл критичные пути тестами.",
    stack: ["React", "Node.js", "NestJS", "PostgreSQL", "Stripe"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
    links: { live: "#" },
    year: 2024,
  },
  {
    title: "TaskFlow API",
    category: "API",
    description:
      "REST + WebSocket API для таск-трекера с realtime-синхронизацией команд.",
    challenge:
      "40+ одновременных редакторов одной задачи — конфликты и гонки данных.",
    solution:
      "CRDT-like синхронизация через Operational Transforms, ≤50мс latency на команду.",
    stack: ["Node.js", "NestJS", "WebSocket", "Redis", "Docker"],
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71",
    links: { repo: "#" },
    year: 2024,
  },
  {
    title: "DevUI Kit",
    category: "Open Source",
    description:
      "Open-source библиотека из 40+ анимированных React-компонентов с dark/light темами.",
    challenge:
      "Bundle-size: головная боль библиотечного автора, каждый байт на счету.",
    solution:
      "Tree-shaking из коробки, CSS-in-JS выкинул в пользу CSS-переменных, 2.1 KB на компонент.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8",
    links: { repo: "#", live: "#" },
    year: 2023,
  },
];

/**
 * Секция «Почему я».
 *
 * Короткие пункты с иконкой-эмодзи, заголовком и описанием.
 * Главная цель — снять типичные страхи клиента (сроки, коммуникация, качество).
 */
export const whyMe = [
  {
    icon: "🎯",
    title: "Беру задачу под ключ",
    description:
      "От задачи до прод-релиза. Не нужно микроменеджерить — декомпозирую, согласую, реализую, отчитываюсь.",
  },
  {
    icon: "⏱",
    title: "Сроки в договоре",
    description:
      "Декомпозиция на чанки по 2–3 дня, оплата по этапникам. Если задерживаю — это моя ответственность, а не ваша.",
  },
  {
    icon: "🗣",
    title: "На связи в течение дня",
    description:
      "Отвечаю в рабочее время за 4 часа. О проблемах сообщаю заранее, а не в день дедлайна.",
  },
  {
    icon: "🧪",
    title: "Тесты перед релизом",
    description:
      "Критичные пути покрыты unit и e2e-тестами. Баги ловлю на stage, а не в проде у ваших пользователей.",
  },
  {
    icon: "📚",
    title: "Код уходит вам, а не мне",
    description:
      "Полная документация по API, архитектуре и деплою. Любой разработчик продолжит работу без меня.",
  },
  {
    icon: "🚀",
    title: "Сопровождение после релиза",
    description:
      "72 часа 24/7 мониторинга после деплоя + месяц бесплатных мелких правок. Помогаю с онбордингом в код.",
  },
] as const;

/**
 * Метрики-доказательства для блока «Почему я».
 * Конкретные цифры вместо общих слов — продают лучше.
 * Анимированный отсчёт при попадании в viewport (AnimatedCounter).
 */
export const whyMeMetrics = [
  {
    value: 99.9,
    suffix: "%",
    decimals: 1,
    label: "uptime в проде",
    sublabel: "по проектам за последний год",
  },
  {
    value: 300,
    suffix: "мс",
    decimals: 0,
    label: "средний response",
    sublabel: "p95 на API-эндпоинтах",
  },
  {
    value: 4,
    suffix: "ч",
    decimals: 0,
    label: "SLA ответа",
    sublabel: "в рабочее время, по будням",
  },
  {
    value: 72,
    suffix: "ч",
    decimals: 0,
    label: "пост-релизный мониторинг",
    sublabel: "на связи 24/7 первые 3 дня после деплоя",
  },
] as const;

/**
 * Процесс работы — timeline «Как я работаю».
 * 5 фаз от первого контакта до сопровождения. Каждая с длительностью,
 * результатом (deliverable) и кратким описанием.
 *
 * Это снимает главный страх клиента: «а что вообще будет происходить?»
 */
export const workProcess = [
  {
    phase: "01",
    title: "Знакомство и оценка",
    duration: "1–2 дня",
    icon: "💬",
    description:
      "Созваниваемся 30 минут, я задаю вопросы про бизнес-цели. Через день присылаю смету с декомпозацией по задачам.",
    deliverables: ["Смета", "Декомпозиция", "Timeline"],
  },
  {
    phase: "02",
    title: "Прототип и ТЗ",
    duration: "3–5 дней",
    icon: "📐",
    description:
      "Делаю кликабельный прототип в Figma + согласованное техзадание. На этом этапе правки бесплатные.",
    deliverables: ["Прототип", "ТЗ", "Дизайн-система"],
  },
  {
    phase: "03",
    title: "Разработка спринтами",
    duration: "по 2 недели",
    icon: "⚡",
    description:
      "Каждые 2 недели — демо с тем, что готово. Доступ к стейджингу с первого дня, видно прогресс в реальном времени.",
    deliverables: ["Демо", "Stage-доступ", "Отчёт"],
  },
  {
    phase: "04",
    title: "Релиз и проверка",
    duration: "3–5 дней",
    icon: "🚀",
    description:
      "Деплой в прод под моим контролем, нагрузочное тестирование, monitored rollout. Первые 72 часа на связи 24/7.",
    deliverables: ["Production", "Тесты", "Мониторинг"],
  },
  {
    phase: "05",
    title: "Сопровождение",
    duration: "от 1 месяца",
    icon: "🛡",
    description:
      "Бесплатно правлю мелочи первый месяц, помогаю с онбордингом в код, передаю документацию и доступы.",
    deliverables: ["Поддержка", "Документация", "Handover"],
  },
] as const;

/**
 * Карточки для карусели (stories-формат) в секции портфолио.
 *
 * Гибрид: 4 карточки на основе существующих projects + 4 новых
 * (выдуманные testimonials-style кейсы). Каждая карточка — короткая
 * «сторис»: иллюстрация сверху, тег, цитата, автор с аватаром.
 *
 * ВАЖНО: 8 карточек — это минимум для красивой карусели (видны 2-3 по краям).
 * Меняй содержимое свободно — структура останется.
 */
export type Story = {
  id: string;
  // Короткий тег в верхнем углу карточки (как в ТЗ "Design")
  shortLabel: string;
  // Заголовок проекта (крупно на картинке)
  projectTitle: string;
  // Короткая цитата-сторис от автора/клиента
  quote: string;
  // Автор цитаты
  authorName: string;
  authorRole: string;
  // Буква для аватара
  avatarInitial: string;
  // Unsplash-фото (можно переиспользовать из projects)
  image: string;
  // Focal point для object-position CSS (например "30% 20%").
  // Настраивается через dev-drag маркер в карусели (см. ImageFocusEditor):
  // двигаешь маркер → копируешь строку сюда. Если undefined → object-center.
  imageFocus?: string;
  // Zoom изображения (например 1.15). Настраивается колесом мыши в dev-режиме.
  // Если undefined → 1.0 (без зума).
  imageZoom?: number;
  // Год (мелкий шрифт)
  year: number;
  // Ссылка на репозиторий/профиль GitHub (для иконки-стрелки на карточке)
  repoUrl: string;
};

// Канонический URL профиля — переиспользуем для всех stories по умолчанию
const GITHUB_PROFILE = "https://github.com/Chegolin123";

export const stories: Story[] = [
  // === ВСЕ 7 — РЕАЛЬНЫЕ проекты Алексея с github.com/Chegolin123 ===
  // Цитаты и фичи — из README и docs соответствующих репозиториев.
  {
    id: "karny",
    shortLabel: "Full-Stack",
    projectTitle: "Karny",
    quote:
      "Telegram Mini App для планирования встреч: комнаты с кодами, realtime-чат на WebSocket, события, авторизация через Telegram.",
    authorName: "Алексей",
    authorRole: "Pet-проект · React + Express + MySQL",
    avatarInitial: "А",
    image: "/projects/karny.png",
    year: 2026,
    repoUrl: `${GITHUB_PROFILE}/Karny`,
  },
  {
    id: "tourtohell",
    shortLabel: "Web App",
    projectTitle: "Tour to Hell",
    quote:
      "Сайт экстремального туроператора: бронирование туров, отзывы с модерацией, интерактивные карты Яндекс, админ-панель с графиками и аналитикой.",
    authorName: "Алексей",
    authorRole: "Проект · React + Node.js + MySQL",
    avatarInitial: "А",
    image: "/projects/tourtohell.png",
    year: 2026,
    repoUrl: `${GITHUB_PROFILE}/tourtohell`,
  },
  {
    id: "arduino-kip",
    shortLabel: "EdTech",
    projectTitle: "КИП ФИН · Arduino",
    quote:
      "Образовательная платформа колледжа: курсы, тестирование, каталог компонентов, админ-панель с WYSIWYG-редактором, экспорт в Excel/Word/JSON.",
    authorName: "Алексей",
    authorRole: "Проект · React 18 + Redux Toolkit + Node.js",
    avatarInitial: "А",
    image: "/projects/arduino-kip.png",
    year: 2026,
    repoUrl: `${GITHUB_PROFILE}/Arduino-KIP-kurs`,
  },
  {
    id: "fitmaster",
    shortLabel: "Web App",
    projectTitle: "FitMaster",
    quote:
      "Веб-приложение для домашних тренировок: умный подбор упражнений по оборудованию и мышечным группам, таймер, статистика прогресса, система достижений.",
    authorName: "Алексей",
    authorRole: "Проект · React + PHP + MySQL",
    avatarInitial: "А",
    image: "/projects/fitmaster.png",
    year: 2026,
    repoUrl: `${GITHUB_PROFILE}/Fitmaster`,
  },
  {
    id: "dark-moon",
    shortLabel: "Telegram Bot",
    projectTitle: "Тёмная Луна",
    quote:
      "Telegram-бот для детективной ролевой игры на 10–15 игроков: раздача ролей, 15 QR-улик, двухфазное голосование, автоматический выбор финала на основе найденных улик.",
    authorName: "Алексей",
    authorRole: "Pet-проект · Python + SQLite",
    avatarInitial: "А",
    image: "/projects/dark-moon.png",
    year: 2026,
    repoUrl: `${GITHUB_PROFILE}/Detective_IRL_Game-tg`,
  },
  {
    id: "leady-bot",
    shortLabel: "Backend",
    projectTitle: "Leady Bot",
    quote:
      "Telegram-бот — основной продукт: REST API, модульная архитектура (api/bot/core), Docker Compose для деплоя, Alembic-миграции схемы БД.",
    authorName: "Алексей",
    authorRole: "Продукт · Python + FastAPI + PostgreSQL",
    avatarInitial: "А",
    image: "/projects/leady-bot.png",
    year: 2026,
    repoUrl: `${GITHUB_PROFILE}/leady_bot`,
  },
  {
    id: "leady-landing",
    shortLabel: "Frontend",
    projectTitle: "Leady Landing",
    quote:
      "Конверсионный лендинг для бота: Next.js + TypeScript, 3D-анимации на React Three Fiber, micro-interactions через Framer Motion. Приводит трафик в продукт.",
    authorName: "Алексей",
    authorRole: "Продукт · Next.js + TypeScript + R3F",
    avatarInitial: "А",
    image: "/projects/leady-landing.png",
    year: 2026,
    repoUrl: `${GITHUB_PROFILE}/leady-landing`,
  },
  {
    id: "brew-bloom",
    shortLabel: "Frontend",
    projectTitle: "Brew & Bloom Café",
    quote:
      "Одностраничный сайт кофейни: интерактивное меню с табами, галерея с лайтбоксом, parallax-эффекты, scroll-reveal анимации, форма обратной связи.",
    authorName: "Алексей",
    authorRole: "Pet-проект · HTML + CSS + JavaScript",
    avatarInitial: "А",
    image: "/projects/brew-bloom.png",
    year: 2026,
    repoUrl: `${GITHUB_PROFILE}/brew-and-bloom-cafe`,
  },
];
