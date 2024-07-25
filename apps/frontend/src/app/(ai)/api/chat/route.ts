import { openai } from "@ai-sdk/openai"
import { convertToCoreMessages, embed, streamText } from "ai"
import { z } from "zod"
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30
export const runtime = "nodejs"

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
        parameters: z.object({
          piece: z
            .string()
            .describe(
              "The name of the piece of clothing suggested to the client"
            ),
        }),
        execute: async ({ piece }: { piece: string }) => {
          console.debug("getClothesInformation", piece)
          // const embeddingFunction = new OpenAIEmbeddingFunction({
          //   openai_api_key:
          //     "sk-proj-YSKiIcXYgVC8H4eaMdWqT3BlbkFJHVnuURnmaYc1yaR5GANO",
          //   openai_model: "text-embedding-3-small",
          // })

          const { embedding } = await embed({
            model: openai.embedding("text-embedding-3-small"),
            value: piece,
          })

          console.debug("SERGIO", embedding)

          const response = await fetch(
            "http://localhost:8000/api/v1/collections/2c57aab6-3a55-4d51-97c9-a28acb9883f2/query",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                where: {},
                where_document: {},
                n_results: 1,
                query_embeddings: [embedding],
                include: ["metadatas", "documents", "distances"],
              }),
            }
          )

          const result = await response.json()

          console.debug("SERGIO", result)

          if (!response.ok) {
            new Error()
          }

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
