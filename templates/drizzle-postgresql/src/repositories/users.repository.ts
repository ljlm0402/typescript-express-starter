import { singleton } from 'tsyringe';
import { eq } from 'drizzle-orm';
import { db } from '@config/database';
import { users, User, NewUser } from '@config/schema';

export interface IUsersRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, update: Partial<User>): Promise<User | undefined>;
  delete(id: string): Promise<boolean>;
  reset(): Promise<void>; // 테스트용 메소드
}

@singleton()
export class UsersRepository implements IUsersRepository {
  async findAll(): Promise<User[]> {
    const result = await db.select().from(users);
    return result;
  }

  async findById(id: string): Promise<User | undefined> {
    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid user ID format');
    }

    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async save(user: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: NewUser = {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive ?? true,
    };

    const result = await db.insert(users).values(newUser).returning();
    return result[0];
  }

  async update(id: string, update: Partial<User>): Promise<User | undefined> {
    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid user ID format');
    }

    const updateData: Partial<NewUser> = {};

    if (update.email !== undefined) updateData.email = update.email;
    if (update.password !== undefined) updateData.password = update.password;
    if (update.firstName !== undefined) updateData.firstName = update.firstName;
    if (update.lastName !== undefined) updateData.lastName = update.lastName;
    if (update.isActive !== undefined) updateData.isActive = update.isActive;

    // Always update the updatedAt timestamp
    updateData.updatedAt = new Date();

    const result = await db.update(users).set(updateData).where(eq(users.id, id)).returning();

    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid user ID format');
    }

    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async reset(): Promise<void> {
    // 테스트용 메소드: 모든 사용자 데이터 삭제
    await db.delete(users);
  }
}
