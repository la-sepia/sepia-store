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
    model: openai("gpt-4o-mini"),
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

          const { embedding } = await embed({
            model: openai.embedding("text-embedding-3-small"),
            value: piece,
          })

          const collections = await fetch(
            "http://localhost:8000/api/v1/collections/?tenant=default_tenant&database=default_database",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          )

          const collectionsX = await collections.json()

          if (!collections.ok) {
            throw new Error(collectionsX)
          }

          const collectionId = collectionsX
            .filter((collection) => collection.name === "products")
            .map((collection) => collection.id)[0]

          const response = await fetch(
            `http://localhost:8000/api/v1/collections/${collectionId}/query`,
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
            throw new Error(result)
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
