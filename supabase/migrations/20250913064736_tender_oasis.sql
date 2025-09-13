/*
  # Create candidates table for Mini ATS

  1. New Tables
    - `candidates`
      - `id` (uuid, primary key)
      - `name` (text, required, min 2 chars)
      - `role` (text, required, min 2 chars)
      - `experience` (integer, 0-50 years)
      - `resume_link` (text, optional URL)
      - `status` (text, enum: applied/interview/offer/rejected)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `candidates` table
    - Add policy for public access (demo purposes)

  3. Indexes
    - Primary key on `id`
    - Index on `status` for filtering
    - Index on `role` for analytics
    - Index on `created_at` for ordering

  4. Triggers
    - Auto-update `updated_at` timestamp
*/

-- Create the candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  experience integer NOT NULL DEFAULT 0,
  resume_link text,
  status text NOT NULL DEFAULT 'applied',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE candidates 
ADD CONSTRAINT candidates_name_check 
CHECK (length(name) >= 2);

ALTER TABLE candidates 
ADD CONSTRAINT candidates_role_check 
CHECK (length(role) >= 2);

ALTER TABLE candidates 
ADD CONSTRAINT candidates_experience_check 
CHECK (experience >= 0 AND experience <= 50);

ALTER TABLE candidates 
ADD CONSTRAINT candidates_status_check 
CHECK (status IN ('applied', 'interview', 'offer', 'rejected'));

ALTER TABLE candidates 
ADD CONSTRAINT candidates_resume_link_check 
CHECK (resume_link = '' OR resume_link ~ '^https?://');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS candidates_status_idx ON candidates(status);
CREATE INDEX IF NOT EXISTS candidates_role_idx ON candidates(role);
CREATE INDEX IF NOT EXISTS candidates_created_at_idx ON candidates(created_at DESC);

-- Enable Row Level Security
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (for demo purposes)
-- In production, you would want more restrictive policies
CREATE POLICY "Allow all operations for demo" 
ON candidates 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Create function to update updated_at timestamp
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

-- Insert some sample data for testing
INSERT INTO candidates (name, role, experience, status, resume_link) VALUES
('John Doe', 'Frontend Developer', 3, 'applied', 'https://example.com/john-resume.pdf'),
('Jane Smith', 'Backend Developer', 5, 'interview', 'https://example.com/jane-resume.pdf'),
('Mike Johnson', 'Full Stack Developer', 7, 'offer', ''),
('Sarah Wilson', 'UI/UX Designer', 2, 'applied', 'https://example.com/sarah-resume.pdf'),
('David Brown', 'DevOps Engineer', 8, 'rejected', 'https://example.com/david-resume.pdf'),
('Emily Davis', 'Product Manager', 4, 'interview', ''),
('Chris Lee', 'Data Scientist', 6, 'applied', 'https://example.com/chris-resume.pdf'),
('Anna Taylor', 'QA Engineer', 3, 'offer', 'https://example.com/anna-resume.pdf')
ON CONFLICT DO NOTHING;