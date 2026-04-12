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
- `useTgLoginMutation()` — вход через Telegram
- `useWebauthnGenerateChallengeMutation()`, `useWebauthnLoginMutation()` — WebAuthn

## Store

- Dispatch `setAuthToken()` при успешном входе

## Хуки

- `useTitle()` — заголовок страницы
- `useNavigate()` — редирект после логина
