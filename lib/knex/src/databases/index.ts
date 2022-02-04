import Knex from 'knex';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '@config';

const dbConnection = {
  client: 'mysql',
  connection: {
    charset: 'utf8',
    timezone: 'UTC',
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  },
  pool: {
    min: 2,
    max: 10,
  },
};

export default Knex(dbConnection);
