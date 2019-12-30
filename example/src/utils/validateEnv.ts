import { cleanEnv, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
  });
}

export default validateEnv;
