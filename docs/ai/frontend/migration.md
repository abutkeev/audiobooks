# Миграция зависимостей

Гайд по миграции: Vite 6→7, React 18→19, MUI 6→9, RTK 1→2 и сопутствующие зависимости.

## System props удалены

**Самое масштабное изменение.** MUI 9 убрал system props (`mt`, `mx`, `p`, `display`, `width`, `alignItems` и т.д.) как прямые пропы компонентов. Всё через `sx`.

### Что переносить в `sx`

| Было | Стало |
|---|---|
| `<Box mt={1} />` | `<Box sx={{ mt: 1 }} />` |
| `<Stack alignItems='center'>` | `<Stack sx={{ alignItems: 'center' }}>` |
| `<Typography textAlign='center'>` | `<Typography sx={{ textAlign: 'center' }}>` |
| `<Box display='flex' justifyContent='center'>` | `<Box sx={{ display: 'flex', justifyContent: 'center' }}>` |
| `<Box width='100%' height={50}>` | `<Box sx={{ width: '100%', height: 50 }}>` |

Полный список: `m`, `mt`, `mr`, `mb`, `ml`, `mx`, `my`, `p`, `pt`, `pr`, `pb`, `pl`, `px`, `py`, `display`, `width`, `height`, `minWidth`, `maxWidth`, `alignItems`, `justifyContent`, `alignContent`, `textAlign`, `flexGrow`, `flexShrink`.

### Что остаётся как проп

- **Stack**: `spacing`, `direction` — собственные пропы
- **Typography**: `variant`, `noWrap`, `align` — собственные пропы
- **Grid**: `container`, `spacing` — собственные пропы

### Мерж с существующим `sx`

```tsx
// Было
<Stack flexGrow={1} sx={{ background: 'red' }}>

// Стало
<Stack sx={{ flexGrow: 1, background: 'red' }}>
```

## Grid v1 → Grid (бывший Grid2)

Grid v1 удалён. Grid в MUI 9 — это бывший Grid2.

```tsx
// Было
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>

// Стало
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6 }}>
```

- `item` проп удалён
- `xs`, `md`, `lg` и т.д. → `size={{ xs: N, md: N }}`
- Импорт остаётся `import { Grid } from '@mui/material'`

## Hidden удалён

```tsx
// Было
import { Hidden } from '@mui/material';
<Hidden mdDown><Component /></Hidden>

// Стало
<Box sx={{ display: { xs: 'none', md: 'block' } }}><Component /></Box>
```

## InputProps / inputProps → slotProps

### TextField

```tsx
// Было
<TextField
  InputProps={{ endAdornment: <Icon /> }}
  inputProps={{ maxLength: 10 }}
/>

// Стало
<TextField
  slotProps={{
    input: { endAdornment: <Icon /> },
    htmlInput: { maxLength: 10 },
  }}
/>
```

### Autocomplete renderInput

```tsx
// Было
renderInput={({ inputProps, InputProps, ...rest }) => (
  <TextField
    {...rest}
    inputProps={{ ...inputProps }}
    InputProps={{ ...InputProps }}
  />
)}

// Стало
renderInput={({ slotProps: { htmlInput, input }, ...rest }) => (
  <TextField
    {...rest}
    slotProps={{
      htmlInput: { ...htmlInput },
      input: { ...input },
    }}
  />
)}
```

Тип `AutocompleteRenderInputParams` теперь содержит `slotProps.htmlInput` и `slotProps.input` вместо `inputProps` и `InputProps`.

## componentsProps → slotProps

Глобальная замена во всех компонентах:

```tsx
// Было (Slider)
<Slider componentsProps={{ thumb: { style: { display: 'none' } } }} />

// Стало
<Slider slotProps={{ thumb: { style: { display: 'none' } } }} />
```

```tsx
// Было (Menu)
<Menu MenuListProps={{ sx: { py: 0 } }} />

// Стало
<Menu slotProps={{ list: { sx: { py: 0 } } }} />
```

## Slider в flex-контейнере

Slider больше не занимает доступное пространство автоматически внутри flex-контейнера. Нужен `flexGrow: 1`:

```tsx
<Stack direction='row'>
  <VolumeDown />
  <Slider sx={{ flexGrow: 1 }} />
  <VolumeUp />
</Stack>
```

## Иконки переименованы

```tsx
// Было
import { ErrorOutline } from '@mui/icons-material';

// Стало
import { ErrorOutlined } from '@mui/icons-material';
```

Паттерн: `*Outline` → `*Outlined`.

## SpeedDial

`FabProps` остаётся как прямой проп (не в `slotProps`):

```tsx
<SpeedDial FabProps={{ sx: { alignSelf: 'flex-end' } }} />
```

## Сопутствующие миграции

### React 18 → 19

- `useRef()` требует начальное значение: `useRef<T>()` → `useRef<T>(null)` или `useRef<T>(undefined)`
- `RefObject<HTMLElement>` → `RefObject<HTMLElement | null>`

### jwt-decode 3 → 4

```tsx
// Было
import jwtDecode from 'jwt-decode';

// Стало
import { jwtDecode } from 'jwt-decode';
```

### @passwordless-id/webauthn 1 → 2

```tsx
// Было
client.register(username, challenge);
client.authenticate(credentialIds, challenge);

// Стало
client.register({ user: username, challenge });
client.authenticate({ allowCredentials: credentialIds, challenge });
```

Типы ответа (`RegistrationJSON`, `AuthenticationJSON`) не совместимы с v1 (`RegistrationDto`, `AuthenticationDto`). Если бэкенд не обновлён — использовать `as any`.

### Redux Toolkit 1 → 2

- Проверять `response.data` на `undefined` перед доступом к полям
- RTK Query типы могут отличаться

### Vite 6 → 7

- `process.env.NODE_ENV` → `import.meta.env.DEV` / `import.meta.env.PROD`
- Node.js модули (`buffer`, `crypto`, `stream`) экстернализированы для браузера. Если зависимость использует `Buffer` — установить полифилл:

```bash
npm install buffer
```

`vite.config.ts`:
```typescript
resolve: {
  alias: {
    buffer: 'buffer/',
  },
},
```

`main.tsx` (до всех остальных импортов):
```typescript
import { Buffer } from 'buffer';
(globalThis as unknown as Record<string, unknown>).Buffer = Buffer;
```

### i18next-parser → i18next-cli

`i18next-parser` deprecated, заменён на `i18next-cli`.

```bash
npm uninstall i18next-parser
npm install -D i18next-cli
```

Миграция конфига:
```bash
npx i18next-cli migrate-config ./src/locales/i18next-parser.config.ts
```

Скрипт в package.json:
```json
"i18next:extract": "i18next-cli extract"
```

Конфиг `i18next.config.ts` в корне модуля (не в `src/locales/`).

### @types/uuid

`uuid` v11 имеет встроенные типы — `@types/uuid` не нужен:
```bash
npm uninstall @types/uuid
```

## Порядок миграции

1. Обновить пакеты (React, MUI, RTK, Vite, вспомогательные)
2. Исправить system props → sx (самый объёмный этап)
3. Исправить Grid v1 → Grid
4. Исправить Hidden → Box с sx display
5. Исправить InputProps → slotProps
6. Исправить componentsProps → slotProps
7. Исправить остальные breaking changes (иконки, типы, API)
8. Проверить сборку (`tsc && vite build`)
