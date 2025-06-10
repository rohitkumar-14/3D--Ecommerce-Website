
import type { User } from './types';

// In-memory store for mock users. In a real app, this would be a database.
let mockUsersDb: User[] = [
  { id: 'user_1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'customer', passwordHash: 'password123' }, // Store hashed passwords in real app
  { id: 'user_2', name: 'Bob The Admin', email: 'admin@example.com', role: 'admin', passwordHash: 'adminpass' },
  { id: 'user_3', name: 'Charlie Seller', email: 'seller@example.com', role: 'seller', passwordHash: 'sellerpass' },
];

// Helper to simulate password hashing/checking - REPLACE WITH REAL HASHING
const checkPassword = (inputPassword?: string, storedPasswordHash?: string) => {
  return inputPassword === storedPasswordHash;
};

export const findUserByEmail = (email: string): User | undefined => {
  return mockUsersDb.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const addUser = (user: Omit<User, 'id' | 'role'> & { password?: string }): User | null => {
  if (findUserByEmail(user.email)) {
    return null; // User already exists
  }
  const newUser: User = {
    ...user,
    id: `user_${Date.now()}`,
    role: 'customer', // Default role for new sign-ups
    passwordHash: user.password, // Store hashed password in real app
  };
  mockUsersDb.push(newUser);
  return newUser;
};

export const verifyCredentials = (email: string, password?: string): User | null => {
  const user = findUserByEmail(email);
  if (user && checkPassword(password, (user as any).passwordHash)) {
    const { passwordHash, ...userWithoutPassword } = user as any;
    return userWithoutPassword as User;
  }
  return null;
};
