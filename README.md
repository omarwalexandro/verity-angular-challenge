# Angular Challenge — Multi-Step Profile Registration

A production-grade Angular SPA demonstrating modern best practices: **Signals-based state management**, **reactive form handling**, **HTTP interceptor pipelines**, **runtime schema validation**, and **route-level access control** — all built with the latest Angular 22 APIs.

---

## ✨ Features

- **Multi-step profile form** — Personal → Residential → Professional → Review → Feedback
- **Create & Edit flows** — a single route (`/profile/:id`) handles both new profiles and loading existing ones via `httpResource`
- **CEP auto-fill** — integrates with the public [ViaCEP](https://viacep.com.br/) API to auto-populate address fields on ZIP code blur
- **Step guard** — `CanActivateFn` prevents users from skipping steps; redirects to the highest accessible step
- **PDF export** — one-click export of the full profile summary using jsPDF
- **Runtime schema validation** — every API request/response is validated against [Valibot](https://valibot.dev/) schemas via a global HTTP interceptor
- **Global error handling** — a second interceptor classifies errors by severity, retries retriable `GET` failures with exponential back-off, and surfaces user-facing messages
- **Responsive UI** — built with TailwindCSS v4, fluid from mobile to desktop

---

## 🏗️ Architecture

```
src/app/
├── core/
│   ├── interceptors/
│   │   ├── error/          # Retry logic + error classification
│   │   └── validation/     # Valibot schema validation for all HTTP traffic
│   └── services/           # ProfileApiService, CepService, ProfessionApiService, StateApiService
│
├── feat/
│   ├── home/               # Landing page
│   └── profile/
│       ├── personal/       # Step 1 — Personal data
│       ├── residential/    # Step 2 — Address + ViaCEP integration
│       ├── professional/   # Step 3 — Occupation & salary
│       ├── review/         # Step 4 — Read-only summary + PDF export
│       ├── feedback/       # Post-save confirmation page
│       ├── profile.store.ts    # NgRx SignalStore (global profile state)
│       ├── profile.service.ts  # Step validity service (scoped to the route)
│       └── step.guard.ts       # Functional route guard
│
└── shared/
    ├── directives/         # MaskDirective (CPF, phone, CEP, currency masking)
    ├── models/             # Valibot schemas + inferred TypeScript types
    ├── ui/                 # Stepper, Header, and other reusable components
    └── utils/              # camelCase transformer, validation helpers
```

### State management

| Layer | Tool | Scope |
|---|---|---|
| Global profile data | `@ngrx/signals` `signalStore` | Route-level (`providers: [ProfileStore]`) |
| Step validity | Plain `Injectable` + `signal` | Route-level (`providers: [ProfileService]`) |
| Server state / data fetching | Angular `httpResource` | Component-level |

Both `ProfileStore` and `ProfileService` are provided at the **route level** (not `root`), so their state is automatically destroyed when the user navigates away.

### HTTP Interceptor pipeline

```
Request  → [validationInterceptor] → [errorInterceptor] → Backend
Response ← [errorInterceptor]      ← [validationInterceptor] ←
```

- **`validationInterceptor`** — reads `OUTGOING_SCHEMA` / `INCOMING_SCHEMA` from the `HttpContext` and runs `valibot.safeParse` before sending or after receiving. Throws a typed `HttpErrorResponse` (400 / 422) on failure.
- **`errorInterceptor`** — retries `GET` requests on `0 / 502 / 503 / 504` with a `retryCount × 500 ms` delay (max 2 retries). Classifies remaining errors as `warn` or `error` by status code.

---

## 🛠️ Tech Stack

| Concern | Library | Version |
|---|---|---|
| Framework | Angular | 22.x |
| State management | `@ngrx/signals` | 21.x |
| NGRx DevTools | `@angular-architects/ngrx-toolkit` | 21.x |
| Schema validation | Valibot | 1.x |
| Styling | TailwindCSS | 4.x |
| PDF generation | jsPDF | 4.x |
| Mock API | json-server | 1.0 beta |
| Test runner | Vitest | 4.x |
| Language | TypeScript | 6.x |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 11+

### Install

```bash
npm install
```

### Run

Starts both the Angular dev server and the json-server mock API concurrently:

```bash
npm start
```

| Service | URL |
|---|---|
| Angular app | http://localhost:4200 |
| Mock REST API | http://localhost:3000 |

### API Endpoints (json-server)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/profiles` | List all profiles |
| `GET` | `/profiles/:id` | Get a single profile |
| `POST` | `/profiles` | Create a new profile |
| `PUT` | `/profiles/:id` | Update a profile |
| `GET` | `/professions` | List available professions |
| `GET` | `/states` | List Brazilian states |

---

## 🧪 Testing

```bash
npm test
```

**156 tests across 17 test files** — zero failures.

Coverage includes:

- All four profile form steps (personal, residential, professional, review)
- `ProfileStore` state transitions (initial state, updates, reset, load)
- `ProfileService` step-validity logic (`submittedUpTo`, `allStepsValid`)
- `stepGuard` — all access-control paths including redirect logic
- `MaskDirective` — all mask types (CPF, phone, CEP, currency)
- HTTP services (`ProfileApiService`, `CepService`, `ProfessionApiService`)
- Error interceptor retry behaviour
- The `Stepper` UI component
- Utility functions (camelCase transformer, validation helpers)

---

## 📐 Key Design Decisions

### Signals-first forms

Forms use `@angular/forms/signals` (`form()`, `FormField`) instead of `ReactiveFormsModule`. Each step component owns a local `signal<Model>` that is synced to the global `ProfileStore` on `blur` — keeping the store as the single source of truth while avoiding unnecessary re-renders on every keystroke.

### Route-level provider isolation

`ProfileStore` and `ProfileService` are declared in `providers` on the `/profile/:id` route definition. This means every navigation to a profile URL gets a **fresh, isolated instance** — no state bleed between sessions.

### Valibot schemas as the single type source

All TypeScript types (`ProfileModel`, `CreateProfileDto`, `ResidentialModel`, etc.) are **derived from Valibot schemas** via `InferOutput<>`. The same schema objects are passed to the HTTP interceptor via `HttpContext`, so there is no duplication between runtime validation and static types.

### Functional interceptors & guards

Both interceptors and the step guard are written as **plain functions** — no classes, no decorators. This makes them trivially tree-shakeable and easy to test in isolation.

---

## 📁 Running the Mock API Standalone

```bash
npm run json-server
```

The API data lives in `db.json` at the project root. json-server watches for file changes and hot-reloads automatically.
