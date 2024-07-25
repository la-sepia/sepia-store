import { openai } from "@ai-sdk/openai"
import { convertToCoreMessages, embed, streamText } from "ai"
import { z } from "zod"
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages: convertToCoreMessages(messages),
    experimental_toolCallStreaming: true,
    system:
      "You are a helpful assistant that answers questions about the products in a shop." +
      "You use the showClothesInformation tool to show the piece of clothes information to the user instead of talking about it.",
    tools: {
      // getWeatherInformation: {
      //   description: "show the weather in a given city to the user",
      //   parameters: z.object({ city: z.string() }),
      //   execute: async ({}: { city: string }) => {
      //     const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"]
      //     return {
      //       weather:
      //         weatherOptions[Math.floor(Math.random() * weatherOptions.length)],
      //       temperature: Math.floor(Math.random() * 50 - 10),
      //     }
      //   },
      // },
      // // client-side tool that displays whether information to the user:
      // showWeatherInformation: {
      //   description:
      //     "Show the weather information to the user. Always use this tool to tell weather information to the user.",
      //   parameters: z.object({
      //     city: z.string(),
      //     weather: z.string(),
      //     temperature: z.number(),
      //     typicalWeather: z
      //       .string()
      //       .describe(
      //         "2-3 sentences about the typical weather in the city during spring."
      //       ),
      //   }),
      // },
      getClothesInformation: {
        description:
          "return the most suitable piece of clothing based on the user request",
        parameters: z.object({ piece: z.string() }),
        execute: async ({ piece }: { piece: string }) => {
          const embeddingFunction = new OpenAIEmbeddingFunction({
            openai_api_key:
              "sk-proj-YSKiIcXYgVC8H4eaMdWqT3BlbkFJHVnuURnmaYc1yaR5GANO",
            openai_model: "text-embedding-3-small",
          })

          const client = new ChromaClient({
            path: "http://localhost:8000",
          })

          const collection = await client.getOrCreateCollection({
            name: "products",
            metadata: {
              description: "Products of medusa store",
            },
            embeddingFunction,
          })

          const result = await collection.query({
            queryTexts: piece,
            nResults: 1,
          })

          const id = result.ids[0][0]
          const document = result.documents[0][0]

          return {
            id,
            description: document,
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
