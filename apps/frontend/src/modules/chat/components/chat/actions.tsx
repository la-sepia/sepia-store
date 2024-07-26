"use server"

import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc"
import { openai } from "@ai-sdk/openai"
import { ReactNode } from "react"
import { z } from "zod"
import { generateId, nanoid } from "ai"
import { ChatBotMessage, ChatSpinnerMessage } from "./chat-bot-message"

import { CoreMessage } from "ai"

export type Message = CoreMessage & {
  id: string
}

export async function submitUserMessage(content: string) {
  "use server"

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
              id: nanoid(),
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

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialAIState: { chatId: generateId(), messages: [] },
  initialUIState: [],
})
