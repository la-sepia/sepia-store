"use server"

import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc"
import { openai } from "@ai-sdk/openai"
import { generateId, generateObject } from "ai"
import { ChatBotMessage, ChatSpinnerMessage } from "../chat-bot-message"

import { CoreMessage } from "ai"
import { z } from "zod"
import { Redir } from "./Redir"
import { Embeddings } from "medusa-ui-sepia"

export type Message = CoreMessage & {
  id: string
}

export async function submitUserMessage(content: string) {
  "use server"

  const embbedings = new Embeddings(
    process.env.DATABASE_URL!,
    process.env.OPENAI_API_KEY!
  )

  const aiState = getMutableAIState()

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
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const result = await streamUI({
    system:
      "You are a helpful assistant that answers questions about the products in a shop." +
      "You use the showClothesInformation tool to show the piece of clothes information to the user instead of talking about it.",

    model: openai("gpt-4o-mini"),
    initial: <ChatSpinnerMessage />,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],

    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("")
        textNode = <ChatBotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
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
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },

    tools: {
      showClothesInformation: {
        description:
          "Show the piece of clothes selected to the user. Always use this tool to tell the piece of clothes to the user.",
        parameters: z.object({
          piece: z
            .string()
            .describe(
              "The name of the piece of clothing suggested to the client"
            ),
        }),
        generate: async function* ({ piece }) {
          yield `Searching...`

          const data = await embbedings.findRelevantContent(piece)

          const result = await generateObject({
            model: openai("gpt-4o-mini"),
            mode: "json",
            schema: z.object({
              id: z.string(),
              description: z
                .string()
                .describe(
                  "2-3 sentences about the amazing piece of clothes selected"
                ),
            }),
            prompt:
              "The customer wants to buy a ${piece}. We have these product in stock, returns the id and a description of the most suitable piece of clothes:" +
              data.map((t) =>
                JSON.stringify({ id: t.metadata.handle, article: t.document })
              ),
          })

          const {
            object: { id, description },
          } = result

          return <Redir id={id} description={description} />
        },
      },
    },
  })

  return {
    id: generateId(),
    display: result.value,
  }
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export type UIActions = {
  submitUserMessage: typeof submitUserMessage
}

export const AI = createAI<AIState, UIState, UIActions>({
  actions: {
    submitUserMessage,
  },
  initialAIState: { chatId: generateId(), messages: [] },
  initialUIState: [],
})
