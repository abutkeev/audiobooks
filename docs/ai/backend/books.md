# Управление книгами

## Хранилище

Книги хранятся в файловой системе (`data/books/`). Каждая книга — директория с `info.json`, аудиофайлами и обложкой.

```
data/books/{bookId}/
├── info.json       # Метаданные и список глав
├── cover.jpg       # Обложка (опционально)
└── *.mp3           # Аудиофайлы глав
```

### info.json

```json
{
  "info": {
    "name": "Название кни��и",
    "authors": ["author-uuid"],
    "readers": ["reader-uuid"],
    "series": [{"id": "series-uuid", "number": 1}],
    "cover": {"type": "image/jpeg", "filename": "cover.jpg"},
    "draft": false
  },
  "chapters": [
    {"title": "Глава 1", "filename": "chapter1.mp3", "duration": 3600}
  ]
}
```

## Эндпоинты (admin-only)

| Метод | Путь | Действие |
|---|---|---|
| `GET /books` | Список книг |
| `GET /books/:id` | Информация о книге с глава��и |
| `POST /books` | Создание книги |
| `PUT /books/:id` | Редактирование метаданных |
| `DELETE /books/:id` | Удаление книги |
| `POST /books/:id/chapter/:title` | Загрузка главы (multipart) |
| `PUT /books/:id/chapter/:chapter` | Редактирование названия главы |
| `DELETE /books/:id/chapters` | Очистка глав (с бэкапом) |
| `POST /books/:id/cover` | Загрузка обложки (multipart) |
| `DELETE /books/:id/cover` | Удаление обложки |
| `POST /books/:id/cover/extract` | Извлечение обложки из ID3-тегов |
| `POST /books/:id/durations/update` | Пересчёт длительностей |
| `GET /books/chapters/:url` | Парсинг глав из внешнего URL (base64) |
| `POST /books/:id/external` | Загрузка главы из внешнего URL |

## Парсинг внешних плейлистов (`external-playlist`)

Сервис поддерживает несколько форматов:

- **PlayerJs** — `file: [...]` встроенный в HTML
- **DLE** — HTML-комментарии `<!--dle_audio_begin:...-->`
- **GraphQL/Nuxt** — `window.__NUXT__` JSON-состояние

## Метаданные (файловое хранилище)

Авторы, чтецы и серии хранятся в JSON-файлах (`data/authors.json`, `data/readers.json`, `data/series.json`).

Базовый сервис `PersonsService` обеспечивает CRUD с UUID для authors и readers. `SeriesService` управляет сериями с привязкой к авторам.

Запись: `CommonService.writeJSONFile()` — атомарная запись через tmp-файл с бэкапом.
