/*
  # Create candidates table for Mini ATS

  1. New Tables
    - `candidates`
      - `id` (uuid, primary key)
      - `name` (text, candidate's full name)
      - `role` (text, position they applied for)
      - `experience` (integer, years of experience)
      - `resume_link` (text, optional URL to resume)
      - `status` (text, current application status)
      - `created_at` (timestamp, when candidate was added)
      - `updated_at` (timestamp, when record was last modified)

  2. Security
    - Enable RLS on `candidates` table
    - Add policy for all operations (for demo purposes - in production, this should be more restrictive)

  3. Indexes
    - Add index on status for faster filtering
    - Add index on role for analytics queries
*/

CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(name) >= 2),
  role text NOT NULL CHECK (length(role) >= 2),
  experience integer NOT NULL DEFAULT 0 CHECK (experience >= 0 AND experience <= 50),
  resume_link text CHECK (resume_link = '' OR resume_link ~ '^https?://'),
  status text NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'interview', 'offer', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Create policy for demo purposes (allow all operations)
-- In production, you would want more restrictive policies based on authentication
CREATE POLICY "Allow all operations for demo"
  ON candidates
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS candidates_status_idx ON candidates (status);
CREATE INDEX IF NOT EXISTS candidates_role_idx ON candidates (role);
CREATE INDEX IF NOT EXISTS candidates_created_at_idx ON candidates (created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();