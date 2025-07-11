-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  password_hash text,
  role text DEFAULT 'USER',
  organization_id uuid REFERENCES organizations(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create initial admin user
INSERT INTO users (email, name, password_hash, role)
VALUES (
  'admin@example.com',
  'Admin User',
  '$2b$12$3WPg67wsxuF4DN6SFNAzH.gOUf6TZMC7jdkWerqzJ32bTRP.Wlw82',
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create policy to allow admin to read all users
CREATE POLICY "Admin can read all users" ON users
  FOR SELECT USING (auth.jwt() ->> 'role' = 'ADMIN');

-- Create policy to allow admin to update all users
CREATE POLICY "Admin can update all users" ON users
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'ADMIN');
