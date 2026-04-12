# Модуль events

WebSocket gateway и real-time уведомления. Путь: `backend/src/events/`.

## EventsGateway

**Декораторы:** `@WebSocketGateway({ namespace: 'api/events' })`, `@UsePipes(...)`.

### Подключение

1. Извлечение `token` и `instanceId` и�� `handshake.auth`
2. Валидация токена через `authService.verify()`
3. Если невалид��ый — `socket.disconnect()`
4. Рег��страция сокета, отправка `refresh_token` если токен устарел

### Обработчики сообщений

| Событие | ��ействие |
|---|---|
| `position_update` | Сохранение позиции, обновление онлайн-статуса |
| `online` | Обновление timestamp онлайн |
| `log` | Логирование клиентских данных |

### Отключение

Удаление со��ета из реестра.

### Тип SocketWithUser

Расширяет Socket, добавляя `user: UserDto` и `instanceId: string`.

## EventsService

**In-memory хранилище:** `Record<userId, { instanceId, socket }[]>`.

### Методы

| Метод | Описание |
|---|---|
| `registerSocket(userId, instanceId, socket)` | Регистрация сокета |
| `unregisterSocket(userId, socket)` | Удаление сокета |
| `sendToUser(userId, skipInstance?, message, args)` | Отправка пользователю (с опциональным пропуском инстанса) |
| `sendAll(message, args)` | Broadcast всем |
| `sendToAdmins(message, args)` | Broadcast а��минам |
| `sendOutdatedTokenRefreshEvent(token, socket)` | Сравнение payload с текущими данными, `refresh_token` если отличается |

### Типы сообщений

- `invalidate_tag` — инвалидация кеша RTK Query (аргумент: имя тега)
- `refresh_token` — клиент должен обновить JWT
