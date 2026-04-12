# Страница Sign Up

Путь: `pages/sign-up/index.tsx`. Маршрут: `/sign-up`.

## Структура

```
SignUp
├── ErrorAlert
���── TextField (имя, auto-focus)
├── LoginTextField (async-валидация д��ступности)
├── CustomPassword (с генерацией пароля)
├── ReCaptcha (Google reCAPTCHA v3)
└── ProgressButton (регистрация)
```

## Состояние

- `login`, `loginValid`, `name`, `password`, `captchaToken`, `error`

## API

- `useSignUpSignUpMutation()` — регистрация

## Логика

1. Имя → логин → пароль (с опциональной генерацией) → капча
2. При успехе — `setAuthToken()` и редирект на главную
3. Cancel — очистка формы и переход на главную
