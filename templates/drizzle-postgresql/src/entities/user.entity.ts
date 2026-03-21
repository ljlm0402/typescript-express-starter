import { User as UserSchema, NewUser } from '@config/schema';

export type User = UserSchema;

export type CreateUserData = Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>;

export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password'>> {
  password?: string;
}

export type UserResponse = Omit<User, 'password'>;
