-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO todos (title, description, priority) VALUES
('Complete project documentation', 'Write comprehensive documentation for the todo app', 'high'),
('Review code changes', 'Review and approve pending pull requests', 'medium'),
('Update dependencies', 'Update all npm packages to latest versions', 'low');
