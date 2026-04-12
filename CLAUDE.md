# Audiobooks

Pet-проект: веб-приложение для прослушивания аудиокниг с поддержкой нескольких пользователей, синхронизацией позиции между устройствами и системой друзей.

## Структура проекта

| Директория | Описание |
|---|---|
| `backend/` | NestJS API-сервер (MongoDB, WebSocket, JWT-авторизация) |
| `frontend/` | React SPA (Vite, MUI, RTK Query) |
| `tools/` | CLI-утилиты для работы с метаданными и загрузки аудиокниг |
| `deploy/` | Docker Compose, systemd-сервис |

## Команды разработки

### Backend (`backend/`)

```bash
npm run start:dev     # Dev-сервер с watch (порт 4000)
npm run build         # Сборка NestJS
npm run lint          # ESLint с авто-фиксом
npm run format        # Prettier
npm run generate-openapi  # Генерация OpenAPI-спецификации
```

### Frontend (`frontend/`)

```bash
npm run dev           # Dev-сервер Vite
npm run build         # TypeScript + Vite сборка
npm run lint          # ESLint (--max-warnings 0)
npm run format        # Prettier
npm run compile-openapi   # Генерация RTK Query API из OpenAPI
```

### Tools (`tools/`)

```bash
npm run download          # Загрузка аудиокниг
npm run update_metadata   # Обновление ID3-тегов
npm run extract_cover     # Извлечение обложек
```

## Предкоммитные проверки

Перед коммитом в модуле, где были изменения:

```bash
npm run lint
npm run build   # или tsc --noEmit
```

## Code conventions

- **Prettier**: 120 символов, single quotes, trailing commas ES5, 2 пробела, LF
- **ESLint**: настройки per-module (backend — `@typescript-eslint`, frontend — + `react-hooks`)
- Код и комментарии — на английском
- Документация (`.md`) — на русском

## Подробная документация

Директория `docs/ai/` содержит детальное описание архитектуры, паттернов и процедур:

| Документ | Назначение |
|---|---|
| [docs/ai/index.md](docs/ai/index.md) | Навигация по документации |
| [docs/ai/workflow.md](docs/ai/workflow.md) | Формат коммитов, git-операции |
| [docs/ai/changelog.md](docs/ai/changelog.md) | Правила ведения changelog |
| [docs/ai/frontend/](docs/ai/frontend/) | Архитектура и паттерны фронтенда |
| [docs/ai/backend/](docs/ai/backend/) | Архитектура и паттерны бекенда |
