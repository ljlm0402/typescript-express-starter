process.env['NODE_CONFIG_DIR'] = __dirname + '/src/configs';

import config from 'config';
import { dbConfig } from './src/interfaces/db.interface';

const db: dbConfig = config.get('dbConfig');
export = {
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
  migrations: {
    directory: 'src/databases/migrations',
    tableName: 'migrations',
    // stub: 'src/databases/stubs',
  },
  seeds: {
    directory: 'src/databases/seeds',
    // stub: 'src/databases/stubs',
  },
};
