-- Simple fix for the role column issue
-- Run these commands one by one in your Supabase SQL Editor

-- Step 1: Add role column
ALTER TABLE profiles ADD COLUMN role TEXT;

-- Step 2: Set default value for role
UPDATE profiles SET role = 'user' WHERE role IS NULL;

-- Step 3: Add constraint to role column
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';
ALTER TABLE profiles ADD CONSTRAINT check_role CHECK (role IN ('user', 'admin', 'moderator'));

-- Step 4: Add status column
ALTER TABLE profiles ADD COLUMN status TEXT DEFAULT 'active';

-- Step 5: Add last_login column
ALTER TABLE profiles ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;

-- Step 6: Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'professional',
  status TEXT DEFAULT 'draft',
  html_content TEXT NOT NULL,
  css_styles TEXT,
  preview_image TEXT,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Enable RLS on templates
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Step 8: Grant permissions
GRANT ALL ON public.templates TO anon, authenticated;

-- Step 9: Make the first user an admin (optional - you can also use the web interface)
-- Uncomment the line below if you want to make the first user an admin automatically
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);

-- Check current profiles and their roles
SELECT id, email, role, created_at FROM profiles ORDER BY created_at ASC;