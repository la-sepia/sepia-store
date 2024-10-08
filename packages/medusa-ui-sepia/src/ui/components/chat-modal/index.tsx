import { useUIState } from "ai/rsc";
import { type AI } from "medusa-ui-sepia/rsc";
import { useState } from "react";
import { cn } from "../../utils";
import { ChatList } from "../chat-list";
import { ChatPrompt } from "../chat-prompt";

interface Props {
  isOpen: boolean;
}

export const ChatModal = ({ isOpen }: Props) => {
  const [messages] = useUIState<typeof AI>();
  const [input, setInput] = useState("");

  return (
    <div
      style={{
        boxShadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
      className={cn({ hidden: !isOpen }, "z-10 bg-white fixed bottom-[calc(5rem+1.5rem)] overflow-auto right-0 mr-4  w-[440px] h-[634px]")}
    >
      <div className="p-6 rounded-t-lg border border-b-0 border-[#e5e7eb]">
        <div className="flex flex-col space-y-1.5 pb-6">
          <h2 className="font-semibold text-lg tracking-tight text-gray-900">SEPIA</h2>
          <p className="text-sm text-gray-600 leading-3">Your AI helpful personal shopper</p>
        </div>
        <ChatList messages={messages} />
      </div>
      <div className="flex items-center absolute w-full bottom-0">
        <ChatPrompt input={input} setInput={setInput} />
      </div>
    </div>
  );
};
