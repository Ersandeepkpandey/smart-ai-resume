-- Safe Admin Access Fix
-- This script handles cases where columns already exist

-- Step 1: Check current state (run this first to see what you have)
SELECT 'Current profiles table structure:' as info;
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Step 2: Check current users and their roles
SELECT 'Current users and their roles:' as info;
SELECT
    id,
    email,
    full_name,
    role,
    status,
    created_at
FROM profiles
ORDER BY created_at ASC;

-- Step 3: Add role column only if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role TEXT;
        RAISE NOTICE 'Added role column to profiles table';
    ELSE
        RAISE NOTICE 'Role column already exists in profiles table';
    END IF;
END $$;

-- Step 4: Add status column only if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'status'
    ) THEN
        ALTER TABLE profiles ADD COLUMN status TEXT DEFAULT 'active';
        RAISE NOTICE 'Added status column to profiles table';
    ELSE
        RAISE NOTICE 'Status column already exists in profiles table';
    END IF;
END $$;

-- Step 5: Add last_login column only if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'last_login'
    ) THEN
        ALTER TABLE profiles ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added last_login column to profiles table';
    ELSE
        RAISE NOTICE 'Last_login column already exists in profiles table';
    END IF;
END $$;

-- Step 6: Set default values for existing users
UPDATE profiles SET role = 'user' WHERE role IS NULL;
UPDATE profiles SET status = 'active' WHERE status IS NULL;

-- Step 7: Add constraints (only if they don't exist)
DO $$
BEGIN
    -- Add role constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'check_role' AND conrelid = 'profiles'::regclass
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT check_role CHECK (role IN ('user', 'admin', 'moderator'));
        RAISE NOTICE 'Added role constraint';
    ELSE
        RAISE NOTICE 'Role constraint already exists';
    END IF;

    -- Add status constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'check_status' AND conrelid = 'profiles'::regclass
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT check_status CHECK (status IN ('active', 'suspended', 'pending'));
        RAISE NOTICE 'Added status constraint';
    ELSE
        RAISE NOTICE 'Status constraint already exists';
    END IF;
END $$;

-- Step 8: Make the first user an admin (uncomment and modify as needed)
-- Option A: Make first user admin
UPDATE profiles
SET role = 'admin'
WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);

-- Option B: Make specific user admin (replace with your email)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- Step 9: Verify the changes
SELECT 'Final state - all users and their roles:' as info;
SELECT
    id,
    email,
    full_name,
    role,
    status,
    created_at
FROM profiles
ORDER BY created_at ASC;

-- Step 10: Show admin users
SELECT 'Admin users:' as info;
SELECT
    id,
    email,
    role,
    created_at
FROM profiles
WHERE role = 'admin';