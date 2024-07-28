import { Product, TransactionBaseService } from "@medusajs/medusa";
import { Embedding, EmbeddingMetadata } from "../models/embedding";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import EmbeddingRepository from "../repositories/embedding";
import { EntityManager, IsNull, Not } from "typeorm";

type InjectedDependencies = {
  manager: EntityManager;
  embeddingRepository: typeof EmbeddingRepository;
};

class EmbeddingService extends TransactionBaseService {
  protected embeddingRepository_: typeof EmbeddingRepository;

  constructor({ embeddingRepository }: InjectedDependencies) {
    super(arguments[0]);

    this.embeddingRepository_ = embeddingRepository;
  }

  async upsertProduct(product: Product): Promise<void> {
    const document = `Product name: ${product.title}. Product description: ${product.description}`;
    const metadata: EmbeddingMetadata = {
      id: product.id,
      type: "product",
      handle: product.handle!,
    };

    const repository = this.activeManager_.withRepository(this.embeddingRepository_);

    const embedding = await repository
      .createQueryBuilder("embedding")
      .where("embedding.metadata @> :query", { query: JSON.stringify({ type: "product", id: product.id }) })
      .getOne();

    if (!embedding) {
      await this.insert(document, metadata);

      return;
    }

    await this.update(embedding, document, metadata);
  }

  async deleteProduct(product: Product): Promise<void> {
    const repository = this.activeManager_.withRepository(this.embeddingRepository_);

    const embedding = await repository
      .createQueryBuilder("embedding")
      .where("embedding.metadata @> :query", { query: JSON.stringify({ type: "product", id: product.id }) })
      .getOne();

    if (!embedding) {
      return;
    }

    await repository.remove(embedding);
  }

  private async insert(document: string, metadata: EmbeddingMetadata): Promise<void> {
    const repository = this.activeManager_.withRepository(this.embeddingRepository_);

    const embedding = new Embedding();
    embedding.document = document;
    embedding.embedding = await this.generateEmbeddings(document);
    embedding.metadata = metadata;

    await repository.insert(embedding);
  }

  private async update(embedding: Embedding, document: string, metadata: EmbeddingMetadata): Promise<void> {
    const repository = this.activeManager_.withRepository(this.embeddingRepository_);

    embedding.document = document;
    embedding.embedding = await this.generateEmbeddings(document);
    embedding.metadata = metadata;

    await repository.save(embedding);
  }

  private async generateEmbeddings(document: string): Promise<string> {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: document,
    });

    return `[${embedding.join(",")}]`;
  }
}

export default EmbeddingService;
