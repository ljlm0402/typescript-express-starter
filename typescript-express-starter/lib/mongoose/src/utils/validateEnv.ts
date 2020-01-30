import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    MONGO_USER: str(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    MONGO_DATABASE: str(),
    JWT_SECRET: str(),
    PORT: port(),
  });
}

export default validateEnv;
