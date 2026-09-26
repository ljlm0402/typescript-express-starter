import { hash, compare } from 'bcryptjs';

/**
 * Hash Utility Class
 * @desc 해싱 관련 유틸리티 함수들
 */
export class Hash {
  /**
   * 패스워드를 해싱합니다
   * @param password 해싱할 패스워드
   * @returns 해싱된 패스워드
   */
  static async hashPassword(password: string): Promise<string> {
    if (!password || typeof password !== 'string') {
      throw new Error('Password is required');
    }
    return hash(password, 12);
  }

  /**
   * 패스워드를 해싱된 패스워드와 비교합니다
   * @param password 원본 패스워드
   * @param hashedPassword 해싱된 패스워드
   * @returns 비교 결과
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    if (!password || !hashedPassword) {
      return false;
    }
    return compare(password, hashedPassword);
  }

  /**
   * 문자열을 해싱합니다 (패스워드 외 다른 용도)
   * @param text 해싱할 텍스트
   * @returns 해싱된 텍스트
   */
  static async hashText(text: string): Promise<string> {
    if (!text || typeof text !== 'string') {
      throw new Error('Text is required');
    }
    return hash(text, 10);
  }
}
