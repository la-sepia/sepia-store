"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { ToolInvocation } from "ai"
import { AssistantMessage } from "./AssistantMessage"
import { UserMessage } from "./UserMessage"
import { ShowWeatherInformation } from "./ShowWeatherInformation"
import { useRouter } from "next/navigation"

export const Chat = () => {
  const router = useRouter()

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxToolRoundtrips: 5,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "showClothesInformation") {
        console.log("toolCall", toolCall)
        const { id } = toolCall.args as { id: string }

        router.push(`/us/products/${id}`)
      }
    },
  })

  const [isOpen, setIsOpen] = useState(false)

  console.dir(messages)

  return (
    <>
      <button
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        data-state="closed"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns=" http://www.w3.org/2000/svg"
          width="30"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white block border-gray-200 align-middle"
        >
          <path
            d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
            className="border-gray-200"
          ></path>
        </svg>
      </button>
      {isOpen && (
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
            className="pr-4 h-[474px] overflow-y-auto flex flex-col-reverse justify-start"
            style={{
              minWidth: "100%",
              maxHeight: "500px",
            }}
          >
            {messages.toReversed().map((m) => {
              if (!m.content && m.toolInvocations) {
                return <ShowWeatherInformation message={m} key={m.id} />
              }

              return m.role === "assistant" ? (
                <AssistantMessage message={m} key={m.id} />
              ) : (
                <UserMessage message={m} key={m.id} />
              )
            })}
          </div>
          <div className="flex items-center pt-0">
            <form
              onSubmit={handleSubmit}
              className="flex items-center justify-center w-full space-x-2"
            >
              <input
                className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                placeholder="Type your message"
                value={input}
                onChange={handleInputChange}
              />
            </form>
          </div>
        </div>
      )}
    </>
  )
}
