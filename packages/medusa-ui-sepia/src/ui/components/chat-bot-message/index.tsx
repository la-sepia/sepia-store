import { SpinnerIcon } from "./spinner";
import { StreamableValue } from "ai/rsc";
import { CuttlefishIcon } from "./cuttlefish-icon";
import { ReactElement, ReactNode } from "react";
import { useStreamableText } from "../../hooks/use-streamable-text";
import { useRouter } from "next/navigation";

export const ChatBotMessage = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <>
      <div className="flex items-start gap-3">
        <span className="rounded-sm bg-slate-500 relative flex shrink-0 overflow-hidden min-w-8 min-h-8 items-center justify-center ">
          <CuttlefishIcon />
        </span>

        <div className="bg-slate-500 p-3 rounded-lg max-w-[75%] text-primary-foreground rounded-tl-none text-sm text-gray-50">{children}</div>
      </div>
    </>
  );
};

export const ChatBotStreamMessage = ({ content }: { content: string | StreamableValue<string> }): ReactElement => {
  const text = useStreamableText(content);

  return <ChatBotMessage>{text}</ChatBotMessage>;
};

export const ChatBotSpinnerMessage = (): ReactElement => {
  return (
    <>
      <div className="flex items-start gap-3">
        <span className="rounded-sm bg-slate-500 relative flex shrink-0 overflow-hidden min-w-8 min-h-8 items-center justify-center ">
          <CuttlefishIcon />
        </span>

        <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
          <SpinnerIcon />
        </div>
      </div>
    </>
  );
};

export const Redir = ({ id, description }: { id: string; description: string }) => {
  const router = useRouter();

  router.push(`/us/products/${id}`);

  return <ChatBotMessage>{description}</ChatBotMessage>;
};