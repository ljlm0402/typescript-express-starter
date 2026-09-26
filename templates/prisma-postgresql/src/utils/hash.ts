import { hash, compare } from 'bcryptjs';
import { logger } from '@utils/logger';

/**
 * 비밀번호 해싱 솔트 라운드
 */
const SALT_ROUNDS = 12;

/**
 * 비밀번호 해싱
 * @param password 원본 비밀번호
 * @returns 해싱된 비밀번호
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    logger.debug('Hashing password');
    const hashedPassword = await hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    logger.error('Failed to hash password', { error });
    throw new Error('Password hashing failed');
  }
}

/**
 * 비밀번호 검증
 * @param password 원본 비밀번호
 * @param hashedPassword 해싱된 비밀번호
 * @returns 일치 여부
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    logger.debug('Comparing password');
    const isMatch = await compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    logger.error('Failed to compare password', { error });
    throw new Error('Password comparison failed');
  }
}
