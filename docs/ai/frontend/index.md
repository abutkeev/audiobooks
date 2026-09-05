# Frontend

## Стек

- **React 19** + TypeScript
- **Vite** — сборка и dev-сервер
- **Material-UI (MUI)** — UI-компоненты
- **Emotion** — CSS-in-JS (через MUI)
- **Redux Toolkit** — state management
- **RTK Query** — API-слой (автогенерация из OpenAPI)
- **Socket.io** — real-time обновления
- **i18next** — интернационализация (en, ru)
- **Vitest** — тесты
- **Workbox** — Service Worker / PWA

## Структура `frontend/src/`

```
src/
├── main.tsx              # Точка входа, инициализация i18n
├── api/                  # RTK Query: базовый API и автогенерированные эндпоинты
├── app/                  # Layout: App, Routes, AppBar, Footer, ThemeProvider
├── components/           # Переиспользуемые компоненты
│   ├── common/           # UI-примитивы (LoadingWrapper, CustomDialog, ProgressButton...)
│   ├── player/           # Аудиоплеер (controls, chapters, кеширование)
│   ├── book-info-edit-form/
│   ├── other-player-positions/
│   └── ...
├── hooks/                # Пользовательские хуки
│   └── media-session/    # Интеграция с Media Session API
├── locales/              # Переводы (en, ru)
├── pages/                # Страницы (по маршрутам)
├── store/                # Redux store, слайсы, middleware
│   └── features/         # auth, player, theme, search, websocket, media-cache...
└── utils/                # Утилиты (formatTime, formatSize, getErrorMessage, convert-layout...)
```

## Маршрутизация

### Публичные

| Маршрут | Страница |
|---|---|
| `/sign-up` | Регистрация |
| `/*` | Логин (если нет токена) |

### Пользовательские (требуется авторизация)

| Маршрут | Страница |
|---|---|
| `/`, `/books` | Список книг (мои книги, книги друзей) |
| `/book/:id` | Страница книги с плеером |
| `/friends` | Управление друзьями |

### Административные (требуется admin)

| Маршрут | Страница |
|---|---|
| `/users` | Управление пользователями |
| `/chats` | Telegram-чаты |
| `/series` | Серии |
| `/authors` | Авторы |
| `/readers` | Чтецы |
| `/edit/:id` | Редактирование книги |

## Тема

- Три режима: `light`, `dark`, `auto` (системные настройки)
- Состояние в Redux store (`theme.mode`), сохраняется в localStorage
- MUI ThemeProvider + `useCreateTheme` хук

## i18n

- Языки: en, ru
- Детекция: localStorage (`lang`) → язык браузера → fallback `en`
- Использование: `useTranslation()` из react-i18next; вне компонентов (utils, middleware) — `t` из `i18next`,
  ключи извлекаются и из `.ts`
- Извлечение ключей: `npm run i18next:extract` (в `frontend/`)

## API-слой

Автогенерация из OpenAPI:

1. Backend: `npm run generate-openapi` — создаёт спецификацию
2. Frontend: `npm run compile-openapi` — генерирует RTK Query хуки в `api/api.ts`
3. Кастомизации в `api/enhancedApi.ts` (трансформация URL обложек)

Базовый URL: `/api`, авторизация через Bearer-токен из store.

## Тесты

Vitest, конфигурация — `vitest.config.ts` (отдельно от сборочного конфига, чтобы плагины react и pwa
не участвовали в прогоне; алиасы берутся из tsconfig). Файлы — `*.test.ts` рядом с проверяемым кодом,
окружение `node`.

```bash
npm run test         # однократный прогон
npm run test:watch   # watch-режим
```

Сборочные глобалы (`VERSION`, `MEDIA_CACHE_NAME` и прочие из `define` в `vite.config.ts`) в тестах
подменяются заглушками в `vitest.config.ts` — иначе модуль, который их читает, падает с `ReferenceError`.

Покрыты функции, не требующие React и DOM: `utils/isMatch` (поиск: регистр, е/ё, раскладка), `utils/formatSize`,
`store/features/media-cache/parseContentLength`, `store/features/api/redactSecrets`,
`store/features/player/audio-control-middleware/waitForMetadata`, `startPlayback` и `diagnosticsLog`,
`utils/getTelegramAuthError`.
Слушатели среднего слоя покрыты в `addLoadChapterAction.test.ts`, `addDiagnostics.test.ts`,
`addPlayerSetupActions.test.ts` (закрытие плеера) и `addSleepTimer.test.ts`. Тестов на компоненты и хуки пока нет —
для них потребуется jsdom и testing-library.

Listener middleware тестируется без jsdom: слушатели принимают аудиоэлемент параметром, так что в тесте
собирается свой `createListenerMiddleware`, стор с одним слайсом и подменный элемент
(`addLoadChapterAction.test.ts`). Условие — не тянуть в модуль ничего, что при импорте создаёт аудиоэлемент
или стор: баррель `features/player` реэкспортирует `audioControlMiddleware` с `new Audio()`, а `@/store`
собирает стор целиком. Поэтому слушатели импортируют `../slice`, `../actions` и `../limits` напрямую, тип
`AudioControllAddListrers` — через `import type`, граф Web Audio живёт в `gainGraph`, а
`getSliceActionCreator` — в отдельном модуле, а не в `store/index.ts`. DOM-глобалы, которые слушатели читают
в рантайме (`HTMLMediaElement` в проверках `readyState`), подменяются в тесте через `vi.stubGlobal`. Правило распространяется на все
слушатели плеера, включая `local-storage-middleware`, а не только на те, что нужны текущему тесту: иначе
следующий тест снова упрётся в баррель.

## Паттерны

Подробнее: [components.md](components.md), [store.md](store.md), [player.md](player.md), [hooks.md](hooks.md)
