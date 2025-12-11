# QR Studio - Authentication Architecture

## 🔑 Dev User Credentials

**For Development & Testing:**

```
User ID:  cltest123456789
Email:    dev@qrstudio.local
Name:     Dev User
Plan:     Free (10 QR codes, 1000 scans)
```

This user is **already created in the database** and ready to use!

---

## 🎯 Current Setup (Development)

### Overview
QR Studio is designed as a **microservice** that will be integrated into a larger application ecosystem. Authentication is handled by a **parent service**, not by QR Studio itself.

### How It Works Now

#### 1. **Frontend (Dev Mode)**
**File:** `apps/web/src/lib/api-client.ts`

```typescript
// Hardcoded dev user ID
const DEV_USER_ID = 'cltest123456789';

function getHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        'x-user-id': DEV_USER_ID, // Sent with every request
    };
}
```

**What happens:**
- Every API request includes `x-user-id: cltest123456789` header
- This simulates what the parent service will do in production

#### 2. **Backend (Auth Middleware)**
**File:** `apps/api/src/middleware/auth.ts`

```typescript
export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const userId = request.headers['x-user-id'] as string;

    if (!userId) {
        return reply.status(401).send({
            success: false,
            error: 'Authentication required'
        });
    }

    // Attach userId to request for use in routes
    (request as any).userId = userId;
}
```

**What happens:**
- Extracts `x-user-id` from request headers
- Validates it exists
- Attaches it to the request object
- Routes can access `request.userId`

#### 3. **Database User**
The dev user exists in the database:

```sql
User {
  id: 'cltest123456789'
  email: 'dev@qrstudio.local'
  name: 'Dev User'
}

Subscription {
  userId: 'cltest123456789'
  plan: 'free'
  qrLimit: 10
  scanLimit: 1000
}
```

---

## 🚀 Production Setup (Future)

### Architecture

```
┌─────────────────┐
│  Parent Service │  (Handles Auth)
│  (Main App)     │
└────────┬────────┘
         │
         │ Authenticated Request
         │ Headers: x-user-id: real_user_123
         │
         ▼
┌─────────────────┐
│   API Gateway   │  (Optional)
│   or Proxy      │
└────────┬────────┘
         │
         │ Forwards: x-user-id: real_user_123
         │
         ▼
┌─────────────────┐
│   QR Studio     │  (This Microservice)
│   Backend API   │
└─────────────────┘
```

### Integration Flow

#### Step 1: Parent Service Authentication
The parent service handles:
- User login/signup
- Session management
- JWT tokens
- OAuth/SSO
- Password management

#### Step 2: Parent Service Sends User ID
When making requests to QR Studio:

```javascript
// Parent service code (example)
async function callQrStudio(userId, endpoint, data) {
    const response = await fetch(`https://qrstudio-api.com${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,  // ← Parent sends this
            'Authorization': `Bearer ${parentToken}` // Optional
        },
        body: JSON.stringify(data)
    });
    return response.json();
}
```

#### Step 3: QR Studio Validates
QR Studio's auth middleware:
1. Extracts `x-user-id` from headers
2. Validates user exists in database
3. Proceeds with request

---

## 🔧 Configuration

### Environment Variables

**`apps/api/.env`**
```env
# Auth configuration
AUTH_HEADER_NAME=x-user-id

# In production, you might add:
# PARENT_SERVICE_API_KEY=secret_key_here
# ALLOWED_PARENT_ORIGINS=https://parent-app.com
```

### CORS Setup
**File:** `apps/api/src/app.ts`

```typescript
app.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
});
```

**Production:**
```env
ALLOWED_ORIGINS=https://parent-app.com,https://admin.parent-app.com
```

---

## 📋 Development Workflow

### For Testing Now

1. **Dev user is created in database** (`cltest123456789`)
2. **Frontend sends this user ID** with every request
3. **Backend accepts it** and creates QR codes for this user

### Creating Additional Test Users

```bash
# Run this SQL in Prisma Studio or via Prisma CLI
npx prisma db execute --stdin
```

Then paste:
```sql
INSERT INTO "User" (id, email, name, "createdAt", "updatedAt") 
VALUES ('test-user-2', 'test2@qrstudio.local', 'Test User 2', NOW(), NOW());

INSERT INTO "Subscription" (id, "userId", plan, status, "qrLimit", "scanLimit", "currentQrCount", "currentScanCount", "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'test-user-2', 'free', 'active', 10, 1000, 0, 0, NOW(), NOW());
```

Then update frontend:
```typescript
// In apps/web/src/lib/api-client.ts
const DEV_USER_ID = 'test-user-2'; // Change to test different users
```

---

## 🔐 Future Auth Enhancements

### Option 1: Shared Secret Validation
Add validation that requests come from trusted parent service:

```typescript
// apps/api/src/middleware/auth.ts
export async function authMiddleware(request, reply) {
    const userId = request.headers['x-user-id'];
    const apiKey = request.headers['x-api-key'];

    // Validate request is from parent service
    if (apiKey !== process.env.PARENT_SERVICE_API_KEY) {
        return reply.status(403).send({ error: 'Forbidden' });
    }

    // Validate user exists
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        return reply.status(401).send({ error: 'User not found' });
    }

    request.userId = userId;
}
```

### Option 2: JWT Validation
If parent service uses JWTs:

```typescript
import jwt from 'jsonwebtoken';

export async function authMiddleware(request, reply) {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.userId = decoded.userId;
    } catch (error) {
        return reply.status(401).send({ error: 'Invalid token' });
    }
}
```

### Option 3: User Sync Webhook
Parent service notifies QR Studio when users are created:

```typescript
// New endpoint: POST /api/users/sync
app.post('/api/users/sync', async (request, reply) => {
    const { userId, email, name } = request.body;
    
    // Validate request is from parent service
    if (request.headers['x-api-key'] !== process.env.PARENT_SERVICE_API_KEY) {
        return reply.status(403).send({ error: 'Forbidden' });
    }

    // Create or update user
    await prisma.user.upsert({
        where: { id: userId },
        create: { id: userId, email, name },
        update: { email, name }
    });

    return { success: true };
});
```

---

## 🎯 Integration Checklist (For Production)

### Parent Service Team Must:
- [ ] Send `x-user-id` header with every request to QR Studio
- [ ] Ensure user IDs are unique and consistent
- [ ] Create users in QR Studio database (via sync endpoint or manual)
- [ ] Handle all authentication (login, logout, sessions)
- [ ] Set CORS origins correctly

### QR Studio Team Must:
- [ ] Deploy API with correct `ALLOWED_ORIGINS`
- [ ] Set up user sync endpoint (if needed)
- [ ] Configure `AUTH_HEADER_NAME` if different
- [ ] Add API key validation (if needed)
- [ ] Monitor for unauthorized access

---

## 📝 Testing Different Scenarios

### Test 1: Valid User
```bash
curl -X POST http://localhost:3001/api/qrcodes \
  -H "Content-Type: application/json" \
  -H "x-user-id: cltest123456789" \
  -d '{"type":"url","name":"Test","payload":{"url":"https://example.com"},"design":{}}'
```
**Expected:** ✅ QR code created

### Test 2: Invalid User
```bash
curl -X POST http://localhost:3001/api/qrcodes \
  -H "Content-Type: application/json" \
  -H "x-user-id: nonexistent-user" \
  -d '{"type":"url","name":"Test","payload":{"url":"https://example.com"},"design":{}}'
```
**Expected:** ❌ Foreign key constraint error

### Test 3: Missing User ID
```bash
curl -X POST http://localhost:3001/api/qrcodes \
  -H "Content-Type: application/json" \
  -d '{"type":"url","name":"Test","payload":{"url":"https://example.com"},"design":{}}'
```
**Expected:** ❌ 401 Unauthorized

---

## 🚦 Current Status

✅ **Working:**
- Auth middleware extracts user ID from headers
- Routes use `request.userId` to scope data
- Dev user exists in database (`cltest123456789`)
- Frontend sends correct headers
- Ready for testing!

✅ **Ready for Production:**
- Microservice architecture
- Header-based auth
- User isolation (each user sees only their QR codes)
- CORS configuration

⏳ **Future Enhancements:**
- API key validation
- User sync endpoint
- JWT support (if needed)
- Rate limiting per user

---

## 💡 Key Takeaways

1. **QR Studio doesn't handle auth** - It trusts the parent service
2. **User ID comes from headers** - Set by parent service (`x-user-id`)
3. **Dev mode uses hardcoded ID** - `cltest123456789` for testing
4. **Production requires user sync** - Parent must create users in QR Studio DB
5. **Microservice design** - Clean separation of concerns

---

## 🎉 You're Ready!

The dev user is created and the system is ready for testing:

```
✅ User ID:  cltest123456789
✅ Email:    dev@qrstudio.local
✅ Backend:  http://localhost:3001
✅ Frontend: http://localhost:3000
```

**Start creating QR codes!** 🚀
