# Плеер

Аудиоплеер — центральный компонент приложения. Находится в `components/player/`.

## Структура

```
components/player/
├── index.tsx             # Основной компонент плеера
├── PlayerError.tsx       # Отображение ошибок воспроизведения
├── controls/
│   ├── index.tsx         # Экспорт контролов
│   ├── PlayerControlPanel.tsx  # Layout панели управления
│   ├── ControlButton.tsx       # Базовая кнопка управления
│   ├── PositionControl.tsx     # Прогресс-бар / ползунок позиции
│   ├── VolumeControl.tsx       # Регулировка громкости
│   ├── PlaybackRate.tsx        # Управление скоростью
│   ├── SleepControl.tsx        # Таймер сна
│   ├── CopyPosition.tsx        # Копирование ссылки с позицией
│   ├── Settings.tsx            # Настройки плеера
│   └── UpdateStateDialog.tsx   # Диалог синхронизации состояния
└── chapters/
    ├── index.tsx               # Список глав
    ├── Chapter.tsx             # Отдельная глава
    ├── BookCacheIcon.tsx       # Иконка кеша книги
    ├── ChapterCacheIcon.tsx    # Иконка кеша главы
    └── useChaptersCacheInfo.ts # Хук информации о кеше
```

## Управление состоянием

Состояние плеера хранится в Redux store (`store/features/player/`):

- **audio-control-middleware** — связывает Redux-действия с HTML5 Audio API. При dispatch `play`/`pause`/`changePosition` — управляет реальным аудиоэлементом.
- **local-storage-middleware** — сохраняет позицию/громкость/скорость в localStorage для восстановления при перезагрузке.

## Синхронизация позиции

- Позиция отправляется на сервер через WebSocket (`position_update`)
- При открытии книги — проверка: есть ли более новая позиция на сервере
- `UpdateStateDialog` — предлагает обновить позицию, если на другом устройстве она дальше

## Кеширование аудио

- `media-cache` slice в store управляет состоянием кеша
- Service Worker (Workbox) кеширует аудиофайлы для офлайн-прослушивания
- `BookCacheIcon` / `ChapterCacheIcon` показывают статус кеширования

## Media Session API

Хуки в `hooks/media-session/`:
- `useMediaSession` — регистрация в Media Session API браузера
- `useMediaKeys` — обработка медиа-клавиш (play/pause/next/prev)
- `usePlaybackState` — синхронизация состояния воспроизведения
- `usePositionState` — синхронизация позиции
- `useMediaMetadata` — отображение метаданных (название, обложка) в системе
