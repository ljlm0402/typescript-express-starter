import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import IndexRoute from './routes/index.route';
import UsersRoute from './routes/users.route';
import AuthRoute from './routes/auth.route';

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
]);

app.listen();
