"use client"

import { useActions, useUIState } from "ai/rsc"
import { FormEventHandler, ReactElement } from "react"
import { AI } from "../actions"
import { generateId } from "ai"
import { ChatUserMessage } from "../chat-user-message"
import { Input } from "@medusajs/ui"
import { ArrowDownLeft, ArrowDownLeftMini, ChatBubble } from "@medusajs/icons"

interface ChatPromptProperties {
  input: string
  setInput: (value: string) => void
}

export const ChatPrompt = ({
  input,
  setInput,
}: ChatPromptProperties): ReactElement => {
  const { submitUserMessage } = useActions<typeof AI>()
  const [_, setMessages] = useUIState<typeof AI>()

  const handleForm: FormEventHandler = async (event) => {
    event.preventDefault()

    const value = input.trim()
    setInput("")
    if (!value) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: generateId(),
        display: <ChatUserMessage>{value}</ChatUserMessage>,
      },
    ])

    const responseMessage = await submitUserMessage(value)
    setMessages((currentMessages) => [...currentMessages, responseMessage])
  }

  return (
    <>
      <form
        onSubmit={handleForm}
        className="flex items-center p-2 rounded-b-2xl shadow-md w-full space-x-2 border border-t-0 border-[#e5e7eb]"
      >
        <div className="flex items-center flex-grow p-2 bg-gray-100 rounded-full">
          <ChatBubble className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Type to start chatting..."
            className="flex-grow px-2 bg-transparent border-none outline-none text-sm"
            autoComplete="off"
            autoCorrect="off"
            autoFocus
            name="message"
            onChange={(event) => setInput(event.target.value)}
            tabIndex={0}
            value={input}
          />
        </div>
        <button className="flex items-center justify-center w-8 h-8 ml-2 bg-gray-800 rounded-lg">
          <ArrowDownLeftMini className="w-5 h-5 text-white" />
        </button>
      </form>
    </>
  )
}
