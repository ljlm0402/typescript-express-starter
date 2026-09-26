import { PrismaClient } from "@prisma/client";
import { logger } from "@utils/logger";

export interface IDatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<boolean>;
  getClient(): PrismaClient;
}

export class PrismaDatabaseConnection implements IDatabaseConnection {
  private client: PrismaClient;
  private isConnected = false;

  constructor() {
    this.client = new PrismaClient({
      log: [
        { level: "error", emit: "stdout" },
        { level: "info", emit: "stdout" },
        { level: "warn", emit: "stdout" },
      ],
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.isConnected = true;
      logger.info("Database connected successfully");
    } catch (error) {
      this.isConnected = false;
      logger.error(
        `Failed to connect to database: ${(error as Error).message}`
      );
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.$disconnect();
      this.isConnected = false;
      logger.info("Database disconnected successfully");
    } catch (error) {
      logger.error(
        `Failed to disconnect from database: ${(error as Error).message}`
      );
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error(`Database health check failed: ${(error as Error).message}`);
      return false;
    }
  }

  getClient(): PrismaClient {
    return this.client;
  }

  get connected(): boolean {
    return this.isConnected;
  }
}
