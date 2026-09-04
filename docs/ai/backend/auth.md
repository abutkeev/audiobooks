# Аутентификация

## Стратегии

### Local (логин/пароль)

- `POST /auth/login` — Basic Auth через `LocalAuthGuard`
- Пароли хешируются bcrypt в `UsersService`
- Возвращает JWT-токен

### JWT

- Токен в заголовке: `Authorization: Bearer <token>`
- Время жизни: 7 дней
- Payload: `{ sub: userId, login, name, admin, enabled }`
- `JwtAuthGuard` — глобальный guard, применяется ко всем эндпоинтам. Исключения — эндпоинты с
  `@Public()` (см. ниже) и статика `data/books/` под `/api/books/`: файлы книг публичны по URL
  (см. [index.md](index.md))

### WebAuthn (FIDO2)

- `auth/webauthn/` — challenge generation, credential registration, authentication
- Публичные ключи хранятся в MongoDB (коллекция `publickeys`)

### Telegram

- `auth/tg/` — верификация Telegram Auth Data (HMAC-SHA256) и возраста подписи: Telegram данные подписывает,
  но не ограничивает их срок, поэтому `auth_date` старше суток отвергается — иначе утёкшая подпись
  открывала бы вход бессрочно. Нижней границы нет намеренно: `auth_date` тоже подписан, подделать его
  без токена бота нельзя, а отставание часов сервера иначе закрывало бы вход совсем
- Привязка Telegram-аккаунта к пользователю (коллекция `telegramaccounts`)
- Логин через Telegram без пароля

## Декораторы

| Декоратор | Действие |
|---|---|
| `@Public()` | Пропускает JWT-guard |
| `@AllowInactive()` | Разрешает доступ отключённым пользователям |
| `@Admin()` | Требует `admin: true` |
| `@HasOnlineTag()` | Пропускает обновление онлайн-статуса |

## Флоу аутентификации

1. **Регистрация**: `POST /sign-up` → пользователь создаётся с `enabled: false`, reCAPTCHA v3
2. **Логин**: `POST /auth/login` (Basic Auth) → JWT-токен
3. **Обновление токена**: `POST /auth/token` (Bearer) → новый JWT
4. **Глобальный guard**: проверяет JWT → обновляет онлайн-статус → проверяет `enabled`
5. **Admin guard**: дополнительно проверяет `admin` флаг
6. **WebSocket**: токен + instanceId в `handshake.auth`
