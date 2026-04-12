# Модуль auth

Аутентификация и авторизация. Путь: `backend/src/auth/`.

## Стратегии

### Local (`local/`)

- `LocalStrategy` — Passport-стратегия с `usernameField: 'login'`
- `validate(username, password)` → `usersService.verify()` → `UnauthorizedException` при ошибке

### JWT (`jwt/`)

- **JwtAuthGuard** (глобальный):
  1. Пропускает эндпоинты с `@Public()`
  2. Пропускает Telegraf-контекст без JWT
  3. Валидирует JWT через parent guard
  4. Если нет `@HasOnlineTag()` — обновляет онлайн-статус
  5. Если нет `@AllowInactive()` и пользователь отключён — отказ
  6. При любой ошибке — логирует и возвращает `false`
- **AdminAuthGuard**: Проверяет `@Admin()` декоратор + `user.admin`

### WebAuthn (`webauthn/`)

- Challenge хранится in-memory (не в БД), удаляется при использовании
- `add(registration, name, userId)` — валидация через `@abutkeev/webauthn`, алгоритмы RS256/ES256
- `auth(authentication)` — проверка credential, `UnauthorizedException` при ошибке
- `remove(id, userId)` — удаление ключа

### Telegram (`tg/`)

- `verifyAuthData(data)` — HMAC-SHA256 валидация хеша
- `set(userId, data)` — привязка аккаунта; автоактивация если пользователь в авторизованном чате
- `auth(data)` — логин через Telegram, `NotFoundException` если аккаунт не привязан

## AuthService

- `login(user)` → JWT с payload `{ username, sub, name, enabled, admin }`, время жизни 7 дней
- `verify(token)` → `UserDto | null` (ошибки логируются, не бросаются)
- `getTokenInfo(token)` → синхронный парсинг payload (ошибки не обрабатываются)

## AuthController

| Метод | Декораторы | Действие |
|---|---|---|
| `POST /auth/login` | `@Public()`, `@UseGuards(LocalAuthGuard)` | Логин, возвращает токен |
| `POST /auth/token` | `@AllowInactive()` | Обновление токена |

## Декораторы

| Декоратор | Файл | Назначение |
|---|---|---|
| `@Public()` | `public.decorator.ts` | Пропуск JWT-guard |
| `@Admin()` | `admin.decorator.ts` | Требование admin-прав |
| `@AllowInactive()` | `allow-inactive.decorator.ts` | Доступ для отключённых |
| `@HasOnlineTag()` | `has-online-tag.decorator.ts` | Пропуск обновления онлайн |

## Зависимости

- Циклические зависимости с `UsersService` — решаются через `forwardRef`
