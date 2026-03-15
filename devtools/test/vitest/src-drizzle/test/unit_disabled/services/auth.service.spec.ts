import { compare, hash } from 'bcryptjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { UsersRepository } from '@repositories/users.repository';
import { AuthService } from '@services/auth.service';

describe('AuthService (with UserMemoryRepository)', () => {
  let authService: AuthService;
  let userRepo: UsersRepository;
  const testUser: User = {
    id: '1',
    email: 'authuser@example.com',
    password: '', // will be replaced with actual hash
  };

  beforeEach(async () => {
    userRepo = new UsersRepository();
    testUser.password = await hash('plainpw', 10);
    // Add initial user
    await userRepo.save({ ...testUser });
    authService = new AuthService(userRepo); // inject repo
  });

  it('should sign up a new user', async () => {
    const dto: CreateUserDto = {
      email: 'newuser@example.com',
      password: 'newpassword123',
    };
    const created = await authService.signup(dto);
    expect(created.email).toBe(dto.email);

    const found = await userRepo.findByEmail(dto.email);
    expect(found).toBeDefined();
    expect(await compare(dto.password, found!.password)).toBe(true);
  });

  it('should throw an error if email is already in use', async () => {
    const dto: CreateUserDto = {
      email: testUser.email,
      password: 'anypw',
    };
    await expect(authService.signup(dto)).rejects.toThrow(/already in use/);
  });

  it('should return user and cookie on successful login', async () => {
    // Create user with hashed password
    const plainPassword = 'mySecret123';
    const email = 'loginuser@example.com';
    const hashed = await hash(plainPassword, 10);
    await userRepo.save({ id: '2', email, password: hashed });

    const result = await authService.login({ email, password: plainPassword });
    expect(result.user.email).toBe(email);
    expect(result.cookie).toContain('Authorization=');
  });

  it('should throw an error if email or password is incorrect', async () => {
    // Non-existing email
    await expect(authService.login({ email: 'nobody@example.com', password: 'xxx' })).rejects.toThrow(/Invalid email or password/i);

    // Incorrect password
    const email = testUser.email;
    await expect(authService.login({ email, password: 'wrongpw' })).rejects.toThrow(/password/i);
  });

  it('should successfully logout without errors', async () => {
    await expect(authService.logout(testUser)).resolves.toBeUndefined();
  });
});
