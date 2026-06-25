import { hash, compare } from 'bcryptjs';
import crypto from 'node:crypto';

export interface UserPersistenceData {
  id: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreateData {
  email: string;
  password: string;
}

export class User {
  private constructor(
    private readonly _id: string,
    private _email: string,
    private _password: string,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
  ) {}

  // 팩토리 메서드 - 새로운 사용자 생성
  static async create(data: UserCreateData): Promise<User> {
    const id = User.generateId();
    const validatedEmail = User.normalizeEmail(data.email);
    User.validateEmail(validatedEmail);
    const hashedPassword = await User.hashPassword(data.password);

    return new User(id, validatedEmail, hashedPassword);
  }

  // 기존 데이터로부터 복원 (DB에서 조회한 경우)
  static fromPersistence(data: UserPersistenceData): User {
    return new User(
      data.id,
      data.email,
      data.password,
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
    );
  }

  // 비즈니스 로직 - 이메일 변경
  async changeEmail(newEmail: string): Promise<void> {
    const validatedEmail = User.validateEmail(newEmail);
    this._email = validatedEmail;
    this._updatedAt = new Date();
  }

  // 비즈니스 로직 - 패스워드 변경
  async changePassword(newPassword: string): Promise<void> {
    User.validatePassword(newPassword);
    const hashedPassword = await User.hashPassword(newPassword);
    this._password = hashedPassword;
    this._updatedAt = new Date();
  }

  // 패스워드 검증
  async verifyPassword(inputPassword: string): Promise<boolean> {
    return compare(inputPassword, this._password);
  }

  // 도메인 규칙 - 이메일 검증
  private static validateEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required');
    }

    const trimmedEmail = email.trim();

    if (trimmedEmail.length === 0) {
      throw new Error('Email cannot be empty');
    }

    if (trimmedEmail.length > 254) {
      throw new Error('Email is too long (max 254 characters)');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error('Invalid email format');
    }

    return trimmedEmail.toLowerCase();
  }

  // 도메인 규칙 - 패스워드 검증 (테스트를 위해 public)
  static validatePassword(password: string): void {
    if (!password || typeof password !== 'string') {
      throw new Error('Password is required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (password.length > 128) {
      throw new Error('Password is too long (max 128 characters)');
    }

    // 최소 하나의 숫자와 하나의 문자 포함
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    if (!hasNumber || !hasLetter) {
      throw new Error('Password must contain at least one letter and one number');
    }
  }

  // 패스워드 해싱
  private static async hashPassword(password: string): Promise<string> {
    User.validatePassword(password);
    return hash(password, 12); // 보안 강화를 위해 12 rounds 사용
  }

  // ID 생성
  private static generateId(): string {
    return `user_${crypto.randomUUID()}`;
  }

  // 정적 메서드 - 이메일 정규화 (테스트 호환성)
  static normalizeEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required');
    }

    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0) {
      throw new Error('Email cannot be empty');
    }

    return trimmedEmail.toLowerCase();
  }

  // Prisma 호환 메서드 (테스트 호환성)
  static fromPrisma(data: UserPersistenceData): User {
    return User.fromPersistence(data);
  }

  // Getter들 - 외부에서 직접 수정 불가능
  get id(): string {
    return this._id;
  }
  get email(): string {
    return this._email;
  }
  get password(): string {
    return this._password;
  }
  get createdAt(): Date {
    return new Date(this._createdAt);
  } // 방어적 복사
  get updatedAt(): Date {
    return new Date(this._updatedAt);
  } // 방어적 복사

  // 도메인 메서드 - 사용자 정보 업데이트
  async updateProfile(data: { email?: string; password?: string }): Promise<void> {
    let hasChanges = false;

    if (data.email && data.email !== this._email) {
      await this.changeEmail(data.email);
      hasChanges = true;
    }

    if (data.password) {
      await this.changePassword(data.password);
      hasChanges = true;
    }

    if (hasChanges) {
      this._updatedAt = new Date();
    }
  }

  // 영속성을 위한 직렬화
  toPersistence(): UserPersistenceData {
    return {
      id: this._id,
      email: this._email,
      password: this._password,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  // API 응답용 직렬화 (패스워드 제외)
  toResponse(): {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      email: this._email,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  // 동등성 비교
  equals(other: User): boolean {
    return this._id === other._id;
  }
}
