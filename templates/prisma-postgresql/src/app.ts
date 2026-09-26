import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import 'reflect-metadata';

import { NODE_ENV, PORT, LOG_FORMAT, CORS_ORIGIN, CORS_CREDENTIALS } from '@config/env';
import { setupContainer, container } from '@config/container';
import { IDatabaseConnection } from '@config/database';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { NotFoundMiddleware } from '@middlewares/notFound.middleware';
import { logger, stream } from '@utils/logger';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  private database!: IDatabaseConnection;

  constructor(routes: Routes[], apiPrefix = '/api/v1') {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeTrustProxy();
    this.setupDependencies();
    this.initializeMiddlewares();
    this.initializeRoutes(routes, apiPrefix);
    this.initializeErrorHandling();
  }

  /**
   * 의존성 주입 설정
   */
  private setupDependencies(): void {
    setupContainer();
    this.database = container.resolve<IDatabaseConnection>('DatabaseConnection');
  }

  /**
   * 애플리케이션 초기화
   */
  public async initialize(): Promise<void> {
    try {
      logger.info('Initializing application...');

      // 데이터베이스 연결
      await this.database.connect();
      logger.info('Database connected successfully');

      logger.info('Application initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize application', { error });
      throw error;
    }
  }

  /**
   * 애플리케이션 정리
   */
  public async cleanup(): Promise<void> {
    try {
      logger.info('Cleaning up application...');
      await this.database.disconnect();
      logger.info('Application cleanup completed');
    } catch (error) {
      logger.error('Failed to cleanup application', { error });
      throw error;
    }
  }

  /**
   * 서버 시작
   */
  public listen() {
    const server = this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });

    return server;
  }

  /**
   * Express 앱 인스턴스 반환
   */
  public getServer() {
    return this.app;
  }

  /**
   * 데이터베이스 인스턴스 반환
   */
  public getDatabase() {
    return this.database;
  }

  /**
   * 프록시 신뢰 설정
   */
  private initializeTrustProxy(): void {
    // Nginx, Heroku, Cloudflare 등 프록시 환경에서 실제 IP 추출
    this.app.set('trust proxy', 1);
  }

  /**
   * 미들웨어 초기화
   */
  private initializeMiddlewares(): void {
    // Rate Limiting
    this.app.use(
      rateLimit({
        windowMs: 60_000, // 1분
        limit: this.env === 'production' ? 100 : 1000,
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req) =>
          this.env !== 'production' ||
          ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.ip ?? ''),
        message: 'Too many requests from this IP, please try again later.',
      }),
    );

    // Logging
    this.app.use(morgan(LOG_FORMAT || 'dev', { stream }));

    // CORS 설정
    this.app.use(
      cors({
        origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(','),
        credentials: CORS_CREDENTIALS,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    );

    // HPP (HTTP Parameter Pollution) 방지
    this.app.use(hpp());

    // Security Headers
    this.app.use(
      helmet({
        contentSecurityPolicy:
          this.env === 'production'
            ? {
                directives: {
                  defaultSrc: ["'self'"],
                  scriptSrc: ["'self'", "'unsafe-inline'"],
                  objectSrc: ["'none'"],
                  upgradeInsecureRequests: [],
                },
              }
            : false, // 개발 환경에서는 CSP 비활성화
        referrerPolicy: { policy: 'no-referrer' },
      }),
    );

    // Response Compression
    this.app.use(compression());

    // Body Parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Cookie Parser
    this.app.use(cookieParser());
  }

  /**
   * 라우트 초기화
   */
  private initializeRoutes(routes: Routes[], apiPrefix: string): void {
    routes.forEach((route) => {
      this.app.use(apiPrefix, route.router);
    });
  }

  /**
   * 에러 처리 미들웨어 초기화
   */
  private initializeErrorHandling(): void {
    this.app.use(NotFoundMiddleware);
    this.app.use(ErrorMiddleware);
  }
}

export default App;
