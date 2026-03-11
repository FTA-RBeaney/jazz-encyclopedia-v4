# Copilot Instructions for AI Agents

## Project Overview

- This is a Nuxt 3 (Vue 3) application for a jazz encyclopedia, with a modular structure for UI, server API, and composables.
- The project uses TypeScript throughout, with a focus on maintainable, typed code.
- The `server/` directory contains API endpoints (e.g., Discogs, YouTube integrations) and server-side utilities.
- The `app/` directory holds the main Vue app, including layouts, pages, and components.
- The `components/Ui/` folder contains reusable UI primitives, following a design system approach.
- State management is handled via Pinia stores in `stores/`.

## Key Workflows

- **Install dependencies:** Use `npm install` (or `pnpm`, `yarn`, `bun` as preferred).
- **Development:** Start with `npm run dev` (or equivalent) to launch the Nuxt dev server at `http://localhost:3000`.
- **Build for production:** Use `npm run build`.
- **Preview production build:** Use `npm run preview`.

## Project-Specific Patterns

- **API Endpoints:**
  - Located in `server/api/`, organized by resource (e.g., `discogs/`, `musicians/`, `videos/`).
  - Endpoints are file-based and follow Nuxt server conventions.
- **Composables:**
  - Shared logic (data fetching, state, etc.) lives in `composables/`.
  - Use composables for cross-component logic, e.g., `useFetchArticles.ts`.
- **UI Components:**
  - Use the `components/Ui/` directory for atomic, reusable UI elements.
  - Higher-level components are grouped by feature (e.g., `Musician/`, `Album/`).
- **State Management:**
  - Use Pinia stores in `stores/` for global state (e.g., `user.store.js`, `notification.store.js`).
- **Type Definitions:**
  - Shared types are in `types/database.types.ts`.
- **Utilities:**
  - Common helpers (e.g., Tailwind helpers) are in `utils/`.

## Integration & External Dependencies

- Integrates with Discogs and YouTube APIs (see `server/api/` and `server/utils/`).
- Uses `vue-query` for data fetching and caching (see `plugins/vue-query.client.ts`).
- Sanitizes HTML with `vue-dompurify-html` (see `plugins/`).

## Conventions & Tips

- Prefer composables and Pinia for shared logic/state.
- Organize new features by domain (e.g., new resource = new folder in `server/api/` and `components/`).
- Use TypeScript for all new code.
- Follow Nuxt/Vue conventions for file-based routing and server endpoints.
- Reference `nuxt.config.ts` for project-wide settings.

## Examples

- To add a new API endpoint for a resource, create a file in `server/api/<resource>/`.
- To add a new UI primitive, add it to `components/Ui/` and document usage.
- For shared logic, create a composable in `composables/`.

---

For more, see the Nuxt docs: https://nuxt.com/docs/getting-started/introduction
