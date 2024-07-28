import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * TypeORM does not support vector type, so this migration file was updated to
 * configure vector field and index.
 */
export class EmbeddingCreate1722096494629 implements MigrationInterface {
  name = "EmbeddingCreate1722096494629";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);
    await queryRunner.query(
      `CREATE TABLE "embedding" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "document" character varying NOT NULL, "embedding" vector(1536) NOT NULL, "metadata" jsonb NOT NULL, CONSTRAINT "PK_9457e810efc9c802fe5047347d6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "embeddingIndex" ON "embedding" USING hnsw ("embedding" vector_cosine_ops);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "embeddingIndex"`);
    await queryRunner.query(`DROP TABLE "embedding"`);
  }
}
