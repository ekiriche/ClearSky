# ClearSky — Weather Forecast App

## Project Summary

React + TypeScript weather app. Users search cities, view weather, manage search history with remove + undo.

---

## Constraints (apply always)

- Do NOT over-engineer. No speculative abstractions.
- Do NOT add features beyond what is specified.
- Do NOT hardcode API keys. Use `VITE_WEATHER_API_KEY` from `.env`.
- Do NOT use `any` in TypeScript. Use explicit types in shared logic.
- Do NOT use class components. Functional components only.
- Do NOT prop-drill. Use Zustand for shared state.
- Prefer simplicity and clarity over cleverness.

---

## Tech Stack

| Concern       | Tool                           |
| ------------- | ------------------------------ |
| UI            | React (functional only)        |
| Language      | TypeScript (strict)            |
| State         | Zustand                        |
| Styling       | Tailwind CSS                   |
| Data fetching | Fetch API                      |
| Testing       | Vitest + React Testing Library |
| Build         | Vite                           |

---

## Folder Structure

```
src/
  components/       # Shared/generic UI components
  features/
    weather/        # Weather search + display
    history/        # History list + undo
  hooks/            # Custom hooks
  services/         # weatherService.ts (API logic)
  store/            # Zustand store
  utils/            # Pure utility functions
  types/            # Shared TypeScript types
  pages/            # Page-level components
```

---

## Features & Behavior

### 1. Weather Search

- Input: city name (text)
- On submit: fetch weather, display results
- Display: current temperature, description, min/max temp, wind speed
- Source: OpenWeatherMap or WeatherAPI via `services/weatherService.ts`

### 2. Search History

- Persist in `localStorage`
- Show list of previously searched cities
- Clicking a history item re-fetches weather for that city
- **Deduplication rule:** on duplicate search, move existing entry to top (do not add duplicate)
- City matching is case-insensitive

### 3. Remove History Item

- Each item has a remove button
- Removal updates UI immediately

### 4. Undo Remove

- Only single-level undo (last removed item only)
- Show "Undo" button after a removal
- On undo: restore item to its **original position** in the list
- Undo is cleared after: a new search OR a new removal

---

## State Shape (Zustand)

```ts
{
  weather: WeatherData | null
  loading: boolean
  error: string | null
  history: HistoryItem[]
  lastRemoved: { item: HistoryItem; index: number } | null
}
```

---

## Service Layer (`services/weatherService.ts`)

Responsibilities:

- Build and execute API requests
- Transform raw API response → `WeatherData` type
- Throw typed errors (network failure, city not found, rate limit)

---

## Error Handling

| Scenario               | UI Behavior                           |
| ---------------------- | ------------------------------------- |
| Network failure        | "Unable to reach weather service."    |
| City not found         | "City not found. Try another name."   |
| Empty/whitespace input | Prevent submission, no error shown    |
| API rate limit         | "Too many requests. Try again later." |

Never show raw API error messages to the user.

---

## Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `useSomething.ts`
- Utilities: `camelCase.ts`
- Types: use `interface` for objects, `type` for unions/aliases — be consistent throughout

---

## Testing

Write tests for:

- `weatherService.ts` (request building, response mapping, error handling)
- Zustand store (history add/remove/undo transitions)
- Input validation utilities
- Critical component rendering (loading, error, results states)

Do NOT write snapshot tests. Focus on behavior, not structure.

---

## Implementation Order

1. Types (`types/`)
2. `weatherService.ts` + tests
3. Zustand store + tests
4. Core components (search input, weather display, history list)
5. Undo UI
6. Styling (Tailwind, mobile-first)
7. README + `.env.example`

---

## Environment

```
# .env.example
VITE_WEATHER_API_KEY=your_key_here
```

---

## Documentation

- `README.md`: setup, env vars, run app, run tests, build
- Inline comments only where logic is non-obvious
- Let naming carry the documentation load
