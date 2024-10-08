import { index, jsonb, pgTable, text, varchar, vector } from "drizzle-orm/pg-core";
import { generateId } from "ai";

export const embeddings = pgTable(
  "embedding",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => generateId()),
    document: text("document").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    metadata: jsonb("metadata")
      .$type<{
        id: string;
        type: string;
        handle: string;
      }>()
      .notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops")),
  })
);
