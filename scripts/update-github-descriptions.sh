#!/usr/bin/env bash
#
# Применение описаний ко всем 10 публичным репозиториям Chegolin123
# через GitHub API (PATCH /repos/{owner}/{repo}).
#
# ИСПОЛЬЗОВАНИЕ:
#   1. Создай Fine-grained Personal Access Token:
#      https://github.com/settings/tokens?type=beta
#      - Repository access: Only select repositories → все 10 твоих репо
#      - Permissions → Repository permissions → Contents: Read and write
#   2. Вставь токен в переменную GITHUB_TOKEN ниже (или передай через env)
#   3. Запусти скрипт:  ./scripts/update-github-descriptions.sh
#
# Что делает: для каждого репо отправляет PATCH на GitHub API с готовым
# description. Выводит результат рядом с каждым репо.
#
# Скрипт идемпотентный — можно запускать многократно.

set -euo pipefail

OWNER="Chegolin123"

# Токен:优先aet из env, иначе просьба вставить сюда
GITHUB_TOKEN="${GITHUB_TOKEN:-ВСТАВЬ_СЮДА_СВОЙ_TOKEN}"

if [[ "$GITHUB_TOKEN" == "ВСТАВЬ_СЮДА_СВОЙ_TOKEN" ]]; then
  echo "❌ Не установлен GITHUB_TOKEN"
  echo "   Создай токен: https://github.com/settings/tokens?type=beta"
  echo "   И запусти: GITHUB_TOKEN=xxx ./scripts/update-github-descriptions.sh"
  exit 1
fi

# Ассоциативный массив репо → описание
# (используем here-doc через declare -A для bash 4+)
declare -A DESCRIPTIONS=(
  ["Detective_IRL_Game-tg"]="Telegram-бот для детективной ролевой игры «Тёмная луна» на 10–15 игроков. Раздача ролей, QR-улики, двухфазное голосование, автоматический выбор финала. Python + aiogram + SQLite."
  ["leady_bot"]="Бэкенд Telegram-бота с REST API. Модульная архитектура (api/bot/core), Docker Compose для деплоя, Alembic-миграции. Python + FastAPI + PostgreSQL."
  ["leady-landing"]="Лендинг на Next.js + TypeScript с 3D-анимациями. React Three Fiber + drei для WebGL-сцены, Framer Motion для micro-interactions."
  ["Arduino-KIP-kurs"]="Образовательная платформа колледжа для изучения Arduino: курсы с главами, тестирование, каталог компонентов, админ-панель. React 18 + Redux Toolkit + Node.js + MySQL."
  ["Karny"]="Telegram Mini App для планирования встреч: комнаты с кодами, realtime-чат на WebSocket, события, авторизация через Telegram. React + Vite + Express + MySQL."
  ["tourtohell"]="Сайт экстремального туроператора: бронирование туров, отзывы с модерацией, избранное, админ-панель с графиками, карты Яндекс. React + Node.js + MySQL."
  ["joke-bot"]="Telegram-бот для групп: парсинг анекдотов с anekdot.ru, отправка по расписанию, подстановка имён участников, модерация. Python + MySQL + Cloudflare Worker."
  ["brew-and-bloom-cafe"]="Одностраничный сайт кофейни: интерактивное меню с табами, галерея с лайтбоксом, parallax, scroll-reveal анимации, форма обратной связи. HTML + CSS + JavaScript."
  ["Fitmaster"]="Веб-приложение для домашних тренировок: умный подбор упражнений по оборудованию и мышечным группам, таймер, статистика, достижения. React 18 + PHP + MySQL."
  ["Aleksei-Chegolin"]="Профиль-визитка на GitHub. Стек: HTML, CSS, JavaScript, React, Python, PHP, Node.js, PostgreSQL. Студент 3 курса КИП ФИН, цель — Fullstack-разработчик."
)

echo "Обновление описаний репозиториев $OWNER..."
echo ""

SUCCESS=0
FAIL=0

for REPO in "${!DESCRIPTIONS[@]}"; do
  DESC="${DESCRIPTIONS[$REPO]}"

  # Экранируем кавычки для JSON
  DESC_JSON=$(printf '%s' "$DESC" | python -c "import json,sys; print(json.dumps(sys.stdin.read()))" 2>/dev/null || echo "\"$DESC\"")

  echo -n "→ $REPO ... "

  RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/repos/$OWNER/$REPO" \
    -d "{\"description\": $DESC_JSON}")

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)

  if [[ "$HTTP_CODE" == "200" ]]; then
    echo "✓ OK"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "✗ ОШИБКА (HTTP $HTTP_CODE)"
    echo "  Ответ: $(echo "$RESPONSE" | head -n -1)"
    FAIL=$((FAIL + 1))
  fi
done

echo ""
echo "Готово. Успешно: $SUCCESS, с ошибками: $FAIL"
if [[ $FAIL -gt 0 ]]; then
  echo "Возможные причины: неверный токен, нет прав на репо, лимит API (60/час без токена)."
fi
