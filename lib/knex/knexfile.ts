process.env['NODE_CONFIG_DIR'] = __dirname + '/src/configs';

import config from 'config';
import { dbConfig } from './src/interfaces/db.interface';

const { host, user, password, database, port }: dbConfig = config.get('dbConfig');
export = {
  client: 'mysql',
  connection: {
    charset: 'utf8',
    timezone: 'UTC',
    host: host,
    user: user,
    password: password,
    database: database,
    port: port,
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
