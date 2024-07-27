import { generateEntityId, BaseEntity } from "@medusajs/medusa";
import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";

export interface EmbeddingMetadata {
  type: string;
  id: string;
  handle: string;
}

@Entity()
export class Embedding extends BaseEntity {
  @Column({ type: "varchar" })
  document: string;

  @Column({ type: "varchar" })
  embedding: string;

  @Column({ type: "jsonb" })
  metadata: EmbeddingMetadata;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "embedding");
  }
}
