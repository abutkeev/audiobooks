# WebSocket и Real-time

## Events Gateway (`events/`)

WebSocket gateway на Socket.io. Namespace: `/api/events`.

### Подключение

Клиент передаёт в `handshake.auth`:
- `token` — JWT-токен
- `instanceId` — уникальный идентификатор устройства/вкладки

Gateway валидирует токен и регистрирует сокет через `EventsService`.

### Входящие сообщения

| Событие | Данные | Действие |
|---|---|---|
| `position_update` | `{bookId, currentChapter, position}` | Сохранение позиции прослушивания |
| `online` | — | Обновление онлайн-статуса |
| `log` | произвольные данные | Клиентское логирование |

### Исходящие сообщения

`EventsService` отправляет сообщения через зарегистрированные сокеты:

| Метод | Назначение |
|---|---|
| `sendToUser({userId, message, args})` | Отправка конкретному пользователю |
| `sendToAdmins()` | Отправка всем админам |
| `sendAll()` | Широковещательная рассылка |
| `sendOutdatedTokenRefreshEvent()` | Обновление устаревших токенов |

### Типы сообщений

- `invalidate_tag` — инвалидация кеша RTK Query (аргумент — имя тега)
- `refresh_token` — клиент должен обновить JWT-токен

## Позиции (`position/`)

Позиция прослушивания привязана к `{userId, instanceId, bookId}` (unique).

### Сохранение

- Через WebSocket (`position_update`) — основной способ
- `PositionService.savePosition()` — upsert с детекцией изменений
- При изменении позиции — broadcast `invalidate_tag:position` всем клиентам пользователя

### Чтение

| Эндпоинт | Данные |
|---|---|
| `GET /position` | Все позиции пользователя |
| `GET /position/:bookId` | Позиции по книге (все устройства) |
| `GET /position/friends` | Позиции друзей |
| `GET /position/:bookId/friends` | Позиции друзей по конкретной книге |

## Интеграция фронтенда

- `websocketMiddleware` в store — управляет соединением
- При получении `invalidate_tag` — RTK Query инвалидирует соответствующий кеш
- При получении `refresh_token` — фронтенд запрашивает новый JWT
