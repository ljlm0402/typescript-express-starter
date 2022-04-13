import { EntityManager, EntityRepository, MikroORM, Options } from '@mikro-orm/core';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { BaseEntity, User } from '../entities';
import { NODE_ENV, DB_DATABASE, DB_HOST, DB_PORT } from '@config';

export const options: Options = {
  type: 'mongo',
  clientUrl: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  entities: [BaseEntity, User],
  highlighter: new MongoHighlighter(),
  debug: NODE_ENV === 'development' ? true : false,
};

export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<User>;
};
