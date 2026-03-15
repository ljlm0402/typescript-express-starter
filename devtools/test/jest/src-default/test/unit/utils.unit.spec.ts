/**
 * Unit Tests for Utility Functions
 * @desc 유틸리티 함수들에 대한 단위 테스트
 */

import { Hash } from '../../utils/hash';
import { logger } from '../../utils/logger';

describe('Utils Unit Tests', () => {
  describe('Hash Utility', () => {
    test('should hash password correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await Hash.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(10);
    });

    test('should generate different hashes for same password', async () => {
      const password = 'samepassword';
      const hash1 = await Hash.hashPassword(password);
      const hash2 = await Hash.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    test('should verify password correctly', async () => {
      const password = 'testpassword';
      const hashedPassword = await Hash.hashPassword(password);
      const isValid = await Hash.comparePassword(password, hashedPassword);

      expect(isValid).toBe(true);
    });

    test('should reject wrong password', async () => {
      const password = 'correctpassword';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await Hash.hashPassword(password);
      const isValid = await Hash.comparePassword(wrongPassword, hashedPassword);

      expect(isValid).toBe(false);
    });
  });

  describe('Logger Utility', () => {
    test('should have logger instance', () => {
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    test('should accept log parameters without throwing', () => {
      expect(() => {
        logger.info('Test log message');
        logger.error({ msg: 'Test error', error: 'test' });
      }).not.toThrow();
    });
  });
});
