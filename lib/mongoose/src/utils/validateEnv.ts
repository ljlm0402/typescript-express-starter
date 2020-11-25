import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    MONGO_HOST: str(),
    MONGO_PORT: str(),
    MONGO_DATABASE: str(),
    JWT_SECRET: str(),
    PORT: port(),
  });
};

export default validateEnv;
