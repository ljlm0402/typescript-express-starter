import bcrypt from 'bcryptjs';

export class Hash {
  private static readonly SALT_ROUNDS = 12;

  /**
   * 비밀번호 해싱
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * 비밀번호 검증
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
