# Supabase Setup Guide for Custom Authentication

This guide will help you set up the custom authentication system using Supabase as your database.

## Step 1: Set up Supabase Database

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your project

2. **Run the SQL Migration**
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy and paste the entire contents of `custom-auth-setup.sql`
   - Click **Run** to execute the SQL

## Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Database (get this from your Supabase project settings)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Session-based authentication (no JWT required)

# Email (SendGrid - optional for email verification)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### How to get your DATABASE_URL:
1. Go to your Supabase project dashboard
2. Click on **Settings** → **Database**
3. Find the **Connection string** section
4. Copy the **URI** (it looks like: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`)
5. Replace `[password]` with your database password

## Step 3: Test the Setup

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test user registration:**
   - Go to `http://localhost:3000/auth/signup`
   - Create a new account
   - Check your email for verification (if SendGrid is configured)

3. **Test user login:**
   - Go to `http://localhost:3000/auth/signin`
   - Sign in with your credentials

## Database Schema Overview

### Tables Created:
- **`users`** - Main user accounts with custom authentication
- **`profiles`** - User profile information (backward compatibility)
- **`resumes`** - User resumes with content and ATS scores
- **`templates`** - Resume templates

### User Roles:
- **`user`** - Regular users (default)
- **`admin`** - Administrators with full access

### Security Features:
- **Row Level Security (RLS)** enabled on all tables
- **Session-based authentication** with 24-hour expiration
- **Password hashing** with bcrypt
- **Email verification** (optional with SendGrid)

## API Endpoints

### Authentication:
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login
- `GET /api/auth/verify` - Verify session
- `GET /api/auth/verify-email` - Email verification
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Resumes:
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/[id]` - Get specific resume
- `PUT /api/resumes/[id]` - Update resume
- `DELETE /api/resumes/[id]` - Delete resume

## Troubleshooting

### Common Issues:

1. **Database Connection Error:**
   - Verify your `DATABASE_URL` is correct
   - Check that your Supabase project is active
   - Ensure the database password is correct

2. **Session Issues:**
- Make sure database connection is working
   - Use a strong, unique secret for production

3. **Email Verification Not Working:**
   - Check your SendGrid API key
   - Verify the sender email is configured in SendGrid
   - Check SendGrid logs for delivery issues

4. **Permission Errors:**
   - Ensure RLS policies are properly set up
   - Check that the SQL migration ran successfully

### Getting Help:
- Check the browser console for errors
- Verify all environment variables are set
- Ensure the database tables were created correctly
- Check the Supabase logs for any database errors

## Production Deployment

When deploying to production:

1. **Update environment variables:**
   - Use production database URL
   - Ensure database is properly configured
   - Configure production email settings

2. **Security considerations:**
   - Use HTTPS in production
   - Set secure cookie settings
   - Configure proper CORS settings

3. **Database backups:**
   - Enable automatic backups in Supabase
   - Test your backup and restore procedures