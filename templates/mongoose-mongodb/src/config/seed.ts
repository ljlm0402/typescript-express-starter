import { connectDB, disconnectDB } from './database';
import { UserModel } from '@entities/user.entity';
import { hashPassword } from '@utils/hash';
import { logger } from '@utils/logger';

/**
 * 시드 데이터 생성
 */
async function seedDatabase(): Promise<void> {
  try {
    logger.info('🌱 Starting database seeding...');

    // 기존 사용자 데이터 삭제 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      await UserModel.deleteMany({});
      logger.info('🗑️ Cleared existing user data');
    }

    // 테스트 사용자 데이터 생성
    const testUsers = [
      {
        email: 'admin@example.com',
        password: await hashPassword('admin123'),
      },
      {
        email: 'user@example.com',
        password: await hashPassword('user123'),
      },
      {
        email: 'test@example.com',
        password: await hashPassword('test123'),
      },
    ];

    // 사용자 데이터 삽입
    const createdUsers = await UserModel.insertMany(testUsers);

    logger.info(`✅ Created ${createdUsers.length} test users:`);
    createdUsers.forEach((user, index) => {
      logger.info(`  ${index + 1}. ${user.email} (ID: ${user._id})`);
    });

    logger.info('🌱 Database seeding completed successfully!');
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    throw error;
  }
}

/**
 * 스크립트 실행부
 */
async function main(): Promise<void> {
  try {
    // MongoDB 연결
    await connectDB();

    // 시드 데이터 생성
    await seedDatabase();

    // 연결 해제
    await disconnectDB();

    logger.info('✅ Seed script completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed script failed:', error);
    await disconnectDB();
    process.exit(1);
  }
}

// 스크립트가 직접 실행된 경우에만 main 함수 실행
if (require.main === module) {
  main();
}

export { seedDatabase };
