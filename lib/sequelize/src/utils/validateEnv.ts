import { cleanEnv, port, str } from 'envalid';

export function ValidateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
  });
}
