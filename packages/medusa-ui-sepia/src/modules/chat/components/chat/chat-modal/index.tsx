"use client";

import { useUIState } from "ai/rsc";
import { AI } from "../actions";
import { FormEventHandler, useState } from "react";
import { ChatPrompt } from "../chat-prompt";
import { ChatList } from "../chat-list";

interface Props {
  isOpen: boolean;
}

export const ChatModal = ({ isOpen }: Props) => {
  const [messages, _] = useUIState<typeof AI>();
  const [input, setInput] = useState<string>("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
  };

  return (
    <div
      style={{
        boxShadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
      className="z-10 fixed bottom-[calc(4rem+1.5rem)] overflow-auto right-0 mr-4  w-[440px] h-[634px]"
    >
      <div className="p-6 bg-white rounded-t-lg border border-b-0 border-[#e5e7eb]">
        <div className="flex flex-col space-y-1.5 pb-6">
          <h2 className="font-semibold text-lg tracking-tight">SEPIA</h2>
          <p className="text-sm text-[#6b7280] leading-3">Chat with me</p>
        </div>
        <ChatList messages={messages} />
      </div>
      <div className="flex items-center absolute w-full bottom-0">
        <ChatPrompt input={input} setInput={setInput} />
      </div>
    </div>
  );
};
