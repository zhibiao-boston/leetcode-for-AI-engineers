// Mock database configuration for testing without PostgreSQL
export const mockConnection = {
  test: async (): Promise<boolean> => {
    console.log('✅ Mock database connected successfully');
    return true;
  },
  close: async (): Promise<void> => {
    console.log('✅ Mock database connection closed');
  }
};

// Mock data for testing
export const mockUsers = [
  {
    id: '1',
    email: 'ai_coding@gmail.com',
    password_hash: '$2b$12$rmA357Z9ju2B59UjbYXJPuHrrYOkdnI7ysnJXsH5sMy/b5N.D5k4O',
    name: 'AI Coding Admin',
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
    last_login_at: new Date()
  },
  {
    id: '2',
    email: 'user@example.com',
    password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K',
    name: 'Test User',
    role: 'user',
    created_at: new Date(),
    updated_at: new Date(),
    last_login_at: new Date()
  }
];

export const mockProblems = [
  {
    id: '1',
    title: 'Design Database',
    description: 'You need to design a simple database system that supports the following functionalities: Insert: Add a key-value pair to the database. Remove: Delete a key from the database. Retrieve: Fetch the value associated with a given key.',
    difficulty: 'medium',
    company: 'Google',
    categories: ['coding', 'phone', 'onsite'],
    tags: ['database', 'design', 'system'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  },
  {
    id: '2',
    title: 'Array Compression',
    description: 'Implement an array compression algorithm that reduces the size of arrays by removing consecutive duplicate elements and replacing them with a count.',
    difficulty: 'medium',
    company: 'Microsoft',
    categories: ['coding', 'phone'],
    tags: ['array', 'compression', 'algorithm'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  }
];
