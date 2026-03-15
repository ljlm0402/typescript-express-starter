import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './database';
import { logger } from '@utils/logger';

async function runMigration() {
  try {
    logger.info('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    logger.info('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Migration failed:');
    process.exit(1);
  }
}

runMigration();
