"use client"
import { useRouter } from "next/navigation"
import { ChatBotMessage, ChatStringMessage } from "./chat-bot-message"

export const Redir = ({
  id,
  description,
}: {
  id: string
  description: string
}) => {
  const router = useRouter()

  router.push(`/us/products/${id}`)

  return <ChatStringMessage>{description}</ChatStringMessage>
}
