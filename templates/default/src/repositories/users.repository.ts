import { singleton } from 'tsyringe';
import { HttpException } from '@exceptions/http.exception';
import { User, type UserPersistenceData } from '@entities/user.entity';

// 단순한 쿼리 옵션
export interface SimpleQuery {
  page?: number;
  limit?: number;
  search?: string;
}

// 단순한 페이지네이션 응답
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
  save(user: User): Promise<User>;
  update(id: string, user: User): Promise<User | undefined>;
  delete(id: string): Promise<boolean>;
  count(search?: string): Promise<number>;
}

@singleton()
export class UsersRepository implements IUsersRepository {
  private users: UserPersistenceData[] = [];

  async findAll(): Promise<User[]> {
    return this.users.map((userData) => User.fromPersistence(userData));
  }

  async findAllPaginated(options: SimpleQuery): Promise<SimplePaginatedResult> {
    const { page = 1, limit = 10, search } = options;

    // 검색 필터링
    let filteredUsers = this.users;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = this.users.filter((user) => user.email.toLowerCase().includes(searchLower));
    }

    // 페이지네이션 계산
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    const users = paginatedUsers.map((userData) => User.fromPersistence(userData));

    return {
      users,
      page,
      limit,
      total,
      totalPages,
    };
  }

  async count(search?: string): Promise<number> {
    if (!search) return this.users.length;

    const searchLower = search.toLowerCase();
    return this.users.filter((user) => user.email.toLowerCase().includes(searchLower)).length;
  }

  async findById(id: string): Promise<User | undefined> {
    // UUID 형식 검증 (user_ prefix 허용)
    const cleanId = id.startsWith('user_') ? id.substring(5) : id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(cleanId)) {
      throw new HttpException(404, 'User not found');
    }

    const userData = this.users.find((u) => u.id === id);
    return userData ? User.fromPersistence(userData) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const userData = this.users.find((u) => u.email === email.toLowerCase());
    return userData ? User.fromPersistence(userData) : undefined;
  }

  async save(user: User): Promise<User> {
    const persistenceData = user.toPersistence();
    this.users.push(persistenceData);
    return user;
  }

  async update(id: string, user: User): Promise<User | undefined> {
    // UUID 형식 검증 (user_ prefix 허용)
    const cleanId = id.startsWith('user_') ? id.substring(5) : id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(cleanId)) {
      throw new Error('Invalid user ID format');
    }

    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;

    this.users[idx] = user.toPersistence();
    return user;
  }

  async delete(id: string): Promise<boolean> {
    // UUID 형식 검증 (user_ prefix 허용)
    const cleanId = id.startsWith('user_') ? id.substring(5) : id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(cleanId)) {
      throw new Error('Invalid user ID format');
    }

    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    this.users.splice(idx, 1);
    return true;
  }

  reset() {
    this.users = [];
  }
}
