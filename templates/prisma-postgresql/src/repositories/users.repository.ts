import { PrismaClient } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { User } from '@interfaces/users.interface';
import { PrismaDatabaseConnection } from '@config/database';

export interface IUsersRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
  update(id: string, update: User): Promise<User | undefined>;
  delete(id: string): Promise<boolean>;
}

@injectable()
export class UsersRepository implements IUsersRepository {
  private prisma: PrismaClient;

  constructor() {
    // container에서 등록된 인스턴스를 가져올 것임
    this.prisma = new PrismaClient();
  }

  setPrismaClient(client: PrismaClient) {
    this.prisma = client;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    return users;
  }

  async findById(id: string): Promise<User | undefined> {
    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid user ID format');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    return user || undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    return user || undefined;
  }

  async save(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id as string,
        email: user.email,
        password: user.password,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    return created;
  }

  async update(id: string, update: User): Promise<User | undefined> {
    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid user ID format');
    }

    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data: {
          ...(update.email && { email: update.email }),
          ...(update.password && { password: update.password }),
        },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });
      return updated;
    } catch (error) {
      // 사용자가 존재하지 않는 경우
      return undefined;
    }
  }

  async delete(id: string): Promise<boolean> {
    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid user ID format');
    }

    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // 사용자가 존재하지 않는 경우
      return false;
    }
  }
}
