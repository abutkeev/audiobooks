# Backend

## Стек

- **NestJS** — фреймворк (Express)
- **MongoDB** — база данных (через Mongoose)
- **Passport** — аутентификация (JWT, Local, WebAuthn, Telegram)
- **Socket.io** — WebSocket-соединения
- **Telegraf** — Telegram-бот
- **Swagger** — документация API (`/api/docs`)

## Конфигурация

### Переменные окружения (`constants.ts`)

| Переменная | Назначение |
|---|---|
| `DB_URI` | URI подключения к MongoDB |
| `PORT` | Порт сервера (по умолчанию 4000) |
| `JWT_SECRET` | Секрет для подписи JWT |
| `INIT_ID` / `INIT_PASSWD` | Начальный пользователь |
| `RECAPTCHA_SITE_KEY` | Ключ reCAPTCHA v3 |
| `TELEGRAM_BOT_TOKEN` | Токен Telegram-бота |

### Запуск (`app.ts`, `main.ts`)

- Статика фронтенда: `data/frontend`
- Файлы книг: `data/books/` → `/api/books/`
- Глобальный префикс: `/api`
- Глобальный `ValidationPipe`
- Swagger: `/api/docs` (JWT security scheme)

## Модули

| Модуль | Описание | Хранилище |
|---|---|---|
| `auth` | Аутентификация (JWT, Local, WebAuthn, Telegram) | MongoDB |
| `users` | CRUD пользователей, активация, админ-права | MongoDB |
| `books` | Управление книгами, главами, обложками | Файловая система (`data/books/`) |
| `position` | Позиции прослушивания (по устройствам) | MongoDB |
| `events` | WebSocket gateway, real-time уведомления | — |
| `friends` | Запросы дружбы, список друзей | MongoDB |
| `profile` | Профиль, пароль, настройки | MongoDB |
| `series` | Серии книг | Файл (`data/series.json`) |
| `authors` | Авторы | Файл (`data/authors.json`) |
| `readers` | Чтецы | Файл (`data/readers.json`) |
| `persons` | Базовый сервис для authors/readers | Файловая система |
| `sign-up` | Регистрация с reCAPTCHA | MongoDB |
| `telegram` | Интеграция Telegram-чатов | MongoDB |
| `tg-bot` | Telegram-бот (Telegraf) | — |
| `common` | Утилиты: JSON I/O, UUID, MP3 метаданные | — |
| `external-playlist` | Парсинг внешних плейлистов | — |
| `log` | Клиентское логирование | — |

## Хранилище данных

### MongoDB

| Коллекция | Индексы |
|---|---|
| `users` | `login` (unique) |
| `positions` | `{userId, instanceId, bookId}` (unique) |
| `friends` | `{user1, user2}` (unique) |
| `friendrequests` | `{from, to}` (unique) |
| `settings` | `userId` |
| `telegramaccounts` | `id`, `userId` |
| `publickeys` | `userId`, `id` |
| `chats` | `chatId` |

### Файловая система (`data/`)

```
data/
├── books/{bookId}/
│   ├── info.json       # {info, chapters[]}
│   ├── cover.*         # Обложка
│   └── *.mp3           # Аудиофайлы
├── authors.json        # [{id, name}]
├── readers.json        # [{id, name}]
└── series.json         # [{id, name, authors[]}]
```

## Подробнее

- [auth.md](auth.md) — аутентификация
- [books.md](books.md) — управление книгами
- [realtime.md](realtime.md) — WebSocket и real-time
