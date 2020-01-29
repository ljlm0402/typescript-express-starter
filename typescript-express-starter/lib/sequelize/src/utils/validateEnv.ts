import { cleanEnv, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    MYSQL_USER: str(),
    MYSQL_PASSWORD: str(),
    MYSQL_PATH: str(),
    MYSQL_DATABASE: str(),
  });
}

export default validateEnv;
