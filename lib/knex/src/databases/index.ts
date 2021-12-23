import config from 'config';
import Knex from 'knex';
import { dbConfig } from '@interfaces/db.interface';

const { host, port, user, password, database }: dbConfig = config.get('dbConfig');
const dbConnection = {
  client: 'mysql',
  connection: {
    charset: 'utf8',
    timezone: 'UTC',
    host: host,
    port: port,
    user: user,
    password: password,
    database: database,
  },
  pool: {
    min: 2,
    max: 10,
  },
};

export default Knex(dbConnection);
