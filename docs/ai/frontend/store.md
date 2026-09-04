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
- Константы: `maxVolume = 300` (усиление через Web Audio API GainNode), `minSpeed = 0.25`, `maxSpeed = 3`, `speedStep = 0.05`
- `changeSpeed` нормализует значение (`normalizeSpeed`: clamp в `[minSpeed, maxSpeed]` и округление до сотых) в `audio-control-middleware` — так что любой источник скорости приходит к допустимому значению

### media-cache

- Управление кешированием аудиофайлов
- Listener middleware для обработки событий кеширования
- Состояние: `{ available: boolean, entries: Record<url, MediaCacheEntryState>, subscribers: string[] }`
- Действия: `addMediaToCache`, `removeCachedMedia`, `startMediaCacheUpdates`, `stopMediaCacheUpdates`
- `entries` — состояние по URL главы: `cached`, `downloading` (с прогрессом), `error`. Размер `cached`-записи берётся из `content-length` — при скачивании и при опросе Cache API; заголовка нет — размер остаётся неизвестным
- Подписка на периодическое обновление состояния — хуком `useMediaCache`; подписчики учитываются по id (`useId`) в самом состоянии, интервал живёт, пока есть хотя бы один. Экземпляров хука на экране несколько: список глав, иконки кеша, настройки плеера, диалог кешированных глав
- Listener'ы регистрируются сразу, а `Cache` ждут внутри своих эффектов — иначе действия, отправленные до готовности Service Worker, терялись бы. Поэтому реестр подписчиков живёт в состоянии: эффект отрабатывает позже редьюсера и должен видеть актуальный список
- Прогон публикует состояние дважды: сначала список закешированного (мгновенно), затем его же с размерами (чтение `content-length` по каждой записи занимает заметное время) — иначе диалог кешированных глав ждал бы размеры, чтобы показать хоть что-то
- Прогоны обновления не идут параллельно: `updateCachedMedia` заменяет все `cached`-записи, и более старый снапшот затирал бы главы, закешированные между прогонами. Список записей снимается после чтения размеров, а новый подписчик получает отдельный прогон — тик интервала во время идущего прогона нового не планирует
- Загрузка глав: не больше трёх попыток на URL, без повторов на 4xx (кроме 408 и 429); отмена загрузки (переход к другой книге) ошибкой не считается и запись просто снимается
- `mediaCacheSupported` — поддержка Cache API и Service Worker в браузере. Сам кеш читается со страницы напрямую, Service Worker нужен для его наполнения; `available` означает, что состояние кеша хотя бы раз прочитано, и UI отличает по нему «кеш пуст» от «состояние недоступно»

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
