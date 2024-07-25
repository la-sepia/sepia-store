import { ProductService, SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import ChromaService from "src/services/chroma";

interface ProductCreatedEvent {
  id: string;
}

export default async function productUpdatedHandler({ data, eventName, container }: SubscriberArgs<ProductCreatedEvent>) {
  const productService: ProductService = container.resolve("productService");
  const chromaService: ChromaService = container.resolve("chromaService");

  const { id } = data;
  const product = await productService.retrieve(id);

  await chromaService.insertProduct(product);
}

export const config: SubscriberConfig = {
  event: ProductService.Events.UPDATED,
};
