# RMS — Restaurant Management System

An admin console for running a restaurant's back office: the menu and the meals
on it, the ingredients and raw materials behind each meal, the kitchen machines
that produce them, and the staff who use the system.

Built as a single-page React application against a REST API, in Arabic and
English, with full right-to-left support.

> This is the web client. The API it talks to lives elsewhere and is configured
> through `VITE_BASE_URL`.

---

## What it manages

| Area | What it covers |
| --- | --- |
| **Meals** | The menu itself — creating a meal, its ingredients, category and brand, with a detail view per meal |
| **Meal categories** | How meals are grouped on the menu |
| **Ingredients** | What meals are made of, and the unit each is measured in |
| **Articles** | Raw materials and stock items, each with its own detail page |
| **Categories** | Classification for articles and materials |
| **Units** | Units of measure shared across ingredients and materials |
| **Machines** | Kitchen equipment, with add, edit and detail views |
| **Brands** | Brands referenced by meals and articles |
| **Users** | Staff accounts, with per-user permission editing |
| **Home slider** | The carousel shown on the storefront |
| **Settings** | Application preferences |

Every management area follows the same shape — a searchable, sortable table
built on TanStack Table, with add, edit, details and delete flows in dialogs —
so a new area behaves exactly like the ones already learned.

---

## Notable engineering

**Silent session refresh.** The API client intercepts every `401`/`403`, refreshes
the access token, and replays the original request, so an expiring session is
invisible to the user. Concurrent failures are serialised behind a mutex
(`async-mutex`), so ten requests failing at once trigger **one** refresh rather
than ten — and the rest wait for it instead of racing.

**Typed data layer.** RTK Query owns fetching, caching and invalidation. Each
domain is a separate injected slice under `src/api/feature/`, so a screen
declares what it needs and the cache handles the rest.

**Validated forms.** React Hook Form with Zod resolvers — one schema per form,
shared between validation and the inferred TypeScript type, so a form and its
type cannot drift apart.

**Bilingual and bidirectional.** i18next with browser language detection; the
document direction follows the active language, so Arabic renders RTL and
English LTR throughout, including the sidebar and layout.

**Theming.** Light, dark and system themes, persisted across sessions.

**Phone input.** `libphonenumber-js` with country-aware formatting and
validation, rather than a free-text field.

---

## Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · shadcn/ui components over Radix ·
Redux Toolkit + RTK Query · redux-persist · React Router 7 · React Hook Form +
Zod · TanStack Table · i18next · Axios · Lucide · React Toastify.

---

## Running it

```bash
npm install
```

```bash
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview the production bundle |
| `npm run lint` | ESLint |

### Environment

Create a `.env` file pointing at the API:

```
VITE_BASE_URL = "https://your-api.example.com"
```

Vite inlines `VITE_*` variables at build time, so the value must be set before
`npm run build` — a bundle built against localhost will not reach a deployed
server.

---

## Layout

```
src/
  api/
    api.ts        RTK Query base: auth header, refresh-and-retry, mutex
    feature/      one injected slice per domain
  components/
    ui/           design primitives (shadcn/ui over Radix)
    <domain>/     table, dialogs and forms for each management area
  pages/          one page per route
  routes/         router definition and the auth guard
  layout/         app shell — sidebar, navbar, breadcrumbs
  store/          Redux store and persistence
  context/        cross-cutting providers
  hooks/          shared hooks
  i18n/           i18next setup and the ar/en dictionaries
  theme/          light/dark/system theme provider
  types/          shared type definitions
  lib/            helpers
```

---

## Routes

Everything below `/` requires a session; `RequireAuth` redirects to the sign-in
page otherwise.

| Route | Page |
| --- | --- |
| `/` | Home |
| `/meals` · `/meals/add` · `/meals/edit/:id` · `/meals/:id` | Meals |
| `/categories-meal` | Meal categories |
| `/ingredient` | Ingredients |
| `/article` · `/articles/create` · `/articles/edit/:id` · `/article/:id` | Articles |
| `/categories` | Categories |
| `/units` | Units |
| `/machines` · `/machines/add` · `/machines/edit/:id` · `/machines/details/:id` | Machines |
| `/brands` | Brands |
| `/users` | Users and permissions |
| `/settings` | Settings |
| `/auth/login-admin` | Sign in |
