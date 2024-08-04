"use server";

import { createStreamableUI, getMutableAIState } from "ai/rsc";
import { AI } from "..";
import { ChatBotMessage, ChatCarousel } from "medusa-ui-sepia/ui";
import { generateId } from "ai";

export interface CartUpdateEvent {
  productId: string;
  countryCode: string;
}

export async function submitCardUpdated(event: CartUpdateEvent) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  const message = createStreamableUI(null);

  const products = await getProducts(event.productId);

  message.append(<ChatCarousel slides={products} />);
  message.append(<ChatBotMessage>Great choice! You might also like these related products. Interested?</ChatBotMessage>);

  message.done();

  return {
    message: {
      id: generateId(),
      display: message.value,
    },
  };
}

async function getProducts(excludeId: string) {
  const response = await fetch("http://localhost:9000/store/products?fields=thumbnail");

  if (!response.ok) {
    return [];
  }

  const { products } = (await response.json()) as { products: { id: string; thumbnail: string; handle: string }[] };

  return products.filter(({ id }) => id !== excludeId);
}
