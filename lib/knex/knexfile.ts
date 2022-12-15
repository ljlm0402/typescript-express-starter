import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from './src/config';

export const dbConfig = {
  client: 'mysql',
  connection: {
    charset: 'utf8',
    timezone: 'UTC',
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE,
  },
  migrations: {
    directory: 'src/database/migrations',
    tableName: 'migrations',
    // stub: 'src/database/stubs',
  },
  seeds: {
    directory: 'src/database/seeds',
    // stub: 'src/database/stubs',
  },
};
