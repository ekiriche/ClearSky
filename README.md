# ClearSky

A weather forecast app. Search any city and get the current weather, with a persistent search history and undo support.

## Features

- **Weather search** — current temperature, feels like, min/max, wind speed, and weather description
- **Search history** — persisted in `localStorage`, up to 10 entries; clicking an entry re-fetches weather
- **Deduplication** — searching an existing city moves it to the top instead of adding a duplicate
- **Remove & undo** — remove any history entry; an undo toast appears for 5 seconds to restore it

## Tech Stack

| Concern       | Tool                             |
| ------------- | -------------------------------- |
| UI            | React 19 (functional components) |
| Language      | TypeScript (strict)              |
| State         | Zustand                          |
| Styling       | Tailwind CSS + Lucide React      |
| Data fetching | Fetch API                        |
| Testing       | Vitest + React Testing Library   |
| Build         | Vite                             |

## Getting Started

### Prerequisites

- Node.js 18+
- An [OpenWeatherMap](https://openweathermap.org/api) API key (free tier works)

### Setup

```bash
git clone <repo-url>
cd ClearSky
npm install
```

Copy the environment template and add your API key:

```bash
cp .env.example .env
```

```
# .env
VITE_WEATHER_API_KEY=your_key_here
```

Start the dev server:

```bash
npm run dev
```

## Available Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start dev server with HMR           |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview the production build        |
| `npm run test`    | Run unit tests                      |
| `npm run test:ui` | Run tests in the Vitest UI          |
| `npm run lint`    | Run ESLint                          |
| `npm run format`  | Format code with Prettier           |

## Environment Variables

| Variable               | Required | Description            |
| ---------------------- | -------- | ---------------------- |
| `VITE_WEATHER_API_KEY` | Yes      | OpenWeatherMap API key |
