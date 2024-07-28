import { openai } from "@ai-sdk/openai"
import { convertToCoreMessages, embed, streamText } from "ai"
import { Embeddings } from "medusa-ui-sepia"
import { z } from "zod"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30
export const runtime = "nodejs"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const embbedings = new Embeddings(
    process.env.DATABASE_URL!,
    process.env.OPENAI_API_KEY!
  )

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: convertToCoreMessages(messages),
    experimental_toolCallStreaming: true,
    system:
      "You are a helpful assistant that answers questions about the products in a shop." +
      "You use the showClothesInformation tool to show the piece of clothes information to the user instead of talking about it.",
    tools: {
      getClothesInformation: {
        description:
          "return the most suitable piece of clothing based on the user request",
        parameters: z.object({
          piece: z
            .string()
            .describe(
              "The name of the piece of clothing suggested to the client"
            ),
        }),
        execute: async ({ piece }: { piece: string }) => {
          try {
            const result = await embbedings.findRelevantContent(piece)

            const id = result[0].metadata.handle
            const document = result[0].document

            return {
              id,
              description: document,
            }
          } catch (error) {
            console.error(error)
            throw error
          }
        },
      },
      showClothesInformation: {
        description:
          "Show the piece of clothes selected to the user. Always use this tool to tell the piece of clothes to the user.",
        parameters: z.object({
          id: z.string(),
          description: z.string(),
          extendedDescription: z
            .string()
            .describe(
              "2-3 sentences about the amazing piece of clothes selected."
            ),
        }),
      },
    },
  })

  return result.toAIStreamResponse()
}
