import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    MYSQL_USER: str(),
    MYSQL_PASSWORD: str(),
    MYSQL_PATH: str(),
    MYSQL_DATABASE: str(),
    JWT_SECRET: str(),
    PORT: port(),
  });
}

export default validateEnv;
