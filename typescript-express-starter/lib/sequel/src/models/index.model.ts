import { Sequelize } from 'sequelize-typescript';
import User from './users.model';

export const sequelize = new Sequelize(
  process.env.SEQUEL_DATABASE,
  process.env.SEQUEL_USER,
  process.env.SEQUEL_PASSWORD,
  {
    host: process.env.SEQUEL_PATH,
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
  },
);

sequelize.addModels([User]);

sequelize.authenticate().catch((err: Error) => {
  console.error('Unable to connect to the database:', err);
});
