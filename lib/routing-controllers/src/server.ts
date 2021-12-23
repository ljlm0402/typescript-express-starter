import 'dotenv/config';
import '@/index';
import App from '@/app';
import { AuthController } from '@controllers/auth.controller';
import { IndexController } from '@controllers/index.controller';
import { UsersController } from '@controllers/users.controller';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([AuthController, IndexController, UsersController]);
app.listen();
