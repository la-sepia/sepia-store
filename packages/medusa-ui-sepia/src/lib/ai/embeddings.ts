import { embed, embedMany } from "ai";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { EmbeddingModelV1 } from "@ai-sdk/provider";
import { db } from "../db";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "../db/schema/embeddings";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export class Embeddings {
  embeddingModel: EmbeddingModelV1<string>;
  db: PostgresJsDatabase;

  constructor(
    private readonly connectionUri: string,
    apiKey: string
  ) {
    const openai = createOpenAI({
      apiKey,
    });

    this.db = db(connectionUri);
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
