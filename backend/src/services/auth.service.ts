import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, User, CreateUserData } from '../models/User';
import { config } from '../config';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'user';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 12;

  // Hash password
  private static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  // Compare password
  private static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate access token
  private static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      issuer: 'leetcode-backend',
      audience: 'leetcode-frontend',
    } as jwt.SignOptions);
  }

  // Generate refresh token
  private static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiresIn,
      issuer: 'leetcode-backend',
      audience: 'leetcode-frontend',
    } as jwt.SignOptions);
  }

  // Verify token
  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'leetcode-backend',
      audience: 'leetcode-frontend',
    }) as TokenPayload;
  }

  // Register new user
  static async register(userData: RegisterData): Promise<AuthResponse> {
    const { email, password, name, role = 'user' } = userData;

    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const password_hash = await this.hashPassword(password);

    // Create user
    const createUserData: CreateUserData = {
      email,
      password_hash,
      name,
      role,
    };

    const user = await UserModel.create(createUserData);

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    // Update last login
    await UserModel.update(user.id, { last_login_at: new Date() });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login_at: user.last_login_at,
      },
      accessToken,
      refreshToken,
    };
  }

  // Login user
  static async login(credentials: LoginData): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await this.comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    // Update last login
    await UserModel.update(user.id, { last_login_at: new Date() });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login_at: user.last_login_at,
      },
      accessToken,
      refreshToken,
    };
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.verifyToken(refreshToken);
      
      // Verify user still exists
      const user = await UserModel.findById(payload.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new access token
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.generateAccessToken(tokenPayload);

      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Logout user (in a real app, you might want to blacklist the token)
  static async logout(userId: string): Promise<void> {
    // In a production app, you would add the token to a blacklist
    // For now, we'll just update the user's last activity
    await UserModel.update(userId, {});
  }

  // Get user profile
  static async getProfile(userId: string): Promise<Omit<User, 'password_hash'>> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login_at: user.last_login_at,
    };
  }

  // Update user profile
  static async updateProfile(userId: string, updateData: {
    name?: string;
    email?: string;
  }): Promise<Omit<User, 'password_hash'>> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await UserModel.findByEmail(updateData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }

    const updatedUser = await UserModel.update(userId, updateData);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
      last_login_at: updatedUser.last_login_at,
    };
  }

  // Change password
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await this.comparePassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.hashPassword(newPassword);

    // Update password
    await UserModel.update(userId, { password_hash: newPasswordHash });
  }

  // Check if user is admin
  static async isAdmin(userId: string): Promise<boolean> {
    const user = await UserModel.findById(userId);
    return user?.role === 'admin';
  }
}
