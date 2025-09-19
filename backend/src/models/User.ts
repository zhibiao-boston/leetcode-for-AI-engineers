import { pool } from '../config/database';
import { mockUsers } from '../config/database-mock';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

export interface CreateUserData {
  email: string;
  password_hash: string;
  name: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserData {
  name?: string;
  password_hash?: string;
  last_login_at?: Date;
}

export class UserModel {
  // Create a new user
  static async create(userData: CreateUserData): Promise<User> {
    const { email, password_hash, name, role = 'user' } = userData;
    
    // Use mock data instead of database
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      password_hash,
      name,
      role: role as 'admin' | 'user',
      created_at: new Date(),
      updated_at: new Date(),
      last_login_at: new Date()
    };
    
    mockUsers.push(newUser);
    return newUser as User;
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    // Use mock data instead of database
    const user = mockUsers.find(u => u.email === email);
    return user as User || null;
  }

  // Find user by ID
  static async findById(id: string): Promise<User | null> {
    // Use mock data instead of database
    const user = mockUsers.find(u => u.id === id);
    return user as User || null;
  }

  // Update user
  static async update(id: string, userData: UpdateUserData): Promise<User> {
    // Use mock data instead of database
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update the mock user data
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      updated_at: new Date()
    };
    
    return mockUsers[userIndex] as User;
  }

  // Delete user (soft delete)
  static async delete(id: string): Promise<void> {
    // Use mock data instead of database
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      mockUsers[userIndex].updated_at = new Date();
    }
  }

  // Get all users (admin only)
  static async findAll(limit = 50, offset = 0): Promise<User[]> {
    // Use mock data instead of database
    return mockUsers
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(offset, offset + limit) as User[];
  }

  // Count total users
  static async count(): Promise<number> {
    // Use mock data instead of database
    return mockUsers.length;
  }

  // Check if email exists
  static async emailExists(email: string): Promise<boolean> {
    // Use mock data instead of database
    return mockUsers.some(u => u.email === email);
  }
}
