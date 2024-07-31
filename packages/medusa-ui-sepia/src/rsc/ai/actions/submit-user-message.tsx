"use server";

import { createStreamableValue, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { generateId, generateObject } from "ai";

import { z } from "zod";

import { ChatBotMessage, ChatBotSpinnerMessage, ChatBotStreamMessage, ChatBotShowProductMessage } from "medusa-ui-sepia/ui";
import { Embeddings } from "../embeddings";

export async function submitUserMessage(content: string) {
  "use server";

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
    system:
      "You are a helpful assistant that answers questions about the products in a shop." +
      "You use the showClothesInformation tool to show the piece of clothes information to the user instead of talking about it." +
      "Only respond to questions using information from tool calls." +
      `If no relevant information is found in the tool calls, respond, "Sorry, I cannot help you with that."`,

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
      showClothesInformation: {
        description: "Show the piece of clothes selected to the user. Always use this tool to tell the piece of clothes to the user.",
        parameters: z.object({
          type: z.string().describe("The type of clothing item requested, such as 'tshirt', 'shorts', etc."),
          color: z.string().optional().describe("Preferred color of the clothing item, if specified."),
          size: z.string().optional().describe("Preferred size, if specified."),
          use: z.string().optional().describe("The intended use or season such as 'summer', 'sports', etc. , if specified"),
          item: z.string().describe("Generate a brief description of the clothing item or any other specific preferences, up to one sentence long."),
        }),
        generate: async function* (clothing) {
          yield <ChatBotSpinnerMessage />;

          const query = JSON.stringify(clothing);
          console.debug("query", query);

          const data = await embbedings.findRelevantContent(query);

          let lookingFor = clothing.item;
          if (clothing.color) {
            lookingFor += `, in ${clothing.color} color`;
          }
          if (clothing.size) {
            lookingFor += `, in ${clothing.size} size`;
          }
          if (clothing.use) {
            lookingFor += `, for ${clothing.use}`;
          }

          const result = await generateObject({
            model: openai("gpt-4o-mini"),
            mode: "json",
            schema: z
              .object({
                id: z.string(),
                description: z.string().describe("2-3 sentences about the amazing piece of clothes selected"),
                color: z.string().optional().describe("Preferred color of the clothing item, if specified."),
                size: z.string().optional().describe("Preferred size, if specified."),
              })
              .optional(),
            prompt:
              `The customer is looking for a ${clothing.item} with these props: ${lookingFor}.` +
              `Based on the available products in stock, identify the most suitable clothing item` +
              `and provide their ID and description. If there are no relevant matches, return 'null'.` +
              `Available stock:` +
              data.map((t) => JSON.stringify({ id: t.metadata.handle, article: t.document })),
          });

          if (!result.object) {
            return <ChatBotMessage>Sorry, we don't have anything in stock that matches your request.</ChatBotMessage>;
          }

          const {
            object: { id, description, color, size },
          } = result;

          return <ChatBotShowProductMessage id={id} description={description} color={color} size={size} />;
        },
      },
    },
  });

  return {
    id: generateId(),
    display: result.value,
  };
}
