import { ReactElement } from "react";
import { ChatIcon } from "./icon";

interface Props {
  handleButton: () => void;
}

export const ChatToggleButton = ({ handleButton }: Props): ReactElement => {
  return (
    <button
      className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
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
