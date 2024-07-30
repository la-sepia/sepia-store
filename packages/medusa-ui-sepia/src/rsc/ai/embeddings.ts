import { embed } from "ai";
import { createOpenAI, OpenAIProvider } from "@ai-sdk/openai";
import { EmbeddingModelV1 } from "@ai-sdk/provider";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "../db/schema/embeddings";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";

export class Embeddings {
  embeddingModel: EmbeddingModelV1<string>;
  db: NodePgDatabase;

  private constructor(client: pg.Client, openai: OpenAIProvider) {
    this.db = drizzle(client);
    this.embeddingModel = openai.embedding("text-embedding-3-small");
  }

  static async create(connectionString: string, apiKey: string) {
    const openai = createOpenAI({
      apiKey,
    });

    const client = new pg.Client({
      connectionString,
    });

    await client.connect();

    return new Embeddings(client, openai);
  }

  async generateEmbedding(value: string): Promise<number[]> {
    const input = value.replaceAll("\\n", " ");
    const { embedding } = await embed({
      model: this.embeddingModel,
      value: input,
    });
    return embedding;
  }

  async findRelevantContent(userQuery: string) {
    const userQueryEmbedded = await this.generateEmbedding(userQuery);
    const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, userQueryEmbedded)})`;
    const similarGuides = await this.db
      .select({ document: embeddings.document, metadata: embeddings.metadata, similarity })
      .from(embeddings)
      .where(gt(similarity, 0))
      .orderBy((t) => desc(t.similarity))
      .limit(4);
    return similarGuides;
  }
}
