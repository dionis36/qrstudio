# QR Studio - Detailed Project Roadmap & Procedure

This document outlines the step-by-step procedure to build the QR Studio microservice from scratch. Follow these steps sequentially.

## Prerequisites
-   [ ] **Node.js** (v18+ recommended) installed.
-   [ ] **Docker** & **Docker Compose** installed and running.
-   [ ] **VS Code** with relevant extensions (ESLint, Prettier, Prisma).

---

## Phase 1: Foundation (Sprint 0)
**Goal**: Initialize the Monorepo, Setup Infrastructure (Docker), and Basic Backend/Frontend Skeletons.

### Step 1.1: Project Initialization
1.  Open terminal in `c:\Users\DIO\Documents\PROJECT23\qrstudio`.
2.  Initialize root package.json:
    ```bash
    npm init -y
    ```
3.  Create directory structure:
    ```bash
    mkdir apps packages
    mkdir apps\api apps\web
    mkdir packages\common
    ```

### Step 1.2: Infrastructure Setup (Docker)
1.  Create `docker-compose.yml` in the root (see `architecture.md` for recommendations).
2.  Configuration:
    -   **Postgres**: Port 5432, User/Pass `postgres`/`postgres`, DB `qrstudio`.
    -   **Redis**: Port 6379.
    -   **Adminer** (Optional): Port 8080.
3.  Start infrastructure:
    ```bash
    docker-compose up -d
    ```

### Step 1.3: Backend Setup (Fastify)
1.  Navigate to `apps/api`.
2.  Initialize:
    ```bash
    cd apps/api
    npm init -y
    npm install fastify fastify-plugin @fastify/cors dotenv zod
    npm install -D typescript @types/node ts-node prisma
    ```
3.  Initialize TypeScript:
    ```bash
    npx tsc --init
    ```
4.  Initialize Prisma:
    ```bash
    npx prisma init
    ```
5.  **Action**: Copy the schema from `database_schema.md` into `apps/api/prisma/schema.prisma`.
6.  Run migration:
    ```bash
    npx prisma migrate dev --name init
    ```

### Step 1.4: Frontend Setup (Next.js)
1.  Navigate to `apps/web`.
2.  Initialize Next.js app:
    ```bash
    cd ../web
    npx create-next-app@latest . --typescript --tailwind --eslint
    ```
    *(Select Defaults: Yes to App Router, No to Src dir if preferred, etc. - Recommended: Yes to `src/` directory)*

---

## Phase 2: Core Mechanics (Sprint 1)
**Goal**: QR Generation, Short-codes, & Redirection logic.

### Step 2.1: QR Generation Module
1.  In `apps/api/src/modules/qr`:
    -   Install `qrcode` library: `npm install qrcode`.
    -   Create service to generate SVG strings from text.

### Step 2.2: Short-Code Logic
1.  In `apps/api/src/modules/dynamic`:
    -   Implement `Base62` encoder/decoder.
    -   Create `POST /api/qrcodes` endpoint:
        -   Validate payload.
        -   Insert into DB.
        -   Generate Short-code.
        -   Return `short_code`.
2.  Implement `GET /d/:code` endpoint:
    -   Lookup code in Redis -> DB.
    -   Wait for DB Lookup.
    -   Reply `302 Found` with `Location` header.

### Step 2.3: Frontend Creator UI
1.  Create `apps/web/src/app/(dashboard)/create/page.tsx`.
2.  Build a simple form:
    -   Input: Destination URL.
    -   Button: "Generate".
    -   Result: Show the Short URL and the QR Image.

---

## Phase 3: Advanced Templates (Sprint 2)
**Goal**: Menu & vCard Implementation.

### Step 3.1: Menu Template Backend
1.  Create `apps/api/src/modules/templates/menu`.
2.  Define Zod Schema for Menu (Restaurant Info, Categories, Items).
3.  Update `POST /api/qrcodes` to accept `type: 'menu'` and validate against this schema.

### Step 3.2: Public Menu Page
1.  In `apps/web`, create route `src/app/m/[slug]/page.tsx`.
2.  Fetch Menu Data from API using the slug.
3.  Render a beautiful mobile-first Menu View.

---

## Phase 4: Designer & Analytics (Sprint 3)
**Goal**: Visual Customization & Tracking.

### Step 4.1: Designer Logic
1.  Add `logo` support to QR generation.
2.  Allow changing colors (`fgColor`, `bgColor`) in the API payload.

### Step 4.2: Scans Analytics
1.  In `GET /d/:code`, add non-blocking logging:
    -   Capture IP, User-Agent.
    -   Push to Redis List `scan_logs`.
2.  Create a background worker (or simple interval) to pop logs and batch insert into `scans` table.

---

## Next Steps
-   [ ] Validate file paths in `folder_structure.md`.
-   [ ] Begin **Phase 1, Step 1.1**.
