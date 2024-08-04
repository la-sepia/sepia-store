import { StreamableValue } from "ai/rsc";
import { useRouter } from "next/navigation";
import { ReactElement, ReactNode } from "react";
import { useStreamableText } from "../../hooks/use-streamable-text";
import { CuttlefishIcon } from "./cuttlefish-icon";
import { SpinnerIcon } from "./spinner";

export const ChatBotMessage = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  return (
    <>
      <div className="flex items-start gap-3">
        <span className="rounded-full bg-slate-500 relative flex shrink-0 overflow-hidden min-w-8 min-h-8 items-center justify-center text-white">
          <CuttlefishIcon />
        </span>
        <div className="bg-slate-500 p-3 rounded-lg max-w-[75%] text-primary-foreground rounded-tl-none text-sm text-white">
          {children}
        </div>
      </div>
    </>
  );
};

export const ChatBotStreamMessage = ({
  content,
}: {
  content: string | StreamableValue<string>;
}): ReactElement => {
  const text = useStreamableText(content);

  return <ChatBotMessage>{text}</ChatBotMessage>;
};

export const ChatBotSpinnerMessage = (): ReactElement => {
  return (
    <>
      <div className="flex items-start gap-3">
        <span className="rounded-full bg-slate-500 relative flex shrink-0 overflow-hidden min-w-8 min-h-8 items-center justify-center text-white">
          <CuttlefishIcon />
        </span>
        <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
          <SpinnerIcon />
        </div>
      </div>
    </>
  );
};

export const ChatBotShowProductMessage = ({
  id,
  description,
  color,
  size,
}: {
  id: string;
  description: string;
  color?: string | null;
  size?: string | null;
}) => {
  const router = useRouter();

  const params = new URLSearchParams();
  color && params.set("Color", color);
  size && params.set("Size", size);

  router.push(`/us/products/${id}?${params.toString()}`);

  return (
    <>
      <ChatBotMessage>{description}</ChatBotMessage>
    </>
  );
};
