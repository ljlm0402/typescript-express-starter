import { User as PrismaUser } from '@prisma/client';

/**
 * 사용자 엔티티 인터페이스
 */
export interface IUser {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 사용자 생성 데이터 인터페이스
 */
export interface IUserCreate {
  email: string;
  password: string;
}

/**
 * 사용자 업데이트 데이터 인터페이스
 */
export interface IUserUpdate {
  email?: string;
  password?: string;
}

/**
 * 사용자 응답 데이터 인터페이스 (비밀번호 제외)
 */
export interface IUserResponse {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Prisma User 타입을 내부 User 인터페이스로 변환
 */
export function toPrismaUser(user: IUser): PrismaUser {
  return user as PrismaUser;
}

/**
 * Prisma User 타입을 내부 User 인터페이스로 변환
 */
export function fromPrismaUser(user: PrismaUser): IUser {
  return user;
}

/**
 * 사용자 응답에서 비밀번호 제거
 */
export function sanitizeUser(user: IUser): IUserResponse {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

/**
 * User 엔티티 클래스
 */
export class User implements IUser {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IUser) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * 이메일 유효성 검증
   */
  static validateEmail(email: string): void {
    if (!email) {
      throw new Error('Email is required');
    }

    if (email.length > 255) {
      throw new Error('Email too long');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  /**
   * 이메일 정규화 (소문자 변환, 공백 제거)
   */
  static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * 패스워드 유효성 검증
   */
  static validatePassword(password: string): void {
    if (password.length < 4) {
      throw new Error('Password must be at least 4 characters');
    }

    if (!/\d/.test(password)) {
      throw new Error('Password must contain at least one number');
    }

    if (!/[a-zA-Z]/.test(password)) {
      throw new Error('Password must contain at least one letter');
    }
  }

  /**
   * Prisma User 객체를 User 인스턴스로 변환
   */
  static fromPrisma(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  /**
   * 비밀번호를 제외한 안전한 사용자 데이터 반환
   */
  toResponse(): IUserResponse {
    return sanitizeUser(this);
  }
}

export type { PrismaUser };
