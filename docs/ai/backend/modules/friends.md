# Модуль friends

Система друзей. Путь: `backend/src/friends/`.

## FriendsService

**Зависимости:** `FriendRequestsModel`, `FriendsModel`, `EventsService`, `UsersService` (через `forwardRef`).

### Методы

| Метод | Описание |
|---|---|
| `addRequest(from, toLogin)` | Валидация: получатель существует, не self, нет дубликата; если уже друзья — возвращает `true` |
| `getRequests(uid, 'in'\|'out')` | Входящие/исходящие заявки |
| `get(uid)` | Список друзей (bidirectional query) |
| `approve(uid, requestId)` | Удаляет заявку, создаёт запись друга (idempotent); broadcast заявителю |
| `removeRequest(uid, requestId, type)` | Удаление заявки, broadcast другой стороне |
| `remove(uid, entryId)` | Удаление друга, broadcast |

### Обработка ошибок

- `NotFoundException` — заявка/друг/пользователь не найден
- `BadRequestException` — добавление себя в друзья
- `ConflictException` — дублирующая заявка

## FriendsController

| Метод | Путь | Действие |
|---|---|---|
| `GET` | `/friends` (`@HasOnlineTag()`) | Список друзей |
| `DELETE` | `/friends/:entry_id` | Удаление друга |
| `POST` | `/friends/request` | Отправка заявки |
| `GET` | `/friends/requests/in` | Входящие заявки |
| `GET` | `/friends/requests/out` | Исходящие заявки |
| `POST` | `/friends/request/approve/:id` | Одобрение |
| `DELETE` | `/friends/request/in/:id` | Отклонение входящей |
| `DELETE` | `/friends/request/out/:id` | Отмена исходящей |

## Схемы

**FriendRequests:** `{ from: userId, to: userId }`, unique index `(from, to)`
**Friends:** `{ user1: userId, user2: userId }`, unique index `(user1, user2)`
