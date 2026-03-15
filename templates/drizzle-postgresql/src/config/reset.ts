/**
 * Drizzle PostgreSQL 데이터베이스 리셋 스크립트
 * 모든 테이블을 삭제하고 초기 상태로 되돌립니다.
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import { DATABASE_URL } from './env';
import { logger } from '../utils/logger';

async function resetDatabase(): Promise<void> {
  const connection = postgres(DATABASE_URL);
  const db = drizzle(connection);

  try {
    logger.info('Starting database reset...');

    // 외래 키 제약조건 임시 비활성화
    await db.execute(sql`SET session_replication_role = replica;`);

    // 모든 테이블 목록 조회
    const tables = await db.execute(sql`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename NOT LIKE 'pg_%'
      AND tablename != 'information_schema';
    `);

    if (tables.length === 0) {
      logger.info('No tables found. Database is already empty.');
      return;
    }

    // 모든 테이블 삭제
    logger.info(`Found ${tables.length} tables. Dropping all...`);

    for (const table of tables) {
      const tableName = (table as { tablename: string }).tablename;
      await db.execute(sql`DROP TABLE IF EXISTS ${sql.identifier(tableName)} CASCADE;`);
      logger.info(`Dropped table: ${tableName}`);
    }

    // 마이그레이션 히스토리 테이블도 삭제 (있다면)
    await db.execute(sql`DROP TABLE IF EXISTS __drizzle_migrations CASCADE;`);

    // 외래 키 제약조건 다시 활성화
    await db.execute(sql`SET session_replication_role = DEFAULT;`);

    logger.info('✅ Database reset completed successfully!');
  } catch (error) {
    logger.error({
      msg: '❌ Database reset failed',
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  } finally {
    // 연결 종료
    await connection.end();
    logger.info('Database connection closed.');
  }
}

// 스크립트 실행이면 바로 실행
if (require.main === module) {
  resetDatabase()
    .then(() => {
      logger.info('Reset script completed.');
      process.exit(0);
    })
    .catch((error) => {
      logger.error({
        msg: 'Reset script failed',
        error: error instanceof Error ? error.message : String(error),
      });
      process.exit(1);
    });
}

export { resetDatabase };
