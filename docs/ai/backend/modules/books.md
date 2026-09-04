# Модуль books

Управление аудиокнигами. Путь: `backend/src/books/`.

## Файловое хранилище

```
data/books/{bookId}/
├── info.json       # BookDto: { info: BookInfoDto, chapters: ChapterDto[] }
├── cover.*         # Обложка (jpg/png)
└── *.mp3           # Аудиофа��лы глав
```

## BooksService

**Зависимости:** `HttpService`, `ExternalPlaylistService`, `EventsService`, `CommonService`.

### Методы

| Метод | Описание |
|---|---|
| `getList()` | Сканирует директории, возвращает `{ id, info }[]` |
| `get(id)` | Читает и валидирует config (поддерживает old format → new) |
| `create(info)` | Создаёт директори�� и пустой массив chapters |
| `edit(id, book)` | Валидация файла, запись JSON |
| `remove(id)` | Рекурсивное удаление директории |
| `uploadChapter(bookId, title, file)` | Валидация `.mp3`, уникальность title/filename, расчёт duration |
| `uploadCover(bookId, file)` | Удаление старой обложки, генерация ID, сохр��нение |
| `removeCover(bookId)` | Удаление файла обложки |
| `updateDurations(bookId)` | Пересчёт длительностей всех глав |
| `editChaperTitle(bookId, chapter, title)` | Обновление названия, broadcast invalidate |
| `extractCover(bookId)` | Парсинг ID3 из первой главы с обложкой; `NotAcceptableException` если нет |
| `getChaptersFromUrl(url)` | Получение HTML, делегирование ExternalPlaylistService |
| `downloadExternalChapter(bookId, data)` | Загрузка MP3 с внеш��его URL с CORS-заголовками |
| `clearChapters(bookId)` | Бэкап существующих глав в `data/backup/{bookId}/` (требует draft), очистка массива |
| `remove(id)` | Удаление книги вместе с её бэкапами из `data/backup/{id}/` |

## BooksController

**Все мутирующие эндпоинты** — `@Admin()`.

| Метод | Путь | Действие |
|---|---|---|
| `GET` | `/books` | Список книг |
| `GET` | `/books/:id` | Информация о книге с главами |
| `POST` | `/books` | Создание |
| `PUT` | `/books/:id` | Реда��тирование метаданных |
| `DELETE` | `/books/:id` | Удаление |
| `POST` | `/books/:id/chapter/:title` | Загрузка главы (multipart, `FileInterceptor`) |
| `PUT` | `/books/:id/chapter/:chapter` | Переименование главы |
| `DELETE` | `/books/:id/chapters` | Очистка глав |
| `POST` | `/books/:id/cover` | Загрузка обложки (multipart) |
| `DELETE` | `/books/:id/cover` | Удаление обложки |
| `POST` | `/books/:id/cover/extract` | ��звлечение из ID3 |
| `POST` | `/books/:id/durations/update` | Пересчёт длительностей |
| `GET` | `/books/chapters/:url` | Парсинг глав из URL (base64) |
| `POST` | `/books/:id/external` | Загрузка из внешнего URL |

## Backward compatibility

Поддерживает старый формат `OldBookDto` → автоматическая конвертация в новый при чтении.
