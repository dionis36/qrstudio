# API Specification

All API endpoints are prefixed with `/api`.
Response Format: `{ success: boolean, data: any, error?: { code: string, message: string } }`

## 1. QR Codes Management

| Method | Endpoint | Description | Payload (Body) | Response |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/qrcodes` | Create a new QR Code | `{ type, is_dynamic, payload, design, project_id }` | `{ id, short_code, preview_url }` |
| **GET** | `/qrcodes/:id` | Get details of a QR Code | - | `{ id, type, payload, design, stats_summary }` |
| **PUT** | `/qrcodes/:id` | Update QR Code | `{ payload?, design? }` | `{ id, updated_at, preview_url }` |
| **DELETE** | `/qrcodes/:id` | Delete a QR Code | - | `{ success: true }` |
| **GET** | `/qrcodes` | List project QR Codes | `?project_id=...&page=1` | `[ { id, name, type, ... } ]` |

### Design Payload Example
```json
"design": {
  "dots": { "style": "rounded", "color": "#000000" },
  "background": "#ffffff",
  "corners": { "style": "extra-rounded" },
  "logo": { "asset_id": "uuid", "scale": 0.2 }
}
```

## 2. Redirection & Public Access

| Method | Endpoint | Description | Query Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/d/:code` | Handle Short-code Redirect | `?utm_source=...` | **302 Redirect** -> Target URL |

### Frontend Routes (Not API)
-   **GET** `/m/:slug`: Public Menu Page (SSR). Renders the menu content for the scanned QR code.

## 3. Analytics

| Method | Endpoint | Description | Response |
| :--- | :--- | :--- | :--- |
| **GET** | `/qrcodes/:id/analytics` | Get aggregated stats | `{ total_scans, unique_scans, top_locations }` |
| **GET** | `/qrcodes/:id/scans` | Get time-series data | `[ { date: '2023-01-01', count: 50 }, ... ]` |

## 4. Assets (Uploads)

| Method | Endpoint | Description | Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/assets` | Upload Image/File | `Multipart/Form-Data` | `{ id, url, filename }` |
