"use client"

import { generateId } from "ai"
import { useActions, useAIState, useUIState } from "ai/rsc"
import { AI, ClientMessage } from "../actions"
import { FormEventHandler, useState } from "react"
import { ChatUserMessage } from "../chat-user-message"

interface Props {
  isOpen: boolean
}

export const ChatModal = ({ isOpen }: Props) => {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [input, setInput] = useState<string>("")

  if (!isOpen) {
    return null
  }

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault()
  }

  return (
    <div
      style={{
        boxShadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
      className="z-10 fixed bottom-[calc(4rem+1.5rem)] overflow-auto right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[634px]"
    >
      <div className="flex flex-col space-y-1.5 pb-6">
        <h2 className="font-semibold text-lg tracking-tight">SEPIA</h2>
        <p className="text-sm text-[#6b7280] leading-3">Chat with me</p>
      </div>
      <div
        className="pr-4 h-[474px] overflow-y-auto flex flex-col justify-start"
        style={{
          minWidth: "100%",
          maxHeight: "500px",
        }}
      >
        {messages.map((message, index) => (
          <div key={message.id}>
            {message.display}
            {index < messages.length - 1 && <hr className="my-4" />}
          </div>
        ))}
      </div>
      <div className="flex items-center pt-0">
        <form
          className="flex items-center justify-center w-full space-x-2"
          onSubmit={async (e: any) => {
            e.preventDefault()

            // Blur focus on mobile
            if (window.innerWidth < 600) {
              e.target["message"]?.blur()
            }

            const value = input.trim()
            setInput("")
            if (!value) return

            // Optimistically add user message UI
            setMessages((currentMessages) => [
              ...currentMessages,
              {
                id: generateId(),
                display: <ChatUserMessage>{value}</ChatUserMessage>,
              },
            ])

            // Submit and get response message
            const responseMessage = await submitUserMessage(value)
            setMessages((currentMessages) => [
              ...currentMessages,
              responseMessage,
            ])
          }}
        >
          <input
            name="message"
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
            }}
            className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
            placeholder="Type your message"
          />
        </form>
      </div>
    </div>
  )
}
