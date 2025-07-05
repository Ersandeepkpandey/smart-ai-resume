-- Fix Admin RLS Policies for User Management
-- Run this in your Supabase SQL Editor

-- Add admin policy to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
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

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin() OR auth.uid() = id);

-- Add admin policy to update all profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
    )
  );

-- Add admin policy to view all resumes
DROP POLICY IF EXISTS "Admins can view all resumes" ON resumes;
CREATE POLICY "Admins can view all resumes" ON resumes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
    )
  );

-- Add admin policy to view all templates
DROP POLICY IF EXISTS "Admins can view all templates" ON templates;
CREATE POLICY "Admins can view all templates" ON templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
    )
  );

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('profiles', 'resumes', 'templates')
ORDER BY tablename, policyname;