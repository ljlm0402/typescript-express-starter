/**
 * MongoDB 데이터베이스 리셋 스크립트
 * 모든 컬렉션을 삭제하고 초기 상태로 되돌립니다.
 */

import { connectDB } from './database';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

async function resetDatabase(): Promise<void> {
  try {
    // 데이터베이스 연결
    await connectDB();
    logger.info('Connected to MongoDB for database reset...');

    // 모든 컬렉션 가져오기
    const database = mongoose.connection.db;
    if (!database) throw new Error('MongoDB connection is not ready');
    const collections = await database.collections();

    if (collections.length === 0) {
      logger.info('No collections found. Database is already empty.');
      return;
    }

    // 모든 컬렉션 삭제
    logger.info(`Found ${collections.length} collections. Dropping all...`);

    for (const collection of collections) {
      await collection.drop();
      logger.info(`Dropped collection: ${collection.collectionName}`);
    }

    logger.info('✅ Database reset completed successfully!');
  } catch (error) {
    logger.error('❌ Database reset failed:', error);
    process.exit(1);
  } finally {
    // 연결 종료
    await mongoose.connection.close();
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
      logger.error('Reset script failed:', error);
      process.exit(1);
    });
}

export { resetDatabase };
