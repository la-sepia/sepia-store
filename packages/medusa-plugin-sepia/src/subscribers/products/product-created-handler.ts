import { ProductService, SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import EmbeddingService from "../../services/embedding";

interface ProductCreatedEvent {
  id: string;
}

export default async function productCreatedHandler({ data, eventName, container }: SubscriberArgs<ProductCreatedEvent>) {
  const productService: ProductService = container.resolve("productService");
  const embeddingService: EmbeddingService = container.resolve("embeddingService");

  const { id } = data;
  const product = await productService.retrieve(id, {
    relations: ["options", "options.values"],
  });

  await embeddingService.upsertProduct(product);
}

export const config: SubscriberConfig = {
  event: ProductService.Events.CREATED,
};
