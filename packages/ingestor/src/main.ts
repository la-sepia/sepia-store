import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { index, jsonb, pgTable, text, varchar, vector } from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres("postgres://postgres@localhost/medusa-9ugN");
export const db = drizzle(client);

process.env.OPENAI_API_KEY = "sk-proj-YSKiIcXYgVC8H4eaMdWqT3BlbkFJHVnuURnmaYc1yaR5GANO";

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");

const embeddingModel = openai.embedding("text-embedding-3-small", {});

export const embeddings = pgTable(
  "embedding",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    document: text("document").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    metadata: jsonb("metadata").notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops")),
  })
);

export const generateEmbedding = async (value: string) => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, userQueryEmbedded)})`;
  const similarGuides = await db
    .select({ metadata: embeddings.metadata, similarity })
    .from(embeddings)
    .where(gt(similarity, 0))
    .orderBy((t) => desc(t.similarity))
    .limit(5);
  return similarGuides;
};

async function main() {
  const result = await findRelevantContent("I want a wear for cold winters");

  console.dir(result);
  process.exit(0);
}

main();
