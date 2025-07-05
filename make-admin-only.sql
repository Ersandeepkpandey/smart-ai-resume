-- Simple Admin Assignment (Safe - no table modifications)
-- This script only assigns admin role without changing table structure

-- Option 1: Make the first user an admin
UPDATE profiles
SET role = 'admin'
WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);

-- Option 2: Make a specific user admin (replace with your email)
UPDATE profiles
SET role = 'admin'
WHERE email = 'sandeepp1819@gmail.com';

-- Option 3: Make the most recent user admin
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM profiles ORDER BY created_at DESC LIMIT 1);

-- Verify the change
SELECT 'Current admin users:' as info;
SELECT
    id,
    email,
    role,
    created_at
FROM profiles
WHERE role = 'admin';

-- Show all users for reference
SELECT 'All users:' as info;
SELECT
    id,
    email,
    role,
    created_at
FROM profiles
ORDER BY created_at ASC;

-- Verify
SELECT id, email, role FROM profiles WHERE email = 'sandeepp1819@gmail.com';