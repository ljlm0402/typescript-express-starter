import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    POSTGRESQL_HOST: str(),
    POSTGRESQL_PORT: port(),
    POSTGRESQL_USERNAME: str(),
    POSTGRESQL_PASSWORD: str(),
    POSTGRESQL_DATABASE: str(),
    JWT_SECRET: str(),
  });
};

export default validateEnv;
