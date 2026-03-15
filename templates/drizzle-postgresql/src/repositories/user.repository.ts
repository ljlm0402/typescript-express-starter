import { injectable } from 'tsyringe';
import { eq, and } from 'drizzle-orm';
import { db } from '@config/database';
import { users } from '@config/schema';
import { User, CreateUserData, UpdateUserData } from '@interfaces/user.interface';

@injectable()
export class UsersRepository {
  async findAll(): Promise<User[]> {
    const result = await db.select().from(users);
    return result;
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  }

  async create(userData: CreateUserData): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const result = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async findByEmailAndActive(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.isActive, true)));
    return result[0] || null;
  }

  /**
   * 테스트용 - 모든 사용자 삭제 (데이터베이스 리셋)
   */
  async reset(): Promise<void> {
    await db.delete(users);
  }
}
