import { Sequelize } from 'sequelize-typescript';
import User from '../models/users.model';
import { logger } from '../utils/logger';

const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST } = process.env;
const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: 'mysql',
  timezone: '+09:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  },
  pool: {
    min: 0,
    max: 30,
    idle: 10000,
    acquire: 30000,
  },
});

sequelize.addModels([User]);

sequelize
  .authenticate()
  .then(() => {
    logger.info('🟢 The database is connected.');
  })
  .catch((error: Error) => {
    logger.error(`🔴 Unable to connect to the database: ${error}.`);
  });

export default sequelize;
