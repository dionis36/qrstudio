-- Create dev user for testing
INSERT INTO "User" (id, email, name, "createdAt", "updatedAt") 
VALUES ('cltest123456789', 'dev@qrstudio.local', 'Dev User', NOW(), NOW()) 
ON CONFLICT (id) DO NOTHING;

-- Create subscription for dev user (matching actual schema)
INSERT INTO "Subscription" (id, "userId", plan, status, "qrLimit", "createdAt", "updatedAt") 
VALUES (gen_random_uuid()::text, 'cltest123456789', 'free', 'active', 10, NOW(), NOW()) 
ON CONFLICT ("userId") DO NOTHING;
