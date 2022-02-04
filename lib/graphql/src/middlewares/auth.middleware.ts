import { verify } from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';
import { getRepository } from 'typeorm';
import { SECRET_KEY } from '@config';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser, DataStoredInToken } from '@interfaces/auth.interface';

export const authMiddleware = async req => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const { id } = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userRepository = getRepository(UserEntity);
      const findUser = await userRepository.findOne(id, { select: ['id', 'email', 'password'] });
      return findUser;
    }

    return null;
  } catch (error) {
    throw new HttpException(401, 'Wrong authentication token');
  }
};

export const authChecker: AuthChecker<RequestWithUser> = async ({ context: { user } }) => {
  if (!user) {
    throw new HttpException(404, 'Authentication token missing');
  }

  return true;
};
