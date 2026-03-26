import { AppDataSource } from '../data-source';
import { QueryRunner } from 'typeorm';

export class SeedHelper {
  private static queryRunner: QueryRunner | null = null;

  static async startTransaction(): Promise<QueryRunner> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    this.queryRunner = AppDataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    return this.queryRunner;
  }

  static getQueryRunner(): QueryRunner | null {
    return this.queryRunner;
  }

  static async commitTransaction() {
    if (this.queryRunner) {
      await this.queryRunner.commitTransaction();
      await this.queryRunner.release();
      this.queryRunner = null;
    }
  }

  static async rollbackTransaction() {
    if (this.queryRunner) {
      await this.queryRunner.rollbackTransaction();
      await this.queryRunner.release();
      this.queryRunner = null;
    }
  }

  static async clearTable(tableName: string) {
    if (!this.queryRunner) {
      throw new Error('Transaction not started');
    }
    await this.queryRunner.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
    console.log(`  ✓ Cleared table: ${tableName}`);
  }

  static async clearTables(tables: string[]) {
    for (const table of tables) {
      await this.clearTable(table);
    }
  }
}