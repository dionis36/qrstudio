# QR Studio - Quick Start Guide

## Prerequisites

1. **PostgreSQL** - Ensure PostgreSQL is running
   - Windows: Check Services or start via pgAdmin
   - Verify it's accessible on `localhost:5432`

2. **Node.js** - Version 20+ required
   - Check: `node --version`

3. **npm** - Version 10+ required
   - Check: `npm --version`

---

## 🚀 One-Command Setup & Start

### Step 1: Navigate to Project Root
```bash
cd c:\Users\DIO\Documents\PROJECT23\qrstudio
```

### Step 2: Install All Dependencies
```bash
npm install
```

**Expected Output:**
```
added X packages in Xs
```

### Step 3: Setup Database
```bash
# Navigate to API directory
cd apps/api

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Seed with test data
npx prisma db seed

# Return to root
cd ../..
```

**Expected Output:**
```
✔ Generated Prisma Client
✔ The migration has been created successfully
✔ Database seeded successfully
```

### Step 4: Start Both Servers (One Command!)
```bash
npm run dev
```

**Expected Output:**
```
• Packages in scope: api, web
• Running dev in 2 packages
• Remote caching disabled

api:dev: Server listening on port 3001
web:dev: ▲ Next.js 14.x.x
web:dev: - Local:        http://localhost:3000
web:dev: ✓ Ready in 2.5s
```

**Both servers are now running!** 🎉
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:3000

---

## ✅ Verify Everything Works

### Test 1: Check API Health
**Open New Terminal** (keep `npm run dev` running):
```bash
curl http://localhost:3001/
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "qr-studio-api"
}
```

### Test 2: Check Frontend
**Open Browser:**
- Navigate to: http://localhost:3000
- You should see the QR Studio dashboard

### Test 3: Create Test QR Code (Postman/cURL)
```bash
curl -X POST http://localhost:3001/api/qrcodes \
  -H "Content-Type: application/json" \
  -H "x-user-id: cltest123456789" \
  -d "{\"type\":\"url\",\"name\":\"Test QR\",\"payload\":{\"url\":\"https://example.com\"},\"design\":{}}"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "shortcode": "aB3xY9Zk",
    "type": "url",
    "name": "Test QR",
    ...
  }
}
```

---

## 📋 Common Commands

### Development
```bash
# Start both frontend & backend (from root)
npm run dev

# Start only backend
npm run dev --workspace=api

# Start only frontend
npm run dev --workspace=web
```

### Database Management
```bash
# View database in browser (from apps/api)
cd apps/api
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name your_migration_name

# Generate Prisma client
npx prisma generate
```

### Build & Production
```bash
# Build frontend for production
npm run build

# Start production server
npm run start
```

---

## 🔧 Troubleshooting

### Issue: `npm run dev` fails with Turbo error
**Solution:**
```bash
# Clear Turbo cache
npx turbo clean

# Reinstall dependencies
npm install

# Try again
npm run dev
```

### Issue: API fails with CORS error
**Solution:**
```bash
# Update CORS dependency
npm install @fastify/cors@latest --workspace=api

# Restart servers
npm run dev
```

### Issue: Database connection fails
**Check:**
1. PostgreSQL is running (Windows Services)
2. `apps/api/.env` exists with correct `DATABASE_URL`:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/qrstudio_db"
   ```
3. Test connection:
   ```bash
   cd apps/api
   npx prisma db pull
   ```

### Issue: Port already in use
**Solution:**
```bash
# Kill process on port 3001 (API)
npx kill-port 3001

# Kill process on port 3000 (Frontend)
npx kill-port 3000

# Restart
npm run dev
```

### Issue: Prisma client not generated
**Solution:**
```bash
cd apps/api
npx prisma generate
cd ../..
npm run dev
```

### Issue: Frontend can't connect to API
**Check:**
1. `apps/web/.env.local` exists with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```
2. API is running on port 3001
3. CORS is configured in `apps/api/src/app.ts`

---

## 📁 Project Structure

```
qrstudio/
├── apps/
│   ├── api/                    # Backend (Fastify + Prisma)
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   ├── migrations/     # Database migrations
│   │   │   └── seed.ts         # Test data
│   │   ├── src/
│   │   │   ├── routes/         # API endpoints
│   │   │   ├── services/       # Business logic
│   │   │   ├── middleware/     # Auth, etc.
│   │   │   └── app.ts          # Fastify app
│   │   └── .env                # API environment variables
│   │
│   └── web/                    # Frontend (Next.js)
│       ├── src/
│       │   ├── app/            # Pages (App Router)
│       │   ├── components/     # React components
│       │   └── lib/            # Utilities, API client
│       └── .env.local          # Frontend environment variables
│
├── package.json                # Root package.json (workspaces)
├── turbo.json                  # Turbo configuration
└── README.md                   # This file
```

---

## 🎯 Development Workflow

### 1. Start Development
```bash
npm run dev
```

### 2. Make Changes
- Edit files in `apps/api/src/` or `apps/web/src/`
- Changes auto-reload (hot reload enabled)

### 3. Database Changes
```bash
cd apps/api

# Edit prisma/schema.prisma
# Then create migration:
npx prisma migrate dev --name add_new_field

cd ../..
```

### 4. Test Changes
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Database: `npx prisma studio` (in apps/api)

---

## 📚 Documentation

Located in `.gemini/antigravity/brain/9e2f1294-4420-4f4c-8b0f-5074526de34c/`:

- **Implementation Plan**: `implementation_plan.md`
- **Walkthrough**: `walkthrough.md`
- **Test Plan**: `test.md`
- **Task Checklist**: `task.md`

---

## 🧪 Testing

See `test.md` for comprehensive testing guide.

**Quick Test:**
```bash
# 1. Start servers
npm run dev

# 2. In new terminal, test API
curl http://localhost:3001/api/dashboard/stats \
  -H "x-user-id: cltest123456789"

# 3. Open browser
# Navigate to http://localhost:3000
```

---

## 🚀 Deployment

### Backend (API)
1. Set production `DATABASE_URL` in environment
2. Run migrations: `npx prisma migrate deploy`
3. Start: `npm run start --workspace=api`

### Frontend (Web)
1. Build: `npm run build --workspace=web`
2. Start: `npm run start --workspace=web`

---

## 📝 Environment Variables

### `apps/api/.env`
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
AUTH_HEADER_NAME=x-user-id
```

### `apps/web/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🎉 Success!

If you see:
- ✅ API running on port 3001
- ✅ Frontend running on port 3000
- ✅ Dashboard loads in browser
- ✅ Can create QR codes

**You're ready to develop! Happy coding! 🚀**

---

## 💡 Tips

- **Turbo runs both servers in parallel** - One command starts everything!
- **Hot reload enabled** - Changes reflect immediately
- **Prisma Studio** - Visual database editor (`npx prisma studio`)
- **API logs** - Watch the terminal for API requests
- **Frontend logs** - Check browser console for errors

---

## 🆘 Need Help?

1. Check `test.md` for detailed testing procedures
2. Review `walkthrough.md` for implementation details
3. Check `implementation_plan.md` for architecture overview
4. Verify all environment variables are set correctly
5. Ensure PostgreSQL is running and accessible

---

**Built with ❤️ using Next.js, Fastify, Prisma, and PostgreSQL**
