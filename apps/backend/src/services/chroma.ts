import { openai } from "@ai-sdk/openai";
import { ConfigModule, Logger, Product, TransactionBaseService } from "@medusajs/medusa";
import { embed } from "ai";
import { ChromaClient, Collection } from "chromadb";

interface DependencyInjection {
  configModule: ConfigModule & {
    projectConfig: {
      chromadb_url: string;
    };
  };
  logger: Logger;
}

class ChromaService extends TransactionBaseService {
  private client: ChromaClient;
  private products?: Collection;
  private logger: Logger;

  constructor({ configModule, logger }: DependencyInjection) {
    super(arguments[0]);

    this.logger = logger;
    this.client = new ChromaClient({
      path: configModule.projectConfig.chromadb_url,
    });

    this.logger.info("ChromaService loaded");
  }

  async insertProduct(product: Product) {
    const { handle, title, description } = product;

    const value = `Product name: ${title}. Product description: ${description}`;

    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value,
    });

    const products = await this.getProducts();
    await products.upsert({
      ids: [handle],
      embeddings: [embedding],
      documents: [value],
    });
  }

  private async getProducts() {
    if (this.products) {
      return this.products;
    }

    this.products = await this.client.getOrCreateCollection({
      name: "products",
      metadata: {
        description: "Products of medusa store",
      },
    });

    return this.products;
  }
}

export default ChromaService;
