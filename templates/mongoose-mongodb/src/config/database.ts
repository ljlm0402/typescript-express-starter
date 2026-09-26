import mongoose from 'mongoose';
import { MONGODB_URI, NODE_ENV } from './env';
import { logger } from '@utils/logger';

/**
 * MongoDB 연결 옵션
 */
const mongooseOptions: mongoose.ConnectOptions = {
  maxPoolSize: 10, // 최대 연결 풀 크기
  serverSelectionTimeoutMS: 5000, // 서버 선택 타임아웃
  socketTimeoutMS: 45000, // 소켓 타임아웃
  bufferCommands: false, // 연결되지 않은 상태에서 명령 버퍼링 비활성화
  bufferMaxEntries: 0, // 버퍼 최대 항목 수
};

/**
 * MongoDB 연결 함수
 */
export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false);

    // 개발 환경에서 디버깅 활성화
    if (NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }

    const conn = await mongoose.connect(MONGODB_URI, mongooseOptions);

    logger.info(
      `🚀 Connected to MongoDB: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`,
    );
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * MongoDB 연결 해제 함수
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('📴 Disconnected from MongoDB');
  } catch (error) {
    logger.error('❌ MongoDB disconnection error:', error);
  }
};

/**
 * MongoDB 연결 상태 확인
 */
export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

/**
 * MongoDB 연결 이벤트 핸들러
 */
mongoose.connection.on('connected', () => {
  logger.info('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  logger.error('❌ Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('📴 Mongoose disconnected from MongoDB');
});

// 애플리케이션 종료 시 연결 정리
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});
