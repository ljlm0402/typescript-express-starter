import App from './app';
import IndexRoute from './routes/index.route';
import UsersRoute from './routes/users.route';

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
]);

app.listen();
