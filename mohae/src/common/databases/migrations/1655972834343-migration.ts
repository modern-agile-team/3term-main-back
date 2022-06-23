import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1655972834343 implements MigrationInterface {
  // 마이그레이션 할 수정된 쿼리문
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 예제 쿼리문
    await queryRunner.query(
      'ALTER TABLE `memtions` RENAME COLUMN `category` To `type`',
    );
  }

  // 마이그레이션 적용을 롤백할 때의 쿼리문
  public async down(queryRunner: QueryRunner): Promise<void> {
    // 예제 쿼리문
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `type` TO `category`',
    );
  }
}
