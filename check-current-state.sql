-- Diagnostic script to check current database state
-- Run this first to understand what's in your database

-- Check profiles table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check current users and their roles
SELECT
    id,
    email,
    full_name,
    role,
    status,
    created_at
FROM profiles
ORDER BY created_at ASC;

-- Check if there are any users with admin role
SELECT
    id,
    email,
    role,
    created_at
FROM profiles
WHERE role = 'admin';

-- Check if there are any users without a role (NULL)
SELECT
    id,
    email,
    role,
    created_at
FROM profiles
WHERE role IS NULL;

-- Check the most recent user
SELECT
    id,
    email,
    role,
    created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 1;