# Страница Friends

Путь: `pages/friends/index.tsx`. Маршрут: `/friends`.

## Структура

```
Friends
├── AddFriendToolbar         # Кнопка + диалог добавления
└── Tabs
    ├── IncomingRequests      # Входящие заявки
    ├── OutgoingRequests      # Исходящие заявки
    └── FriendsTab            # Список друзей
```

Вкладки показываются тол��ко если есть д��нные или вкладка активна. Дефолтная вкладка — входящие заявки (если есть), иначе — друзья.

## Компоненты

### AddFriendToolbar

- `useFriendsAddMutation()` — добавление друга
- `LoginTextField` — валидация существования логина
- Ошибки показываются чер��з snackbar

### IncomingRequests

- `useFriendsApproveRequestMutation()` — одобрение
- `useFriendsRemoveIncomingRequestMutation()` — отклонение

### OutgoingRequests

- `useFriendsRemoveOutgoingRequestMutation()` — отмена

### FriendsTab

- `useFriendsGetQuery()` — список друзей
- `useFriendsRemoveMutation()` — удаление
- Онлайн-индикатор, поиск

### FriendsList (переиспользуемый)

Принимает `data`, `actions[]`, `showOnline`, `emptyMessage`.
Фильтрация через `useSearchMatcher()` по id, uid, login, name.
