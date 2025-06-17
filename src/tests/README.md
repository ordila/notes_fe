# Тестування

Цей проект використовує Jest та React Testing Library для тестування.

## Структура тестів

```
src/
├── components/
│   ├── NoteForm.tsx
│   ├── NoteForm.test.tsx      # Тести для форми нотаток
│   ├── NotesApp.tsx
│   ├── NotesApp.test.tsx      # Тести для головного компонента
│   └── NotesList.tsx
├── __tests__/
│   ├── utils/
│   │   ├── test-utils.tsx     # Кастомні утиліти для рендерингу
│   │   └── mocks.ts           # GraphQL моки
│   └── README.md
├── App.tsx
└── App.test.tsx               # Тести для App компонента
```

## Тестові утиліти

### `test-utils.tsx`

- Кастомний `render` з автоматичним `MockedProvider`
- Експорт всіх утилітів з `@testing-library/react`
- Спрощує написання тестів для компонентів з GraphQL

### `mocks.ts`

- Централізовані GraphQL моки
- Моки для всіх операцій (GET_NOTES, CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE)
- Тестові дані для нотаток

## Використання

```typescript
import { render, screen } from "../__tests__/utils/test-utils";
import { mockNotes, getNotesSuccessMock } from "../__tests__/utils/mocks";

// Простий рендер з моками
render(<MyComponent />, { mocks: [getNotesSuccessMock] });

// Використання тестових даних
expect(screen.getByText(mockNotes[0].title)).toBeInTheDocument();
```

## Запуск тестів

```bash
# Запустити всі тести
npm test

# Запустити тести в watch режимі
npm test -- --watch

# Запустити тести з покриттям
npm test -- --coverage
```

## Принципи тестування

1. **Co-location** - тести поруч з компонентами
2. **Тестування поведінки** - тестуємо те, що бачить користувач
3. **Мокування GraphQL** - використовуємо MockedProvider
4. **DRY** - перевикористовуємо утиліти для уникнення дублювання
