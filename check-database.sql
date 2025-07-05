-- Diagnostic script to check database state
-- Run this first to see what's in your database

-- Check if profiles table exists and its structure
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check if templates table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'templates';

-- Check current profiles data
SELECT id, email, full_name, created_at
FROM profiles
LIMIT 5;