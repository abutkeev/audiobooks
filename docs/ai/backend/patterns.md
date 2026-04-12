# Паттерны и антипаттерны backend

## Паттерны

### Декораторы авторизации

Четыре декоратора управляют доступом. Порядок проверки:

1. `@Public()` → пропуск JWT
2. JWT-валидация → обновление онлайн-статуса (если нет `@HasOnlineTag()`)
3. Проверка `enabled` (если нет `@AllowInactive()`)
4. `@Admin()` → проверка admin-флага

```typescript
@Admin()                    // Весь контроллер — только admin
@Controller('users')
export class UsersController {
  @Get()
  @HasOnlineTag()           // Не обновлять онлайн при GET списка
  findAll() { ... }
}
```

### Event broadcasting

При изменении данных — broadcast через `EventsService`:

```typescript
// Инвалидация кеша RTK Query у клиента
this.eventsService.sendToUser({ userId, message: 'invalidate_tag', args: ['position'] });

// Обновление токена (при изменении данных пользователя)
this.eventsService.sendToUser({ userId, message: 'refresh_token' });

// Broadcast всем админам
this.eventsService.sendToAdmins('invalidate_tag', ['users']);
```

**Правило:** при изменении данных — уведомлять всех, кого это касается (пользователя, друзей, админов).

### Атомарная запись файлов

`CommonService.writeJSONFile()` — safe pattern:

1. Копия существующего → `.bak`
2. Запись во `.tmp`
3. Rename `.tmp` → оригинал

Предотвращает потерю данных при сбое.

### Циклические зависимости

Решаются через `@Inject(forwardRef(() => Service))`. Это **принятый паттерн** в проекте (auth ↔ users, events ↔ position, friends ↔ users ↔ events).

### Каскадное удаление

При удалении пользователя — очистка всех связанных коллекций:

```typescript
async remove(id: string) {
  await this.positionModel.deleteMany({ userId: id });
  await this.friendRequestsModel.deleteMany({ $or: [{ from: id }, { to: id }] });
  await this.friendsModel.deleteMany({ $or: [{ user1: id }, { user2: id }] });
  // ... ещё 4 коллекции
  await this.userModel.findByIdAndDelete(id);
}
```

### Throttle обновлений

Онлайн-статус обновляется не чаще раза в 60 секунд:

```typescript
const now = new Date();
if (user.online && now.getTime() - user.online.getTime() < 60000) return;
```

### Backward compatibility

Поддержка старых форматов данных (`OldBookDto`, `OldSeriesDto`) с автоматической конвертацией при чтении. Не ломать обратную совместимость при изменении формата хранения.

### Хранилище: MongoDB vs файлы

| Данные | Хранилище | Причина |
|---|---|---|
| Пользователи, позиции, друзья, настройки | MongoDB | Частые записи, индексы, связи |
| Книги, авторы, чтецы, серии | Файлы JSON | Редкие изменения, бинарные файлы рядом |

## Антипаттерны

### НЕ бросать исключения в guard

Guard должен возвращать `false`, а не бросать. Исключения логировать:

```typescript
// Правильно (как в JwtAuthGuard)
try {
  // ...
} catch (e) {
  Logger.error(e);
  return false;
}
```

### НЕ забывать broadcast при изменении данных

Каждая мутация, влияющая на кеш клиента, должна отправлять `invalidate_tag`. Забытый broadcast → устаревшие данные у клиента.

### НЕ использовать sync verify для JWT в runtime

`getTokenInfo()` — синхронный парсинг без обработки ошибок. Использовать `verify()` для валидации (возвращает `null` при ошибке).

### НЕ хранить challenge в БД

WebAuthn challenge хранится in-memory и удаляется при использовании. Это намеренно — challenge одноразовый и короткоживущий.

### НЕ делать silent error в парсерах без fallback

`ExternalPlaylistService` ловит ошибки молча — это допустимо, т.к. пробует несколько парсеров по очереди. Но в остальных сервисах — бросать конкретные HTTP-исключения.

### НЕ дублировать файловые операции

Всю работу с JSON-файлами — через `CommonService.readJSONFile()` / `writeJSONFile()`. Не использовать `fs` напрямую в сервисах модулей.
