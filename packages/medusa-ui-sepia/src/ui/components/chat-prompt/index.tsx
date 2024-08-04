import { ArrowDownLeftMini, ChatBubble } from "@medusajs/icons";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { type AI } from "medusa-ui-sepia/rsc";
import { FormEventHandler, ReactElement, useEffect } from "react";
import { ChatUserMessage } from "../chat-user-message";

interface ChatPromptProperties {
  input: string;
  setInput: (value: string) => void;
}

export interface CartUpdateEvent {
  productId: string;
  countryCode: string;
}

const CART_UPDATE_EVENT = "cartUpdate";

declare global {
  interface WindowEventMap {
    cartUpdate: CustomEvent;
  }
}

export function updateCart({ productId, countryCode }: CartUpdateEvent) {
  window.dispatchEvent(
    new CustomEvent<CartUpdateEvent>(CART_UPDATE_EVENT, {
      detail: { productId, countryCode },
    })
  );
}

export const ChatPrompt = ({
  input,
  setInput,
}: ChatPromptProperties): ReactElement => {
  const { submitUserMessage, submitCardUpdated } = useActions<typeof AI>();
  const [messages, setMessages] = useUIState<typeof AI>();

  useEffect(() => {
    const handleCardUpdate = async (event: CustomEvent<CartUpdateEvent>) => {
      const response = await submitCardUpdated(event.detail);

      setMessages((currentMessages: any) => [
        ...currentMessages,
        response.message,
      ]);
    };

    window.addEventListener(CART_UPDATE_EVENT, handleCardUpdate);

    return () => {
      window.removeEventListener(CART_UPDATE_EVENT, handleCardUpdate);
    };
  }, []);

  const handleForm: FormEventHandler = async (event) => {
    event.preventDefault();

    const value = input.trim();
    setInput("");
    if (!value) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: generateId(),
        display: <ChatUserMessage>{value}</ChatUserMessage>,
      },
    ]);

    const responseMessage = await submitUserMessage(value);
    setMessages((currentMessages) => [...currentMessages, responseMessage]);
  };

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
            placeholder={
              messages.length > 0
                ? "Type a message..."
                : "Type to start chatting..."
            }
            className="flex-grow px-2 bg-transparent border-none outline-none text-sm placeholder-gray-400 text-gray-600"
            autoComplete="off"
            autoCorrect="off"
            autoFocus
            name="message"
            onChange={(event) => setInput(event.target.value)}
            tabIndex={0}
            value={input}
          />
        </div>
        <button className="flex items-center justify-center w-8 h-8 ml-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
          <ArrowDownLeftMini className="w-5 h-5 text-white" />
        </button>
      </form>
    </>
  );
};
