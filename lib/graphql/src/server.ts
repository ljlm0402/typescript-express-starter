import { App } from '@/app';
import { AuthResolver } from '@resolvers/auth.resolver';
import { UserResolver } from '@resolvers/users.resolver';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([AuthResolver, UserResolver]);

app.listen();
