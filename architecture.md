# Project Architecture & Design Decisions

## 1. High-Level Architecture
The system follows a **Modular Monolith** architecture, designed to be split into microservices later if needed.

### Components
1.  **Frontend (Next.js 14)**:
    -   **Creator UI**: For designing and managing QR codes.
    -   **Public Pages (`/m/:slug`)**: Server-Side Rendered (SSR) pages for Menu and vCard display.
    -   **Tech**: React 18, TypeScript, Tailwind CSS.

2.  **Backend API (Fastify)**:
    -   **API Layer**: RESTful endpoints for QR management, templates, and analytics.
    -   **Service Modules**: Isolated modules for `qr-core`, `templates`, `designer`, `analytics`.
    -   **Tech**: Node.js 20, TypeScript, Prisma ORM.

3.  **Data Persistence**:
    -   **Primary DB**: PostgreSQL (Relational data: Users, Projects, QRCodes, Scans).
    -   **Cache/Queue**: Redis (Short-code caching, analytics event queue).
    -   **Object Storage**: Local Filesystem (Dev) / S3 Interface (Prod).

## 2. Key Design Decisions

### Privacy & Analytics
-   **Decision**: **Privacy-First**.
-   **Implementation**: IP addresses will be **anonymized** by masking the last octet (e.g., `192.168.1.xxx`) before storage.
-   **Data**: We store Country, City, Device Type, OS, Browser, and Referrer.
-   **Retention**: 12 Months default policy.

### Infrastructure & Hosting
-   **Decision**: **Docker utilizing Docker Compose**.
-   **Dev Environment**: Windows 11 compatible (WSL2 recommended).
-   **Production**: Docker-based deployment (stateless containers).
-   **Storage**: Abstracted via `IStorageAdapter`. Local filesystem for dev, S3 for production.

### Short-Code Strategy
-   **Decision**: **Base62 Short Strings** (e.g., `Ab3Xz`).
-   **Algorithm**: Database ID (Counter/Sequence) -> Base62 Encoding.
-   **Format**: `domain.com/d/Ab3Xz` (redirect) or `domain.com/m/Ab3Xz` (direct public page).

### Advanced Designer
-   **Decision**: **Included in MVP**.
-   **Features**: Gradients (Linear/Radial), Custom Eye Shapes, Module Shapes (Dots, Rounded), Custom Logos, Frames.
-   **Implementation**: Server-side generation via `node-qrcode` + Custom SVG manipulation. Client-side preview via `react-qrcode-logo` or mapped SVG rendering.

## 3. Technology Stack

| Layer | Technology | Status |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, React 18, TypeScript | **Selected** |
| **Styling** | Tailwind CSS v3, clsx, tailwind-merge | **Selected** |
| **Backend** | Fastify (Node.js 20), TypeScript | **Selected** |
| **Database** | PostgreSQL | **Selected** |
| **ORM** | Prisma | **Selected** |
| **Cache/Queue** | Redis | **Selected** |
| **QR Engine** | node-qrcode (server) + Custom SVG Logic | **Selected** |
| **Validation** | Zod | **Selected** |
