import { User } from '@entities/user.entity';

describe('User Entity (Static Methods)', () => {
  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      expect(() => User.validateEmail('test@example.com')).not.toThrow();
    });

    it('should throw error for invalid email format', () => {
      expect(() => User.validateEmail('invalid-email')).toThrow('Invalid email format');
    });

    it('should throw error for empty email', () => {
      expect(() => User.validateEmail('')).toThrow('Email is required');
    });
  });

  describe('normalizeEmail', () => {
    it('should normalize email to lowercase', () => {
      expect(User.normalizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      expect(User.normalizeEmail('  test@example.com  ')).toBe('test@example.com');
    });
  });

  describe('validatePassword', () => {
    it('should validate correct password', () => {
      expect(() => User.validatePassword('password123')).not.toThrow();
    });

    it('should throw error for short password', () => {
      expect(() => User.validatePassword('123')).toThrow('Password must be at least 4 characters');
    });
  });

  describe('fromPrisma', () => {
    it('should convert Prisma User to domain User', () => {
      const prismaUser = {
        id: 'user_123',
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      };

      const user = User.fromPrisma(prismaUser);

      expect(user.id).toBe('user_123');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('hashedpassword');
    });
  });
});