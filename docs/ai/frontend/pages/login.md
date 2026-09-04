# Страница Login

Путь: `pages/login/index.tsx`. Маршрут: `/*` (fallback при отсутствии токена).

## Структура

```
Login
├── PasswordAuthForm        # Логин/пароль
├── SecurityKeyAuthButton   # WebAuthn
├── TelegramAuthButton      # Telegram OAuth
├── ErrorAlert              # Ошибки
└── Link → /sign-up         # Регистрация
```

## API

- `useAuthLoginMutation()` — логин по паролю
- `useTgLoginMutation()` — вход через Telegram. Отказ переводится по коду из тела ответа
  (`utils/getTelegramAuthError`), а не показывается как есть: сообщения сервера английские
- `useWebauthnGenerateChallengeMutation()`, `useWebauthnLoginMutation()` — WebAuthn

## Store

- Dispatch `setAuthToken()` при успешном входе

## Хуки

- `useTitle()` — заголовок страницы
- `useNavigate()` — редирект после логина
