# Документация для Claude

## Навигация

| Документ | Назначение |
|---|---|
| [workflow.md](workflow.md) | Формат коммитов, git-операции, предкоммитные проверки |
| [changelog.md](changelog.md) | Правила ведения CHANGELOG.md |
| [frontend/index.md](frontend/index.md) | Обзор фронтенда |
| [backend/index.md](backend/index.md) | Обзор бекенда |

## Frontend

### Обзор

| Документ | Назначение |
|---|---|
| [frontend/index.md](frontend/index.md) | Стек, структура директорий, маршрутизация, тема, i18n, тесты |
| [frontend/store.md](frontend/store.md) | Redux store: слайсы, middleware, RTK Query API |
| [frontend/components.md](frontend/components.md) | Переиспользуемые компоненты и UI-паттерны |
| [frontend/player.md](frontend/player.md) | Аудиоплеер: компоненты, управление, кеширование |
| [frontend/hooks.md](frontend/hooks.md) | Пользовательские хуки |
| [frontend/patterns.md](frontend/patterns.md) | Паттерны и антипаттерны |
| [frontend/migration.md](frontend/migration.md) | Гайд миграции зависимостей (Vite 7, React 19, MUI 9, RTK 2) |

### Страницы

| Документ | Назначение |
|---|---|
| [frontend/pages/login.md](frontend/pages/login.md) | Логин: пароль, WebAuthn, Telegram |
| [frontend/pages/sign-up.md](frontend/pages/sign-up.md) | Регистрация с reCAPTCHA |
| [frontend/pages/books.md](frontend/pages/books.md) | Книги: главная, каталог, страница книги |
| [frontend/pages/friends.md](frontend/pages/friends.md) | Друзья: заявки, список |
| [frontend/pages/admin.md](frontend/pages/admin.md) | Админ: пользователи, чаты, серии, авторы, чтецы, редактирование книг |

## Backend

### Обзор

| Документ | Назначение |
|---|---|
| [backend/index.md](backend/index.md) | Стек, модули, конфигурация, хранилище |
| [backend/auth.md](backend/auth.md) | Аутентификация: JWT, WebAuthn, Telegram (обзор) |
| [backend/books.md](backend/books.md) | Управление книгами (обзор) |
| [backend/realtime.md](backend/realtime.md) | WebSocket, позиции, инвалидация кеша (обзор) |
| [backend/patterns.md](backend/patterns.md) | Паттерны и антипаттерны |

### Модули

| Документ | Назначение |
|---|---|
| [backend/modules/auth.md](backend/modules/auth.md) | auth: стратегии, guard, декораторы |
| [backend/modules/users.md](backend/modules/users.md) | users: CRUD, init user, каскадное удаление |
| [backend/modules/books.md](backend/modules/books.md) | books: файловое хранилище, загрузка, парсинг |
| [backend/modules/events.md](backend/modules/events.md) | events: WebSocket gateway, broadcasting |
| [backend/modules/position.md](backend/modules/position.md) | position: позиции прослушивания |
| [backend/modules/friends.md](backend/modules/friends.md) | friends: заявки, список, удаление |
| [backend/modules/profile.md](backend/modules/profile.md) | profile: профиль, настройки, пароль |
| [backend/modules/other.md](backend/modules/other.md) | series, persons, sign-up, common, external-playlist, telegram, log |
