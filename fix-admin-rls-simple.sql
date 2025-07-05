-- Fix Admin RLS Policies (Simple Version - No Recursion)
-- Run this in your Supabase SQL Editor

-- First, let's disable RLS temporarily to see if we can access the data
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE resumes DISABLE ROW LEVEL SECURITY;
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;

-- Now let's create a simple admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users u
    JOIN profiles p ON u.id = p.id
    WHERE u.id = auth.uid() AND p.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Drop any existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all resumes" ON resumes;
DROP POLICY IF EXISTS "Admins can view all templates" ON templates;

-- Create simple admin policies using the function
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin() OR auth.uid() = id);

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (is_admin() OR auth.uid() = id);

CREATE POLICY "Admins can view all resumes" ON resumes
  FOR SELECT USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admins can view all templates" ON templates
  FOR SELECT USING (is_admin() OR status = 'active');

-- Keep existing user policies
-- Users can view own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can view own resumes
CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage own resumes
CREATE POLICY "Users can manage own resumes" ON resumes
  FOR ALL USING (auth.uid() = user_id);

-- Everyone can view active templates
CREATE POLICY "Everyone can view active templates" ON templates
  FOR SELECT USING (status = 'active');

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'resumes', 'templates')
ORDER BY tablename, policyname;