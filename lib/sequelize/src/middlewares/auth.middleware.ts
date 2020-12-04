import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface';
import DB from '../database';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies;

    if (cookies && cookies.Authorization) {
      const secret = process.env.JWT_SECRET;
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
      const userId = verificationResponse.id;
      const findUser = await DB.Users.findByPk(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
