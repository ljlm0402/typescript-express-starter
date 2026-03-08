import { User, type UserCreateData } from '@entities/user.entity';

describe('User Entity', () => {
  const validUserData: UserCreateData = {
    email: 'test@example.com',
    password: 'password123',
  };

  describe('create', () => {
    it('should create a new user with valid data', async () => {
      const user = await User.create(validUserData);

      expect(user.id).toBeDefined();
      expect(user.id).toMatch(/^user_/);
      expect(user.email).toBe('test@example.com');
      expect(user.password).not.toBe('password123'); // should be hashed
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should normalize email to lowercase', async () => {
      const user = await User.create({ ...validUserData, email: 'TEST@EXAMPLE.COM' });
      expect(user.email).toBe('test@example.com');
    });

    it('should throw error for invalid email format', async () => {
      await expect(User.create({ ...validUserData, email: 'invalid-email' })).rejects.toThrow(
        'Invalid email format',
      );
    });

    it('should throw error for empty email', async () => {
      await expect(User.create({ ...validUserData, email: '' })).rejects.toThrow(
        'Email is required',
      );
    });

    it('should throw error for too long email', async () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      await expect(User.create({ ...validUserData, email: longEmail })).rejects.toThrow(
        'Email is too long',
      );
    });

    it('should throw error for short password', async () => {
      await expect(User.create({ ...validUserData, password: '123' })).rejects.toThrow(
        'Password must be at least 8 characters long',
      );
    });

    it('should throw error for password without number', async () => {
      await expect(User.create({ ...validUserData, password: 'onlyletters' })).rejects.toThrow(
        'Password must contain at least one letter and one number',
      );
    });

    it('should throw error for password without letter', async () => {
      await expect(User.create({ ...validUserData, password: '12345678' })).rejects.toThrow(
        'Password must contain at least one letter and one number',
      );
    });

    it('should throw error for too long password', async () => {
      const longPassword = 'a'.repeat(130) + '123'; // 133 chars, exceeds 128 limit
      await expect(User.create({ ...validUserData, password: longPassword })).rejects.toThrow(
        'Password is too long',
      );
    });
  });

  describe('fromPersistence', () => {
    it('should restore user from persistence data', () => {
      const persistenceData = {
        id: 'user_123',
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      };

      const user = User.fromPersistence(persistenceData);

      expect(user.id).toBe('user_123');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('hashedpassword');
      expect(user.createdAt).toEqual(new Date('2025-01-01'));
      expect(user.updatedAt).toEqual(new Date('2025-01-02'));
    });

    it('should use default dates if not provided', () => {
      const persistenceData = {
        id: 'user_123',
        email: 'test@example.com',
        password: 'hashedpassword',
      };

      const user = User.fromPersistence(persistenceData);

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('changeEmail', () => {
    it('should change email and update timestamp', async () => {
      const user = await User.create(validUserData);
      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      await user.changeEmail('new@example.com');

      expect(user.email).toBe('new@example.com');
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should validate new email format', async () => {
      const user = await User.create(validUserData);

      await expect(user.changeEmail('invalid-email')).rejects.toThrow('Invalid email format');
    });
  });

  describe('changePassword', () => {
    it('should change password and update timestamp', async () => {
      const user = await User.create(validUserData);
      const originalPassword = user.password;
      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      await user.changePassword('newpassword123');

      expect(user.password).not.toBe(originalPassword);
      expect(user.password).not.toBe('newpassword123'); // should be hashed
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should validate new password', async () => {
      const user = await User.create(validUserData);

      await expect(user.changePassword('123')).rejects.toThrow(
        'Password must be at least 8 characters long',
      );
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const user = await User.create(validUserData);

      const isValid = await user.verifyPassword('password123');
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const user = await User.create(validUserData);

      const isValid = await user.verifyPassword('wrongpassword');
      expect(isValid).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should update email only', async () => {
      const user = await User.create(validUserData);
      const originalPassword = user.password;

      await user.updateProfile({ email: 'updated@example.com' });

      expect(user.email).toBe('updated@example.com');
      expect(user.password).toBe(originalPassword); // unchanged
    });

    it('should update password only', async () => {
      const user = await User.create(validUserData);
      const originalEmail = user.email;
      const originalPassword = user.password;

      await user.updateProfile({ password: 'newpassword456' });

      expect(user.email).toBe(originalEmail); // unchanged
      expect(user.password).not.toBe(originalPassword);
    });

    it('should update both email and password', async () => {
      const user = await User.create(validUserData);
      const originalPassword = user.password;

      await user.updateProfile({
        email: 'both@example.com',
        password: 'bothupdate789',
      });

      expect(user.email).toBe('both@example.com');
      expect(user.password).not.toBe(originalPassword);
    });

    it('should not update timestamp if no changes', async () => {
      const user = await User.create(validUserData);
      const originalUpdatedAt = user.updatedAt;

      await user.updateProfile({ email: user.email }); // same email

      expect(user.updatedAt.getTime()).toBe(originalUpdatedAt.getTime());
    });
  });

  describe('toPersistence', () => {
    it('should return persistence data format', async () => {
      const user = await User.create(validUserData);
      const persistenceData = user.toPersistence();

      expect(persistenceData).toEqual({
        id: user.id,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });
  });

  describe('toResponse', () => {
    it('should return response format without password', async () => {
      const user = await User.create(validUserData);
      const responseData = user.toResponse();

      expect(responseData).toEqual({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
      expect(responseData).not.toHaveProperty('password');
    });
  });

  describe('equals', () => {
    it('should return true for same user ID', async () => {
      const userData1 = { ...validUserData };
      const userData2 = { ...validUserData, email: 'different@example.com' };

      const user1 = await User.create(userData1);
      const user2 = User.fromPersistence({
        id: user1.id,
        email: userData2.email,
        password: 'different',
      });

      expect(user1.equals(user2)).toBe(true);
    });

    it('should return false for different user ID', async () => {
      const user1 = await User.create(validUserData);
      const user2 = await User.create({ ...validUserData, email: 'other@example.com' });

      expect(user1.equals(user2)).toBe(false);
    });
  });

  describe('defensive copying', () => {
    it('should return defensive copies of dates', async () => {
      const user = await User.create(validUserData);

      const createdAt1 = user.createdAt;
      const createdAt2 = user.createdAt;

      expect(createdAt1).not.toBe(createdAt2); // different instances
      expect(createdAt1.getTime()).toBe(createdAt2.getTime()); // same time

      // Modifying returned date should not affect internal state
      createdAt1.setTime(0);
      expect(user.createdAt.getTime()).not.toBe(0);
    });
  });
});
