import { DB_HOST, DB_PORT, DB_DATABASE } from '@config';

// export const dbConnection = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

export const dbConnection = {
    url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
  };