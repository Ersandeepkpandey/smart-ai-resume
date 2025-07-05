# Admin Access Fix Guide

## Problem
You're seeing the error "Admin Access Required - You don't have permission to access the admin panel" when trying to access the admin panel.

## Root Cause
The admin role is not assigned to your user account in the database. By default, all users are created with the `user` role, and only users with the `admin` role can access the admin panel.

## Solutions

### Option 1: Use the Web Interface (Recommended)
1. Sign in to your account
2. Navigate to `/admin-fix` in your browser
3. Click the "Make Me Admin" button
4. You'll be redirected to the admin panel once successful

### Option 2: Database SQL Fix
If the web interface doesn't work, you can fix it directly in the database:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the following SQL commands:

```sql
-- First, check your current user
SELECT id, email, role FROM profiles WHERE email = 'your-email@example.com';

-- Make yourself an admin (replace with your actual email)
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- Verify the change
SELECT id, email, role FROM profiles WHERE email = 'your-email@example.com';
```

### Option 3: Make the First User Admin
If you want to make the first registered user an admin:

```sql
-- Make the first user an admin
UPDATE profiles
SET role = 'admin'
WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);

-- Check the result
SELECT id, email, role, created_at FROM profiles ORDER BY created_at ASC;
```

## Verification
After applying any of the above fixes:

1. Sign out and sign back in (to refresh your session)
2. Try accessing `/admin` again
3. You should now see the admin panel

## Troubleshooting

### If you still can't access admin panel:
1. Check that you're signed in with the correct account
2. Verify the role was updated in the database
3. Clear your browser cache and cookies
4. Try signing out and signing back in

### If the database update fails:
1. Make sure the `profiles` table exists
2. Check that the `role` column exists
3. Verify you have the correct permissions

### Database Structure Check
Run this to verify your database structure:

```sql
-- Check if profiles table has the role column
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name = 'role';

-- Check current user roles
SELECT id, email, role, created_at
FROM profiles
ORDER BY created_at ASC;
```

## Security Note
- Only assign admin roles to trusted users
- Consider implementing additional security measures for admin access
- Regularly review admin user list

## API Endpoint
The web interface uses the `/api/admin/make-admin` endpoint which:
- Verifies the user is authenticated
- Updates their role to 'admin' in the profiles table
- Returns success/error status

This endpoint is safe to use as it only affects the current authenticated user.

### Example Fix for Next.js API Route

If you are using Next.js 13/14 with the App Router, update your API route like this:

```ts
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const supabase = createServerClient({ cookies: () => cookies() });
  // ...rest of your code
}
```

- Make sure your `createServerClient` is set up to accept cookies from the request context.