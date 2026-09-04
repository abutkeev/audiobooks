# Страницы книг

## Home (`pages/Home.tsx`)

Маршрут: `/`. Редирект-обёртка.

- Если `currentBook` в localStorage есть в списке книг → редирект на `/book/{id}`
- Иначе → рендерит MainPage

## MainPage (`pages/main/index.tsx`)

Маршрут: `/books`. Три вкладки.

### Вкладки

| Вкладка | Компонент | Описание |
|---|---|---|
| Мои книги | `MyBooks` | Текущие книги пользователя |
| Книги друзей | `FriendsBooks` | Книги, которые слушают друзья |
| Все книги | `BookList` | Полный каталог с фильтрацией |

Вкладки скрываются при наличии фильтров (`author_id`, `reader_id`, `series_id` в URL).

### MyBooks (`pages/main/MyBooks.tsx`)

**API:** `useBooksGetQuery()`, `usePositionGetQuery()`, `useAuthors()`, `useReaders()`, `useSeries()`

**Логика:**
- Фильтрует позиции: исключает незначащие (position=0 && currentChapter=0)
- Дедупликация по книгам (последнее обновление)
- Поиск через `useBookSearchFilter()` по имени книги, автору, чтецу, серии
- Сортировка по дате обновления (новые первые)
- При активном поиске под списком — `CatalogSearchResults`: найденное во всех книгах, кроме уже показанного

### FriendsBooks (`pages/main/FriendsBooks.tsx`)

**API:** `useBooksGetQuery()`, `usePositionGetFriendsQuery()`

**Логика:**
- Группирует позиции по другу
- Каждый друг — `CustomAccordion` с `BookCard[]`
- `UserOnlineIndicator` для статуса онлайн
- Поиск фильтрует книги друзей, друзья без совпадений скрываются
- При активном поиске под списком — `CatalogSearchResults`: найденное во всех книгах, кроме уже показанного

### BookList (`pages/main/BookList.tsx`)

**API:** `useBooksGetQuery()`

**Логика:**
- Фильтрация по URL-параметрам: `author_id`, `reader_id`, `series_id`
- Поиск через `useBookSearchFilter()`
- Сортировка: автор → серия → н��мер в серии

## BookPage (`pages/BookPage.tsx`)

Маршрут: `/book/:id`.

```
BookPage
├── LoadingWrapper
├── BookCard
├── Player (если есть гл��вы)
└── OtherPlayersPosition
```

**API:** `useBooksGetBookInfoQuery({ id })`, `useAuthors()`, `useReaders()`, `useSeries()`

**Логика:**
- Устанавливает `currentBook` в localStorage
- Если в URL есть `position`/`currentChapter` — передаёт как externalState в Player
- Отображает п��зиции других слушателей (`OtherPlayersPosition`)
- `bookInfo` для `Player` мемоизирован — требование `player.md`, раздел «Media Session API»
- Данные книги берутся из `currentData`, не из `data`: `data` держит предыдущую книгу, пока грузится новая, и `Player` получил бы идентификатор новой книги со списком глав старой — позиция ушла бы в localStorage и на сервер под чужим id
