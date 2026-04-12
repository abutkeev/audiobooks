# Вспомогательные модули

## series

Серии книг. Путь: `backend/src/series/`.

- **Хранилище:** файл `data/series.json`
- Поддержка старого формата (`author_id`) и нового (`authors[]`)
- `remove(seriesId)` — удаление серии + очистка из всех книг через `booksService.edit()`

## persons

Базовый сервис для авторов и чтецов. Путь: `backend/src/persons/`.

- **Хранилище:** `data/authors.json`, `data/readers.json`
- CRUD с UUID: `get(type)`, `create(type, name)`, `edit(type, id, name)`, `remove(type, id)`

## authors / readers

Обёртки над `PersonsService` для конкретного типа. Все эндпоинты — `@Admin()`.

## sign-up

Регистрация. Путь: `backend/src/sign-up/`.

- `signUp(login, password, name, captchaToken)` — проверка уникальности логина, reCAPTCHA v3, создание пользователя с `enabled: false`
- `check(login)` — проверка доступности логина
- `BadRequestException` при дублировании или ошибке капчи

## common

Утилиты. Путь: `backend/src/common/`.

| Метод | Описание |
|---|---|
| `readJSONFile(name)` | Чтение из `DataDir`, `undefined` если файл отсутствует |
| `writeJSONFile(name, data)` | Атомарная запись: копия → `.bak`, запись → `.tmp`, rename |
| `generateID()` | UUID v4 uppercase |
| `getExtensionByMimeType(type)` | jpeg → jpg, png → png |
| `extractImageFromID3tag(file)` | Парсинг ID3 через `node-id3` |
| `getDuration(filename)` | Длительность MP3 в секундах |

## external-playlist

Парсинг внешних плейлистов. Путь: `backend/src/external-playlist/`.

Поддерживаемые форматы (пробует все по очереди):
1. **PlayerJS** — regex `file: [...]` или `file: "url"` в HTML
2. **DLE** — HTML-комментарий `<!--dle_audio_begin:...-->`
3. **GraphQL/Nuxt** — `window.__NUXT__` JSON-состояние в HTML

CORS: добавляет `Origin` и `Referer` заголовки к запросам.

## telegram / tg-bot

Telegram-интеграция. Путь: `backend/src/telegram/`, `backend/src/tg-bot/`.

- `TelegramService` — API операции, проверка членства в чате
- `TgBotService` — обработчик команд Telegraf, реализует `OnModuleInit`
- Автозапуск бота отключён (`launchOptions: false` в `app.module.ts`)
- `TgBotService.onModuleInit()` запускает бота вручную с retry каждые 30 секунд при ошибке
- Backend не падает если Telegram API недоступен

## log

Клиентское логирование. Путь: `backend/src/log/`.

- `POST /log` — `@Public()` эндпоинт, записывает данные в серверные логи
