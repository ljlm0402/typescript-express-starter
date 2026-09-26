/**
 * 사용자 인터페이스 정의
 */

export interface IUser {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  email: string;
  password: string;
}

export interface IUserUpdate {
  email?: string;
  password?: string;
}

export interface IUserResponse {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
