# Хуки

Пользовательские хуки в `hooks/`.

## Данные и авторизация

| Хук | Назначение |
|---|---|
| `useAuthData` | Парсит JWT-токен, возвращает `admin`, `enabled` флаги |
| `useAuthors` | Обёртка RTK Query для списка авторов |
| `useReaders` | Обёртка RTK Query для списка чтецов |
| `useSeries` | Обёртка RTK Query для списка серий |

## UI и медиа

| Хук | Назначение |
|---|---|
| `useCreateTheme` | Создаёт MUI-тему на основе системных настроек и store |
| `useMobile` | Определение мобильного устройства |
| `useWakeLock` | Предотвращение блокировки экрана при воспроизведении |
| `useWebSocket` | Управление WebSocket-соединением |
| `useTitle` | Установка заголовка страницы (dispatch в store) |
| `useKeyboardShortcuts` | Привязка клавиатурных сочетаний |

## Формы и утилиты

| Хук | Назначение |
|---|---|
| `useFormattedDateTime` | Форматирование даты/времени с учётом языка |
| `useIsOverlaps` | Определение пересечения элементов |
| `useMediaCache` | Доступ к состоянию медиа-кеша |
| `useResizeObserver` | Отслеживание изменения размеров элемента |
| `useSearch` | Управление состоянием поиска |
| `useSearchMatcher` | Fuzzy-поиск по строкам |
| `useUpdatingState` | Отслеживание обновления состояния |
| `useWaitRefreshing` | Ожидание завершения обновления API |

## Media Session (`hooks/media-session/`)

Подробнее: [player.md](player.md)
