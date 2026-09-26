import { ilike, eq, or } from 'drizzle-orm';
import { db } from '@config/database';
import { users, User, NewUser } from '@config/schema';
import { HttpException } from '@exceptions/http.exception';

export interface SimpleQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SimplePaginatedResult {
  users: User[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IUsersRepository {
  findAll(): Promise<User[]>;
  findAllPaginated(options: SimpleQuery): Promise<SimplePaginatedResult>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, update: Partial<User>): Promise<User | undefined>;
  delete(id: string): Promise<boolean>;
  reset(): Promise<void>; // 테스트용 메소드
}

export class UsersRepository implements IUsersRepository {
  private readonly uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  async findAll(): Promise<User[]> {
    const result = await db.select().from(users);
    return result;
  }

  async findAllPaginated(options: SimpleQuery): Promise<SimplePaginatedResult> {
    const { page = 1, limit = 10, search } = options;
    const offset = (page - 1) * limit;
    const searchFilter = search
      ? or(
          ilike(users.email, `%${search}%`),
          ilike(users.firstName, `%${search}%`),
          ilike(users.lastName, `%${search}%`),
        )
      : undefined;

    const filteredUsers = searchFilter
      ? await db.select().from(users).where(searchFilter)
      : await db.select().from(users);

    const paginatedUsers = filteredUsers.slice(offset, offset + limit);
    const total = filteredUsers.length;

    return {
      users: paginatedUsers,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<User | undefined> {
    this.assertValidId(id);

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
    this.assertValidId(id);

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
    this.assertValidId(id);

    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async reset(): Promise<void> {
    // 테스트용 메소드: 모든 사용자 데이터 삭제
    await db.delete(users);
  }

  private assertValidId(id: string): void {
    if (!this.uuidRegex.test(id)) {
      throw new HttpException(404, 'User not found');
    }
  }
}
