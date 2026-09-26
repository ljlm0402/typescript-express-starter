import { hash, compare } from 'bcryptjs';

export class Hash {
  static async hashPassword(password: string): Promise<string> {
    if (!password || typeof password !== 'string') {
      throw new Error('Password is required');
    }
    return hash(password, 12);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    if (!password || !hashedPassword) {
      return false;
    }
    return compare(password, hashedPassword);
  }

  static async hashText(text: string): Promise<string> {
    if (!text || typeof text !== 'string') {
      throw new Error('Text is required');
    }
    return hash(text, 10);
  }
}
