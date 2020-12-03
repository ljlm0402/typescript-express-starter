import { ConnectionOptions } from 'typeorm';

export const dbConnection: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRESQL_HOST,
  port: Number(process.env.POSTGRESQL_PORT),
  username: process.env.POSTGRESQL_USERNAME,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [process.env.NODE_ENV === 'production' ? 'build/entity/*{.ts,.js}' : 'src/entity/*{.ts,.js}'],
  migrations: [process.env.NODE_ENV === 'production' ? 'build/migration/*{.ts,.js}' : 'src/migration/*{.ts,.js}'],
  subscribers: [process.env.NODE_ENV === 'production' ? 'build/subscriber/*{.ts,.js}' : 'src/subscriber/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
