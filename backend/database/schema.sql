-- LeetCode for AI Engineers Database Schema
-- PostgreSQL Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Problems Table
CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    company VARCHAR(255),
    categories TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- User Solutions Table
CREATE TABLE solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    output TEXT,
    error TEXT,
    execution_time INTEGER,
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('completed', 'in_progress', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Solutions Table
CREATE TABLE admin_solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    explanation TEXT,
    time_complexity VARCHAR(100),
    space_complexity VARCHAR(100),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_problems_status ON problems(status);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_company ON problems(company);
CREATE INDEX idx_problems_created_by ON problems(created_by);
CREATE INDEX idx_problems_created_at ON problems(created_at);
CREATE INDEX idx_problems_external_id ON problems(external_id);
CREATE INDEX idx_problems_categories ON problems USING GIN(categories);
CREATE INDEX idx_problems_tags ON problems USING GIN(tags);

CREATE INDEX idx_solutions_user_id ON solutions(user_id);
CREATE INDEX idx_solutions_problem_id ON solutions(problem_id);
CREATE INDEX idx_solutions_status ON solutions(status);
CREATE INDEX idx_solutions_created_at ON solutions(created_at);

CREATE INDEX idx_admin_solutions_problem_id ON admin_solutions(problem_id);
CREATE INDEX idx_admin_solutions_created_by ON admin_solutions(created_by);
CREATE INDEX idx_admin_solutions_created_at ON admin_solutions(created_at);

-- Triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON problems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_solutions_updated_at BEFORE UPDATE ON solutions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_solutions_updated_at BEFORE UPDATE ON admin_solutions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: 123456)
INSERT INTO users (email, password_hash, name, role) VALUES 
('ai_coding@gmail.com', '$2b$12$rmA357Z9ju2B59UjbYXJPuHrrYOkdnI7ysnJXsH5sMy/b5N.D5k4O', 'AI Coding Admin', 'admin');

-- Insert sample problems
INSERT INTO problems (title, description, difficulty, company, categories, tags, status, created_by) VALUES 
('Design Database', 'You need to design a simple database system that supports the following functionalities: Insert: Add a key-value pair to the database. Remove: Delete a key from the database. Retrieve: Fetch the value associated with a given key. Optional: Support additional functionalities like listing all keys or updating a value.', 'medium', 'Google', ARRAY['coding', 'phone', 'onsite'], ARRAY['database', 'design', 'system'], 'published', (SELECT id FROM users WHERE email = 'ai_coding@gmail.com')),
('Array Compression', 'Implement an array compression algorithm that reduces the size of arrays by removing consecutive duplicate elements and replacing them with a count.', 'medium', 'Microsoft', ARRAY['coding', 'phone'], ARRAY['array', 'compression', 'algorithm'], 'published', (SELECT id FROM users WHERE email = 'ai_coding@gmail.com')),
('Backend Assignment Interview', 'Design and implement a backend system for a social media platform with user authentication, post creation, and feed generation.', 'hard', 'Facebook', ARRAY['coding', 'onsite'], ARRAY['backend', 'system', 'design'], 'published', (SELECT id FROM users WHERE email = 'ai_coding@gmail.com')),
('Basic Calculator', 'Implement a basic calculator that can evaluate mathematical expressions containing +, -, *, /, and parentheses.', 'easy', 'Amazon', ARRAY['coding', 'phone'], ARRAY['calculator', 'math', 'expression'], 'published', (SELECT id FROM users WHERE email = 'ai_coding@gmail.com')),
('LLM Token Counter', 'Create a token counting system for Large Language Models that accurately counts tokens in text input.', 'medium', 'OpenAI', ARRAY['coding', 'phone'], ARRAY['llm', 'token', 'counting'], 'published', (SELECT id FROM users WHERE email = 'ai_coding@gmail.com')),
('Neural Network Optimizer', 'Implement an optimizer for neural networks that can handle gradient descent with momentum and adaptive learning rates.', 'hard', 'DeepMind', ARRAY['coding', 'onsite'], ARRAY['neural', 'network', 'optimizer'], 'published', (SELECT id FROM users WHERE email = 'ai_coding@gmail.com')),
('Prompt Engineering Framework', 'Design a framework for managing and optimizing prompts for AI models with version control and A/B testing capabilities.', 'medium', 'Anthropic', ARRAY['coding', 'phone'], ARRAY['prompt', 'engineering', 'framework'], 'published', (SELECT id FROM users WHERE email = 'ai_coding@gmail.com')),
('Vector Database Query', 'Implement a vector similarity search system for high-dimensional data with efficient indexing and querying.', 'hard', 'Pinecone', ARRAY['coding', 'onsite'], ARRAY['vector', 'database', 'similarity'], 'published', (SELECT id FROM users WHERE email = 'ai_coding@gmail.com'));

-- Insert sample admin solutions
INSERT INTO admin_solutions (problem_id, code, explanation, time_complexity, space_complexity, created_by) VALUES 
((SELECT id FROM problems WHERE title = 'Design Database'), 'class Database:
    def __init__(self):
        self.data = {}
    
    def insert(self, key, value):
        self.data[key] = value
    
    def remove(self, key):
        if key in self.data:
            del self.data[key]
            return True
        return False
    
    def retrieve(self, key):
        return self.data.get(key, None)
    
    def list_keys(self):
        return list(self.data.keys())', 'A simple in-memory database implementation using a Python dictionary. The insert, remove, and retrieve operations are all O(1) average case.', 'O(1)', 'O(n)', (SELECT id FROM users WHERE email = 'admin@leetcode.com'));

-- Create views for common queries
CREATE VIEW problem_stats AS
SELECT 
    p.id,
    p.title,
    p.difficulty,
    p.company,
    p.status,
    COUNT(s.id) as solution_count,
    COUNT(CASE WHEN s.status = 'completed' THEN 1 END) as completed_solutions,
    COUNT(CASE WHEN s.status = 'in_progress' THEN 1 END) as in_progress_solutions,
    COUNT(CASE WHEN s.status = 'failed' THEN 1 END) as failed_solutions
FROM problems p
LEFT JOIN solutions s ON p.id = s.problem_id
GROUP BY p.id, p.title, p.difficulty, p.company, p.status;

CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    COUNT(s.id) as total_solutions,
    COUNT(CASE WHEN s.status = 'completed' THEN 1 END) as completed_solutions,
    COUNT(CASE WHEN s.status = 'in_progress' THEN 1 END) as in_progress_solutions,
    COUNT(CASE WHEN s.status = 'failed' THEN 1 END) as failed_solutions,
    COUNT(DISTINCT s.problem_id) as problems_attempted
FROM users u
LEFT JOIN solutions s ON u.id = s.user_id
GROUP BY u.id, u.email, u.name, u.role;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
