# Backend

## Стек

- **NestJS** — фреймворк (Express)
- **MongoDB** — база данных (через Mongoose)
- **Passport** — аутентификация (JWT, Local, WebAuthn, Telegram)
- **Socket.io** — WebSocket-соединения
- **Telegraf** — Telegram-бот
- **Swagger** — документация API (`/api-docs`)
- **Node** — 24 (образ в `deploy/docker-compose.yaml`, `engines.node` в `backend/package.json`)

## Конфигурация

### Переменные окружения (`constants.ts`)

| Переменная | Назначение |
|---|---|
| `DB_URI` | URI подключения к MongoDB |
| `PORT` | Порт сервера (по умолчанию 4000) |
| `LISTEN_ADDRESS` | Адрес прослушивания (по умолчанию `127.0.0.1`) |
| `JWT_SECRET` | Секрет для подписи JWT |
| `TELEGRAM_PROXY` | SOCKS5-прокси для Telegram-бота |
| `RECAPTCHA_VERIFY_URL` | URL проверки reCAPTCHA |
| `LAZY_DB_CONNECTION` | Не ждать подключения к MongoDB при старте (`true`) |
| `INIT_ID` / `INIT_PASSWD` | Начальный пользователь |
| `RECAPTCHA_SITE_KEY` | Ключ reCAPTCHA v3 |
| `TELEGRAM_BOT_TOKEN` | Токен Telegram-бота |

### Запуск (`app.ts`, `main.ts`)

- Статика фронтенда: `backend/frontend` (симлинк на сборку фронтенда)
- Файлы книг: `data/books/` → `/api/books/`
- Глобальный префикс: `/api`
- Глобальный `ValidationPipe`
- Парсеры тела регистрируются вручную (`bodyParser: false`), в том числе свой на `/api/log` с лимитом
  64 КБ — см. `modules/other.md`
- `trust proxy: ['loopback', 'uniquelocal']` для верного адреса клиента у троттлера
- Адрес прослушивания — `LISTEN_ADDRESS`, по умолчанию `127.0.0.1`
- Swagger: `/api-docs` (JWT security scheme)

Адрес прослушивания и доверие к заголовку с адресом клиента — одна настройка, разнесённая по двум
местам. Приложение считает `X-Forwarded-For` авторитетным, потому что перед ним стоит nginx; значит порт
бекенда не должен быть доступен в обход nginx, иначе заголовок подставит кто угодно и обойдёт троттлинг
`POST /api/log`. Отсюда петля по умолчанию — она же и есть рабочий вариант для запуска на хосте
(`deploy/audiobooks.service`, node под nginx на той же машине). В docker-развёртывании
(`deploy/docker-compose.yaml`) наоборот: публикация порта ограничена петлёй **хоста**
(`127.0.0.1:4001:4000`), а внутри контейнера приложение обязано отвечать на всех интерфейсах —
проброшенный порт приходит на адрес контейнера, не на петлю, — поэтому там задан `LISTEN_ADDRESS=0.0.0.0`.
Бекенд на другой машине, чем прокси, потребует того же явно — и тогда доступ к порту закрывается снаружи,
файрволом.

**Разовое при обновлении:** и хостовой, и docker-вариант раньше слушали все интерфейсы в обоих стеках,
а теперь отвечают только по IPv4-петле. `proxy_pass http://localhost:4001` в nginx резолвится ещё и в
`::1` и начнёт отдавать отказ на части запросов — upstream надо записать адресом (`127.0.0.1`), а не
именем.

Обе статики монтируются **до** роутера Nest, поэтому обе объявлены с `redirect: false`: иначе каталог,
чей путь совпадает с маршрутом (`data/books/<id>` против `GET /books/:id`), отвечает 301 на адрес со
слэшем вместо контроллера. Постоянный редирект без `cache-control` браузер запоминает надолго, а
Service Worker кеширует ответы `/api/` по адресу запроса — из-за расхождения адресов книга переставала
открываться офлайн.

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
├── books/{bookId}/     # раздаётся как статика по /api/books/
│   ├── info.json       # {info, chapters[]}
│   ├── cover.*         # Обложка
│   └── *.mp3           # Аудиофайлы
├── backup/{bookId}/{timestamp}/  # главы, снятые clearChapters
├── authors.json        # [{id, name}]
├── readers.json        # [{id, name}]
└── series.json         # [{id, name, authors[]}]
```

**Разовое при обновлении:** бэкапы, сделанные до переноса, остаются в `data/books/<id>/backup/` —
то есть публично раздаются. Их нужно перенести в `data/backup/<id>/` вручную.

**Файлы книг публичны по URL.** `data/books/` раздаётся статикой и не проходит через
`JwtAuthGuard`: аудиофайлы, обложки и `info.json` доступны без токена. На этом держится
клиентская схема воспроизведения и кеширования — тег `audio` и Service Worker не умеют
добавлять заголовок авторизации. Поэтому внутри `data/books/` не должно быть ничего, кроме
файлов самой книги: бэкапы глав лежат в `data/backup/`.

## Подробнее

- [auth.md](auth.md) — аутентификация
- [books.md](books.md) — управление книгами
- [realtime.md](realtime.md) — WebSocket и real-time
