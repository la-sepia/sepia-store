import { index, jsonb, pgTable, text, varchar, vector } from "drizzle-orm/pg-core";
import { nanoid } from "../../utils";

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
