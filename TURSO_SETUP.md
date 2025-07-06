# Turso Setup Guide for Resume Maker

This guide will help you migrate from Supabase to Turso for authentication and database.

## Prerequisites

1. Install Turso CLI:
   ```bash
   # macOS
   brew install tursodatabase/tap/turso

   # Windows (using winget)
   winget install tursodatabase.turso

   # Linux
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. Sign up for a Turso account at https://turso.tech

## Step 1: Install Dependencies

The required dependencies have already been installed:
- `@libsql/client` - Turso database client

## Step 2: Create Turso Database

1. Login to Turso:
   ```bash
   turso auth login
   ```

2. Create a new database:
   ```bash
   turso db create resume-maker
   ```

3. Get your database URL and auth token:
   ```bash
   turso db show resume-maker
   turso db tokens create resume-maker
   ```

## Step 3: Set Up Environment Variables

Create or update your `.env.local` file:

```env
# Turso Database
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Session-based authentication (no JWT required)

# SendGrid for email verification
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-verified-sender@yourdomain.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Initialize Database Schema

1. Run the schema file in your Turso database:
   ```bash
   turso db shell resume-maker < turso-schema.sql
   ```

   Or copy and paste the contents of `turso-schema.sql` into the Turso web console.

## Step 5: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/auth/signup` and create a new account

3. Check your email for verification link

4. Sign in with your credentials

## Step 6: Verify Database

You can check your database using the Turso CLI:

```bash
# Connect to database shell
turso db shell resume-maker

# List tables
.tables

# Check users table
SELECT * FROM users;

# Check profiles table
SELECT * FROM profiles;

# Exit shell
.quit
```

## Database Schema Overview

The Turso database includes these tables:

### Users Table
- `id` - Unique user identifier
- `email` - User email (unique)
- `full_name` - User's full name
- `password_hash` - Bcrypt hashed password
- `role` - User role ('user' or 'admin')
- `status` - Account status ('active', 'suspended', 'pending')
- `is_verified` - Email verification status
- `verification_token` - Email verification token
- `reset_token` - Password reset token
- `reset_token_expires` - Token expiration
- `last_login` - Last login timestamp
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Profiles Table
- `id` - Profile identifier (same as user id)
- `email` - User email
- `full_name` - User's full name
- `avatar_url` - Profile picture URL
- `role` - User role
- `status` - Profile status
- `last_login` - Last login timestamp
- `created_at` - Profile creation timestamp
- `updated_at` - Last update timestamp

### Resumes Table
- `id` - Resume identifier
- `user_id` - Owner user ID
- `title` - Resume title
- `template_id` - Template used
- `content` - Resume content (JSON)
- `ats_score` - ATS compatibility score
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Templates Table
- `id` - Template identifier
- `name` - Template name
- `description` - Template description
- `category` - Template category
- `status` - Template status
- `html_content` - Template HTML
- `css_styles` - Template CSS
- `preview_image` - Preview image URL
- `usage_count` - Usage counter
- `created_by` - Creator user ID
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Default Data

The schema includes:
- Default admin user (email: admin@resumemaker.com, password: admin123)
- Three default resume templates (Professional, Modern, Creative)

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **Session-based Authentication**: Secure session-based authentication
3. **Email Verification**: Required email verification for new accounts
4. **Role-based Access**: User and admin roles
5. **Account Status**: Active, suspended, and pending statuses

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/verify-email` - Email verification
- `GET /api/auth/verify` - Token verification

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Resume Management
- `GET /api/resumes` - Get user resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/[id]` - Get specific resume
- `PUT /api/resumes/[id]` - Update resume
- `DELETE /api/resumes/[id]` - Delete resume

### Templates
- `GET /api/templates` - Get available templates
- `GET /api/templates/[id]` - Get specific template

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are correct
   - Check if your database exists: `turso db list`

2. **Session Errors**
- Ensure database connection is working
   - Check token expiration

3. **Email Not Sending**
   - Verify SendGrid API key and sender email
   - Check SendGrid account status

4. **Migration Issues**
   - Run schema file again: `turso db shell resume-maker < turso-schema.sql`
   - Check for existing data conflicts

### Getting Help

- Turso Documentation: https://docs.turso.tech
- Turso Discord: https://discord.gg/turso
- GitHub Issues: Create an issue in this repository

## Migration from Supabase

If you're migrating from Supabase:

1. Export your data from Supabase
2. Transform the data to match the new schema
3. Import into Turso using the CLI or web console
4. Update your environment variables
5. Test all functionality

## Performance Tips

1. **Indexes**: The schema includes optimized indexes for common queries
2. **Connection Pooling**: Turso handles connection pooling automatically
3. **Caching**: Consider implementing Redis for session caching
4. **Monitoring**: Use Turso's built-in monitoring and analytics

## Backup and Recovery

Turso provides automatic backups, but you can also:

```bash
# Export database
turso db dump resume-maker > backup.sql

# Restore database
turso db shell resume-maker < backup.sql
```