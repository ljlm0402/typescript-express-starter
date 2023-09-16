import { hash } from 'bcrypt';
import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const { rows } = await pg.query(`
    SELECT
      *
    FROM
      users
    `);
    return rows;
  }

  public async findUserById(userId: number): Promise<User> {
    const { rows, rowCount } = await pg.query(
      `
    SELECT
      *
    FROM
      users
    WHERE
      id = $1
    `,
      [userId],
    );
    if (!rowCount) throw new HttpException(409, "User doesn't exist");

    return rows[0];
  }

  public async createUser(userData: User): Promise<User> {
    const { email, password } = userData;

    const { rows } = await pg.query(
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
    if (rows[0].exists) throw new HttpException(409, `This email ${email} already exists`);

    const hashedPassword = await hash(password, 10);
    const { rows: createUserData } = await pg.query(
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

    return createUserData[0];
  }

  public async updateUser(userId: number, userData: User): Promise<User[]> {
    const { rows: findUser } = await pg.query(
      `
      SELECT EXISTS(
        SELECT
          "id"
        FROM
          users
        WHERE
          "id" = $1
      )`,
      [userId],
    );
    if (findUser[0].exists) throw new HttpException(409, "User doesn't exist");

    const { email, password } = userData;
    const hashedPassword = await hash(password, 10);
    const { rows: updateUserData } = await pg.query(
      `
      UPDATE
        users
      SET
        "email" = $2,
        "password" = $3
      WHERE
        "id" = $1
      RETURNING "email", "password"
    `,
      [userId, email, hashedPassword],
    );

    return updateUserData;
  }

  public async deleteUser(userId: number): Promise<User[]> {
    const { rows: findUser } = await pg.query(
      `
      SELECT EXISTS(
        SELECT
          "id"
        FROM
          users
        WHERE
          "id" = $1
      )`,
      [userId],
    );
    if (findUser[0].exists) throw new HttpException(409, "User doesn't exist");

    const { rows: deleteUserData } = await pg.query(
      `
      DELETE
      FROM
        users
      WHERE
        id = $1
      RETURNING "email", "password"
      `,
      [userId],
    );

    return deleteUserData;
  }
}
