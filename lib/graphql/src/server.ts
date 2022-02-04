import App from '@/app';
import validateEnv from '@utils/validateEnv';

import { authResolver } from '@resolvers/auth.resolver';
import { userResolver } from '@resolvers/users.resolver';

validateEnv();

const app = new App([authResolver, userResolver]);

app.listen();
