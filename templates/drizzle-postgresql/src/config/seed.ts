import { Hash } from '@utils/hash';
import { db } from './database';
import { users } from './schema';
import { logger } from '@utils/logger';

async function seed() {
  try {
    logger.info('🌱 Starting database seeding...');

    // 기존 데이터 확인
    const existingUsers = await db.select().from(users);

    if (existingUsers.length > 0) {
      logger.info('📋 Users already exist, skipping seed...');
      return;
    }

    // 테스트 사용자 생성
    const testUsers = [
      {
        email: 'admin@example.com',
        password: await Hash.hashPassword('admin123'),
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
      },
      {
        email: 'user@example.com',
        password: await Hash.hashPassword('user123'),
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
      },
      {
        email: 'inactive@example.com',
        password: await Hash.hashPassword('inactive123'),
        firstName: 'Inactive',
        lastName: 'User',
        isActive: false,
      },
    ];

    // 사용자 삽입
    await db.insert(users).values(testUsers);

    logger.info(`✅ Seeded ${testUsers.length} users successfully`);
    logger.info('👤 Test accounts:');
    logger.info('   - admin@example.com (password: admin123)');
    logger.info('   - user@example.com (password: user123)');
    logger.info('   - inactive@example.com (password: inactive123) [inactive]');
  } catch (error) {
    logger.error({ error }, '❌ Seeding failed:');
  } finally {
    process.exit(0);
  }
}

seed();
