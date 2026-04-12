# Модуль position

Позиции прослушивания. Путь: `backend/src/position/`.

## PositionService

**Зависимости:** `PositionModel`, `FriendsService`, `EventsService` (через `forwardRef`).

### Методы

| Метод | Описание |
|---|---|
| `find(userId, bookId)` | Позиции пол��зователя по книге |
| `savePosition(userId, instanceId, position)` | Upsert; пропуск если данные не изменились; broadcast `invalidate_tag: position` по��ьзователю и друзьям |
| `remove(userId, instanceId, bookId)` | Удаление позиции, broadcast друзьям |
| `getAll(userId)` | ��се позиции пользователя |
| `getFriends(uid, bookId)` | Позиции друзей по конкретной книге |
| `getFriendsAll(uid)` | Все позиции друзей, сгруппированные по другу (исключая начальные) |

## PositionController

| Метод | Путь | Декораторы | Действие |
|---|---|---|---|
| `GET` | `/position` | | Все по��иции пользователя |
| `GET` | `/position/friends` | `@HasOnlineTag()` | Позиции друзей |
| `GET` | `/position/:bookId` | | Позиции по книге |
| `GET` | `/position/:bookId/friends` | | Позиции друзей по книге |
| `DELETE` | `/position/:bookId/:instanceId` | | Удаление позиции |

## Схема Position

| Поле | Тип | Особенности |
|---|---|---|
| `userId` | ObjectId (ref: User) | |
| `instanceId` | string | |
| `bookId` | string | |
| `currentChapter` | number | |
| `position` | number | |
| `updated` | Date | |

**Unique index:** `(userId, instanceId, bookId)`
