# Quick Setup Guide - Resume Maker Authentication

## Step 1: Create Environment File

Create a `.env.local` file in your project root with this content:

```env
# Session-based authentication (no JWT required)
# Session-based authentication (no JWT required)

# App URL (required)
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Turso Database (optional for now - will use fallback)
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# SendGrid Email (optional - signup will work without it)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-email@domain.com
```

## Step 2: Test Your Setup

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test session functionality**:
   Visit: `http://localhost:3001/api/auth/test-jwt`

3. **Test environment variables**:
   Visit: `http://localhost:3001/api/debug-env`

## Step 3: Test Authentication

### Test Signup (Simple version):
```bash
curl -X POST http://localhost:3001/api/auth/signup-simple \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### Test Signin:
```bash
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Step 4: What's Fixed

✅ **SendGrid errors won't break signup** - Email sending is now optional
✅ **Unverified users can sign in** - If SendGrid is not configured
✅ **Better error messages** - More detailed error information
✅ **Graceful fallbacks** - System works without all environment variables

## Step 5: Database Setup (Optional)

If you want to use Turso database:

1. Install Turso CLI
2. Create database: `turso db create resume-maker`
3. Get credentials: `turso db show resume-maker`
4. Run schema: `turso db shell resume-maker < turso-schema.sql`
5. Update `.env.local` with your Turso credentials

## Step 6: Email Setup (Optional)

If you want email verification:

1. Sign up for SendGrid
2. Get API key and verify sender email
3. Update `.env.local` with SendGrid credentials

## Current Status

- ✅ Session authentication working
- ✅ User registration working
- ✅ User login working
- ✅ Email verification optional
- ✅ Database connection optional
- ✅ Error handling improved

The system will work with just the database configuration and NEXT_PUBLIC_APP_URL set!