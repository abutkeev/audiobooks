# Workflow

## Формат коммитов

```
<emoji> (<scope>) <description>
```

или без emoji/scope для глобальных изменений:

```
<description>
```

### Emoji

Emoji опционально. Для новых фич обычно не ставится.

| Emoji | Назначение |
|---|---|
| `:pencil:` | Фиксы, обновления зависимостей |
| `:lipstick:` | Форматирование, UI-правки |
| `:hammer:` | Рефакторинг |
| `:fire:` | Удаление кода/файлов |
| `:ambulance:` | Критические фиксы |

### Scope

| Scope | Директория |
|---|---|
| `front` | `frontend/` |
| `back` | `backend/` |
| `deploy` | `deploy/` |
| `tools` | `tools/` |

Scope опционален. Для глобальных изменений (например, `run npm audit fix`) scope не указывается.

### Примеры

```
(front) add speed control
:pencil: (front) fix sort books by series number
:lipstick: (front) formatting
:hammer: (deploy) docker compose refactoring
:fire: (front) remove unneded fragment
:ambulance: (front) upgrade vite
run npm audit fix
```

### Description

- На английском
- Строчными буквами (без заглавной)
- Без точки в конце
- Краткое описание сути изменения

## Правила коммитов

### Трекинг

Трекинг задач не используется. Номер задачи в коммите не требуется.

### Аудиторы

Аудиторы не нужны. Поле `Auditors` не добавляется.

### Ссылки на задачи

Если коммит связан с GitHub Issue, можно добавить `#123` в описание. Это опционально.

### Co-Authored-By

Добавляется автоматически при использовании `/коммит`.

## Git-операции

### Ветвление

По умолчанию коммиты идут в `main` напрямую. Feature-ветки создаются только по явной просьбе.

### Предкоммитные проверки

В модуле, где были изменения:

1. `npm run lint`
2. `npm run build` (или `tsc --noEmit`)
