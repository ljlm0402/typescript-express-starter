import { User, type UserCreateData } from '@entities/user.entity';
import { UsersRepository } from '@repositories/users.repository';
import { UsersService } from '@services/users.service';

describe('UsersService (with UsersRepository)', () => {
  let usersService: UsersService;
  let userRepo: UsersRepository;

  beforeEach(async () => {
    userRepo = new UsersRepository();
    userRepo.reset();

    // Create test users using Entity
    const user1 = await User.create({
      email: 'one@example.com',
      password: 'password1',
    });
    const user2 = await User.create({
      email: 'two@example.com',
      password: 'password2',
    });

    await userRepo.save(user1);
    await userRepo.save(user2);
    usersService = new UsersService(userRepo);
  });

  it('getAllUsers: should return all users', async () => {
    const users = await usersService.getAllUsers();
    expect(users.length).toBe(2);
    expect(users.map((u) => u.email)).toContain('one@example.com');
    expect(users.map((u) => u.email)).toContain('two@example.com');
  });

  it('getUserById: should return user by ID', async () => {
    const users = await usersService.getAllUsers();
    const targetUser = users.find((u) => u.email === 'two@example.com');
    expect(targetUser).toBeDefined();

    const user = await usersService.getUserById(targetUser!.id);
    expect(user.email).toBe('two@example.com');
  });

  it('getUserById: should throw if ID does not exist', async () => {
    await expect(usersService.getUserById('999')).rejects.toThrow(/not found/);
  });

  it('createUser: should add a new user', async () => {
    const userData: UserCreateData = {
      email: 'new@example.com',
      password: 'newpass3',
    };

    const created = await usersService.createUser(userData);
    expect(created.email).toBe('new@example.com');
    const all = await usersService.getAllUsers();
    expect(all.length).toBe(3);
  });

  it('createUser: should throw if email already exists', async () => {
    const userData: UserCreateData = {
      email: 'one@example.com', // already exists
      password: 'password9',
    };

    await expect(usersService.createUser(userData)).rejects.toThrow(/exists/);
  });

  it('updateUser: should update user password', async () => {
    const users = await usersService.getAllUsers();
    const targetUser = users.find((u) => u.email === 'two@example.com');
    expect(targetUser).toBeDefined();

    const updateData = {
      email: 'updated@example.com',
      password: 'newpass1',
    };

    const updated = await usersService.updateUser(targetUser!.id, updateData);
    expect(updated).toBeDefined();
    expect(updated.email).toBe('updated@example.com');
  });

  it('updateUser: should throw if ID does not exist', async () => {
    const updateData = {
      email: 'no@no.com',
      password: 'nopass12',
    };

    await expect(usersService.updateUser('nonexistent-id', updateData)).rejects.toThrow(
      /not found/,
    );
  });

  it('deleteUser: should delete user successfully', async () => {
    const users = await usersService.getAllUsers();
    const userToDelete = users.find((u) => u.email === 'one@example.com');
    expect(userToDelete).toBeDefined();

    await usersService.deleteUser(userToDelete!.id);
    const remaining = await usersService.getAllUsers();
    expect(remaining.length).toBe(1);
    expect(remaining.find((u) => u.id === userToDelete!.id)).toBeUndefined();
  });

  it('deleteUser: should throw if ID does not exist', async () => {
    await expect(usersService.deleteUser('nonexistent-id')).rejects.toThrow(/not found/);
  });
});
