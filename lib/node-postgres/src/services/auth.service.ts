import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  public async signup(userData: User): Promise<User> {
    const { email, password } = userData;

    const { rows: findUser } = await pg.query(
      `
    SELECT EXISTS(
      SELECT
        "email"
      FROM
        users
      WHERE
        "email" = $1
    )`,
      [email],
    );
    if (findUser[0].exists) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(password, 10);
    const { rows: signUpUserData } = await pg.query(
      `
      INSERT INTO
        users(
          "email",
          "password"
        )
      VALUES ($1, $2)
      RETURNING "email", "password"
      `,
      [email, hashedPassword],
    );

    return signUpUserData[0];
  }

  public async login(userData: User): Promise<{ cookie: string; findUser: User }> {
    const { email, password } = userData;

    const { rows, rowCount } = await pg.query(
      `
      SELECT
        "email",
        "password"
      FROM
        users
      WHERE
        "email" = $1
    `,
      [email],
    );
    if (!rowCount) throw new HttpException(409, `This email ${email} was not found`);

    const isPasswordMatching: boolean = await compare(password, rows[0].password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = createToken(rows[0]);
    const cookie = createCookie(tokenData);
    return { cookie, findUser: rows[0] };
  }

  public async logout(userData: User): Promise<User> {
    const { email, password } = userData;

    const { rows, rowCount } = await pg.query(
      `
    SELECT
        "email",
        "password"
      FROM
        users
      WHERE
        "email" = $1
      AND
        "password" = $2
    `,
      [email, password],
    );
    if (!rowCount) throw new HttpException(409, "User doesn't exist");

    return rows[0];
  }
}
