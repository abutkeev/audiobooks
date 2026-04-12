# Модуль profile

Профиль пользователя и настройки. Путь: `backend/src/profile/`.

**Декоратор класса контроллера:** `@AllowInactive()` — доступен даже для отключённых пользователей.

## ProfileService

### Методы

| Метод | Описание |
|---|---|
| `edit(id, login, name)` | Проверка уникальности логина; broadcast `refresh_token` пользователю, `invalidate_tag: users` админам |
| `changePassword(id, old, new)` | Верификация старого пароля; `ForbiddenException` если неверный |
| `getSettings(userId)` | Возвращает настройки или пустой объект |
| `setSettings(userId, settings)` | Upsert; broadcast `invalidate_tag: settings` |

## ProfileController

| Метод | Путь | Действие |
|---|---|---|
| `PUT` | `/profile` | Редактирование профиля |
| `POST` | `/profile/password` | Смена пароля |
| `GET` | `/profile/settings` | Получение настроек |
| `PUT` | `/profile/settings` | Обновление настроек |
