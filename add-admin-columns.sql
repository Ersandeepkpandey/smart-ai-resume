-- Add missing columns to profiles table for admin functionality
-- Run this in your Supabase SQL Editor

-- Add role column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- Add status column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending'));

-- Add last_login column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Create templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'professional' CHECK (category IN ('professional', 'creative', 'modern', 'classic')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  html_content TEXT NOT NULL,
  css_styles TEXT,
  preview_image TEXT,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_status ON templates(status);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON templates(created_by);

-- Enable Row Level Security on templates
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for templates
DROP POLICY IF EXISTS "Everyone can view active templates" ON templates;
CREATE POLICY "Everyone can view active templates" ON templates
  FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage templates" ON templates;
CREATE POLICY "Admins can manage templates" ON templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Grant permissions on templates table
GRANT ALL ON public.templates TO anon, authenticated;

-- Update existing profiles to have default role (optional)
UPDATE profiles SET role = 'user' WHERE role IS NULL;
UPDATE profiles SET status = 'active' WHERE status IS NULL;