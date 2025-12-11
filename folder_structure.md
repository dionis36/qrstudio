# Modular Folder Structure Blueprint

The project will use a Monorepo structure.

```text
/
├── apps/
│   ├── api/                    # Backend Microservice (Fastify)
│   │   ├── src/
│   │   │   ├── modules/        # Domain Modules
│   │   │   │   ├── qr/         # QR Gen logic (incl. Advanced Designer)
│   │   │   │   ├── templates/  # Template definitions (Menu, VCard)
│   │   │   │   ├── designer/   # Styling logic & Validation
│   │   │   │   ├── analytics/  # Stats aggregation
│   │   │   │   └── dynamic/    # Redirection logic
│   │   │   ├── common/         # Shared utils/types
│   │   │   ├── infra/          # DB, Redis, Storage adapters
│   │   │   ├── app.ts          # Entry point
│   │   │   └── routes.ts       # Main router
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web/                    # Frontend (Next.js)
│       ├── src/
│       │   ├── app/            # App Router
│       │   │   ├── (dashboard)/# Creator UI
│       │   │   │   ├── create/ # Wizard
│       │   │   │   └── my-qrs/ # Dashboard
│       │   │   └── m/          # Public Menu Pages (SSR)
│       │   │       └── [slug]/ # e.g. /m/la-piazza
│       │   ├── components/
│       │   │   ├── designer/   # QR Customization Widgets (Client)
│       │   │   ├── templates/  # Template Forms & Previews
│       │   ├── lib/            # API clients, utils
│       └── package.json
│
├── packages/                   # Shared libraries
│   ├── content-models/         # Zod schemas shared between FE/BE
│   └── ui-kit/                 # Shared React components
│
├── docker-compose.yml          # Local Dev Orchestration
├── .env.example
└── README.md
```

## Module Responsibilities

### `apps/api/src/modules/qr/`
-   Generates QR SVG string based on payload + content.
-   Handles "Advanced Designer" backend rendering (merging logo, gradients).

### `apps/api/src/modules/templates/`
-   **Menu**: `menu/schema.ts`, `menu/transformer.ts`
-   **vCard**: `vcard/schema.ts`, `vcard/vcard-gen.ts`

### `apps/web/src/app/m/[slug]/`
-   **Public Menu Page**: Server Component. Fetches payload from API (or Cache). Renders the "Menu" template view.
