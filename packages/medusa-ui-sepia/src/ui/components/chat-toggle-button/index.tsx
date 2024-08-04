import { ReactElement } from "react";
import { ChatIcon } from "./icon";

interface Props {
  handleButton: () => void;
}

export const ChatToggleButton = ({ handleButton }: Props): ReactElement => {
  return (
    <button
      className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 rounded-full w-16 h-16 bg-slate-700 hover:bg-slate-600 m-0 cursor-pointer p-0 normal-case leading-5 text-white"
      type="button"
      aria-haspopup="dialog"
      aria-expanded="false"
      data-state="closed"
      onClick={handleButton}
    >
      <ChatIcon />
    </button>
  );
};
