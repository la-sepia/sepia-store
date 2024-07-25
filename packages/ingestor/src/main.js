import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";

async function main() {
  const embeddingFunction = new OpenAIEmbeddingFunction({
    openai_api_key: "sk-proj-YSKiIcXYgVC8H4eaMdWqT3BlbkFJHVnuURnmaYc1yaR5GANO",
    model: "text-embedding-3-small",
  });

  const client = new ChromaClient({
    path: "http://localhost:8000",
  });

  const collection = await client.getOrCreateCollection({
    name: "products",
    metadata: {
      description: "Products of medusa store",
    },
    embeddingFunction,
  });

  const result = await collection.query({
    queryTexts: "I want something to use in winter",
    nResults: 5,
  });

  console.dir(result);
}

await main();
