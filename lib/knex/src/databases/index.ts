import config from 'config';
import Knex from 'knex';
import { dbConfig } from '@interfaces/db.interface';

const db: dbConfig = config.get('dbConfig');
const dbConnection = {
  client: 'mysql',
  connection: {
    charset: 'utf8',
    timezone: 'UTC',
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
    port: db.port,
  },
  pool: {
    min: 2,
    max: 10,
  },
};

export default Knex(dbConnection);
