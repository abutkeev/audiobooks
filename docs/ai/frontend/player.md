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

- **audio-control-middleware** — связывает Redux-действия с HTML5 Audio API и Web Audio API. При dispatch `play`/`pause`/`changePosition` — управляет реальным аудиоэлементом. Громкость управляется через `GainNode` (Web Audio API), что позволяет усиление до 300% (`maxVolume = 300`).
- **local-storage-middleware** — сохраняет позицию/громкость/скорость в localStorage для восстановления при перезагрузке.

### Скорость воспроизведения

- Пресеты 0.50–2.00 и произвольное значение слайдером в диапазоне `[minSpeed, maxSpeed]` с шагом `speedStep` (`controls/PlaybackRate.tsx`)
- `changeSpeed` задаёт и `playbackRate`, и `defaultPlaybackRate`: `audio.load()` при смене главы сбрасывает `playbackRate` к `defaultPlaybackRate`
- Клавиши `Shift+.` / `Shift+,` двигают скорость по сетке 0.25 к следующему круглому значению
- Скорость сохраняется в localStorage вместе с позицией и громкостью и передаётся в `mediaSession.setPositionState` — иначе прогресс на локскрине считается как при обычной скорости

### Клавиатурные сокращения

Шорткаты плеера (`hooks/useKeyboardShortcuts.ts`) не срабатывают, когда событие пришло из поля ввода, меню или диалога: там своя обработка клавиш. Слайдеры плеера — исключение, MUI оставляет фокус на скрытом `input[type=range]` после клика, и без этого исключения после клика по прогресс-бару перестали бы работать все сокращения.

### Web Audio API

Аудио проходит через цепочку: `Audio → MediaElementSource → GainNode → AudioContext.destination`.

- Громкость 0–100%: `gainNode.gain.value` от 0 до 1
- Громкость 100–300%: `gainNode.gain.value` от 1 до 3 (усиление)
- `AudioContext.resume()` вызывается при play (Chrome autoplay policy)

## Синхронизация позиции

- Позиция отправляется на сервер через WebSocket (`position_update`)
- При открытии книги — проверка: есть ли более новая позиция на сервере
- `UpdateStateDialog` — предлагает обновить позицию, если на другом устройстве она дальше

## Кеширование аудио

- `media-cache` slice в store управляет состоянием кеша
- Service Worker (Workbox) кеширует аудиофайлы для офлайн-прослушивания
- `BookCacheIcon` / `ChapterCacheIcon` показывают статус кеширования
- Кеш всех книг (не только открытой) управляется из меню аккаунта — `app/account-menu/cached-chapters/`

## Media Session API

Хуки в `hooks/media-session/`:
- `useMediaSession` — регистрация в Media Session API браузера
- `useMediaKeys` — обработка медиа-клавиш (play/pause/next/prev)
- `usePlaybackState` — синхронизация состояния воспроизведения
- `usePositionState` — синхронизация позиции
- `useMediaMetadata` — отображение метаданных (название, обложка) в системе
