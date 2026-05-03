# Focus Flow Task Prioritizer

## Product Goal

Build a functional task management app that re-prioritizes work based on the user's current mental energy.

## Engineering Role

Act as a senior full-stack engineer and system architect. Prefer clean, modular ES6+ code, React functional components, hooks, Fastify routes, Zod validation, Mongoose persistence, and clear naming over inline explanation.

## Strict Code Rule

Generated code must not include `//` or `/* */` comments.

## Stack

- Frontend: React with Vite, Tailwind CSS, Lucide Icons, Framer Motion
- Backend: Node.js, Fastify, Zod
- Database: MongoDB with Mongoose
- Inference: Gemini 1.5 Flash API

## Environment

Required variables:

- `MONGODB_URI`
- `GEMINI_API_KEY`
- `PORT`

Frontend variable:

- `VITE_API_URL`: optional, defaults to `http://localhost:4000`

## Task Model

Fields:

- `title`: required string
- `description`: string
- `difficulty`: number from 1 to 5
- `estimatedTime`: minutes
- `category`: one of `Coding`, `Documentation`, `Admin`, `Learning`
- `status`: one of `Backlog`, `In-Progress`, `Completed`
- `createdAt`: date

## User State

Fields:

- `currentEnergy`: number from 1 to 10
- `lastUpdate`: timestamp

## Flow Algorithm

`calculateFlowScore(task, energy)` uses:

- Energy below 4: modifier `0.5`
- Energy above 8: modifier `2.5`
- Otherwise: modifier `1.0`
- Score: `(task.difficulty * modifier) - (task.estimatedTime * 0.1)`

## Backend Phase

- Complete: MongoDB connection is implemented with Mongoose in `server/src/db/mongoose.js`.
- Complete: CRUD endpoints for `/tasks` are implemented in `server/src/routes/task.routes.js`.
- Complete: `POST /prioritize` is implemented in `server/src/routes/prioritize.routes.js`.
- Complete: API request schemas and environment validation use Zod.
- Complete: Gemini 1.5 Flash prioritization is implemented with local Flow fallback behavior.
- Complete: User Model, Authentication routes (`POST /auth/register`, `POST /auth/login`), and JWT based authorization using `@fastify/jwt` and `bcryptjs`.

## Frontend Phase

- Complete: Dashboard header and mental energy slider are implemented.
- Complete: `TaskBoard.jsx` uses Framer Motion `LayoutGroup`, `AnimatePresence`, and spring-based `layout="position"` transitions so cards slide smoothly when priority order changes.
- Complete: The task list re-sorts immediately when the slider changes.
- Complete: `CreateTaskForm.jsx` supports creating tasks through the API, with local demo fallback when the API is unavailable.
- Complete: Task deletion is wired through the API when available.
- Complete: `client/vite.config.js` enables `@vitejs/plugin-react`; keep this file in place to prevent blank-page runtime crashes from JSX compilation.
- Complete: Real-time active task tracking implemented in `TaskCard.jsx` using absolute `Date.now()` logic to prevent background browser tab throttling.
- Complete: Dark Mode toggle implemented via `ThemeToggle.jsx` and Tailwind CSS `dark:` classes.
- Complete: JWT authentication and protected routes with a "Guest Mode" fallback logic using `react-router-dom`. Unauthenticated users can use the app locally without database persistence.
- Verify persisted tasks by running the server, running the client, creating a task, refreshing the browser, and confirming it remains in the list.

## Current Project Structure

- Root workspace scripts live in `package.json`.
- Client app lives in `client`.
- Server app lives in `server`.
- Client entry point: `client/src/main.jsx`.
- Client app shell: `client/src/App.jsx`.
- Task board: `client/src/components/TaskBoard.jsx`.
- Task creation drawer: `client/src/components/CreateTaskForm.jsx`.
- Energy slider: `client/src/components/EnergySlider.jsx`.
- Task card: `client/src/components/TaskCard.jsx`.
- Theme toggle: `client/src/components/ThemeToggle.jsx`.
- Client API wrapper: `client/src/api/tasks.js`.
- Shared client Flow utility: `client/src/utils/flow.js`.
- Server app setup: `server/src/app.js`.
- Server entry point: `server/src/index.js`.
- Task model: `server/src/models/task.model.js`.
- Task schemas: `server/src/schemas/task.schema.js`.
- Task routes: `server/src/routes/task.routes.js`.
- Prioritization route: `server/src/routes/prioritize.routes.js`.
- Gemini integration: `server/src/services/gemini.service.js`.
- Priority response normalization: `server/src/services/priority-response.service.js`.
- Shared server Flow utility: `server/src/utils/flow.js`.

## Verification Commands

- Run the backend: `npm run dev --workspace server`
- Run the frontend: `npm run dev --workspace client`
- Build the frontend: `npm run build --workspace client`
- Check backend syntax: `npm run check --workspace server`
- Verify prioritization service: `npm run verify:prioritize --workspace server`

## Known Gaps

- User State persistence is defined in the product model but is not yet implemented as a database model or API route.
- The frontend currently uses local React state for current energy.
