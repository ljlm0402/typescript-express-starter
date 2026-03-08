import { describe, it, expect, beforeEach } from 'vitest';
import { User } from '@interfaces/users.interface';
import { UsersRepository } from '@repositories/users.repository';
import { UsersService } from '@services/users.service';

describe('UsersService (with UsersRepository)', () => {
  let usersService: UsersService;
  let userRepo: UsersRepository;

  // Sample user data
  const user1: User & { id: string } = { id: '1', email: 'one@example.com', password: 'pw1' };
  const user2: User & { id: string } = { id: '2', email: 'two@example.com', password: 'pw2' };

  beforeEach(async () => {
    userRepo = new UsersRepository();
    userRepo.reset();
    // Directly save users (save is async but await is optional for init)
    await userRepo.save({ ...user1 });
    await userRepo.save({ ...user2 });
    usersService = new UsersService(userRepo);
  });

  it('getAllUsers: should return all users', async () => {
    const users = await usersService.getAllUsers();
    expect(users.length).toBe(2);
    expect(users[0].email).toBe(user1.email);
  });

  it('getUserById: should return user by ID', async () => {
    const user = await usersService.getUserById('2');
    expect(user.email).toBe(user2.email);
  });

  it('getUserById: should throw if ID does not exist', async () => {
    await expect(usersService.getUserById('999')).rejects.toThrow(/not found/);
  });

  it('createUser: should add a new user', async () => {
    const created = await usersService.createUser({
      id: '', // ignored
      email: 'new@example.com',
      password: 'pw3',
    });
    expect(created.email).toBe('new@example.com');
    const all = await usersService.getAllUsers();
    expect(all.length).toBe(3);
  });

  it('createUser: should throw if email already exists', async () => {
    await expect(
      usersService.createUser({
        id: '',
        email: user1.email,
        password: 'pwX',
      }),
    ).rejects.toThrow(/exists/);
  });

  it('updateUser: should update user password', async () => {
    const newPassword = 'newpw';
    const updated = await usersService.updateUser(user2.id as string, {
      id: user2.id as string,
      email: user2.email,
      password: newPassword,
    });
    expect(updated).toBeDefined();
    expect(updated!.password).not.toBe(user2.password); // changed to hashed value
  });

  it('updateUser: should throw if ID does not exist', async () => {
    await expect(
      usersService.updateUser('999', {
        id: '999',
        email: 'no@no.com',
        password: 'no',
      }),
    ).rejects.toThrow(/not found/);
  });

  it('deleteUser: should delete user successfully', async () => {
    await usersService.deleteUser(user1.id as string);
    const users = await usersService.getAllUsers();
    expect(users.length).toBe(1);
    expect(users[0].id).toBe(user2.id);
  });

  it('deleteUser: should throw if ID does not exist', async () => {
    await expect(usersService.deleteUser('999')).rejects.toThrow(/not found/);
  });
});
