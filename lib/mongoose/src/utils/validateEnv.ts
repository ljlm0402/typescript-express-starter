import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    MONGO_HOST: str(),
    MONGO_PORT: str(),
    MONGO_DATABASE: str(),
    JWT_SECRET: str(),
  });
};

export default validateEnv;
