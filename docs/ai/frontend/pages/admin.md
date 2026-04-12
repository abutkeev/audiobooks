# Админ-страницы

Все требуют `admin: true` в JWT.

## Users (`pages/users/index.tsx`)

Маршрут: `/users`.

```
Users
├── LoadingWrapper
└── User[] (с поиском useSearchMatcher)
```

### User (`pages/users/User.tsx`)

- `useUsersUpdateMutation()`, `useUsersRemoveMutation()`
- `useAuthData()` — проверка «это я?»
- `useUpdatingState()` — управление формой
- Editable: login, name, password
- `UserDisableSwitch` — включение/отключение (нельзя для админов)
- `AdminSwitch` — назначение/снятие админа (нельзя для себя)
- `DeleteButton` — удаление (скрыто для себя)

## Chats (`pages/chats/index.tsx`)

Маршрут: `/chats`.

```
Chats
├── LoadingWrapper
└── ChatEntry[]
    ├── ChatType (иконка типа чата)
    ├── ChatStatus (иконка статуса)
    ├── CustomSwitch (авторизация)
    └── DeleteButton
```

- `useTelegramGetChatsQuery()`, `useTelegramAuthorizeChatMutation()`, `useTelegramUnauthorizeChatMutation()`, `useTelegramRemoveChatMutation()`

## Series (`pages/series/index.tsx`)

Маршрут: `/series`.

### SeriesItem (`pages/series/SeriesItem.tsx`)

- `useSeriesEditMutation()`, `useSeriesRemoveMutation()`
- `useUpdatingState()` — форма для name, authors
- `MultiSelect` — выбор авторов
- `BooksAccordion` — книги серии
- Подтверждение при удалении показывает количество книг

## Authors (`pages/authors/index.tsx`)

Маршрут: `/authors`.

### AuthorItem (`pages/authors/AuthorItem.tsx`)

- `useAuthorsEditMutation()`, `useAuthorsRemoveMutation()`
- `useUpdatingState()` — форма для name
- Защита от удаления: нельзя удалить если автор — единственный у книги
- `BooksAccordion` — книги автора

## Readers (`pages/readers/index.tsx`)

Маршрут: `/readers`. Аналогичен Authors.

## Edit Book (`pages/edit-book/index.tsx`)

Маршрут: `/edit/:id`. Три вкладки: Info, Chapters, Cover.

### EditBookInfo

- `useBooksEditMutation()`
- `useUpdatingState()` — форма: name, authors[], readers[], series[], draft
- Валидация: name обязателен, минимум 1 автор и 1 чтец
- Использует `BookInfoEditForm`

### EditChapters

- `useBooksUpdateDurationsMutation()`, `useBooksClearChaptersMutation()`
- Загрузка MP3: `UploadDialog` (axios POST с прогрессом)
- Внешние URL: `ExternalUrlDialog` → `DownloadExternalChaptersDialog`
- Очистка глав: только для черновиков

### EditCover

- `useBooksExtractCoverMutation()`, `useBooksRemoveCoverMutation()`
- Загрузка обложки: ручной axios PUT (не RTK Query, из-за multipart)
- Извлечение из ID3-тегов глав
