import { ReactNode } from "react";
import { User } from "@medusajs/icons";

export const ChatUserMessage = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="flex items-start gap-3 justify-end">
        <div className="bg-gray-200 p-3 rounded-lg max-w-[75%] text-primary-foreground rounded-tr-none text-sm text-gray-400">{children}</div>
        <span className="rounded-sm bg-gray-100 relative flex shrink-0 overflow-hidden  min-w-8 min-h-8 items-center justify-center ">
          <User />
        </span>
      </div>
    </>
  );
};
