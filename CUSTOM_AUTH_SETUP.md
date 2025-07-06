# Custom Authentication Setup Guide

This guide will help you set up the custom authentication system that replaces Supabase authentication.

## Database Setup

1. **Run the database migration**:
   ```sql
   -- Copy and paste the contents of custom-auth-setup.sql into your PostgreSQL database
   ```

2. **Environment Variables**:
   Add these to your `.env.local` file:
   ```env
   # Database
   DATABASE_URL=your_postgresql_connection_string

   # Session-based authentication (no JWT required)

   # Email (SendGrid)
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com

   # App URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

## Features

### ✅ What's Implemented

1. **Custom User Registration**
   - Email/password registration
   - Email verification with SendGrid
   - Password hashing with bcrypt
   - Role-based user system (user, admin, moderator)

2. **Custom User Authentication**
   - Session-based authentication
   - Token verification middleware
   - Protected routes
   - Session management with HTTP-only cookies

3. **Security Features**
   - Password hashing
   - Session expiration (24 hours)
   - Email verification required for login
   - Account status checking

4. **Database Schema**
   - `users` table with all necessary fields
   - `profiles` table for backward compatibility
   - `resumes` and `templates` tables
   - Proper indexes for performance

### 🔧 API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/verify` - Token verification
- `GET /api/auth/verify-email` - Email verification

### 🛡️ Protected Routes

The following routes require authentication:
- `/dashboard`
- `/profile`
- `/resume/*`
- `/admin/*`

## Migration from Supabase

### Removed Dependencies
- `@supabase/supabase-js`
- `@supabase/auth-helpers-nextjs`
- `@supabase/auth-ui-react`
- `@supabase/auth-ui-shared`
- `@supabase/ssr`

### Added Dependencies
- `jsonwebtoken`
- `@types/jsonwebtoken`

### Files Changed
1. **Authentication Context** (`src/contexts/AuthContext.tsx`)
   - Removed Supabase dependencies
   - Added custom session management
   - Added signIn/signUp methods

2. **Components**
   - `CustomSignIn.tsx` - Updated to use custom auth
   - `CustomSignUp.tsx` - Updated to use custom auth

3. **Pages**
   - `signin/page.tsx` - Removed OAuth buttons
   - `signup/page.tsx` - Simplified interface

4. **API Routes**
   - New `/api/auth/` routes for custom authentication
   - Removed old Supabase-dependent routes

## Usage

### Registration Flow
1. User fills out registration form
2. Account is created with `is_verified = false`
3. Verification email is sent via SendGrid
4. User clicks verification link
5. Account is marked as verified
6. User can now log in

### Login Flow
1. User enters email/password
2. Credentials are verified against database
3. Session is created and cookie is set
4. Session cookie is automatically set
5. User is redirected to dashboard

### Authentication Check
1. Middleware checks for session cookie on protected routes
2. Token is verified on each request
3. User data is fetched from database
4. Access is granted/denied accordingly

## Security Considerations

1. **Database**: Ensure database connection is working
2. **Password Hashing**: Passwords are hashed with bcrypt (salt rounds: 10)
3. **Session Expiration**: Sessions expire after 24 hours
4. **Email Verification**: Required before login
5. **Account Status**: Users can be suspended/activated

## Production Deployment

1. **Environment Variables**: Set all required environment variables
2. **Database**: Use a production PostgreSQL database
3. **Database**: Ensure database is properly configured
4. **SendGrid**: Configure SendGrid for email delivery
5. **HTTPS**: Ensure your app runs over HTTPS in production

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure `DATABASE_URL` is correct
2. **Database**: Make sure database connection is working
3. **Email Verification**: Check SendGrid configuration
4. **Session Cookies**: Verify cookies are enabled in browser

### Debug Mode

Add this to your `.env.local` for debugging:
```env
NODE_ENV=development
```

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure database tables are created correctly
4. Check SendGrid email delivery logs