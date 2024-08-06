import { ReactElement, useEffect, useState } from "react";
import { ChatIcon } from "./icon";
import { cn } from "../../utils";

interface Props {
  handleButton: () => void;
  isOpen: boolean;
}

export const ChatToggleButton = ({ handleButton, isOpen }: Props): ReactElement => {
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (isOpen === true) {
      setRunning(false);
    }

    setTimeout(() => {
      setRunning(false);
    }, 3000);
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-0 flex flex-col  place-items-end ">
      <div className={cn({ hidden: !running }, "relative bottom-8 right-4")}>
        <div className="bg-white text-black text-sm p-4 rounded-lg shadow-md border border-2 ">
          <h3>Hi! 👋</h3>
          Do you wanna talk?
        </div>
      </div>

      <div className="relative right-4">
        <button
          className={cn(
            { paused: !running },
            `animate-bounce relative bottom-0 right-0 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 rounded-full w-16 h-16 bg-slate-700 hover:bg-slate-600 m-0 cursor-pointer p-0 normal-case leading-5 text-white`
          )}
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-state="closed"
          onClick={handleButton}
        >
          <ChatIcon />
        </button>
      </div>
    </div>
  );
};
