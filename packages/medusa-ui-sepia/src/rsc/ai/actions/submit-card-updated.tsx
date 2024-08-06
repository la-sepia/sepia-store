"use server";

import { createStreamableUI, getMutableAIState } from "ai/rsc";
import { AI } from "..";
import { ChatBotMessage, ChatCarousel } from "medusa-ui-sepia/ui";
import { generateId } from "ai";
import { getProducts } from "../../medusajs/data";

export interface CartUpdateEvent {
  productId: string;
  countryCode: string;
}

export async function submitCardUpdated(event: CartUpdateEvent) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  const message = createStreamableUI(null);

  const products = await getProducts(event.productId);

  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,

      {
        id: generateId(),
        role: "system",
        content: `[User added the next product id to the cart: ${event.productId}]`,
      },
    ],
  });

  message.append(
    <div className="flex flex-col gap-y-4">
      <ChatCarousel slides={products} />
      <ChatBotMessage>Great choice! You might also like these related products. Interested?</ChatBotMessage>
    </div>
  );

  message.done();

  return {
    message: {
      id: generateId(),
      display: message.value,
    },
  };
}
