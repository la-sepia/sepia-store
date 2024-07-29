"use client"

import { spinner } from "./spinner"
import { StreamableValue } from "ai/rsc"
import { CuttlefishIcon } from "./cuttlefish-icon"
import { ReactElement, ReactNode } from "react"
import { useStreamableText } from "../../../../lib/hooks/use-streamable-text"

export const ChatBotMessage = ({
  content,
}: {
  content: string | StreamableValue<string>
}) => {
  const text = useStreamableText(content)

  return (
    <>
      <div className="flex items-start gap-3">
        <span className="rounded-sm bg-slate-500 relative flex shrink-0 overflow-hidden min-w-8 min-h-8 items-center justify-center ">
          <CuttlefishIcon />
        </span>

        <div className="bg-slate-500 p-3 rounded-lg max-w-[75%] text-primary-foreground rounded-tl-none text-sm text-gray-50">
          {text}
        </div>
      </div>
    </>
  )
}

export const ChatStringMessage = ({
  children,
}: {
  children: ReactNode
}): ReactElement => {
  return (
    <>
      <div className="flex items-start gap-3">
        <span className="rounded-sm bg-slate-500 relative flex shrink-0 overflow-hidden min-w-8 min-h-8 items-center justify-center ">
          <CuttlefishIcon />
        </span>

        <div className="bg-slate-500 p-3 rounded-lg max-w-[75%] text-primary-foreground rounded-tl-none text-sm text-gray-50">
          {children}
        </div>
      </div>
    </>
  )
}

export const ChatSpinnerMessage = (): ReactElement => {
  return (
    <>
      <div className="flex items-start gap-3">
        <span className="rounded-sm bg-slate-500 relative flex shrink-0 overflow-hidden min-w-8 min-h-8 items-center justify-center ">
          <CuttlefishIcon />
        </span>

        <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
          {spinner}
        </div>
      </div>
    </>
  )
}
