"use server";

import { createStreamableValue, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { generateId, generateObject } from "ai";

import { z } from "zod";

import { ChatBotMessage, ChatBotSpinnerMessage, ChatBotStreamMessage, ChatBotShowProductMessage, ChatOrderStatus, ChatCartStatus } from "medusa-ui-sepia/ui";
import { Embeddings } from "../embeddings";
import { getCart, retrieveAvailableProducts, retrieveLookupOrder } from "../../medusajs/data";
import { cookies } from "next/headers";

export async function submitUserMessage(content: string) {
  "use server";

  const storeAvailableProducts = await retrieveAvailableProducts();

  const embbedings = await Embeddings.create(process.env.DATABASE_URL!, process.env.OPENAI_API_KEY!);

  const aiState = getMutableAIState();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: generateId(),
        role: "user",
        content,
      },
    ],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const result = await streamUI({
    system: `"You are a helpful assistant specialized in a clothing store. Your primary role is to assist customers with questions about products and help them find what they're looking for.

- General Interaction: You can greet users, respond to common pleasantries, and ensure a friendly interaction. If a user asks a question unrelated to the store's products or services, politely inform them that you can only assist with clothing-related inquiries.

- The only products available in the store are the following: ${JSON.stringify(storeAvailableProducts)}. If a customer asks about available products, you don't need to list them all. However, it would be good to explain what is generally sold, the possible categories, etc. The most important thing is to never mention or suggest a product/category that is not available. 

- Product Information: Always use the 'showClothesInformation' tool to provide detailed information about clothing items. Do not discuss specific product details without using this tool.

- Inadequate Information: If a user provides insufficient information about what they want to buy, start by asking for the most essential details, such as the type of clothing item they are looking for. If the user does not specify a color or size, you can proceed without them unless they are crucial for narrowing down options. Only ask for additional details like color or size if the user explicitly mentions they are important or if they want specific recommendations. Avoid asking for every parameter and prioritize the user’s preferences based on the provided information.

- Order Status Information: Always use the 'showOrderInformation' tool to provide detail informacion about order status. If the user does not provider de order id and the email, you need to ask for them before to use this tool. If the user does not provide both, you need to explain than you cannot help him.

- Cart Status Information: Always use the 'showCartInformation' tool to provide detail informacion about cart status.

- Store-Focused: Remind users that your expertise is specific to the clothing store, and gently steer the conversation back to relevant topics if it veers off-course."`,

    model: openai("gpt-4o-mini"),
    initial: <ChatBotSpinnerMessage />,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],

    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        textNode = <ChatBotStreamMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: generateId(),
              role: "assistant",
              content,
            },
          ],
        });
      } else {
        textStream.update(delta);
      }

      return textNode;
    },

    tools: {
      showCartInformation: {
        description: "Show information about the state of the cart",
        parameters: z.object({}),
        generate: async function* ({}) {
          yield <ChatBotSpinnerMessage />;
          const cartId = cookies().get("_medusa_cart_id")?.value;

          if (!cartId) {
            return <ChatBotMessage>Your cart is currently empty :(</ChatBotMessage>;
          }

          const cart = await getCart(cartId);

          if (!cart || cart.items.length === 0) {
            return <ChatBotMessage>Your cart is currently empty :(</ChatBotMessage>;
          }

          return (
            <div className="flex flex-col gap-4">
              <ChatBotMessage>Sure, this is your cart.</ChatBotMessage>
              <ChatCartStatus cart={cart} />
            </div>
          );
        },
      },
      showOrderInformation: {
        description: "Show information about the state of a order of the client",
        parameters: z.object({
          id: z.number().describe("Order number"),
          email: z.string().describe("Client email"),
        }),
        generate: async function* ({ id, email }) {
          yield <ChatBotSpinnerMessage />;

          const order = await retrieveLookupOrder(id, email);

          if (!order) {
            return <ChatBotMessage>Sorry, we cannot found any order with that id</ChatBotMessage>;
          }

          return (
            <div className="flex flex-col gap-4">
              <ChatOrderStatus order={order} />
              <ChatBotMessage>That is the status of your order, you need something else?</ChatBotMessage>
            </div>
          );
        },
      },
      showClothesInformation: {
        description: "Show the piece of clothes selected to the user. Always use this tool to tell the piece of clothes to the user.",
        parameters: z.object({
          language: z.string().describe("The language of the conversation"),
          type: z.string().describe("The type of clothing item requested, such as 'tshirt', 'shorts', etc."),
          color: z.string().nullable().describe("Preferred color of the clothing item, if specified."),
          size: z.string().nullable().describe("Preferred size, if specified."),
          use: z.string().nullable().describe("The intended use or season such as 'summer', 'sports', etc. , if specified"),
          item: z.string().describe("Generate a brief description of the clothing item or any other specific preferences, up to one sentence long."),
        }),
        generate: async function* (clothing) {
          yield <ChatBotSpinnerMessage />;

          const query = JSON.stringify(clothing);
          console.debug("query", query);

          // Step 1: Retrieve relevant products using the RAG system
          const data = await embbedings.findRelevantContent(query);

          const prompt = `You are a helpful assistant that answers questions about the products in a shop.

You must answer in ${clothing.language}.

The customer is looking for a clothing item that matches the following description:
- Type: ${clothing.item}
- ${clothing.color ? `Color: ${clothing.color}` : "Color: Any"}
- ${clothing.size ? `Size: ${clothing.size}` : "Size: Any"}
- ${clothing.use ? `Use: ${clothing.use}` : "Use: Any"}

Please identify the most suitable product from the available stock below. 
Provide the product ID, an appropriate color code, and size code. 
If there are multiple matching colors or sizes, choose the most relevant or common.
If there are no relevant matches, return a suggestion of other product.

Available Stock:
${data
  .map(
    (item) => `
  - ID: ${item.metadata.handle}
    ${item.document}
`
  )
  .join("\n")}
`;

          console.debug("prompt", prompt);

          try {
            const result = await generateObject({
              model: openai("gpt-4o-mini"),
              mode: "json",
              schema: z
                .union([
                  z.object({
                    inStock: z.literal(true),
                    id: z.string(),
                    extendedDescription: z.string().describe("generate a short sentence about the amazing piece of clothes selected"),
                    color: z.string().nullable().optional().describe("Color stock code of the clothing item, if specified."),
                    size: z.string().nullable().optional().describe("Size stock code (S, M, L...), if specified."),
                  }),
                  z.object({
                    inStock: z.literal(false),
                    id: z.string(),
                    color: z.string().nullable().optional().describe("Color stock code of the clothing item, if specified."),
                    size: z.string().nullable().optional().describe("Size stock code (S, M, L...), if specified."),
                    notFoundSuggestion: z.string().describe("Send a suggestion of another product or another size or color if you cannot found a product"),
                  }),
                ])
                .describe("Product availability schema"),
              prompt,
            });

            console.debug("result", result.object);

            if (result.object.inStock === false) {
              const {
                object: { id, color, size, notFoundSuggestion = "" },
              } = result;

              return <ChatBotShowProductMessage id={id} description={notFoundSuggestion} color={color} size={size} />;
            }

            const {
              object: { id, extendedDescription = "", color, size, inStock },
            } = result;

            return <ChatBotShowProductMessage id={id} description={extendedDescription} color={color} size={size} />;
          } catch (error: unknown) {
            console.error(error);

            return <ChatBotMessage>Sorry, I didnt get that, could you repeat it?</ChatBotMessage>;
          }
        },
      },
    },
  });

  return {
    id: generateId(),
    display: result.value,
  };
}
