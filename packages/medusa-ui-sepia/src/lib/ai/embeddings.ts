import { embed } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { EmbeddingModelV1 } from "@ai-sdk/provider";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "../db/schema/embeddings";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export class Embeddings {
  embeddingModel: EmbeddingModelV1<string>;
  db: PostgresJsDatabase;

  constructor(databaseUrl: string, apiKey: string) {
    const openai = createOpenAI({
      apiKey,
    });

    this.db = drizzle(postgres(databaseUrl));
    this.embeddingModel = openai.embedding("text-embedding-3-small");
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
