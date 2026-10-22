import { injectable, inject } from 'tsyringe';
import { HttpException } from '@exceptions/http.exception';
import { IUser, IUserResponse } from '@entities/user.entity';
import { UserRepository, IUserRepository } from '@repositories/user.repository';
import { hashPassword } from '@utils/hash';
import { logger } from '@utils/logger';

/**
 * User Service
 */
@injectable()
export class UserService {
  constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

  /**
   * 모든 사용자 조회
   */
  async getAllUsers(): Promise<IUserResponse[]> {
    try {
      logger.info('Retrieving all users');

      const users = await this.userRepository.findAll();

      const sanitizedUsers = users.map((user) => user.toJSON<IUserResponse>());

      logger.info('Successfully retrieved all users', { count: users.length });
      return sanitizedUsers;
    } catch (error) {
      logger.error('Failed to get all users', { error });
      throw error;
    }
  }

  /**
   * ID로 사용자 조회
   */
  async getUserById(id: string): Promise<IUserResponse> {
    try {
      logger.info('Retrieving user by ID', { userId: id });

      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      const sanitized = user.toJSON<IUserResponse>();

      logger.info('Successfully retrieved user by ID', { userId: id });
      return sanitized;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error('Failed to get user by ID', { error, userId: id });
      throw error;
    }
  }

  /**
   * 이메일로 사용자 조회
   */
  async getUserByEmail(email: string): Promise<IUserResponse | null> {
    try {
      logger.info('Retrieving user by email', { email });

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return null;
      }

      const sanitized = user.toJSON<IUserResponse>();

      logger.info('Successfully retrieved user by email', { email });
      return sanitized;
    } catch (error) {
      logger.error('Failed to get user by email', { error, email });
      throw error;
    }
  }

  /**
   * 사용자 생성
   */
  async createUser(userData: {
    email: string;
    password: string;
  }): Promise<IUserResponse> {
    try {
      logger.info('Creating new user', { email: userData.email });

      // 이메일 중복 확인
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new HttpException(409, 'Email already exists');
      }

      // 비밀번호 해싱
      const hashedPassword = await hashPassword(userData.password);

      // 사용자 생성
      const newUser = await this.userRepository.create({
        email: userData.email,
        password: hashedPassword,
      });

      const sanitized = newUser.toJSON<IUserResponse>();

      logger.info('Successfully created user', {
        userId: newUser._id,
        email: newUser.email,
      });

      return sanitized;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error('Failed to create user', { error, email: userData.email });
      throw error;
    }
  }

  /**
   * 사용자 정보 업데이트
   */
  async updateUser(
    id: string,
    updateData: { email?: string; password?: string },
  ): Promise<IUserResponse> {
    try {
      logger.info('Updating user', { userId: id });

      // 사용자 존재 확인
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new HttpException(404, 'User not found');
      }

      // 이메일 변경 시 중복 확인
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await this.userRepository.findByEmail(updateData.email);
        if (emailExists) {
          throw new HttpException(409, 'Email already exists');
        }
      }

      // 비밀번호 해싱 (필요한 경우)
      const processedUpdateData: Partial<IUser> = { ...updateData };
      if (updateData.password) {
        processedUpdateData.password = await hashPassword(updateData.password);
      }

      // 사용자 업데이트
      const updatedUser = await this.userRepository.update(id, processedUpdateData);
      if (!updatedUser) {
        throw new HttpException(500, 'Failed to update user');
      }

      const sanitized = updatedUser.toJSON<IUserResponse>();

      logger.info('Successfully updated user', { userId: id });
      return sanitized;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error('Failed to update user', { error, userId: id });
      throw error;
    }
  }

  /**
   * 사용자 삭제
   */
  async deleteUser(id: string): Promise<void> {
    try {
      logger.info('Deleting user', { userId: id });

      // 사용자 존재 확인
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new HttpException(404, 'User not found');
      }

      // 사용자 삭제
      const deleted = await this.userRepository.delete(id);
      if (!deleted) {
        throw new HttpException(500, 'Failed to delete user');
      }

      logger.info('Successfully deleted user', { userId: id });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error('Failed to delete user', { error, userId: id });
      throw error;
    }
  }

  /**
   * 사용자 수 조회
   */
  async getUserCount(): Promise<number> {
    try {
      logger.info('Retrieving user count');

      const count = await this.userRepository.count();

      logger.info('Successfully retrieved user count', { count });
      return count;
    } catch (error) {
      logger.error('Failed to get user count', { error });
      throw error;
    }
  }

  /**
   * 사용자 존재 여부 확인
   */
  async userExists(email: string): Promise<boolean> {
    try {
      logger.debug('Checking if user exists', { email });

      const exists = await this.userRepository.exists({ email });

      logger.debug('User existence check completed', { email, exists });
      return exists;
    } catch (error) {
      logger.error('Failed to check user existence', { error, email });
      throw error;
    }
  }
}
