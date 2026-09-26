import { PrismaClient } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { IUser, IUserCreate, IUserUpdate, fromPrismaUser } from '@entities/user.entity';
import { IDatabaseConnection } from '@config/database';
import { logger } from '@utils/logger';

// 단순한 쿼리 옵션
export interface SimpleQuery {
  page?: number;
  limit?: number;
  search?: string;
}

// 단순한 페이지네이션 응답
export interface SimplePaginatedResult {
  users: IUser[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * 사용자 레포지토리 인터페이스
 */
export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findAllPaginated(options: SimpleQuery): Promise<SimplePaginatedResult>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(userData: IUserCreate): Promise<IUser>;
  update(id: string, updateData: IUserUpdate): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
  count(search?: string): Promise<number>;
}

/**
 * Prisma 사용자 레포지토리 구현
 */
@injectable()
export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor(@inject('DatabaseConnection') private databaseConnection: IDatabaseConnection) {
    this.prisma = this.databaseConnection.getClient();
  }

  /**
   * 모든 사용자 조회
   */
  async findAll(): Promise<IUser[]> {
    try {
      logger.debug('Fetching all users');
      const users = await this.prisma.user.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      logger.debug(`Found ${users.length} users`);
      return users.map(fromPrismaUser);
    } catch (error) {
      logger.error('Failed to fetch all users', { error });
      throw error;
    }
  }

  /**
   * 페이지네이션된 사용자 조회
   */
  async findAllPaginated(options: SimpleQuery): Promise<SimplePaginatedResult> {
    try {
      const { page = 1, limit = 10, search } = options;

      logger.debug('Fetching paginated users', { page, limit, search });

      // 검색 조건 구성
      const where = search
        ? {
            email: {
              contains: search,
              mode: 'insensitive' as const,
            },
          }
        : {};

      // 전체 개수 조회
      const total = await this.prisma.user.count({ where });

      // 페이지네이션된 데이터 조회
      const skip = (page - 1) * limit;
      const users = await this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      logger.debug(`Found ${users.length} users out of ${total} total`, { page, limit });

      return {
        users: users.map(fromPrismaUser),
        page,
        limit,
        total,
        totalPages,
      };
    } catch (error) {
      logger.error('Failed to fetch paginated users', { error, options });
      throw error;
    }
  }

  /**
   * 사용자 개수 조회
   */
  async count(search?: string): Promise<number> {
    try {
      const where = search
        ? {
            email: {
              contains: search,
              mode: 'insensitive' as const,
            },
          }
        : {};

      const count = await this.prisma.user.count({ where });
      logger.debug('User count', { count, search });
      return count;
    } catch (error) {
      logger.error('Failed to count users', { error, search });
      throw error;
    }
  }

  /**
   * ID로 사용자 조회
   */
  async findById(id: string): Promise<IUser | null> {
    try {
      logger.debug('Fetching user by id', { id });
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        logger.debug('User not found', { id });
        return null;
      }
      logger.debug('User found', { id, email: user.email });
      return fromPrismaUser(user);
    } catch (error) {
      logger.error('Failed to fetch user by id', { id, error });
      throw error;
    }
  }

  /**
   * 이메일로 사용자 조회
   */
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      logger.debug('Fetching user by email', { email });
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        logger.debug('User not found', { email });
        return null;
      }
      logger.debug('User found', { id: user.id, email });
      return fromPrismaUser(user);
    } catch (error) {
      logger.error('Failed to fetch user by email', { email, error });
      throw error;
    }
  }

  /**
   * 사용자 생성
   */
  async create(userData: IUserCreate): Promise<IUser> {
    try {
      logger.debug('Creating new user', { email: userData.email });
      const user = await this.prisma.user.create({
        data: userData,
      });
      logger.info('User created successfully', { id: user.id, email: user.email });
      return fromPrismaUser(user);
    } catch (error) {
      logger.error('Failed to create user', { email: userData.email, error });
      throw error;
    }
  }

  /**
   * 사용자 정보 수정
   */
  async update(id: string, updateData: IUserUpdate): Promise<IUser | null> {
    try {
      logger.debug('Updating user', { id, updateData });

      // 사용자 존재 확인
      const existingUser = await this.findById(id);
      if (!existingUser) {
        logger.warn('User not found for update', { id });
        return null;
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });

      logger.info('User updated successfully', { id, email: user.email });
      return fromPrismaUser(user);
    } catch (error) {
      logger.error('Failed to update user', { id, error });
      throw error;
    }
  }

  /**
   * 사용자 삭제
   */
  async delete(id: string): Promise<boolean> {
    try {
      logger.debug('Deleting user', { id });

      // 사용자 존재 확인
      const existingUser = await this.findById(id);
      if (!existingUser) {
        logger.warn('User not found for deletion', { id });
        return false;
      }

      await this.prisma.user.delete({
        where: { id },
      });

      logger.info('User deleted successfully', { id });
      return true;
    } catch (error) {
      logger.error('Failed to delete user', { id, error });
      throw error;
    }
  }
}
