import { ChromaClient } from "chromadb";

async function main() {
  const client = new ChromaClient({
    path: "http://localhost:8000",
  });

  const collection = await client.getOrCreateCollection({
    name: "products",
    metadata: {
      description: "Products of medusa store",
    },
  });

  const response = await fetch("http://localhost:9000/store/products");

  if (!response.ok) {
    console.error("Error conecting");
    return -1;
  }

  const { products } = await response.json();

  for (let product of products) {
    const template = `Product name: ${product.title}. Product description: ${product.description}`;
    const id = product.handle;

    await collection.upsert({
      ids: [id],
      documents: [template],
    });
  }

  const result = await collection.query({
    queryTexts: "I want something to use in winter",
    nResults: 1,
  });
}

await main();
