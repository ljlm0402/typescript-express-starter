import { injectable } from 'tsyringe';
import { Types, FilterQuery, UpdateQuery } from 'mongoose';
import { UserModel, IUser } from '@entities/user.entity';
import { logger } from '@utils/logger';

/**
 * User Repository Interface
 */
export interface IUserRepository {
  create(userData: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByEmailWithPassword(email: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  update(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
  exists(filter: FilterQuery<IUser>): Promise<boolean>;
  count(): Promise<number>;
}

/**
 * User Repository 구현
 */
@injectable()
export class UserRepository implements IUserRepository {
  /**
   * 사용자 생성
   */
  async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      logger.debug('Creating new user', { email: userData.email });

      const user = new UserModel(userData);
      const savedUser = await user.save();

      logger.info('User created successfully', {
        userId: savedUser._id,
        email: savedUser.email,
      });

      return savedUser;
    } catch (error) {
      logger.error('Failed to create user', { error, userData: { email: userData.email } });
      throw error;
    }
  }

  /**
   * ID로 사용자 조회
   */
  async findById(id: string): Promise<IUser | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }

      const user = await UserModel.findById(id);

      if (user) {
        logger.debug('User found by ID', { userId: id });
      }

      return user;
    } catch (error) {
      logger.error('Failed to find user by ID', { error, userId: id });
      throw error;
    }
  }

  /**
   * 이메일로 사용자 조회 (비밀번호 제외)
   */
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({
        email: email.toLowerCase(),
      });

      if (user) {
        logger.debug('User found by email', { email });
      }

      return user;
    } catch (error) {
      logger.error('Failed to find user by email', { error, email });
      throw error;
    }
  }

  /**
   * 이메일로 사용자 조회 (비밀번호 포함)
   */
  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({
        email: email.toLowerCase(),
      }).select('+password');

      if (user) {
        logger.debug('User found by email with password', { email });
      }

      return user;
    } catch (error) {
      logger.error('Failed to find user by email with password', { error, email });
      throw error;
    }
  }

  /**
   * 모든 사용자 조회
   */
  async findAll(): Promise<IUser[]> {
    try {
      const users = await UserModel.find({}).sort({ createdAt: -1 });

      logger.debug('Retrieved all users', { count: users.length });

      return users;
    } catch (error) {
      logger.error('Failed to find all users', { error });
      throw error;
    }
  }

  /**
   * 사용자 정보 업데이트
   */
  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }

      // password 필드가 있으면 updatedAt도 현재 시간으로 설정
      const updateQuery: UpdateQuery<IUser> = {
        ...updateData,
        updatedAt: new Date(),
      };

      const user = await UserModel.findByIdAndUpdate(id, updateQuery, {
        new: true, // 업데이트된 문서 반환
        runValidators: true, // 스키마 검증 실행
      });

      if (user) {
        logger.info('User updated successfully', { userId: id });
      }

      return user;
    } catch (error) {
      logger.error('Failed to update user', { error, userId: id });
      throw error;
    }
  }

  /**
   * 사용자 삭제
   */
  async delete(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return false;
      }

      const result = await UserModel.findByIdAndDelete(id);

      if (result) {
        logger.info('User deleted successfully', { userId: id });
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Failed to delete user', { error, userId: id });
      throw error;
    }
  }

  /**
   * 사용자 존재 여부 확인
   */
  async exists(filter: FilterQuery<IUser>): Promise<boolean> {
    try {
      const count = await UserModel.countDocuments(filter);
      return count > 0;
    } catch (error) {
      logger.error('Failed to check user existence', { error, filter });
      throw error;
    }
  }

  /**
   * 총 사용자 수 조회
   */
  async count(): Promise<number> {
    try {
      const count = await UserModel.countDocuments();
      logger.debug('User count retrieved', { count });
      return count;
    } catch (error) {
      logger.error('Failed to count users', { error });
      throw error;
    }
  }
}
