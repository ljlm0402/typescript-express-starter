import { Authorized, Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { CreateUserDto } from '@dtos/users.dto';
import AuthRepository from '@repositories/auth.repository';
import { User } from '@typedefs/users.type';

@Resolver()
export class authResolver extends AuthRepository {
  @Mutation(() => User, {
    description: 'User signup',
  })
  async signup(@Arg('userData') userData: CreateUserDto): Promise<User> {
    const user: User = await this.userSignUp(userData);
    return user;
  }

  @Mutation(() => User, {
    description: 'User login',
  })
  async login(@Arg('userData') userData: CreateUserDto): Promise<User> {
    const { findUser } = await this.userLogIn(userData);
    return findUser;
  }

  @Authorized()
  @Mutation(() => User, {
    description: 'User logout',
  })
  async logout(@Ctx('user') userData: any): Promise<User> {
    const user = await this.userLogOut(userData);
    return user;
  }
}
