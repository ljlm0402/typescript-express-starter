import { DB_HOST, DB_PORT, DB_DATABASE } from '@config';

export const dbConnection = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
