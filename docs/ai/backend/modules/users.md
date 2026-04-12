# Модуль users

Управление пользователями. Путь: `backend/src/users/`.

## UsersService

**З��висимости:** 7 Mongoose-моделей (`User`, `TelegramAccount`, `Position`, `FriendRequests`, `Friend`, `PublicKey`, `Settings`), `EventsService`, `TgService`, `FriendsService` (все через `forwardRef`).

### Init user

Если заданы `INIT_ID` и `INIT_PASSWD` — создаётся виртуальный admin-пользователь, не хранящийся в БД. Все мутации (update, remove, updatePassword) для него пропускаются.

### Методы

| Метод | Описание |
|---|---|
| `create(password, ...user)` | Хеширование bcrypt, проверка уникальности логина |
| `find(id)` | Воз��ращает init user или из БД; `NotFoundException` |
| `findAll()` | Обогащает онлайн-статусом из позиций и Telegram-��анными |
| `verify(login, password)` | Проверка init user, затем bcrypt compare; `null` при ошибке |
| `findIdByLogin(login)` | ObjectId или `undefined` |
| `update(id, partial)` | Пропускает init user; шлёт `refresh_token` пользователю, `invalidate_tag: online` админам и друзьям |
| `updateOnline(id)` | Throttle 60 секунд; broadcast друзьям |
| `updatePassword(id, password)` | Хеш + update; пропускает init user |
| `remove(id)` | Каскадное удаление из 7 коллекций; пропускает init user |

## UsersController

**Декоратор класса:** `@Admin()` — все эндпоинты только для администраторов.

| Метод | Путь | Действие |
|---|---|---|
| `GET` | `/users` | Список пользователей (`@HasOnlineTag()`) |
| `POST` | `/users` | Создание пользователя |
| `PUT` | `/users/:id` | Обновление (включая пароль, проверка уникал��ности логина) |
| `DELETE` | `/users/:id` | Удаление |
| `PUT` | `/users/active/:id` | Активация |
| `DELETE` | `/users/active/:id` | Де��ктивация (нельзя для админов) |
| `PUT` | `/users/admin/:id` | Назначение админом (требует активный аккаунт) |
| `DELETE` | `/users/admin/:id` | Снятие админа (нельзя для себя) |

## Схема User

| Поле | Тип | Особенности |
|---|---|---|
| `login` | string | unique index |
| `password` | string | удаляется из toJSON |
| `name` | string | |
| `enabled` | boolean | |
| `admin` | boolean | |
| `online` | Date | optional |

**toJSON transform:** `_id` → `id`, удаляет `password`, нормализует `admin`/`enabled` в boolean.
