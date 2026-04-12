# Паттерны и антипаттерны frontend

## Паттерны

### RTK Query

**Автогенерация API.** Эндпоинты генерируются из OpenAPI. Кастомизации — в `api/enhancedApi.ts` (трансформация response).

**Проверка ошибок мутаций.** Используй `'error' in result`:

```tsx
const result = await mutation(args);
if ('error' in result) {
  // обработка ошибки
  return;
}
// result.data доступно
```

**isLoading vs !data.** Для `LoadingWrapper` использовать `isLoading` из RTK Query, а не `!data`. Это предотвращает flash при обновлении данных (рефетч после инвалидации).

```tsx
// Правильно
<LoadingWrapper isLoading={isLoading} error={error}>

// Неправильно — flash при рефетче
{!data ? <Loading /> : <Content data={data} />}
```

### Состояние форм

**useUpdatingState.** Хук для управления состоянием формы с отслеживанием изменений. Используется на страницах редактирования (User, SeriesItem, AuthorItem, EditBookInfo).

**Паттерн modified indicator.** Если форма изменена — показать кнопки Save/Cancel:

```tsx
const [name, setName, modified] = useUpdatingState(initial.name);
// ...
{modified && <>
  <Button onClick={handleSave}>Save</Button>
  <Button onClick={handleCancel}>Cancel</Button>
</>}
```

### Диалоги

**Диалог как отдельный компонент.** Родитель управляет `open`, диалог — закрытием:

```tsx
const [open, setOpen] = useState(false);
<AddBookDialog open={open} onClose={() => setOpen(false)} />
```

**CustomDialog.** Стандартизированный компонент с заголовком, действиями, поддержкой Enter/Escape.

### Поиск

**useSearchMatcher.** Fuzzy-поиск с поддержкой неправильной раскладки (EN↔RU). Принимает массив строк для проверки:

```tsx
const isMatch = useSearchMatcher();
const filtered = items.filter(item => isMatch(item.name, item.login));
```

### Организация кода

**Размер компонента.** Максим��м ~250 строк. При превышении — выносить в подкомпоненты или хуки.

**Структура страниц.** Каждая страница — директория �� `index.tsx` и подкомпонентами. Переиспользуемые компоненты — в `src/components/`.

**Порядок в компоненте:**
1. Хуки (RTK Query, store, роутер)
2. Производные значения
3. Состояние формы
4. Вычисляемые значения
5. Обработчики
6. JSX

### UI

**MUI стили.** Использовать стандартные цве��а MUI (`primary`, `secondary`, `error`), а не hex-значения.

**LoadingWrapper / EmptyListWrapper.** Стандартные обёртки для loading/error/empty состояний.

**ProgressButton.** Кнопка с автоматичес��им спиннером при async-операции.

**DeleteButton.** Кнопка удаления с встроенным диалогом подтверждения.

### Маршрутизация

**Hash-based routing** (`createHashRouter`). Условные маршруты на основе auth-состояния (token, admin, enabled).

## Антипаттерны

### НЕ создавать JSX в переменных

```tsx
// Неправильно
const content = <div>{items.map(...)}</div>;
return <Container>{content}</Container>;

// Правильно — inline JSX или вынести в к��мпонент
return <Container><div>{items.map(...)}</div></Container>;
```

### НЕ создавать компоненты внутри useMemo/useCallback

```tsx
// Неправильно
const MemoizedList = useMemo(() => {
  const ListComponent = () => <div>...</div>;
  return ListComponent;
}, []);

// Правильно — отдельный компонент
const ListComponent = ({ items }) => <div>...</div>;
```

### НЕ использовать boolean для ошибок

```tsx
// Неправильно
const [error, setError] = useState<string | boolean>(false);

// Правильно
const [error, setError] = useState<string | undefined>();
```

### НЕ игнорировать типизацию RTK Query

При spread-операторе RTK Query теряет типы. Указывать типы явно:

```tsx
// Неправильно
const { data } = useGetQuery({ ...params });

// Правильно
const { data } = useGetQuery({ ...params } as GetQueryArg);
```

### НЕ загружать файлы через RTK Query

Для multipart/form-data (загрузка обложек, глав) использовать axios напрямую. RTK Query не подходит для отслеживания прогресса загрузки.
