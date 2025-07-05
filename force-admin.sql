-- Force Admin Access - Use with caution!
-- This will make all users admins

-- Option 1: Make all users admins
UPDATE profiles SET role = 'admin';

-- Option 2: Make specific user admin (replace with your email)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- Option 3: Make first user admin
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);

-- Verify the changes
SELECT id, email, role FROM profiles ORDER BY created_at ASC;