import { injectable, inject } from 'tsyringe';
import {
  IUser,
  IUserCreate,
  IUserUpdate,
  IUserResponse,
  sanitizeUser,
} from '@entities/user.entity';
import { IUserRepository } from '@repositories/user.repository';
import { HttpException } from '@exceptions/httpException';
import { logger } from '@utils/logger';
import { hashPassword } from '@utils/hash';

/**
 * 사용자 서비스 인터페이스
 */
export interface IUserService {
  findAllUsers(): Promise<IUserResponse[]>;
  findUserById(id: string): Promise<IUserResponse>;
  createUser(userData: IUserCreate): Promise<IUserResponse>;
  updateUser(id: string, updateData: IUserUpdate): Promise<IUserResponse>;
  deleteUser(id: string): Promise<void>;
}

/**
 * 사용자 서비스 구현
 */
@injectable()
export class UserService implements IUserService {
  constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

  /**
   * 모든 사용자 조회
   */
  async findAllUsers(): Promise<IUserResponse[]> {
    try {
      logger.debug('UserService: Finding all users');
      const users = await this.userRepository.findAll();
      const sanitizedUsers = users.map(sanitizeUser);
      logger.debug('UserService: Found users', { count: sanitizedUsers.length });
      return sanitizedUsers;
    } catch (error) {
      logger.error('UserService: Failed to find all users', { error });
      throw new HttpException(500, 'Failed to retrieve users');
    }
  }

  /**
   * ID로 사용자 조회
   */
  async findUserById(id: string): Promise<IUserResponse> {
    try {
      logger.debug('UserService: Finding user by id', { id });
      const user = await this.userRepository.findById(id);

      if (!user) {
        logger.warn('UserService: User not found', { id });
        throw new HttpException(404, 'User not found');
      }

      const sanitizedUser = sanitizeUser(user);
      logger.debug('UserService: Found user', { id, email: sanitizedUser.email });
      return sanitizedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error('UserService: Failed to find user by id', { id, error });
      throw new HttpException(500, 'Failed to retrieve user');
    }
  }

  /**
   * 사용자 생성
   */
  async createUser(userData: IUserCreate): Promise<IUserResponse> {
    try {
      logger.debug('UserService: Creating user', { email: userData.email });

      // 이메일 중복 확인
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        logger.warn('UserService: Email already exists', { email: userData.email });
        throw new HttpException(409, 'Email already exists');
      }

      // 비밀번호 해싱
      const hashedPassword = await hashPassword(userData.password);
      const newUserData = {
        ...userData,
        password: hashedPassword,
      };

      const user = await this.userRepository.create(newUserData);
      const sanitizedUser = sanitizeUser(user);

      logger.info('UserService: User created successfully', { id: user.id, email: user.email });
      return sanitizedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error('UserService: Failed to create user', { email: userData.email, error });
      throw new HttpException(500, 'Failed to create user');
    }
  }

  /**
   * 사용자 정보 수정
   */
  async updateUser(id: string, updateData: IUserUpdate): Promise<IUserResponse> {
    try {
      logger.debug('UserService: Updating user', { id, updateData });

      // 이메일 중복 확인 (다른 사용자가 같은 이메일 사용하는지)
      if (updateData.email) {
        const existingUser = await this.userRepository.findByEmail(updateData.email);
        if (existingUser && existingUser.id !== id) {
          logger.warn('UserService: Email already exists', { email: updateData.email });
          throw new HttpException(409, 'Email already exists');
        }
      }

      // 비밀번호 해싱 (비밀번호 변경 시)
      const processedUpdateData = { ...updateData };
      if (updateData.password) {
        processedUpdateData.password = await hashPassword(updateData.password);
      }

      const user = await this.userRepository.update(id, processedUpdateData);
      if (!user) {
        logger.warn('UserService: User not found for update', { id });
        throw new HttpException(404, 'User not found');
      }

      const sanitizedUser = sanitizeUser(user);
      logger.info('UserService: User updated successfully', { id, email: user.email });
      return sanitizedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error('UserService: Failed to update user', { id, error });
      throw new HttpException(500, 'Failed to update user');
    }
  }

  /**
   * 사용자 삭제
   */
  async deleteUser(id: string): Promise<void> {
    try {
      logger.debug('UserService: Deleting user', { id });

      const deleted = await this.userRepository.delete(id);
      if (!deleted) {
        logger.warn('UserService: User not found for deletion', { id });
        throw new HttpException(404, 'User not found');
      }

      logger.info('UserService: User deleted successfully', { id });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error('UserService: Failed to delete user', { id, error });
      throw new HttpException(500, 'Failed to delete user');
    }
  }
}
