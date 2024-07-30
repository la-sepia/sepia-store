import { useState } from "react";
import { ChatToggleButton } from "../chat-toggle-button";
import { ChatModal } from "../chat-modal";

export const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatToggleButton handleButton={() => setIsOpen(!isOpen)} />
      <ChatModal isOpen={isOpen} />
    </>
  );
};
