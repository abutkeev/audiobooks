# Store

Redux Toolkit store с несколькими слайсами и кастомными middleware.

## Слайсы

### auth

- Состояние: `{ token: string | null }`
- Действия: `setAuthToken`
- Middleware: сброс кеша RTK Query при смене токена, обработка 403

### player

- Состояние: позиция, громкость, скорость, текущая глава, длительность, состояние воспроизведения
- Действия: `changePosition`, `changeVolume`, `changeSpeed`, `pause`, `play`, `forward`, `rewind`, `chapterChange`, `updateBookState`, `copyUrl`, `showMessage`
- Middleware:
  - `audio-control-middleware` — управление HTML5 Audio
  - `local-storage-middleware` — сохранение состояния
  - `createPlayerUtilsMiddleware` — вспомогательные операции
- Константа: `maxVolume = 300` (усиление через Web Audio API GainNode)

### media-cache

- Управление кешированием аудиофайлов
- Listener middleware для обработки событий кеширования

### websocket

- Состояние: `{ connected: boolean, instanceId: string }`
- `websocketMiddleware` — управление WebSocket-соединением
- Используется для real-time обновлений (инвалидация кеша, позиции)

### theme

- Состояние: `{ mode: 'light' | 'dark' | 'auto' }`
- Сохраняется в localStorage

### search

- Состояние: `{ show: boolean, text: string }`
- Управляет видимостью и текстом поисковой строки

### title

- Управление заголовком страницы (через React Helmet)

### snackbars

- Очередь toast-уведомлений

## RTK Query API

Автогенерированные эндпоинты в `api/api.ts` (~60+ запросов).

### Tag Types (инвалидация кеша)

`users`, `online`, `auth`, `tg`, `webauthn`, `friends`, `position`, `telegram`, `readers`, `books`, `authors`, `series`, `sign-up`, `profile`, `settings`

### Основные группы эндпоинтов

- **Auth**: login, token refresh, Telegram auth, WebAuthn
- **Users**: CRUD, активация/деактивация, админ-права
- **Books**: CRUD, загрузка глав/обложек, парсинг внешних плейлистов
- **Position**: чтение/сохранение позиции, позиции друзей
- **Friends**: запросы дружбы, одобрение, удаление
- **Metadata**: авторы, серии, чтецы (CRUD)
- **Profile**: редактирование профиля, смена пароля, настройки
- **Telegram**: управление чатами (admin)

### Кастомизации (`enhancedApi.ts`)

- `booksGet` — конвертация относительных URL обложек в абсолютные
- `booksGetBookInfo` — конвертация URL обложек и глав
