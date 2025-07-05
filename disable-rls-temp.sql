-- Temporarily disable RLS for testing
-- Run this in your Supabase SQL Editor

-- Disable RLS on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE resumes DISABLE ROW LEVEL SECURITY;
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;

-- Check if RLS is disabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('profiles', 'resumes', 'templates');

-- This will allow all queries to work without RLS restrictions
-- Remember to re-enable RLS later with proper policies